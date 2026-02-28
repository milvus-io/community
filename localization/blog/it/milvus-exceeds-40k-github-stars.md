---
id: milvus-exceeds-40k-github-stars.md
title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Celebrating Milvus’s 7-Year Journey to Becoming the World’s Leading
  Open-Source Vector Database
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>In June 2025, Milvus reached 35,000 GitHub stars. Fast-forward just a few months, and we’ve now <a href="https://github.com/milvus-io/milvus">crossed 40,000</a>—proof not only of momentum but of a global community that keeps pushing the future of vector and multimodal search forward.</p>
<p>We’re profoundly grateful. To everyone who starred, forked, filed issues, argued over an API, shared a benchmark, or built something incredible with Milvus: <strong>Thank you, and you’re the reason this project moves as fast as it does</strong>. Every star represents more than a button pressed — it reflects someone choosing Milvus to power their work, someone who believes in what we’re building, someone who shares our vision for open, accessible, high-performance AI infrastructure.</p>
<p>So as we celebrate, we’re also looking ahead—to the features you’re asking for, to the architectures AI now demands, and to a world where multimodal, semantic understanding is the default in every application.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">The Journey: From Zero to 40,000+ Stars<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>When we started building Milvus in 2017, the term <em>vector database</em> didn’t even exist. We were just a small team of engineers convinced that AI applications would soon need a new kind of data infrastructure—one built not for rows and columns, but for high-dimensional, unstructured, multimodal data. Traditional databases weren’t built for that world, and we knew someone had to reimagine what storage and retrieval could look like.</p>
<p>The early days were far from glamorous. Building enterprise-grade infrastructure is slow, stubborn work—weeks spent profiling code paths, rewriting components, and questioning design choices at 2 a.m. But we held onto a simple mission: <strong>make vector search accessible, scalable, and reliable for every developer building AI applications</strong>. That mission carried us through the first breakthroughs and through the inevitable setbacks.</p>
<p>And along the way, a few turning points changed everything:</p>
<ul>
<li><p><strong>2019:</strong> We open-sourced Milvus 0.10. It meant exposing all our rough edges—the hacks, the TODOs, the pieces we weren’t yet proud of. But the community showed up. Developers filed issues we never would’ve found, proposed features we hadn’t imagined, and challenged assumptions that ultimately made Milvus stronger.</p></li>
<li><p><strong>2020–2021:</strong> We joined the <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation</a>, shipped Milvus 1.0, graduated from LF AI &amp; Data, and won the <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a> billion-scale vector search challenge—early proof that our architecture could handle real-world scale.</p></li>
<li><p><strong>2022:</strong> Enterprise users needed Kubernetes-native scaling, elasticity, and real separation of storage and compute. We faced a hard decision: patch the old system or rebuild everything. We chose the harder path. <strong>Milvus 2.0 was a ground-up reinvention</strong>, introducing a fully decoupled cloud-native architecture that transformed Milvus into a production-grade platform for mission-critical AI workloads.</p></li>
<li><p><strong>2024–2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (the team behind Milvus) was named <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">a leader by Forrester</a>, surged past 30,000 stars, and is now beyond 40,000. It became the backbone for multimodal search, RAG systems, agentic workflows, and billion-scale retrieval across industries—education, finance, creative production, scientific research, and more.</p></li>
</ul>
<p>This milestone was earned not through hype, but through developers choosing Milvus for real production workloads and pushing us to improve every step of the way.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Two Major Releases, Massive Performance Gains<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 was the year Milvus stepped into a new league. While vector search excels at semantic understanding, the reality in production is simple: <strong>developers still need precise keyword matching</strong> for product IDs, serial numbers, exact phrases, legal terms, and more. Without native full-text search, teams were forced to maintain Elasticsearch/OpenSearch clusters or glue together their own custom solutions—doubling operational overhead and fragmentation.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>changed that</strong>. It introduced <strong>truly native hybrid search</strong>, combining full-text retrieval and vector search into a single engine. For the first time, developers could run lexical queries, semantic queries, and metadata filters together without juggling extra systems or syncing pipelines. We also upgraded metadata filtering, expression parsing, and execution efficiency so that hybrid queries felt natural—and fast—under real production loads.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>pushed this momentum further</strong>, targeting the two challenges we hear most often from users running at scale: <strong><em>cost</em> and <em>performance</em>.</strong> This release delivered deep architectural improvements—more predictable query paths, faster indexing, dramatically lower memory usage, and significantly more efficient storage. Many teams reported immediate gains without changing a single line of application code.</p>
<p>Here are just a few highlights from Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Tiered storage</strong></a> that lets teams balance cost and performance more intelligently, cutting storage costs by as much as 50%.</p></li>
<li><p><strong>Huge memory savings</strong> through <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1-bit quantization</a> — reducing memory usage by up to 72% while still delivering faster queries.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>A redesigned full-text engine</strong></a> with a significantly faster BM25 implementation — up to 4× faster than Elasticsearch in our benchmarks.</p></li>
<li><p><strong>A new Path Index</strong> for <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON-structured metadata</a>, unlocking up to 100× faster filtering on complex documents.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> billion-scale compression with 3200× storage reduction and strong recall</p></li>
<li><p><strong>Semantic +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>Geospatial Search</strong></a> <strong>with R-Tree:</strong> Combining <em>where things are</em> with <em>what they mean</em> for more relevant results</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> Cuts deployment cost with a hybrid CAGRA mode that builds on GPU but queries on CPU</p></li>
<li><p><strong>A “</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>data in, data out</strong></a><strong>” workflow</strong> that simplifies embedding ingestion and retrieval, especially for multimodal pipelines.</p></li>
<li><p><strong>Support for up to 100K collections</strong> in a single cluster — a major step toward true multi-tenancy at scale.</p></li>
</ul>
<p>For a deeper look at Milvus 2.6, check out the <a href="https://milvus.io/docs/release_notes.md">full release notes</a>.</p>
<p><a href="https://zilliz.com/event/milvus-2-6-deep-dive-faster-search-lower-cost-smarter-scaling?utm_source=milvusio&amp;utm_medium=milvus-40k-stars&amp;utm_campaign=milvus-26-webinar">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Webinar_Milvus_2_6_Webinar_5_4_Twitter_a4e8dbf7e4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Beyond Milvus: Open-Source Tools for AI Developers<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>In 2025, we didn’t just improve Milvus—we built tools that strengthen the entire AI developer ecosystem. Our goal wasn’t to chase trends, but to give builders the kind of open, powerful, transparent tools we’ve always wished existed.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Research Without Cloud Lock-In</h3><p>OpenAI’s Deep Researcher proved what deep reasoning agents can do. But it’s closed, expensive, and locked behind cloud APIs. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>is our answer.</strong> It’s a local, open-source deep research engine designed for anyone who wants structured investigations without sacrificing control or privacy.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher runs entirely on your machine, gathering information across sources, synthesizing insights, and providing citations, reasoning steps, and traceability—features essential for real research, not just surface-level summaries. No black boxes. No vendor lock-in. Just transparent, reproducible analysis that developers and researchers can trust.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context: Coding Assistants That Actually Understand Your Code</h3><p>Most AI coding tools still behave like fancy grep pipelines—fast, shallow, token-burning, and oblivious to real project structure. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> changes that. Built as an MCP plugin, it finally gives coding assistants what they’ve been missing: genuine semantic understanding of your codebase.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context builds a vector-powered semantic index across your project, letting agents find the right modules, follow relationships across files, understand architecture-level intent, and answer questions with relevance rather than guesswork. It reduces token waste, boosts precision, and—most importantly—lets coding assistants behave as if they truly understand your software rather than pretending to.</p>
<p>Both tools are fully open source. Because AI infrastructure should belong to everyone—and because the future of AI should not be locked behind proprietary walls.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Trusted by 10,000+ Teams in Production<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Today, more than 10,000 enterprise teams run Milvus in production—from fast-growing startups to some of the world’s most established technology and Fortune 500 companies. Teams at NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch, and inside Microsoft rely on Milvus to power AI systems that operate every minute of every day. Their workloads span search, recommendations, agentic pipelines, multimodal retrieval, and other applications that push vector infrastructure to its limits.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>But what matters most isn’t just <em>who</em> uses Milvus—it’s <em>what they’re building with it</em>. Across industries, Milvus sits behind systems that shape how businesses operate, innovate, and compete:</p>
<ul>
<li><p><strong>AI copilots and enterprise assistants</strong> that improve customer support, sales workflows, and internal decision-making with instant access to billions of embeddings.</p></li>
<li><p><strong>Semantic and visual search in e-commerce, media, and advertising</strong>, driving higher conversion, better discovery, and faster creative production.</p></li>
<li><p><strong>Legal, financial, and scientific intelligence platforms</strong> where precision, auditability, and compliance translate into real operational gains.</p></li>
<li><p><strong>Fraud detection and risk engines</strong> in fintech and banking that depend on fast semantic matching to prevent losses in real time.</p></li>
<li><p><strong>Large-scale RAG and agentic systems</strong> that give teams deeply contextual, domain-aware AI behavior.</p></li>
<li><p><strong>Enterprise knowledge layers</strong> that unify text, code, images, and metadata into one coherent semantic fabric.</p></li>
</ul>
<p>And these aren’t lab benchmarks—they’re some of the world’s most demanding production deployments. Milvus routinely delivers:</p>
<ul>
<li><p>Sub-50ms retrieval across billions of vectors</p></li>
<li><p>Billions of documents and events managed in a single system</p></li>
<li><p>5–10× faster workflows than alternative solutions</p></li>
<li><p>Multi-tenant architectures supporting hundreds of thousands of collections</p></li>
</ul>
<p>Teams choose Milvus for a simple reason: <strong>it delivers where it matters—speed, reliability, cost efficiency, and the ability to scale to billions without tearing apart their architecture every few months.</strong> The trust these teams place in us is the reason we keep strengthening Milvus for the decade of AI ahead.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">When You Need Milvus Without the Ops: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is free, powerful, and battle-tested. But it’s also a distributed system—and running distributed systems well is real engineering work. Index tuning, memory management, cluster stability, scaling, observability… these tasks take time and expertise that many teams simply don’t have to spare. Developers wanted the power of Milvus, just without the operational weight that inevitably comes with managing it at scale.</p>
<p>This reality led us to a simple conclusion: if Milvus was going to become core infrastructure for AI applications, we needed to make it effortless to operate. That’s why we built <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>, the fully managed Milvus service created and maintained by the same team behind the open-source project.</p>
<p>Zilliz Cloud gives developers the Milvus they already know and trust—but without provisioning clusters, firefighting performance issues, planning upgrades, or worrying about storage and compute tuning. And because it includes optimizations impossible to run in self-managed environments, it’s even faster and more reliable. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, our commercial-grade, self-optimizing vector engine, delivers 10× the performance of <strong>open-source Milvus</strong>.</p>
<p><strong>What Sets Zilliz Cloud Apart</strong></p>
<ul>
<li><strong>Self-optimizing performance:</strong> AutoIndex automatically tunes HNSW, IVF, and DiskANN, delivering 96%+ recall with zero manual configuration.</li>
</ul>
<ul>
<li><p><strong>Elastic &amp; cost-efficient:</strong> Pay-as-you-go pricing, serverless autoscaling, and intelligent resource management often reduce costs by 50% or more compared to self-managed deployments.</p></li>
<li><p><strong>Enterprise-grade reliability:</strong> 99.95% uptime SLA, multi-AZ redundancy, SOC 2 Type II, ISO 27001, and GDPR compliance. Full support for RBAC, BYOC, audit logs, and encryption.</p></li>
<li><p><strong>Cloud-agnostic deployment:</strong> Run on AWS, Azure, GCP, Alibaba Cloud, or Tencent Cloud—no vendor lock-in, consistent performance everywhere.</p></li>
<li><p><strong>Natural language queries:</strong> Built-in MCP server support lets you query data conversationally instead of manually crafting API calls.</p></li>
<li><p><strong>Effortless Migration</strong>: Move from Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch, or PostgreSQL using built-in migration tools — no schema rewrites or downtime required.</p></li>
<li><p><strong>100% compatible with open-source Milvus.</strong> No proprietary forks. No lock-in. Just Milvus, made easier.</p></li>
</ul>
<p><strong>Milvus will always remain open source and free to use.</strong> But running and operating it reliably at enterprise scale requires significant expertise and resources. <strong>Zilliz Cloud is our answer to that gap</strong>. Deployed across 29 regions and five major clouds, Zilliz Cloud provides enterprise-grade performance, security, and cost efficiency while keeping you completely aligned with the Milvus you already know.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Start free trial →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">What’s Next: Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>As the team that introduced the vector database, we’ve had a front-row seat to how enterprise data is changing. What once fit neatly into terabytes of structured tables is rapidly turning into petabytes—and soon trillions—of multimodal objects. Text, images, audio, video, time-series streams, multi-sensor logs… these now define the datasets that modern AI systems rely on.</p>
<p>Vector databases are purpose-built for unstructured and multimodal data, but they aren’t always the most economical or architecturally sound choice—especially when the vast majority of data is cold. Training corpora for large models, autonomous-driving perception logs, and robotics datasets usually don’t require millisecond-level latency or high concurrency. Running this volume of data through a real-time vector database becomes expensive, operationally heavy, and overly complex for pipelines that don’t require that level of performance.</p>
<p>That reality led us to our next major initiative: <strong>Milvus Lake</strong>—a semantic-driven, index-first multimodal lakehouse designed for AI-scale data. Milvus Lake unifies semantic signals across every modality—vectors, metadata, labels, LLM-generated descriptions, and structured fields—and organizes them into <strong>Semantic Wide Tables</strong> anchored around real business entities. Data that previously lived as raw, scattered files in object storage, lakehouses, and model pipelines becomes a unified, queryable semantic layer. Massive multimodal corpora turn into manageable, retrievable, reusable assets with consistent meaning across the enterprise.</p>
<p>Under the hood, Milvus Lake is built on a clean <strong>manifest + data + index</strong> architecture that treats indexing as foundational rather than an afterthought. This unlocks a “retrieve first, process later” workflow optimized for trillion-scale cold data—offering predictable latency, dramatically lower storage costs, and far greater operational stability. A tiered-storage approach—NVMe/SSD for hot paths and object storage for deep archives—paired with efficient compression and lazy-loaded indexes preserves semantic fidelity while keeping infrastructure overhead firmly in control.</p>
<p>Milvus Lake also plugs seamlessly into the modern data ecosystem, integrating with Paimon, Iceberg, Hudi, Spark, Ray, and other big-data engines and formats. Teams can run batch processing, near-real-time pipelines, semantic retrieval, feature engineering, and training-data preparation all in one place—without replatforming their existing workflows. Whether you’re building foundation-model corpora, managing autonomous-driving simulation libraries, training robotics agents, or powering large-scale retrieval systems, Milvus Lake provides an extensible and cost-efficient semantic lakehouse for the AI era.</p>
<p><strong>Milvus Lake is in active development.</strong> Interested in early access or want to learn more?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Contact us →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Built by the Community, For the Community<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>What makes Milvus special isn’t just the technology—it’s the people behind it. Our contributor base spans the globe, bringing together specialists from high-performance computing, distributed systems, and AI infrastructure. Engineers and researchers from ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft, and many more have contributed their expertise to shape Milvus into what it is today.</p>
<p>Every pull request, every bug report, every question answered in our forums, every tutorial created—these contributions make Milvus better for everyone.</p>
<p>This milestone belongs to all of you:</p>
<ul>
<li><p><strong>To our contributors</strong>: Thank you for your code, your ideas, and your time. You make Milvus better every single day.</p></li>
<li><p><strong>To our users</strong>: Thank you for trusting Milvus with your production workloads and for sharing your experiences, both good and challenging. Your feedback drives our roadmap.</p></li>
<li><p><strong>To our community supporters</strong>: Thank you for answering questions, writing tutorials, creating content, and helping newcomers get started. You make our community welcoming and inclusive.</p></li>
<li><p><strong>To our partners and integrators</strong>: Thank you for building with us and making Milvus a first-class citizen in the AI development ecosystem.</p></li>
<li><p><strong>To the Zilliz team</strong>: Thank you for your unwavering commitment to both the open-source project and our users’ success.</p></li>
</ul>
<p>Milvus has grown because thousands of people decided to build something together—openly, generously, and with the belief that foundational AI infrastructure should be accessible to everyone.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Join Us on This Journey<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Whether you’re building your first vector search application or scaling to billions of vectors, we’d love to have you as part of the Milvus community.</p>
<p><strong>Get Started</strong>:</p>
<ul>
<li><p>⭐ <strong>Star us on GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Try Zilliz Cloud Free</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Join our</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> to connect with developers worldwide</p></li>
<li><p>📚 <strong>Explore our docs</strong>: <a href="https://milvus.io/docs">Milvus documentation</a></p></li>
<li><p>💬 <strong>Book a</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20-minute one-on-one session</strong></a> to get insights, guidance, and answers to your questions.</p></li>
</ul>
<p>The road ahead is exciting. As AI reshapes industries and unlocks new possibilities, vector databases will sit at the core of this transformation. Together, we’re building the semantic foundation that modern AI applications rely on—and we’re only getting started.</p>
<p>Here’s to the next 40,000 stars, and to building the future of AI infrastructure <strong>together</strong>. 🎉</p>
