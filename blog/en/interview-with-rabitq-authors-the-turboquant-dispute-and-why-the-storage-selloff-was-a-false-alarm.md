---
id: interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >
 Interview with RaBitQ Authors: The TurboQuant Dispute and Why the Storage Selloff Was a False Alarm
author: Cheng Long, Jianyang Gao, Li Liu
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ
meta_title: >
 RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >
 RaBitQ's authors respond to Google's TurboQuant paper: the benchmark imbalance, the misattributed theory, and why the storage selloff was a false alarm.
origin: https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---

Google's [TurboQuant](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/) paper claimed **6x compression, 8x speedup, and near-zero accuracy loss** for vector representations. After it was released, memory and storage stocks fell sharply, and major tech outlets quickly turned it into a headline story.

The market reaction was only the start. Researchers soon began asking whether the paper's claims were overstated and whether it treated prior work — especially [RaBitQ](https://dl.acm.org/doi/10.1145/3654970) — fairly. The dispute pushed **vector quantization** back into the spotlight, partly because the same underlying ideas now matter in two critical parts of the AI stack: [vector search systems](https://zilliz.com/learn/vector-similarity-search) and KV-cache compression for large models.

To understand both the technical debate and what it means for production systems, we spoke with **Cheng Long**, Associate Professor at NTU Singapore and head of VectorDB@NTU; **Jianyang Gao**, first author of RaBitQ; and **Li Liu**, Director of Engineering at Zilliz. The conversation covered vector quantization itself, the questions raised around TurboQuant, and why this matters for systems like [Milvus](https://milvus.io/), the most popular open-source [vector databases](https://zilliz.com/learn/what-is-vector-database), and large-scale vector retrieval.

**_Related reading:_** _If you want the engineering side rather than the interview, see our companion article on_ [_how vector quantization affects AI infrastructure costs_](https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md)_._

## Why did vector quantization suddenly become such a big topic?

**Zilliz: Before we get into the controversy, could you start by explaining what vector quantization is and why it has become so important in AI?**

**Cheng Long:** Vector quantization is a technique for **data compression** and **approximate representation**. It originally came from signal processing, where it was used for image and audio compression. In modern AI systems, its role has changed because vectors have become one of the basic units of computation.

Today, its importance is clearest in two places.

One is **real-time search over collections with billions or even tens of billions of vectors**. In semantic retrieval systems, the core task is similarity search over high-dimensional vectors. But raw vectors are large, and floating-point computation is expensive. At scale, that makes it difficult to deliver millisecond-level latency. Vector quantization helps by compressing vectors into low-bit representations and speeding up distance computation. That is why it matters for practical workloads such as [single-vector search](https://milvus.io/docs/single-vector-search.md), [multi-vector search](https://milvus.io/docs/multi-vector-search.md), and index design in [Milvus search architecture](https://milvus.io/docs/index-explained.md).

The other is **KV cache compression** for large models. KV cache reduces redundant computation during generation, but the memory cost grows quickly as context gets longer. So the problem becomes how to compress those vectors without hurting output quality too much. At its core, that is also a vector quantization problem.

**Zilliz: If vector quantization becomes more widely used — and if TurboQuant's results hold up — does that mean storage demand drops sharply?**

**Jianyang Gao:** Under the same model and the same workload, compression can reduce storage demand. But that does not justify the broader conclusion people jumped to.

When TurboQuant talks about **6x compression** and **8x speedup**, it is comparing against a basic **16-bit/32-bit baseline**. That is not the same as comparing against other methods in the same category. So the real effect still needs to be evaluated more carefully.

**Zilliz: Then from that perspective, if the market reaction were really about the technology itself, should it have happened much earlier, when similar ideas had already appeared?**

**Cheng Long:** From a technical point of view, you could say that similar theoretical territory had already been reached before. But markets do not move in sync with research. There is usually a lag between academic results, engineering adoption, and financial interpretation.

And over a longer horizon, the effect may not even be linear. Compression can make it possible to run large models on smaller devices, which can create new demand rather than simply reduce it. The relationship between technology and markets is more complicated than a straight-line extrapolation.

## How did RaBitQ emerge, and what did it contribute?

**Zilliz: How did you first arrive at the idea for RaBitQ?**

**Jianyang Gao:** We started from a gap we saw in vector databases. Traditional methods such as [Product Quantization](https://milvus.io/docs/ivf-pq.md) worked well empirically, but they offered very little in the way of theoretical guarantees.

At the time, I was studying high-dimensional probability at NTU Singapore, and that led me to ask whether we could build a method that was not only practical, but also came with a clear theoretical guarantee. That was the starting point for RaBitQ.

**Zilliz: What do you see as RaBitQ's core originality?**

**Jianyang Gao:** Its key idea was to use a random rotation, a.k.a., Johnson-Lindenstrauss transformation, to make the distribution of vector coordinates more uniform and more predictable.

Once you have that, you can derive an optimal quantization estimator on top of it. We then gave a strict proof that it reaches the theoretical lower bound.

Earlier work had also tried to introduce random rotation. But from our perspective, those methods did not achieve the effect we were looking for because of practical issues in algorithm design.

**Zilliz: From an engineering perspective, what stood out most to you about RaBitQ?**

**Li Liu:** We had worked with many quantization algorithms, from [scalar quantization methods](https://milvus.io/docs/ivf-sq8.md) to PQ and other variants. What stood out about RaBitQ was that it changed how people approached the problem.

Before that, much of the field was still fairly empirical. You could say a method seemed to work, but it was harder to explain clearly why. RaBitQ approached the problem in a much more mathematical way. The method felt elegant and, in a sense, simple. That way of thinking influenced a lot of later work.

**Zilliz: Put simply, how much can it save in memory and cost?**

**Li Liu:** At the same recall level, moving from 4-bit compression to 2-bit compression cuts memory use by half.

And it is not just about compression. Its performance compares favorably with earlier approaches, and that matters in production environments where teams care about both memory efficiency and retrieval quality. That is why it matters for systems that need to balance [dense vector storage](https://milvus.io/docs/dense-vector.md), throughput, and recall.

**Zilliz: Beyond Milvus, where do you see RaBitQ being used today?**

**Cheng Long:** First, I want to thank the Milvus team, because they were among the earliest to adopt RaBitQ. We also had a lot of discussions and some collaborative research along the way.

RaBitQ has also been adopted in some other systems including Meta’s FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene, and turbopuffer. What stands out on the Milvus side is that the team shipped [IVF_RABITQ](https://milvus.io/docs/ivf-rabitq.md) as a real index option in [Milvus 2.6](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md), alongside broader work on [collection management](https://milvus.io/docs/manage-collections.md), [IVF-based indexing](https://milvus.io/docs/ivf-flat.md), and [HNSW-based indexing](https://milvus.io/docs/hnsw.md).

## How should we evaluate TurboQuant?

**Zilliz: In your public response, you said TurboQuant had some serious issues. What, in your view, were the main ones?**

**Jianyang Gao:** We see three main problems.

One is the way the paper describes prior work and discusses overlap. The TurboQuant paper misrepresents the methodology of RaBitQ, ignoring the most similar part, such as Johnson-Lindenstrauss Transformation. Another is the way the paper characterizes the theoretical result. It describes RaBitQ as suboptimal without providing any explanation or evidence, but RaBitQ is optimal in fact. The third is the fairness of the experimental comparison. They use single-core CPU to evaluate RaBitQ while using A100 GPU to evaluate TurboQuant.

**Zilliz: Let's take the benchmark issue first. Why do you think the comparison was not fair?**

**Jianyang Gao:** Benchmark claims only mean something if the setup is comparable. If one system is tested under a very different hardware or software environment, then the result may reflect the setup more than the algorithm itself.

In our view, differences in processor choice, implementation language, and optimization level can make a major difference. That is why benchmark methodology needs to be interpreted very carefully, especially by teams building production retrieval systems.

**Cheng Long:** The paper also made some other claims that do not hold.

For example, the paper says that **RaBitQ cannot be vectorized**. But RaBitQ had already open-sourced code with SIMD-based vectorized computation when the 2024 paper was published. So from our perspective, that statement was factually incorrect.

It is also worth mentioning that we began working with NVIDIA last year and completed a GPU implementation of RaBitQ. The related code is under review for inclusion in NVIDIA's cuVS library.

**Zilliz: Milvus evaluated TurboQuant in the second half of 2025 but did not adopt it. What did your team see in testing?**

**Li Liu:** It does contain one useful idea. In our view, it makes a small optimization in how the quantization grid is allocated. But the most important step in the method — using random rotation for quantization — was first introduced by RaBitQ.

And when it comes to unbiased estimation, RaBitQ's approach is cleaner and its theoretical derivation is stronger.

That said, because this was a result from Google, we tested it in 2025. In our lab, under a standardized CPU environment, TurboQuant did not outperform our internal RaBitQ version in most of the cases we evaluated. So when the market reacted so strongly, we were genuinely surprised.

**Zilliz: For readers who have not looked closely at either paper, could you walk through where RaBitQ and TurboQuant overlap in plain language?**

**Li Liu:** At a high level, both methods begin with **random rotation**. Mathematically, that means multiplying the vector by a random orthogonal matrix. You can think of it as changing your viewing angle in a high-dimensional space. It does not change the relative positions of the data points, but it distributes the information across dimensions more evenly.

After that comes **quantization**. You divide the continuous real-valued space into **2^k grid cells**, where **k** is the number of quantization bits, and then map each vector element to a nearby grid point. TurboQuant makes a small adjustment here by allocating the grid according to the data distribution instead of distributing it evenly.

The last step is **error estimation**, and this is where RaBitQ's main contribution lies. Traditional methods calculate directly from the quantized values, which makes the error harder to control. RaBitQ estimates the quantization error more precisely, and that is where its mathematical optimality comes from. TurboQuant's solution is more complicated, and in our setting the tradeoff did not look as attractive.

## Why is attribution so hard to resolve in practice?

**Zilliz:** After you published your public statement, how did Google and ICLR respond?

**Cheng Long:** ICLR did not take action. We emailed them during the review period in September last year, but did not receive a response. We wrote again in March this year and were told to post comments on OpenReview, but beyond that there was no action.

As for Google, one of the co-authors replied a few days ago. The reply said they would revise the arXiv version to correct its inaccurate description of RaBitQ's optimality.

**Zilliz:** Earlier the discussion was framed around academic misconduct. Now it also sounds like a question of imbalance and who gets to shape the story. Why is it so hard to defend your work?

**Cheng Long:** One problem is scale. AI conferences are now so large that a single cycle can bring in tens of thousands of papers. Organizers simply do not have the capacity to handle every dispute of this kind.

The other problem is imbalance. Large companies have a much stronger public voice. Independent researchers or smaller teams do not have the same communication power.

**Jianyang Gao:** For individuals, the cost is extremely high. Professor Long and I have barely been able to work normally in recent weeks.

The process itself has also been frustrating. We were firmly rejected when we contacted the authors, and we received no response from the conference organizers. In practice, many researchers look at situations like this and decide to let them go. But that is also how many original contributions disappear from the public narrative.

**Zilliz:** It sounds like this is not the first time your team has run into this kind of problem.

**Cheng Long:** No, it is not.

We have seen cases before where companies take RaBitQ, make a few engineering modifications, give it a new name, and then describe it only as something inspired by RaBitQ.

That is why I appreciate the way some industry teams handle this, including Milvus. When they use RaBitQ, they describe it objectively. And when they add optimizations beyond the original version, they explain those clearly as their own engineering contribution. That gives proper credit to the original work while also showing the company's technical strength.

**Zilliz:** When large companies build on academic work, do they usually provide any financial sharing or benefit allocation?

**Jianyang Gao:** In most cases, no.

That said, large companies still have a strong incentive to present a technical advance as something they created themselves rather than something they adopted from others. Everyone wants customers and investors to see the most advanced work as the result of their own team's innovation.

## What comes next for vector quantization?

**Zilliz:** What research directions are you working on now?

**Cheng Long:** A large part of our work will remain focused on vector retrieval.

One direction is to combine RaBitQ with different vector retrieval indexes, such as IVF and HNSW, so the system can support larger-scale data with lower latency, higher concurrency, and lower cost. I am also paying attention to KV cache compression.

**Jianyang Gao:** KV cache in large models and vector retrieval share many of the same properties, both mathematically and at the systems level, because both deal with high-dimensional vectors.

Going forward, I want to think more about how to apply mathematical tools, including ideas from high-dimensional probability, to accelerate inference and training.

**Zilliz:** Where is the ceiling for vector quantization as a field? How much room is left for improvement?

**Cheng Long:** From a theoretical point of view, the ceiling is largely in sight. RaBitQ is already asymptotically optimal.

But there is still a great deal of room on the engineering side. You still have to deal with hardware characteristics, data distribution, latency constraints, and many other practical factors. That is exactly why production systems still need careful work in areas such as [distributed vector database architecture](https://milvus.io/docs/architecture_overview.md), [sparse vector support](https://milvus.io/docs/sparse_vector.md), [reranking pipelines](https://milvus.io/docs/reranking.md), and metric selection in [Milvus distance metrics](https://milvus.io/docs/metric.md).

## Keep Reading

If you want to dig deeper into the engineering side of RaBitQ and how it fits into Milvus, these are the most relevant resources:

-   [IVF_RABITQ documentation](https://milvus.io/docs/ivf-rabitq.md) — configuration details and tuning guidance.
-   [RaBitQ integration deep dive](https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md) — how Milvus turned RaBitQ into a production index.
-   [How vector quantization affects AI infrastructure costs](https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md) — our broader analysis of the TurboQuant-RaBitQ discussion.
-   [Milvus 2.6 release post](https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md) — where IVF_RABITQ shipped as a real Milvus index option.
-   [Milvus index explained](https://milvus.io/docs/index-explained.md) — how IVF_RABITQ fits with other index choices.
-   [IVF_FLAT indexing](https://milvus.io/docs/ivf-flat.md) and [HNSW indexing](https://milvus.io/docs/hnsw.md) — useful baselines if you are comparing index tradeoffs.
-   [Schema design in Milvus](https://milvus.io/docs/schema.md) and [filtered search](https://milvus.io/docs/filtered-search.md) — useful if you are evaluating RaBitQ in a real application rather than in isolation.
-   [Milvus quickstart](https://milvus.io/docs/quickstart.md) and [RAG system design](https://zilliz.com/learn/Retrieval-Augmented-Generation) — helpful if you want to try this in a retrieval pipeline.

Join the [Milvus Slack community](https://slack.milvus.io/) or [book Milvus Office Hours](https://milvus.io/office-hours) if you want to talk through your workload.

If you'd rather skip infrastructure setup, you can [sign up for Zilliz Cloud](https://cloud.zilliz.com/signup) (fully managed Milvus) .