---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >
  Interview with RaBitQ Authors: The TurboQuant Dispute and Why the Storage
  Selloff Was a False Alarm
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >
  RaBitQ's authors respond to Google's TurboQuant paper: the benchmark
  imbalance, the misattributed theory, and why the storage selloff was a false
  alarm.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Google’s <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> paper claimed <strong>6x compression, 8x speedup, and near-zero accuracy loss</strong> for vector representations. After it was released, memory and storage stocks fell sharply, and major tech outlets quickly turned it into a headline story.</p>
<p>The market reaction was only the start. Researchers soon began asking whether the paper’s claims were overstated and whether it treated prior work — especially <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a> — fairly. The dispute pushed <strong>vector quantization</strong> back into the spotlight, partly because the same underlying ideas now matter in two critical parts of the AI stack: <a href="https://zilliz.com/learn/vector-similarity-search">vector search systems</a> and KV-cache compression for large models.</p>
<p>To understand both the technical debate and what it means for production systems, we spoke with <strong>Cheng Long</strong>, Associate Professor at NTU Singapore and head of VectorDB@NTU; <strong>Jianyang Gao</strong>, first author of RaBitQ; and <strong>Li Liu</strong>, Director of Engineering at Zilliz. The conversation covered vector quantization itself, the questions raised around TurboQuant, and why this matters for systems like <a href="https://milvus.io/">Milvus</a>, the most popular open-source <a href="https://zilliz.com/learn/what-is-vector-database">vector databases</a>, and large-scale vector retrieval.</p>
<p><strong><em>Related reading:</em></strong> <em>If you want the engineering side rather than the interview, see our companion article on</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>how vector quantization affects AI infrastructure costs</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Why did vector quantization suddenly become such a big topic?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Before we get into the controversy, could you start by explaining what vector quantization is and why it has become so important in AI?</strong></p>
<p><strong>Cheng Long:</strong> Vector quantization is a technique for <strong>data compression</strong> and <strong>approximate representation</strong>. It originally came from signal processing, where it was used for image and audio compression. In modern AI systems, its role has changed because vectors have become one of the basic units of computation.</p>
<p>Today, its importance is clearest in two places.</p>
<p>One is <strong>real-time search over collections with billions or even tens of billions of vectors</strong>. In semantic retrieval systems, the core task is similarity search over high-dimensional vectors. But raw vectors are large, and floating-point computation is expensive. At scale, that makes it difficult to deliver millisecond-level latency. Vector quantization helps by compressing vectors into low-bit representations and speeding up distance computation. That is why it matters for practical workloads such as <a href="https://milvus.io/docs/single-vector-search.md">single-vector search</a>, <a href="https://milvus.io/docs/multi-vector-search.md">multi-vector search</a>, and index design in <a href="https://milvus.io/docs/index-explained.md">Milvus search architecture</a>.</p>
<p>The other is <strong>KV cache compression</strong> for large models. KV cache reduces redundant computation during generation, but the memory cost grows quickly as context gets longer. So the problem becomes how to compress those vectors without hurting output quality too much. At its core, that is also a vector quantization problem.</p>
<p><strong>Zilliz: If vector quantization becomes more widely used — and if TurboQuant’s results hold up — does that mean storage demand drops sharply?</strong></p>
<p><strong>Jianyang Gao:</strong> Under the same model and the same workload, compression can reduce storage demand. But that does not justify the broader conclusion people jumped to.</p>
<p>When TurboQuant talks about <strong>6x compression</strong> and <strong>8x speedup</strong>, it is comparing against a basic <strong>16-bit/32-bit baseline</strong>. That is not the same as comparing against other methods in the same category. So the real effect still needs to be evaluated more carefully.</p>
<p><strong>Zilliz: Then from that perspective, if the market reaction were really about the technology itself, should it have happened much earlier, when similar ideas had already appeared?</strong></p>
<p><strong>Cheng Long:</strong> From a technical point of view, you could say that similar theoretical territory had already been reached before. But markets do not move in sync with research. There is usually a lag between academic results, engineering adoption, and financial interpretation.</p>
<p>And over a longer horizon, the effect may not even be linear. Compression can make it possible to run large models on smaller devices, which can create new demand rather than simply reduce it. The relationship between technology and markets is more complicated than a straight-line extrapolation.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">How did RaBitQ emerge, and what did it contribute?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: How did you first arrive at the idea for RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> We started from a gap we saw in vector databases. Traditional methods such as <a href="https://milvus.io/docs/ivf-pq.md">Product Quantization</a> worked well empirically, but they offered very little in the way of theoretical guarantees.</p>
<p>At the time, I was studying high-dimensional probability at NTU Singapore, and that led me to ask whether we could build a method that was not only practical, but also came with a clear theoretical guarantee. That was the starting point for RaBitQ.</p>
<p><strong>Zilliz: What do you see as RaBitQ’s core originality?</strong></p>
<p><strong>Jianyang Gao:</strong> Its key idea was to use a random rotation, a.k.a., Johnson-Lindenstrauss transformation, to make the distribution of vector coordinates more uniform and more predictable.</p>
<p>Once you have that, you can derive an optimal quantization estimator on top of it. We then gave a strict proof that it reaches the theoretical lower bound.</p>
<p>Earlier work had also tried to introduce random rotation. But from our perspective, those methods did not achieve the effect we were looking for because of practical issues in algorithm design.</p>
<p><strong>Zilliz: From an engineering perspective, what stood out most to you about RaBitQ?</strong></p>
<p><strong>Li Liu:</strong> We had worked with many quantization algorithms, from <a href="https://milvus.io/docs/ivf-sq8.md">scalar quantization methods</a> to PQ and other variants. What stood out about RaBitQ was that it changed how people approached the problem.</p>
<p>Before that, much of the field was still fairly empirical. You could say a method seemed to work, but it was harder to explain clearly why. RaBitQ approached the problem in a much more mathematical way. The method felt elegant and, in a sense, simple. That way of thinking influenced a lot of later work.</p>
<p><strong>Zilliz: Put simply, how much can it save in memory and cost?</strong></p>
<p><strong>Li Liu:</strong> At the same recall level, moving from 4-bit compression to 2-bit compression cuts memory use by half.</p>
<p>And it is not just about compression. Its performance compares favorably with earlier approaches, and that matters in production environments where teams care about both memory efficiency and retrieval quality. That is why it matters for systems that need to balance <a href="https://milvus.io/docs/dense-vector.md">dense vector storage</a>, throughput, and recall.</p>
<p><strong>Zilliz: Beyond Milvus, where do you see RaBitQ being used today?</strong></p>
<p><strong>Cheng Long:</strong> First, I want to thank the Milvus team, because they were among the earliest to adopt RaBitQ. We also had a lot of discussions and some collaborative research along the way.</p>
<p>RaBitQ has also been adopted in some other systems including Meta’s FAISS, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene, and turbopuffer. What stands out on the Milvus side is that the team shipped <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> as a real index option in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, alongside broader work on <a href="https://milvus.io/docs/manage-collections.md">collection management</a>, <a href="https://milvus.io/docs/ivf-flat.md">IVF-based indexing</a>, and <a href="https://milvus.io/docs/hnsw.md">HNSW-based indexing</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">How should we evaluate TurboQuant?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: In your public response, you said TurboQuant had some serious issues. What, in your view, were the main ones?</strong></p>
<p><strong>Jianyang Gao:</strong> We see three main problems.</p>
<p>One is the way the paper describes prior work and discusses overlap. The TurboQuant paper misrepresents the methodology of RaBitQ, ignoring the most similar part, such as Johnson-Lindenstrauss Transformation. Another is the way the paper characterizes the theoretical result. It describes RaBitQ as suboptimal without providing any explanation or evidence, but RaBitQ is optimal in fact. The third is the fairness of the experimental comparison. They use single-core CPU to evaluate RaBitQ while using A100 GPU to evaluate TurboQuant.</p>
<p><strong>Zilliz: Let’s take the benchmark issue first. Why do you think the comparison was not fair?</strong></p>
<p><strong>Jianyang Gao:</strong> Benchmark claims only mean something if the setup is comparable. If one system is tested under a very different hardware or software environment, then the result may reflect the setup more than the algorithm itself.</p>
<p>In our view, differences in processor choice, implementation language, and optimization level can make a major difference. That is why benchmark methodology needs to be interpreted very carefully, especially by teams building production retrieval systems.</p>
<p><strong>Cheng Long:</strong> The paper also made some other claims that do not hold.</p>
<p>For example, the paper says that <strong>RaBitQ cannot be vectorized</strong>. But RaBitQ had already open-sourced code with SIMD-based vectorized computation when the 2024 paper was published. So from our perspective, that statement was factually incorrect.</p>
<p>It is also worth mentioning that we began working with NVIDIA last year and completed a GPU implementation of RaBitQ. The related code is under review for inclusion in NVIDIA’s cuVS library.</p>
<p><strong>Zilliz: Milvus evaluated TurboQuant in the second half of 2025 but did not adopt it. What did your team see in testing?</strong></p>
<p><strong>Li Liu:</strong> It does contain one useful idea. In our view, it makes a small optimization in how the quantization grid is allocated. But the most important step in the method — using random rotation for quantization — was first introduced by RaBitQ.</p>
<p>And when it comes to unbiased estimation, RaBitQ’s approach is cleaner and its theoretical derivation is stronger.</p>
<p>That said, because this was a result from Google, we tested it in 2025. In our lab, under a standardized CPU environment, TurboQuant did not outperform our internal RaBitQ version in most of the cases we evaluated. So when the market reacted so strongly, we were genuinely surprised.</p>
<p><strong>Zilliz: For readers who have not looked closely at either paper, could you walk through where RaBitQ and TurboQuant overlap in plain language?</strong></p>
<p><strong>Li Liu:</strong> At a high level, both methods begin with <strong>random rotation</strong>. Mathematically, that means multiplying the vector by a random orthogonal matrix. You can think of it as changing your viewing angle in a high-dimensional space. It does not change the relative positions of the data points, but it distributes the information across dimensions more evenly.</p>
<p>After that comes <strong>quantization</strong>. You divide the continuous real-valued space into <strong>2^k grid cells</strong>, where <strong>k</strong> is the number of quantization bits, and then map each vector element to a nearby grid point. TurboQuant makes a small adjustment here by allocating the grid according to the data distribution instead of distributing it evenly.</p>
<p>The last step is <strong>error estimation</strong>, and this is where RaBitQ’s main contribution lies. Traditional methods calculate directly from the quantized values, which makes the error harder to control. RaBitQ estimates the quantization error more precisely, and that is where its mathematical optimality comes from. TurboQuant’s solution is more complicated, and in our setting the tradeoff did not look as attractive.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Why is attribution so hard to resolve in practice?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> After you published your public statement, how did Google and ICLR respond?</p>
<p><strong>Cheng Long:</strong> ICLR did not take action. We emailed them during the review period in September last year, but did not receive a response. We wrote again in March this year and were told to post comments on OpenReview, but beyond that there was no action.</p>
<p>As for Google, one of the co-authors replied a few days ago. The reply said they would revise the arXiv version to correct its inaccurate description of RaBitQ’s optimality.</p>
<p><strong>Zilliz:</strong> Earlier the discussion was framed around academic misconduct. Now it also sounds like a question of imbalance and who gets to shape the story. Why is it so hard to defend your work?</p>
<p><strong>Cheng Long:</strong> One problem is scale. AI conferences are now so large that a single cycle can bring in tens of thousands of papers. Organizers simply do not have the capacity to handle every dispute of this kind.</p>
<p>The other problem is imbalance. Large companies have a much stronger public voice. Independent researchers or smaller teams do not have the same communication power.</p>
<p><strong>Jianyang Gao:</strong> For individuals, the cost is extremely high. Professor Long and I have barely been able to work normally in recent weeks.</p>
<p>The process itself has also been frustrating. We were firmly rejected when we contacted the authors, and we received no response from the conference organizers. In practice, many researchers look at situations like this and decide to let them go. But that is also how many original contributions disappear from the public narrative.</p>
<p><strong>Zilliz:</strong> It sounds like this is not the first time your team has run into this kind of problem.</p>
<p><strong>Cheng Long:</strong> No, it is not.</p>
<p>We have seen cases before where companies take RaBitQ, make a few engineering modifications, give it a new name, and then describe it only as something inspired by RaBitQ.</p>
<p>That is why I appreciate the way some industry teams handle this, including Milvus. When they use RaBitQ, they describe it objectively. And when they add optimizations beyond the original version, they explain those clearly as their own engineering contribution. That gives proper credit to the original work while also showing the company’s technical strength.</p>
<p><strong>Zilliz:</strong> When large companies build on academic work, do they usually provide any financial sharing or benefit allocation?</p>
<p><strong>Jianyang Gao:</strong> In most cases, no.</p>
<p>That said, large companies still have a strong incentive to present a technical advance as something they created themselves rather than something they adopted from others. Everyone wants customers and investors to see the most advanced work as the result of their own team’s innovation.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">What comes next for vector quantization?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> What research directions are you working on now?</p>
<p><strong>Cheng Long:</strong> A large part of our work will remain focused on vector retrieval.</p>
<p>One direction is to combine RaBitQ with different vector retrieval indexes, such as IVF and HNSW, so the system can support larger-scale data with lower latency, higher concurrency, and lower cost. I am also paying attention to KV cache compression.</p>
<p><strong>Jianyang Gao:</strong> KV cache in large models and vector retrieval share many of the same properties, both mathematically and at the systems level, because both deal with high-dimensional vectors.</p>
<p>Going forward, I want to think more about how to apply mathematical tools, including ideas from high-dimensional probability, to accelerate inference and training.</p>
<p><strong>Zilliz:</strong> Where is the ceiling for vector quantization as a field? How much room is left for improvement?</p>
<p><strong>Cheng Long:</strong> From a theoretical point of view, the ceiling is largely in sight. RaBitQ is already asymptotically optimal.</p>
<p>But there is still a great deal of room on the engineering side. You still have to deal with hardware characteristics, data distribution, latency constraints, and many other practical factors. That is exactly why production systems still need careful work in areas such as <a href="https://milvus.io/docs/architecture_overview.md">distributed vector database architecture</a>, <a href="https://milvus.io/docs/sparse_vector.md">sparse vector support</a>, <a href="https://milvus.io/docs/reranking.md">reranking pipelines</a>, and metric selection in <a href="https://milvus.io/docs/metric.md">Milvus distance metrics</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Keep Reading<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to dig deeper into the engineering side of RaBitQ and how it fits into Milvus, these are the most relevant resources:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ documentation</a> — configuration details and tuning guidance.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ integration deep dive</a> — how Milvus turned RaBitQ into a production index.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">How vector quantization affects AI infrastructure costs</a> — our broader analysis of the TurboQuant-RaBitQ discussion.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 release post</a> — where IVF_RABITQ shipped as a real Milvus index option.</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvus index explained</a> — how IVF_RABITQ fits with other index choices.</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT indexing</a> and <a href="https://milvus.io/docs/hnsw.md">HNSW indexing</a> — useful baselines if you are comparing index tradeoffs.</li>
<li><a href="https://milvus.io/docs/schema.md">Schema design in Milvus</a> and <a href="https://milvus.io/docs/filtered-search.md">filtered search</a> — useful if you are evaluating RaBitQ in a real application rather than in isolation.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a> and <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG system design</a> — helpful if you want to try this in a retrieval pipeline.</li>
</ul>
<p>Join the <a href="https://slack.milvus.io/">Milvus Slack community</a> or <a href="https://milvus.io/office-hours">book Milvus Office Hours</a> if you want to talk through your workload.</p>
<p>If you’d rather skip infrastructure setup, you can <a href="https://cloud.zilliz.com/signup">sign up for Zilliz Cloud</a> (fully managed Milvus) .</p>
