---
id: improving-vector-graph-rag-with-two-stage-jev-reranking.md
title: >
 Improving Vector Graph RAG with Two-Stage Jev Reranking
author: Cheney Chen
date: 2026-10-30
cover: assets.zilliz.com/cms-cn/blog_cover_Improving_Vector_Graph_RAG_with_Two_Stage_Jev_Reranking_2c90b4eac5.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Vector Graph RAG, Milvus, Jev reranking, multi-hop retrieval, Graph RAG
meta_title: >
 Improving Vector Graph RAG with Two-Stage Jev Reranking
desc: >
 Vector Graph RAG combines multi-hop retrieval in Milvus with two-stage Jev reranking to improve evidence recall and the observed quality–latency tradeoff.
origin: https://milvus.io/blog/improving-vector-graph-rag-with-two-stage-jev-reranking.md
---
In [Jev vs\. LLMs in Agentic Search](https://milvus.io/blog/jev-vs-llms-in-agentic-search.md), we tested Jev, a model that returns structured decisions, on tasks such as deciding when a search agent should stop and reranking its memories\. These judgments happen frequently in a search workflow, where the application often needs only a score or a yes/no answer\.

This time, we’ve continued that work in [Vector Graph RAG](https://github.com/zilliztech/vector-graph-rag), our open\-source project for multi\-hop retrieval with Milvus\. It stores entities, relationships, and source passages in Milvus, linked by IDs\. Vector search finds the starting points, and ID lookups expand the connected graph without requiring a separate graph database\.

The original design already delivered strong multi\-hop recall with a single LLM relationship\-selection pass\. We wanted to preserve that retrieval quality while reducing reranking time\. Our first Jev integration kept the Milvus searches and graph expansion intact; the latest version also evaluates the source passages those relationships return\.

We’ve now integrated a two\-stage Jev pipeline into the project\. Jev first selects relationships, then ranks their source passages alongside candidates from direct vector search\. On MuSiQue and 2Wiki, the updated pipeline improved Jev 1.13’s average Recall@5 by 6.03 percentage points\. Two\-stage Jev 1.14 reached 86.61%, the highest among the configurations we compared\.

## What changes with two\-stage Jev reranking

The updated pipeline keeps the same entity search, relationship search, and graph expansion\. Jev then makes two sets of judgments\.

**Stage 1 selects relationships\.** Jev scores the expanded relationships against the question\. It needs to preserve connections that lead to evidence, including intermediate relationships that cannot answer the question on their own\. We retrieve the sources of those relationships and merge them with passages found through direct vector search\. After deduplication, both retrieval paths contribute to the passage candidate pool\.

**Stage 2 ranks passages\.** Jev evaluates the complete candidate passages and scores how well they help answer the question\. We use those scores to order the final retrieval results\.

## How the two Jev stages fit into Vector Graph RAG

Multi\-hop retrieval needs to connect facts that may be spread across passages and expressed using different names\. A relevant passage can be difficult to find if the question omits the entity that links it to the answer\. Vector Graph RAG combines semantic search with entity relationships so retrieval can follow those connections\.

During indexing, we extract entities and relationships from the source text\. Entities, relationships, and passages are stored separately in Milvus and linked by IDs\. Entity and relationship embeddings support the initial similarity searches; ID lookups then follow the graph connections and retrieve their source text\.

This gives the project a practical architectural advantage: the vector database also holds the logical graph\. Multi\-hop evidence retrieval uses Milvus for both similarity search and connected\-data lookups, without adding a separate graph database\.

![](https://assets.zilliz.com/cms-cn/traditional_graph_RAG_vs_vector_graph_RAG_91b83dda62.jpeg)

Vector Graph RAG stores its logical graph in Milvus and combines vector search with ID\-based expansion to retrieve connected evidence\.

Consider a question such as:

*What side effects should be considered for the first\-line treatment for type 2 diabetes?*

Suppose the corpus identifies metformin as a first\-line treatment in one passage and describes its adverse effects in another\. The question never names metformin\. Retrieval needs to identify the drug, then follow its connections to find the side\-effect evidence\.

The first four steps below describe the original retrieval path\. The Jev changes are marked where they apply, followed by the added passage\-ranking step\.

### 1 Retrieve starting entities and relationships

The system extracts entities from the question and searches for matching entities\. In parallel, it uses the full question to search for relevant relationships\. Both searches use vector similarity\. In this example, the entities “type 2 diabetes” and “adverse effects,” together with a relationship such as “diabetes affects blood sugar,” become the starting points for expansion\.

![](https://assets.zilliz.com/cms-cn/01_retrieve_seeds_96f1ed7ff2.png)

Entity and relationship searches establish complementary starting points for graph expansion\.

### 2 Expand the subgraph

ID lookups follow the connections recorded on the retrieved entities and relationships\. From the diabetes and adverse\-effect entities, expansion can reach metformin and the relationships connecting the drug to the condition and its side effects\. Another hop can bring in development history\. The unnamed drug is now in the retrieval scope, along with branches that may need filtering\.

![](https://assets.zilliz.com/cms-cn/02_expand_graphs_9bbdbd0a40.png)

Graph expansion discovers the unnamed drug and additional connected relationships through ID lookups\.

### 3 Select the relationships that help answer the question

The original pipeline sends the question and expanded candidate relationships to an LLM in one selection pass\. It retains the treatment relationship R1 and adverse\-effect relationship R2, while filtering out branches such as drug development history and blood\-sugar effects\. Useful intermediate connections remain available to lead retrieval to the evidence\. The link identifying metformin is one such connection\.

![](https://assets.zilliz.com/cms-cn/03_filter_relationspng_e9fad426d4.png)

One relationship\-selection pass keeps the treatment and adverse\-effect connections needed by the question\.

In the two\-stage configuration, the first Jev stage takes over this same relationship\-selection task\.

### 4 Retrieve the source passages

The system follows the selected relationships back to their source passages\. In this example, R1 points to P01 and P03, while R2 points to P02. Those IDs lead to the original text, which becomes evidence for answer generation\. Graph relationships guide retrieval all the way back to the passages that support them\.

![](https://assets.zilliz.com/cms-cn/04_fetch_passages_9e4a03b780.png)

Selected relationships lead back to original source text through the passage IDs stored in Milvus\.

The entire retrieval path uses Milvus for the entities, relationships, and passages\. It connects evidence across multiple hops before making a single relationship\-selection pass, so it can retrieve linked facts without an iterative agent search loop\.

### 5 Merge and rerank the source passages with Jev

We also found an opportunity after relationship selection\. R1 could retrieve both P01, a treatment overview, and P03, a passage focused on development history\. Both support the selected relationship, but their value for answering the side\-effect question differs\.

Filtering out the development\-history relationship does not necessarily remove P03: it can still be a source for the retained treatment relationship R1. Evaluating the passages themselves gives the pipeline another way to improve the final evidence ranking\.

In the frozen benchmark recipe, we retain up to 64 relationships and expand their sources in round\-robin order\. We interleave those passages with the top 10 direct\-retrieval results, deduplicate by full text, and cap the pool at 16 passages\. Jev scores the complete passages; ties preserve the existing order\.

In the example, graph retrieval returns P01, P02, and P03. Direct vector search finds P02 again and adds P04. Deduplication leaves these four passages:

|**Passage**|**Retrieved through**|**Evidence in the passage**|
|---|---|---|
|P01|Selected relationship|Identifies the first\-line treatment|
|P02|Relationship and direct search|Describes adverse effects|
|P03|Selected relationship|Discusses development history|
|P04|Direct vector search|Provides medication precautions|

Jev now scores the four passages against the question\. P02 should rank highly because it directly addresses the question\. P01 establishes which drug the question refers to, and P04 adds relevant precautions\. P03 can move down the ranking even though it remains a legitimate source for the treatment relationship\.

![](https://assets.zilliz.com/cms-cn/05_rerank_passages_e7d99e69a0.png)

The second stage ranks the merged passages by their content\. The scores shown here are illustrative\.

Jev’s role here is reranking\. We still use LLMs for document triple extraction during ingestion, query entity extraction, and final answer generation\.

## Evaluation from the original pipeline to two\-stage Jev

### The original pipeline already delivered strong recall

In the project’s original three\-dataset evaluation, Vector Graph RAG reached **87.8% average Recall@5**, the highest average among the compared methods\. The historical comparison included NV\-Embed\-v2 at 80.2% and HippoRAG 2 at 87.1%\.

|**Historical configuration**|**MuSiQue**|**HotpotQA**|**2Wiki**|**Average**|
|---|---|---|---|---|
|NV\-Embed\-v2|69.7%|94.5%|76.5%|80.2%|
|HippoRAG 2|74.7%|96.3%|90.4%|87.1%|
|Vector Graph RAG|73.0%|96.3%|94.1%|87.8%|

These [historical results](https://github.com/zilliztech/vector-graph-rag/blob/main/docs/evaluation.md) establish the original design's retrieval quality\. The two\-stage Jev results later in this article cover MuSiQue and 2Wiki and have their own two\-dataset average\.

### The first Jev integration kept the retrieval architecture intact

With the multi\-hop retrieval path in place, we looked at the time spent on relationship selection\. Vector searches and ID lookups were relatively fast\. The LLM still had to read and evaluate the expanded relationship set, which could contain hundreds or thousands of candidates, before returning its selection\.

Our first Jev experiment preserved the searches, graph expansion, and passage lookups\. We changed only the relationship reranker, sending Jev the question and candidate relationships and using its structured judgments to rank and filter them\. This let us test a decision model within the same Milvus\-based retrieval architecture\.

In that earlier MuSiQue and HotpotQA evaluation, Jev outperformed GPT\-4o\-mini but trailed GPT\-5\-mini, with a larger gap on MuSiQue’s harder multi\-hop questions\. The stronger LLM configuration remained an effective retrieval option; the next task was to improve the Jev configuration while retaining the graph\-based evidence discovery\.

![](https://assets.zilliz.com/cms-cn/retrieval_performance_comparison_b36af6397d.png)

The earlier MuSiQue and HotpotQA comparison shows the Vector Graph RAG configurations used in the first Jev experiment\.

### Two\-stage recall and additional model API time

The current comparison covers 1,000 questions each from MuSiQue and 2Wiki, with equal weight given to the two datasets\. Recall@5 measures the share of ground\-truth supporting evidence found in the top five retrieved results\. It measures evidence retrieval, independently of answer generation\.

This is a separate evaluation from the earlier post’s MuSiQue and HotpotQA experiment\. The table includes project runs of the Vector Graph RAG configurations and published baseline aggregates for NV\-Embed\-v2 and HippoRAG 2.

|**Retrieval configuration**|**Average Recall@5**|**Additional model API time**|**Timing basis**|
|---|---|---|---|
|Plain vector retrieval with NV\-Embed\-v2|73.10%|0 s|No extra call|
|HippoRAG 2|82.55%|≈8.25 s|Reference|
|Vector Graph RAG with GPT\-6 Luna|82.70%|5.35 s|Measured|
|Vector Graph RAG with DeepSeek V4.1 Flash|83.34%|10.97 s|Measured|
|Vector Graph RAG with Jev 1.13 single\-stage|80.04%|2.28 s|Measured|
|Vector Graph RAG with Jev 1.13 two\-stage|86.07%|3.13 s|Measured|
|Vector Graph RAG with Jev 1.14 two\-stage|86.61%|≈4.9 s|Estimated direct API|

The LLM configurations use GPT\-6 Luna with medium reasoning and DeepSeek V4.1 Flash with low reasoning\. Luna’s xhigh setting was slower with similar recall; Flash’s high setting exhausted the output limit on some questions\.

Keeping the model at Jev 1.13, moving from relationship\-only scoring to the updated two\-stage pipeline raised average Recall@5 by **6.03 percentage points**, while recorded additional model time increased from 2.28 to 3.13 seconds\. That comparison includes both passage reranking and the changed passage candidate pool; it does not isolate the contribution of either change\.

The two\-stage Jev 1.13 configuration also exceeded both LLM rerankers in Recall@5 while recording less additional model time in these runs\. That is a useful result for this retrieval design, subject to the timing differences described below\.

Jev 1.14 raised average Recall@5 to **86.61%**\. It provides the highest\-recall option in this comparison, while Jev 1.13 retains the lower recorded model time\. Using the displayed timings, both two\-stage configurations lie on the quality–latency Pareto frontier\.

![](https://assets.zilliz.com/cms-cn/retrieval_quality_latency_trade_off_99bd1d4ebe.png)

The two\-stage Jev configurations extend the observed recall/API\-time frontier\. Jev 1.14 and HippoRAG 2 include estimated timings\.

These timings exclude embedding, retrieval, and answer generation\. Zero means no additional model call\. Jev 1.14’s approximately 4.9 seconds is a calibrated direct\-API estimate, and HippoRAG 2’s time is a reference estimate\. Provider conditions, concurrency, and test dates differ across runs\. The plot describes the observed tradeoff; it is not a controlled end\-to\-end latency benchmark\. The [evaluation report](https://github.com/zilliztech/vector-graph-rag/blob/main/evaluation/jev/two-stage/README.md) records the measurement details\.

## Extending Vector Graph RAG with two\-stage decision scoring

Vector Graph RAG already provided multi\-hop evidence retrieval in Milvus with strong recall and no separate graph database\. The two\-stage Jev pipeline builds on that foundation: graph relationships find the connections, and passage scoring improves how the source evidence is ranked\. The gain with Jev 1.13 shows the value of optimizing those decisions within the existing retrieval architecture\.

I’d now evaluate the two\-stage Jev configuration alongside LLM relationship reranking when choosing a Vector Graph RAG setup\. The current comparison offers two useful options: Jev 1.13 with lower recorded additional model time, and Jev 1.14 with the highest recall among the tested configurations\.

## Try Vector Graph RAG with two\-stage Jev reranking

The [Vector Graph RAG repository](https://github.com/zilliztech/vector-graph-rag) and [reranking guide](https://github.com/zilliztech/vector-graph-rag/blob/main/docs/guides/reranking.md) cover configuration\. The [evaluation report](https://github.com/zilliztech/vector-graph-rag/blob/main/evaluation/jev/two-stage/README.md) includes the frozen recipe, timing methodology, and instructions for replaying saved scores or evaluating your own index\. You can share questions and results in the [project’s GitHub issues](https://github.com/zilliztech/vector-graph-rag/issues)\.

For additional background, see the [Jev documentation](https://docs.typesafe.ai/introduction) and [HippoRAG 2 paper](https://arxiv.org/abs/2502.14802)\.
