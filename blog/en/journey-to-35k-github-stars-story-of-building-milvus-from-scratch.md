---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >
 Our Journey to 35K+ GitHub Stars: The Real Story of Building Milvus from Scratch
author: Zilliz
date: 2025-06-27
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: Milvus, vector database, vector search, AI Agents, LLM
meta_keywords: Milvus, vector database, vector search, AI search, Zilliz Cloud
meta_title:  >
 Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: Join us in celebrating Milvus, the vector database that hit 35.5K stars on GitHub. Discover our story and how we’re making AI solutions easier for developers.
origin: https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---

For the past few years, we've been focused on one thing: building an enterprise-ready vector database for the AI era. The hard part isn't building _a_ database—it's building one that's scalable, easy to use, and actually solves real problems in production.

This June, we reached a new milestone: Milvus hit [35,000 stars on GitHub](https://github.com/milvus-io/milvus) (now it has 35.5K+ stars at the time of writing). We're not going to pretend this is just another number—it means a lot to us.

Each star represents a developer who took the time to look at what we've built, found it useful enough to bookmark, and in many cases, decided to use it. Some of you have gone further: filing issues, contributing code, answering questions in our forums, and helping other developers when they get stuck.

We wanted to take a moment to share our story—the real one, with all the messy parts included.


## We Started Building Milvus Because Nothing Else Worked

Back in 2017, we started with a simple question: As AI applications were starting to emerge and unstructured data was exploding, how do you efficiently store and search the vector embeddings that power semantic understanding?

Traditional databases weren't built for this. They're optimized for rows and columns, not high-dimensional vectors. The existing technologies and tools were either impossible or painfully slow for what we needed.

We tried everything available. Hacked together solutions with Elasticsearch. Built custom indexes on top of MySQL. Even experimented with FAISS, but it was designed as a research library, not a production database infrastructure. Nothing provided the complete solution we envisioned for enterprise AI workloads.

**So we started building our own.** Not because we thought it would be easy—databases are notoriously hard to get right—but because we could see where AI was heading and knew it needed purpose-built infrastructure to get there.

By 2018, we were deep into developing what would become [Milvus](https://milvus.io/). The term "**vector database**" didn't even exist yet. We were essentially creating a new category of infrastructure software, which was both exciting and terrifying.


## Open-Sourcing Milvus: Building in Public

In November 2019, we decided to open-source Milvus version 0.10.

Open-sourcing means exposing all your flaws to the world. Every hack, every TODO comment, every design decision you're not entirely sure about. But we believed that if vector databases were going to become critical infrastructure for AI, they needed to be open and accessible to everyone.

The response was overwhelming. Developers didn't just use Milvus—they improved it. They found bugs we'd missed, suggested features we hadn't considered, and asked questions that made us think harder about our design choices.

In 2020, we joined the [LF AI & Data Foundation](https://lfaidata.foundation/). This wasn't just for credibility—it taught us how to maintain a sustainable open-source project. How to handle governance, backward compatibility, and building software that lasts years, not months.

By 2021, we released Milvus 1.0 and [graduated from LF AI & Data Foundation](https://lfaidata.foundation/projects/milvus/). That same year, we won the [BigANN global challenge](https://big-ann-benchmarks.com/neurips21.html) for billion-scale vector search. That win felt good, but more importantly, it validated that we were solving real problems the right way.


## The Hardest Decision: Starting Over

Here's where things get complicated. By 2021, Milvus 1.0 was working well for many use cases, but enterprise customers kept asking for the same things: better cloud-native architecture, easier horizontal scaling, more operational simplicity.

We had a choice: patch our way forward or rebuild from the ground up. We chose to rebuild.

Milvus 2.0 was essentially a complete rewrite. We introduced a fully decoupled storage-compute architecture with dynamic scalability. It took us two years and was honestly one of the most stressful periods in our company's history. We were throwing away a working system that thousands of people were using to build something unproven.

**But when we released Milvus 2.0 in 2022, it transformed Milvus from a powerful vector database into production-ready infrastructure that could scale to enterprise workloads.** That same year, we also completed a [Series B+ funding round](https://zilliz.com/news/vector-database-company-zilliz-series-b-extension)—not to burn money, but to double down on product quality and support for global customers. We knew this path would take time, but every step had to be built on a solid foundation.


## When Everything Accelerated with AI

2023 was the year of [RAG](https://zilliz.com/learn/Retrieval-Augmented-Generation) (retrieval-augmented generation). Suddenly, semantic search went from an interesting AI technique to essential infrastructure for chatbots, document Q&A systems, and AI agents.

The GitHub stars of Milvus spiked. Support requests multiplied. Developers who had never heard of vector databases were suddenly asking sophisticated questions about indexing strategies and query optimization.

This growth was exciting but also overwhelming. We realized we needed to scale not just our technology, but our entire approach to community support. We hired more developer advocates, completely rewrote our documentation, and started creating educational content for developers new to vector databases.

We also launched [Zilliz Cloud](https://zilliz.com/cloud)—our fully managed version of Milvus. Some people asked why we were "commercializing" our open-source project. The honest answer is that maintaining enterprise-grade infrastructure is expensive and complex. Zilliz Cloud allows us to sustain and accelerate Milvus development while keeping the core project completely open source.

Then came 2024. [**Forrester named us a leader**](https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report) **in the vector database category.** Milvus passed 30,000 GitHub stars. **And we realized: the road we'd been paving for seven years had finally become the highway.** As more enterprises adopted vector databases as critical infrastructure, our business growth accelerated rapidly—validating that the foundation we'd built could scale both technically and commercially.


## The Team Behind Milvus: Zilliz

Here's something interesting: many people know Milvus but not Zilliz. We're actually fine with that. [**Zilliz**](https://zilliz.com/) **is the team behind Milvus—we build it, maintain it, and support it.**

What we care about most are the unglamorous things that make the difference between a cool demo and production-ready infrastructure: performance optimizations, security patches, documentation that actually helps beginners, and responding thoughtfully to GitHub issues.

We've built a 24/7 global support team across the U.S., Europe, and Asia, because developers need help in their time zones, not ours. We have community contributors we call "[Milvus Ambassadors](https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform)" who organize events, answer forum questions, and often explain concepts better than we do.

We've also welcomed integrations with AWS, GCP, and other cloud providers—even when they offer their own managed versions of Milvus. More deployment options are good for users. Though we've noticed that when teams hit complex technical challenges, they often end up reaching out to us directly because we understand the system at the deepest level.

Many people think open source is just a "toolbox," but it's actually an "evolutionary process"—a collective effort by countless people who love and believe in it. Only those who truly understand the architecture can provide the "why" behind bug fixes, performance bottleneck analysis, data system integration, and architectural adjustments.

**So if you're using open-source Milvus, or considering vector databases as a core component of your AI system, we encourage you to reach out to us directly for the most professional and timely support.**


## Real Impact in Production: The Trust from Users

The use cases for Milvus have grown beyond what we initially imagined. We're powering AI infrastructure for some of the world's most demanding enterprises across every industry.

![zilliz customers.png](https://assets.zilliz.com/zilliz_customers_66d3adfe97.png)


[**Bosch**](https://zilliz.com/customers/bosch), the global automotive technology leader and pioneer in autonomous driving, revolutionized their data analysis with Milvus achieving 80% reduction in data collection costs and $1.4M annual savings while searching billions of driving scenarios in milliseconds for critical edge cases.

[**Read AI**](https://zilliz.com/customers/read-ai), one of the fastest-growing productivity AI companies serving millions of monthly active users, uses Milvus to achieve sub-20-50ms retrieval latency across billions of records and 5× speedup in agentic search. Their CTO says, "Milvus serves as the central repository and powers our information retrieval among billions of records."

[**A global fintech leader**](https://zilliz.com/customers/global-fintech-leader), one of the world's largest digital payment platforms processing tens of billions of transactions across 200+ countries and 25+ currencies, chose Milvus for 5-10× faster batch ingestion than competitors, completing jobs in under 1 hour that took others 8+ hours.

[**Filevine**](https://zilliz.com/customers/filevine), the leading legal work platform trusted by thousands of law firms across the United States, manages 3 billion vectors across millions of legal documents, saving attorneys 60-80% of time in document analysis and achieving "true consciousness of data" for legal case management.

We're also supporting **NVIDIA, OpenAI, Microsoft, Salesforce, Walmart,** and many others in almost every industry. Over 10,000 organizations have made Milvus or Zilliz Cloud their vector database of choice.

These aren't just technical success stories—they're examples of how vector databases are quietly becoming critical infrastructure that powers the AI applications people use every day.


## Why We Built Zilliz Cloud: Enterprise-Grade Vector Database as a Service

Milvus is open-source and free to use. But running Milvus well at enterprise scale requires deep expertise and significant resources. Index selection, memory management, scaling strategies, security configurations—these aren't trivial decisions. Many teams want the power of Milvus without the operational complexity and with enterprise support, SLA guarantees, etc.

That's why we built [Zilliz Cloud](https://zilliz.com/cloud)—a fully managed version of Milvus deployed across 25 global regions and 5 major clouds, including AWS, GCP, and Azure, designed specifically for enterprise-scale AI workloads that demand performance, security, and reliability.

Here's what makes Zilliz Cloud different:

- **Massive Scale with High Performance:** Our proprietary AI-powered AutoIndex engine delivers 3-5× faster query speeds than open-source Milvus, with zero index tuning required. The cloud-native architecture supports billions of vectors and tens of thousands of concurrent queries while maintaining sub-second response times.

- [**Built-in Security & Compliance**](https://zilliz.com/trust-center)**:** Encryption at rest and in transit, fine-grained RBAC, comprehensive audit logging, SAML/OAuth2.0 integration, and [BYOC](https://zilliz.com/bring-your-own-cloud) (bring your own cloud) deployments. We're compliant with GDPR, HIPAA, and other global standards that enterprises actually need. 

- **Optimized for Cost-Efficiency:** Tiered hot/cold data storage, elastic scaling that responds to real workloads, and pay-as-you-go pricing can reduce total cost of ownership by 50% or more compared to self-managed deployments.

- **Truly Cloud-Agnostic without vendor lock-in:** Deploy on AWS, Azure, GCP, Alibaba Cloud, or Tencent Cloud without vendor lock-in. We ensure global consistency and scalability regardless of where you run.

These capabilities might not sound flashy, but they solve real, daily problems that enterprise teams face when building AI applications at scale. And most importantly: it's still Milvus under the hood, so there's no proprietary lock-in or compatibility issues.


## What's Next: Vector Data Lake

We coined the term "[vector database](https://zilliz.com/learn/what-is-vector-database)" and were the first to build one, but we're not stopping there. We're now building the next evolution: **Vector Data Lake.**

**Here's the problem we're solving: not every vector search needs millisecond latency.** Many enterprises have massive datasets that are queried occasionally, including historical document analysis, batch similarity computations, and long-term trend analysis. For these use cases, a traditional real-time vector database is both overkill and expensive. 

Vector Data Lake uses a storage-compute separated architecture specifically optimized for massive-scale, infrequently accessed vectors while keeping costs dramatically lower than real-time systems.

**Core capabilities include:**

- **Unified Data Stack:** Seamlessly connects online and offline data layers with consistent formats and efficient storage, so you can move data between hot and cold tiers without reformatting or complex migrations.

- **Compatible Compute Ecosystem:** Works natively with frameworks like Spark and Ray, supporting everything from vector search to traditional ETL and analytics. This means your existing data teams can work with vector data using tools they already know.

- **Cost-Optimized Architecture:** Hot data stays on SSD or NVMe for fast access; cold data automatically moves to object storage like S3. Smart indexing and storage strategies keep I/O fast when you need it while making storage costs predictable and affordable.

This isn't about replacing vector databases—it's about giving enterprises the right tool for each workload. Real-time search for user-facing applications, cost-effective vector data lakes for analytics and historical processing.

We still believe in the logic behind Moore's Law and Jevons Paradox: as the unit cost of computing drops, adoption scales. The same applies to vector infrastructure.

By improving indexes, storage structures, caching, and deployment models—day in, day out—we hope to make AI infrastructure more accessible and affordable for everyone, and to help bring unstructured data into the AI-native future.


## A Big Thanks to You All!

Those 35K+ stars represent something we're genuinely proud of: a community of developers who find Milvus useful enough to recommend and contribute to.

But we're not done. Milvus has bugs to fix, performance improvements to make, and features our community has been asking for. Our roadmap is public, and we genuinely want your input on what to prioritize.

The number itself isn't what matters—it's the trust those stars represent. Trust that we'll keep building in the open, keep listening to feedback, and keep making Milvus better.

- **To our contributors:** your PRs, bug reports, and documentation improvements make Milvus better every day. Thank you so much. 

- **To our users:** thank you for trusting us with your production workloads and for the feedback that keeps us honest.

- **To our community:** thank you for answering questions, organizing events, and helping newcomers get started.

If you're new to vector databases, we'd love to help you get started. If you're already using Milvus or Zilliz Cloud, we'd love to [hear about your experience](https://zilliz.com/share-your-story). And if you're just curious about what we're building, our community channels are always open.

Let's keep building the infrastructure that makes AI applications possible—together.

***

Find us here: [Milvus on GitHub](https://github.com/milvus-io/milvus) |[ Zilliz Cloud](https://zilliz.com/) |[ Discord](https://discuss.milvus.io/) | [LinkedIn](https://www.linkedin.com/company/the-milvus-project/) | [X](https://x.com/zilliz_universe) | [YouTube](https://www.youtube.com/@MilvusVectorDatabase/featured)

[![](https://assets.zilliz.com/office_hour_4fb9130a9b.png)](https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&__hssc=175614333.3.1751029841530&__hsfp=3554976067)





