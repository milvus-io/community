---
id: jev-vs-llms-in-agentic-search.md
title: >
 Jev vs. LLMs in Agentic Search
author: Cheney Zhang
date: 2026-10-09
cover: assets.zilliz.com/Jev_vs_LL_Ms_in_Agentic_Search_51f49f1c28.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Jev, agentic search, LLM reranking, agent memory, multi-hop RAG
meta_title: >
 Jev vs. LLMs in Agentic Search
desc: > 
 We tested Jev in DeepSearcher, MemSearch, and Vector Graph RAG to see where it improves decision latency and cost—and where dedicated rerankers and LLMs still win.
origin: https://milvus.io/blog/jev-vs-llms-in-agentic-search.md
---

[Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) has been getting a lot of attention lately, and I can see why.

Most LLMs are designed to generate text. [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), TypeSafe AI's first System One model, takes a different approach. Give it some context and a question, and it returns a decision directly: a choice, a score, or a true/false judgment. No lengthy response to generate, which means these decisions can be much faster and cheaper.

The first use case that came to mind was **agentic search**.

Search agents make decisions constantly. Should they keep searching or stop? Which retrieved memories are worth keeping? Which relationships should they follow to find an answer? Today, many of these decisions are handled by general-purpose LLMs, even though the expected output is often just a score or a yes/no.

If Jev can make those decisions just as well, but faster and at a lower cost, it could change how we build agentic search pipelines.

So I decided to put it to the test.

I integrated Jev into three of our open-source projects—[DeepSearcher](https://github.com/zilliztech/deep-searcher), [MemSearch](https://github.com/zilliztech/memsearch), and [Vector Graph RAG](https://github.com/zilliztech/vector-graph-rag)—and compared it with the models already used in their retrieval workflows.

The three experiments covered increasingly difficult tasks, from deciding when to stop searching to reranking memories and filtering relationships in multi-hop retrieval. The results gave me a much clearer picture of where Jev works well, and where a more specialized or powerful model still makes sense.

## Jev vs. LLMs in Agentic Search: Same Recall, Jev Makes 4x Faster Decisions

In 2025, OpenAI's Deep Research brought a lot of attention to agentic search: instead of retrieving information once and immediately producing an answer, an agent searches iteratively, using what it has learned to decide what to do next.

We built and open-sourced [DeepSearcher](https://github.com/zilliztech/deep-searcher) around this idea, allowing agents to search private data iteratively to answer complex questions. One decision in this process is particularly interesting: **Does the agent have enough evidence to stop searching?**

![](https://assets.zilliz.com/jev_vs_llms_in_agentic_search_md_1_7901ee76d8.png)

We normally use an LLM to make that judgment. But the model isn't being asked to answer the user's question. It only needs to look at the current search history and decide whether another retrieval round is necessary.

That seemed like an ideal job for Jev.

I used 100 multi-hop questions from DeepSearcher's evaluation data and compared Jev 1.13.0 with the DeepSeek Flash service used in our existing workflow. Both models received the same recorded search history and made stopping decisions against the same search trajectories, with a maximum of seven rounds.

Here's what we found.

![](https://assets.zilliz.com/jev_vs_llms_in_agentic_search_md_2_c5f4d8e910.png)

The retrieval results were almost identical. Both models achieved 93.25% Recall@5, and Jev needed roughly the same number of search rounds.

But Jev was much faster. Median API response latency dropped from 2.23 seconds to 0.55 seconds—about a **4x improvement**. The estimated cost of the stopping decisions was also about **7.5x lower**.

That's a pretty good trade.

To be precise, these measure the stopping-decision step, not the entire agentic search pipeline. The cost estimates exclude retrieval, intermediate answer generation, and other model calls. Recall@5 also measures evidence retrieval rather than final-answer accuracy.

And while the two models achieved the same aggregate recall, they didn't always make identical stopping decisions. Still, for this workload, Jev delivered the same aggregate retrieval quality at a fraction of the decision latency and cost.

I think the reason is straightforward. The model doesn't need to generate an explanation or reason its way through an open-ended question. The task is always the same: given the evidence collected so far, is there enough information to answer?

Once the question is framed that way, the system only needs a structured decision.

**For this kind of narrowly defined decision inside a search loop, I'd be comfortable replacing the general-purpose LLM with Jev.**

Of course, deciding when to stop searching is relatively simple. I wanted to see whether Jev could do as well when the judgment itself became more demanding.

## Jev vs. LLMs in Agent Memory Reranking: Jev Helps, but a Dedicated Reranker Still Wins

We had previously tested Jev on public retrieval benchmarks and found that it could perform surprisingly well against dedicated rerankers, sometimes even outperforming them. But public benchmarks don't always reflect what happens with specialized, application-specific data.

For the second experiment, I chose a workload that's quite different from ordinary document retrieval: searching through a coding agent's memory.

Our open-source project [MemSearch](https://github.com/zilliztech/memsearch) gives coding agents such as Claude Code and Codex persistent memory. It stores development conversations and accumulated experience in Markdown files, allowing agents to retrieve relevant context even after a session ends.

For this test, we used MemSearch's existing 2,172 questions, covering both Chinese queries and their English translations. We kept the initial candidate retrieval fixed using BGE-M3 dense embeddings and compared three approaches: the original embedding ranking without reranking, Jev, and Voyage rerank-3.

![](https://assets.zilliz.com/jev_vs_llms_in_agentic_search_md_3_f1006b992e.png)

Jev clearly improved the results.

It raised Recall@5 from 74.71% to 79.41%, a gain of 4.70 percentage points. So it did more than simply reproduce the original embedding order. It could recognize useful memories that the initial retrieval hadn't ranked highly enough. But Voyage rerank-3 still performed better, reaching 81.87% Recall@5.

The gap was even more noticeable in MRR@10, where Voyage was substantially better at placing the first relevant result near the top. We saw the same general pattern in both Chinese and English.

What surprised me was the cost comparison. For this workload, Jev's estimated reranking cost was about $0.171 per 1,000 queries, compared with $0.120 for Voyage. Jev wasn't cheaper, either.

My guess is that memory reranking can require more reasoning than it first appears. A coding agent's memory isn't just a collection of independent facts. It often contains a sequence of events: an error, several attempted fixes, a failed approach, and eventually a working solution. To rank those memories correctly, the model may need to understand how those events relate to one another. That goes beyond recognizing whether two pieces of text are semantically similar.

This experiment doesn't prove that's why Jev fell behind, but it's a plausible explanation. Jev is designed to make fast decisions rather than generate an extended reasoning process, and some ranking tasks may benefit from that additional reasoning.

For now, **I'd still choose a dedicated reranker such as Voyage for this particular memory-search workload.** It gave us better retrieval quality and lower estimated cost.

The result also reminded me why testing on actual application data matters. A model that looks excellent on a public benchmark may behave quite differently once it's ranking the messy, highly contextual information your application really uses.

The next experiment pushed Jev further, into a retrieval task where understanding relationships between pieces of evidence is central to getting the right answer.

## Jev vs. LLMs in Multi-Hop Graph Retrieval: Jev Is Better Than GPT-4o-mini, but Not GPT-5-mini

Our third project, [Vector Graph RAG](https://github.com/zilliztech/vector-graph-rag), combines vector search with entity relationships. Instead of relying only on individually retrieved documents, it can follow connections between entities to answer questions that require multiple pieces of information.

In Vector Graph RAG, a general-purpose LLM originally handled this relationship-ranking and filtering step. It's also one of the slower parts of the pipeline. Many candidate relationships can be returned; the input can get long, and the model has to work through them before returning its selection.

![](https://assets.zilliz.com/jev_vs_llms_in_agentic_search_md_4_d22518a475.png)

So I replaced that step with Jev and tested it against GPT-4o-mini and GPT-5-mini.

We evaluated 500 questions each from MuSiQue and HotpotQA, using the same candidate relationships and passage-retrieval setup across the models we compared.

![](https://assets.zilliz.com/jev_vs_llms_in_agentic_search_md_5_4594887903.png)

Jev outperformed GPT-4o-mini on both datasets.

On HotpotQA, it reached 93.50% Recall@5, just one percentage point behind GPT-5-mini. That's a respectable result for a model designed around fast, structured decisions.

But the gap widened on MuSiQue.

Jev achieved 68.87%, compared with GPT-5-mini's 73.00%, a 4.13 percentage-point difference. Published HippoRAG 2 results were higher as well, although those historical numbers come from different evaluation configurations and aren't a direct head-to-head comparison.

The MuSiQue result is particularly interesting.

In this type of retrieval, you can't always judge relevance by looking at one relationship in isolation. A candidate may only become useful when you understand how it connects to several other facts.

A generative LLM has more flexibility to work through those dependencies before choosing what to keep. Jev doesn't generate that kind of intermediate reasoning.

That doesn't necessarily mean Jev can't handle complicated judgments. But it does suggest that **as the relationships become more complex, the ability to reason across several pieces of evidence can matter more than raw decision speed.**

For difficult multi-hop questions, I'd still lean toward a stronger generative model.

### Does Jev make up for the quality gap in cost and latency?

Not as dramatically as it did in the first experiment.

We estimated the API cost of the relationship-filtering stage at approximately $3.15 per 1,000 queries for Jev, versus $3.30 for GPT-4o-mini and $6–9 for GPT-5-mini.

So Jev was substantially cheaper than GPT-5-mini under these assumptions, but only slightly cheaper than GPT-4o-mini. Some HippoRAG 2 configurations could still be cheaper, largely because their filtering prompts are much shorter.

**Jev's main potential advantage here was latency.**

Our latency scenarios estimated 1.2–4 seconds for Jev, compared with 4–10 seconds for GPT-4o-mini and 10–30 seconds for GPT-5-mini. These are illustrative API-response estimates rather than a controlled, measured latency benchmark, but they show why Jev is worth considering when response time matters.

**Would I use Jev for this workload? It depends.**

If I needed the best retrieval quality on difficult multi-hop questions, I'd keep the stronger model. If I could accept a few percentage points of lower evidence recall in exchange for faster relationship selection, Jev would be worth testing.

I'd also consider a different approach altogether: instead of building a more complicated relationship-filtering pipeline, use iterative agentic search and let Jev handle the stopping decisions. Our first experiment suggests that could be a promising direction, although we'd need a separate evaluation to compare the complete systems.

## What These Experiments Tell Me About Jev

After testing Jev across these three projects, I have a better sense of what it's good at. I wouldn't use it as a universal replacement for LLMs. Its performance depends heavily on the kind of decision you're asking it to make.

For me, the strongest use case is **high-frequency semantic decisions with short, structured outputs**. That includes the search-stopping decisions we tested, but I also see potential in query routing, data filtering, quality evaluation, semantic caching, and reranking with specific business criteria. Tool selection, Skill invocation, and browser actions are other interesting possibilities.

Those applications still need their own evaluations, of course.

What's appealing is that many of these decisions used to require separate, task-specific models if we wanted to make them fast and cheap. With Jev, we can potentially reuse one model across different decisions by changing the context and criteria we provide. That could simplify agent architectures considerably.

At the same time, our MemSearch experiment reminds us that a general decision model isn't always preferable to a specialized one. If a dedicated reranker is both better and cheaper, there's little reason to replace it.

**I think Jev's biggest opportunity is in the parts of an agent workflow where we use an LLM simply because we need a semantic judgment, not because we need text generation or extended reasoning.**

Those decisions happen constantly in modern agent systems. Making them faster and cheaper could leave more room for the expensive reasoning that genuinely needs a powerful generative model.

That's where I'll be looking next.

## Code, Benchmarks, and Further Reading

We've made the evaluation work available for anyone who wants to reproduce the results or try Jev on their own search workloads.

You can find the [DeepSearcher stopping-decision experiment](https://github.com/zilliztech/deep-searcher/blob/master/evaluation/jev_stopping/README.md), the [MemSearch reranking implementation and evaluation](https://github.com/zilliztech/memsearch/pull/758), and the [Vector Graph RAG relationship-reranking experiment](https://github.com/zilliztech/vector-graph-rag/pull/48) on GitHub.

For more background on Jev, see [TypeSafe AI's introduction](https://typesafe.ai/blog/introducing-system-one-models-and-jev) and [API documentation](https://docs.typesafe.ai/introduction). There's also an interesting community project, [jev-ultrafast](https://github.com/browser-use/jev-ultrafast), experimenting with Jev for browser agents.

If you're building an agentic search system, I'd start with one of the frequent, well-defined decisions currently handled by a generative LLM. Measure what changes when you replace it with Jev—not just the API latency, but the quality of the results downstream.

You may find, as we did, that some of those LLM calls don't need to be LLM calls at all.