---
id: jevs-cheap-decisions-make-semantic-caching-worth-another-try.md
title: >
 Jev’s Cheap Decisions Make Semantic Caching Worth Another Try
author: James Luan, CTO of Zilliz
date: 2026-10-12
cover: assets.zilliz.com/jevs_cheap_decisions_semantic_caching_cover_08494007d4.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Jev, GPTCache, semantic caching, LLM caching
meta_title: >
 Jev’s Cheap Decisions Make Semantic Caching Worth Another Try
desc: >
 Zilliz CTO James Luan revisits GPTCache with Jev, testing if cheap answer checks can reduce false cache hits and make semantic caching worth another try.
origin: https://milvus.io/blog/jevs-cheap-decisions-make-semantic-caching-worth-another-try.md
---

When TypeSafe AI released [Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) on September 15, I thought of a project our team had started in 2023: GPTCache.

Jev takes a body of information and a set of defined questions, then returns structured decisions: a yes or no, a choice, or a score, with probabilities. Its [listed price](https://docs.typesafe.ai/models) is $0.042 per million input tokens, with no charge for output.

We built [GPTCache](https://github.com/zilliztech/GPTCache) to find a previously answered question that was semantically similar to a new request, then reuse the answer instead of calling a large language model again. The project attracted more than 8,200 GitHub stars, but it also left us with a difficult problem: two questions can be similar enough to retrieve together while requiring different answers.

We had considered using another model to check each cached answer before returning it. The trouble was the economics. A cache exists to avoid expensive model calls. Adding an expensive call to validate every hit could eat up much of the savings.

Jev made that tradeoff worth testing again. I wanted to see whether an inexpensive reuse check could catch the mistakes similarity search missed.

# The Challenges GPTCache Faces

In early 2023, almost everyone on our team was using GPT. Two patterns quickly became obvious: the calls were expensive, and many questions were repeated.

“How do I reset my password?” and “What should I do if I forgot my password?” are different cache keys, but they often need the same answer. The same is true of many FAQs. As a team building vector databases, we already knew how to find semantically similar content. Why not use that capability to avoid generating the same answer repeatedly?

We started GPTCache in March. By April, it was on [Hacker News](https://news.ycombinator.com/item?id=35471071) under the headline “Slash Your LLM API Costs by 10x,” and it was soon integrated into LangChain.

As the workloads became more varied, the limits of similarity became harder to ignore:

-   A user asks for code only, but the cached answer includes two paragraphs of explanation. A downstream program may fail to parse it.
-   A user asks for ten sentences ending in “Gaming,” but the cached answer ends each sentence in lowercase “gaming.” The meaning is close; the requested output is still wrong.
-   A question about blood pressure medications available in the UK resembles a general question about those medications, but the regional restriction changes what belongs in the answer.
-   Two requests are identical, but the cached answer stops at “Here are the steps.” An exact match cannot make an incomplete answer usable.

We tried adding a reranker to score the relationship between the requests. But a question-to-question comparison doesn't check whether the answer is complete, follows the required format, matches the relevant region or version, or stays current. Our [README](https://github.com/zilliztech/GPTCache#-how-does-it-work) acknowledges that semantic cache hits can produce false positives.

We needed to decide whether this particular answer could satisfy the request in front of us.

# Can We Check the Answer Before Reusing It?

For this experiment, I kept the retrieval process and added a decision step immediately before returning a cached answer. Jev received the current request, the cached request, the cached answer, and the available time information. I asked it to evaluate five dimensions:

-   **Task:** Does the answer solve the task the user is asking for now? A feasible solution does not satisfy a request for the optimal solution.
-   **Constraints:** Do conditions such as region, version, and quantity still match? A request for strings that contain a phrase is different from one for strings that start with it.
-   **Output:** Is the answer complete, and does it meet requirements for language, format, capitalization, and code-only output?
-   **Freshness:** Does the answer depend on information that may have changed? Translation usually does not; a current price does.
-   **Context:** Is the information needed to answer the request available? If a user asks to modify “the code above” and that code is missing, an answer from another conversation cannot fill the gap.

I used the lowest of the five scores to decide whether to allow reuse. A high task-alignment score cannot compensate for a failed output requirement. The answer goes directly to the user, so every essential condition must hold.

The check evaluates reuse only; it does not independently verify the facts, calculations, or code in the cached answer.

# Putting Jev to the Test

I used 1,536 examples drawn from vCache’s [LmArena](https://huggingface.co/datasets/vCache/SemBenchmarkLmArena) and [SearchQueries](https://huggingface.co/datasets/vCache/SemBenchmarkSearchQueries) datasets. Each example contained a current request, a cached request, and a cached answer. I reserved 384 examples for threshold selection and 1,152 for the held-out test. The cache stayed fixed throughout: no new entries and no evictions.

The comparison included Jev, [Laya](https://huggingface.co/convaiinnovations/laya), and the GPTCache reranker baseline. Laya is an open model with 421 million parameters, built on ModernBERT-large.

Jev and Laya evaluated the same five dimensions and could inspect the answer and time information. I had to shorten Laya’s instructions substantially to get usable results. The reranker received only the current and cached requests and used a cross-encoder to score their relevance. I compared similarity between requests while also checking the answer itself.

In the first round, I used fixed thresholds of 0.70 for Jev, 0.60 for Laya, and 0.80 for the reranker. I excluded four examples with uncertain labels from the precision and recall calculations.

| **Method** | **Correct reuse** | **Incorrect reuse** | **Missed reusable answers** | **Precision** | **Recall** |
| --- | --- | --- | --- | --- | --- |
| Jev | 364 | 1 | 141 | 99.7% | 72.1% |
| Laya | 318 | 361 | 187 | 46.8% | 63.0% |
| Reranker | 401 | 477 | 104 | 45.7% | 79.4% |

Here, precision is the share of accepted answers that were reusable; recall is the share of reusable answers the method accepted.

The reranker recovered the most reusable answers, but it also allowed 477 incorrect reuses. Similarity alone did not distinguish the answers that met the current request from those that did not.

Laya reduced incorrect reuse to 361 after being given access to the answer, but its precision was still only 46.8%. Jev accepted 364 reusable answers and just one incorrect reuse, while rejecting 141 answers that could have been reused.

For a cache, that is a tradeoff I am willing to make. A miss means paying for another generation. An incorrect hit means giving the user an answer that does not fit the request.

I still needed to know whether the threshold would hold up on new requests. A model can reduce its errors simply by rejecting more answers. For this to be useful in a running system, I needed a threshold selected on one set of examples to work on another.

For the second round, I used only the 384 calibration examples to select thresholds targeting at least 99% reuse precision. I then applied those thresholds to the remaining 1,152 examples without adjusting them.

| **Method** | **Threshold selection on 384 examples** | **Correct reuse on test set** | **Incorrect reuse on test set** |
| --- | --- | --- | --- |
| Jev | Selected threshold of 0.80 | 227 | 0 |
| Laya | Selected threshold accepted 3 answers, all correct | 10 | 6 |
| Reranker | No threshold met the target while accepting any examples | 0 | 0 |

Jev’s selected threshold carried over to the held-out test: 227 correct reuses and no observed incorrect reuses. Laya’s did not. Its perfect precision on just three calibration examples became ten correct reuses and six incorrect ones on the test set. The reranker could meet the target only by rejecting everything.

That is the behavior I need from a cache: a threshold chosen on past examples has to remain useful on new requests. Jev did that across these two partitions. I would not read a score of 0.80 as a universal 80% probability of correctness, or assume that future workloads would have no false cache hits.

# Changing the Rule Without Retraining

One example taught me as much as the aggregate results.

My first freshness rule treated missing time information as a risk. That makes sense for prices, news, or inventory. Without knowing when an answer was produced, it can be difficult to judge whether it is still current.

But the rule also rejected a hypothetical question: “If you could turn any object into gold, what would you choose to maximize its value?” The question did not depend on today’s date or recent events. Yet without a timestamp, it was easy to receive a low freshness score.

The mistake was in my rule. Missing time information does not mean time information is necessary.

I changed the check to ask first whether the answer depends on external facts that change over time. Only then should it evaluate whether the information is fresh enough. If the task is independent of time, the freshness check passes. With the revised rule, the hypothetical example scored 0.92 and was accepted for reuse.

I added no training data and did not retrain the model. I changed the rule, and the decision changed with it.

Reuse criteria change with the request. A feasible solution may become unacceptable when the user asks for an optimal one. “Contains” and “starts with” may look similar but require different outputs. One query may need current information; another may work with an answer from months ago.

With a conventional classifier, changing the decision criteria often means collecting examples and retraining or fine-tuning. Here, I could change the written rule and test the new behavior against counterexamples.

Laya struggled with the full instructions in my setup. None of the 48 stratified examples reached a score of 0.70. Even a translation request with the candidate answer “Bonjour.” could fail the freshness check, although the rules explicitly said that translation usually does not require current information. Shortening the instructions produced the main results above, but the threshold still did not preserve its calibration-set precision on held-out data.

For cache reuse, I need consistent application of the rules behind the score.

# Is the Extra Check Worth It?

I also measured decision latency. Jev’s remote API had a median latency of 0.79 seconds in my tests, including network and queueing time. Laya ran locally on an M4 Pro with a median of 0.27 seconds. I ran the reranker in CPU batches, so its timing was not directly comparable.

An extra 0.79 seconds matters in the request path. I would weigh it against the cost and latency of the generation it avoids. A short answer from a fast model offers a different tradeoff from a reasoning task that produces thousands of tokens.

# Where I’d Try Jev's Cheap Decisions Next

When we built GPTCache in 2023, we wanted to avoid one unnecessary model call. With reasoning models and agents, unnecessary work can cost much more. A reasoning answer may generate thousands or tens of thousands of tokens. An agent may make many model calls to finish one task.

Early termination is another place I would try it. After a reasoning model has generated 3,000 tokens, a decision step could evaluate whether it has enough information to finish or has gone off track. Previously, checking whether to continue could itself require an expensive model call. A cheap check makes early termination worth testing.

I see a similar opportunity in operations. Autoscaling commonly relies on CPU utilization, queries per second, and queue length. Those signals do not describe everything about the workload. A batch of expensive hybrid searches differs from simple point lookups. Errors caused by an unhealthy node differ from errors caused by bad client parameters. A customer’s support ticket about an event next week may be a reason to prepare capacity in advance.

For those cases, I would ask the model to read the requests, logs, or tickets and return a decision the system could act on. These tasks often do not require generating an analysis report.

Permissions, resource limits, and safety rules still belong in code. The part that requires interpreting content is where I would consider a cheaper decision model.

I revisited GPTCache because checking an answer had become cheap enough to try. The experiments gave me a much clearer tradeoff: Jev sharply reduced incorrect reuse in these tests, but rejected some valid hits and added latency. That is a useful starting point for a design we had struggled to make work.

As reasoning and agent workloads grow, I expect that decision to become more valuable: knowing when an expensive model call is actually necessary.