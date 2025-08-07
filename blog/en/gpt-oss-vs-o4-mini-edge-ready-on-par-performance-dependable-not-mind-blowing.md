---
id: gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
title: >
 GPT-oss vs o4-mini: Edge-Ready, On-Par Performance — Dependable, Not Mind-Blowing
author: Lumina Wang
date: 2025-8-7
desc: OpenAI steals the spotlight by open-sourcing two reasoning models: gpt-oss-120b and gpt-oss-20b, permissively licensed under Apache 2.0.
cover: assets.zilliz.com/gpt_oss_vs_o4_mini_edge_ready_on_par_performance_dependable_not_mind_blowing_2bd27838c1.png
tag: Engineering
recommend: false 
publishToMedium: true
tags: Milvus, vector database, vector search, AI Agents, LLM
meta_keywords: gpt-oss, OpenAI open source models, o4-mini, vector databases, deepseek 
meta_title: >
 GPT-oss vs o4-mini: Edge-Ready, Solid, But Not Disruptive
origin: https://milvus.io/blog/gpt-oss-vs-o4-mini-edge-ready-on-par-performance-dependable-not-mind-blowing.md
---

The AI world has been running hot. In just a few weeks, Anthropic dropped Claude 4.1 Opus, DeepMind stunned everyone with Genie 3 world simulator—and now, OpenAI steals the spotlight by open-sourcing two reasoning models: [gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b) and [gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b), permissively licensed under Apache 2.0.

After launch, these models instantly shot to the #1 trending spot on Hugging Face—and for good reason. This is the first time since 2019 that OpenAI has released open-weight models that are actually production-ready. The move isn’t accidental—after years of pushing API-only access, OpenAI is clearly responding to the pressure from open-source leaders like DeepSeek, Meta’s LLaMA, and Qwen, who’ve been dominating both benchmarks and developer workflows.

In this post, we'll explore what makes GPT-oss different, how it compares to leading open models like DeepSeek R1 and Qwen 3, and why developers should care. We'll also walk through building a reasoning-capable RAG system using GPT-oss and Milvus, the most popular open-source vector database.  


## What Makes GPT-oss Special and Why You Should Care? 

GPT-oss isn't just another weight drop. It delivers in five key areas that matter to developers:


### 1: Built for Edge Deployment

GPT-oss comes in two strategically sized variants:

- gpt-oss-120b: 117B total, 5.1B active per token

- gpt-oss-20b: 21B total, 3.6B active per token

Using Mixture-of-Experts (MoE) architecture, only a subset of parameters is active during inference. This makes both models lightweight to run relative to their size:

- gpt-oss-120b runs on a single 80GB GPU (H100)

- gpt-oss-20b fits in just 16GB VRAM, meaning it runs on high-end laptops or edge devices

According to OpenAI's tests, gpt-oss-20b is the fastest OpenAI model for inference—ideal for low-latency deployments or offline reasoning agents.


### 2: Strong Benchmark Performance

According to OpenAI's evaluations:

- **gpt-oss-120b** performs near-parity with o4-mini on reasoning, tool use, and competition coding (Codeforces, MMLU, TauBench)

- **gpt-oss-20b** competes with o3-mini, and even outperforms it in math and healthcare reasoning


### 3: Cost-Efficient Training

OpenAI claims performance equivalent to o3-mini and o4-mini, but with dramatically lower training costs:

- **gpt-oss-120b**: 2.1 million H100-hours → ~$10M

- **gpt-oss-20b**: 210K H100-hours → ~$1M

Compare that to the multi-hundred-million-dollar budgets behind models like GPT-4. GPT-oss proves that efficient scaling and architecture choices can deliver competitive performance without a massive carbon footprint.


### 4: True Open-Source Freedom

GPT-oss uses Apache 2.0 licensing, which means:

- Commercial use allowed

- Full modification and redistribution rights

- No usage restrictions or copyleft clauses

This is really open source, not a research-only release. You can fine-tune for domain-specific use, deploy in production with full control, and build commercial products around it. Key features include configurable reasoning depth (low/medium/high), full chain-of-thought visibility, and native tool calling with structured output support.


### 5: Potential GPT-5 Preview

OpenAI hasn’t disclosed everything—but architecture details suggest this may preview the direction of **GPT-5**:

- Uses MoE with 4 experts per input

- Follows alternating dense + local sparse attention (GPT-3 pattern)

- Features more attention heads

- Interestingly, bias units from GPT-2 have made a comeback

If you're watching for signals on what comes next, GPT-oss may be the clearest public hint yet.


### Core Specifications

|              |                  |                   |             |                    |              |
| ------------ | ---------------- | ----------------- | ----------- | ------------------ | ------------ |
| **Model**    | **Total Params** | **Active Params** | **Experts** | **Context Length** | **VRAM Req** |
| gpt-oss-120b | 117B             | 5.1B              | 128         | 128k               | 80GB         |
| gpt-oss-20b  | 21B              | 3.6B              | 32          | 128k               | 16GB         |

Both models use the o200k_harmony tokenizer and support 128,000-token context length (roughly 96,000-100,000 words).


## GPT-oss vs. Other Reasoning Models

Here's how GPT-oss stacks up against OpenAI's internal models and top open-source competitors:

|                   |                         |             |                                      |
| ----------------- | ----------------------- | ----------- | ------------------------------------ |
| **Model**         | **Parameters (Active)** | **Memory**  | **Strengths**                        |
| **gpt-oss-120b**  | 117B (5.1B active)      | 80GB        | Single-GPU, open reasoning           |
| **gpt-oss-20b**   | 21B (3.6B active)       | 16GB        | Edge deployment, fast inference      |
| **DeepSeek R1**   | 671B (~37B active)     | Distributed | Benchmark leader, proven performance |
| **o4-mini (API)** | Proprietary             | API only    | Strong reasoning (closed)            |
| **o3-mini (API)** | Proprietary             | API only    | Lightweight reasoning (closed)       |

Based on various benchmarking models, here is what we found: 

- **GPT-oss vs. OpenAI's Own Models:** gpt-oss-120b matches o4-mini on competition math (AIME), coding (Codeforces), and tool use (TauBench). The 20b model performs similarly to o3-mini despite being much smaller.

- **GPT-oss vs. DeepSeek R1:** DeepSeek R1 dominates in pure performance but requires distributed infrastructure. GPT-oss offers simpler deployment—no distributed setup needed for the 120b model.

In summary, GPT-oss offers the best combination of performance, open access, and deployability. DeepSeek R1 wins on pure performance, but GPT-oss strikes the optimal balance for most developers. 


## Hands-on: Building with GPT-oss + Milvus

Now that we’ve seen what GPT-oss brings to the table, it’s time to put it to use. 

In the following sections, we'll walk through a hands-on tutorial for building a reasoning-capable RAG system using gpt-oss-20b and Milvus, all running locally, no API key required.


### Environment Setup

```
! pip install --upgrade "pymilvus[model]" openai requests tqdm
```

### Dataset Preparation

We'll use Milvus documentation as our knowledge base:

```
# Download and prepare Milvus docs
! wget https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip
! unzip -q milvus_docs_2.4.x_en.zip -d milvus_docs

from glob import glob
text_lines = []
for file_path in glob("milvus_docs/en/faq/*.md", recursive=True):
    with open(file_path, "r") as file:
        file_text = file.read()
    text_lines += file_text.split("# ")
```

### Model Setup

Access GPT-oss through [OpenRouter](https://openrouter.ai/openai/gpt-oss-20b:free) (or run locally). [**OpenRouter**](https://openrouter.ai/openai/gpt-oss-20b:free) is a platform that lets developers access and switch between multiple AI models (like GPT-4, Claude, Mistral) through a single, unified API. It's useful for comparing models or building apps that work with different AI providers. Now GPT-oss series have been available on OpenRouter now. 

![](https://assets.zilliz.com/1_46b575811f.png)

```
from openai import OpenAI

# Using OpenRouter for cloud access
openai_client = OpenAI(
    api_key="<OPENROUTER_API_KEY>",
    base_url="https://openrouter.ai/api/v1",
)

# Set up embedding model
from pymilvus import model as milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()

# Test embedding dimensions
test_embedding = embedding_model.encode_queries(["This is a test"])[0]
embedding_dim = len(test_embedding)
print(embedding_dim)
print(test_embedding[:10])
```

```
768
[-0.04836066  0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
```

### Set up Milvus vector database 
```
from pymilvus import MilvusClient

# Initialize Milvus client
milvus_client = MilvusClient(uri="http://localhost:19530", token="root:Milvus")
collection_name = "gpt_oss_rag_collection"

# Clean up existing collection
if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

# Create new collection
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type="IP",  # Inner product distance
    consistency_level="Strong",
)
```

About MilvusClient parameter settings:

- Setting the URI to a local file (e.g., `./milvus.db`) is the most convenient method as it automatically uses Milvus Lite to store all data in that file.

- For large-scale data, you can set up a more powerful Milvus server on Docker or Kubernetes. In this case, use the server’s URI (e.g., `http://localhost:19530`) as your URI.

- If you want to use [Zilliz Cloud ](https://zilliz.com/cloud)(the managed service of Milvus), adjust the URI and token, which correspond to the Public Endpoint and API key in Zilliz Cloud.


### Adding Documents to the Collection

Now we’ll create embeddings for our text chunks and add them to Milvus:

```
from tqdm import tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

for i, line in enumerate(tqdm(text_lines, desc="Creating embeddings")):
    data.append({"id": i, "vector": doc_embeddings[i], "text": line})

milvus_client.insert(collection_name=collection_name, data=data)
```

Output:

```
Creating embeddings: 100%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 72/72 [00:00<00:00, 1222631.13it/s]
{'insert_count': 72, 'ids': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], 'cost': 0}
```

### RAG Query Pipeline

Now for the exciting part - let’s set up our RAG system to answer questions.

Let’s specify a common question about Milvus:
```
question = "How is data stored in milvus?"
```

Search for this question in the collection and retrieve the top 3 semantically matching results:

```
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  # Convert the question to an embedding vector
    limit=3,  # Return top 3 results
    search_params={"metric_type": "IP", "params": {}},  # Inner product distance
    output_fields=["text"],  # Return the text field
)
```

Let’s look at the search results for this query:
```
import json

retrieved_lines_with_distances = [
    (res["entity"]["text"], res["distance"]) for res in search_res[0]
]
print(json.dumps(retrieved_lines_with_distances, indent=4))
```

```
[
    [
        " Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###",
        0.6572664976119995
    ],
    [
        "How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus' data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###",
        0.6312144994735718
    ],
    [
        "How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###",
        0.6115782856941223
    ]
]
```

### Using the GPT-oss to Build a RAG Response

Convert the retrieved documents to string format:

```
context = "\n".join(
    [line_with_distance[0] for line_with_distance in retrieved_lines_with_distances]
)
```
Provide system prompt and user prompt for the large language model:
```
SYSTEM_PROMPT = """
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
"""
USER_PROMPT = f"""
Use the following pieces of information enclosed in <context> tags to provide an answer to the question enclosed in <question> tags.
<context>
{context}
</context>
<question>
{question}
</question>
"""
```
Use the latest gpt-oss model to generate a response based on the prompt:
```
response = openai_client.chat.completions.create(
    model="openai/gpt-oss-120b",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": USER_PROMPT},
    ],
)
print(response.choices[0].message.content)
```

```
Milvus stores its data in two distinct layers:

| Type of data | Where it is stored | How it is stored |
|-------------|-------------------|-----------------|
| **Inserted data** (vector data, scalar fields, collection‑specific schema) | In the **persistent object storage** configured for the cluster. The data are written as **incremental logs** (append‑only logs) that are persisted by the DataNode. | The DataNode reads from the message‑queue and writes the incoming data into the storage backend (MinIO, AWS S3, GCS, Azure Blob, Alibaba OSS, Tencent COS, etc.). When a `flush()` call is issued, the DataNode forces all queued data to be written to the persistent storage immediately. |
| **Metadata** (information about collections, partitions, indexes, etc.) | In **etcd**. Each Milvus module (catalog, index, etc.) keeps its own metadata. | The metadata is generated and managed by Milvus and persisted in the distributed key‑value store **etcd**. |

**Summary:**  
- **Inserted data** = incremental logs stored in the chosen object‑storage backend.  
- **Metadata** = stored in the distributed configuration store **etcd**.  


Together, these two storage mechanisms (object storage for the actual data and etcd for metadata) make up Milvus’s data‑storage architecture.
```

## Final Thoughts on GPT-oss

GPT-oss is OpenAI’s quiet admission that open-source can't be ignored anymore. It doesn’t blow DeepSeek R1 or Qwen 3 or many other models out of the water, but it does bring something they don’t: OpenAI’s training pipeline, applied to a model you can actually inspect and run locally.

**Performance? Solid. Not mind-blowing, but dependable.** The 20B model running on consumer hardware—or even mobile with LM Studio—is the kind of practical advantage that actually matters to developers. It’s more “this just works” than “wow, this changes everything.” And honestly, that’s fine.

**Where it falls short is multilingual support.** If you’re working in anything other than English, you’ll hit weird phrasing, spelling issues, and general confusion. The model was clearly trained with an English-first lens. If global coverage matters, you’re probably going to need to fine-tune it with a multilingual dataset. 

What’s most interesting, though, is the timing. OpenAI’s teaser on X—with a “5” dropped into the word “LIVESTREAM”—feels like a setup. GPT-oss might not be the main act, but it could be a preview of what’s coming in GPT-5. Same ingredients, different scale. Let’s wait.

![](https://assets.zilliz.com/2_0fed950b8e.png)

**The real win is having more high-quality choices.** Competition drives innovation, and OpenAI re-entering open-source development benefits everyone. Test GPT-oss against your specific requirements, but choose based on what actually works for your use case, not brand recognition.