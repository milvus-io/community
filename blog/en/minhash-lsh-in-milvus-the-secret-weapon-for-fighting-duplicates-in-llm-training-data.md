---
id: minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >
 MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data
author: Li Liu, Yaya Cheng
date: 2025-05-16
desc: MinHash LSH in Milvus 2.6 offers an efficient solution for deduplicating massive LLM training datasets, with 2x faster processing and 3- 5x cost savings compared to traditional methods.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: Milvus, vector database, vector search, AI Agents, LLM
meta_keywords: MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data 
meta_title: > 
 MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM Training Data
origin: https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---

Large Language Models (LLMs) have transformed the AI landscape with their ability to write code, create content, and solve complex problems. However, these powerful models require enormous amounts of high-quality data to fuel their training.

The challenge is that raw training data often contains significant redundancy. It's like teaching a child by repeating the same lessons over and over while skipping other important topics. A large AI company approached us with precisely this problem - they were building an ambitious new language model but struggled with deduplicating tens of billions of documents. Traditional matching methods couldn't scale to this volume, and specialized deduplication tools required massive computational resources, making them economically unviable.

To solve this problem, we introduced MinHash LSH (Locality Sensitive Hashing) indexing in Milvus 2.6. This article will explore how MinHash LSH efficiently solves the data deduplication problem for LLM training.


![](https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png)


## Data Deduplication: Why It Matters for LLM Training

High-quality, diverse data is essential for training powerful LLMs. When duplicate content appears in training data, it creates several significant problems:

- **Wasted Resources:** Redundant data increases training time, costs, and energy consumption.

- **Reduced Performance:** Models can overfit to repeated content, limiting their ability to generalize to new information.

- **Memorization Effect:** Duplicated content increases the chance of models memorizing and reproducing specific text verbatim. It could also potentially lead to privacy leaks or copyright issues.

- **Misleading Evaluations:** Duplicates between training and test sets can accidentally inflate performance metrics.

There are three main approaches to finding and removing duplicates:

- **Exact Matching:** Identifies identical duplicates through hashing.

- **Approximate Matching:** Finds near-duplicates using algorithms like MinHash LSH and Jaccard similarity.

- **Semantic Matching:** Identifies content with similar meaning using vector embeddings.

With pre-training corpora reaching terabytes or even petabytes, traditional exact matching methods like pairwise comparisons are computationally infeasible. Semantic deduplication adds significant overhead by using embedding models to generate vectors. We need more innovative approximate methods—like **MinHash LSH**—that balance recall and precision while keeping costs manageable, making large-scale deduplication practical.


## MinHash LSH: Efficiently Detecting Near-Duplicates in Massive Datasets

To find near-duplicates in an ocean of training data, we need an approximate matching algorithm that’s both efficient and accurate. MinHash LSH (Locality Sensitive Hashing) is a great tool for this goal. Let’s break down this seemingly complex term step by step. 


### Step 1: Representing Documents with MinHash

First, we need a way to measure document similarity. The standard approach uses Jaccard similarity:

$$J(A,B) = \frac{|A\cap B|}{|A \cup B|}$$

This formula measures the overlap between document A and document B - specifically, the ratio of shared elements to total unique elements. A higher value means the documents are more similar.

However, computing this directly for billions of document pairs is resource-intensive and would take years. MinHash creates compact "fingerprints" (signatures) that preserve similarity relationships while making comparisons much faster. 

1. **Shingling:** Break each document into overlapping sequences of words or characters (k-shingles). For example, the sentence “I love vector search” with k=3 (by word) yields: {“I love vector”, “love vector search”}

![](https://assets.zilliz.com/shingling_858ad58efa.png)

2. **MinHashing:** Apply multiple hash functions to each set of shingles and record the minimum hash value from each function. This results in a signature vector for each document.

![](https://assets.zilliz.com/minhash_041003210a.png)

When calculating similarity, the probability that hash values align at the same positions in the MinHash signatures of two documents (which corresponds to the Jaccard distance of these signatures) provides a close approximation of the Jaccard similarity of their original shingle sets. This allows us to effectively estimate document similarity without directly comparing the larger original texts; instead, we can analyze their compact MinHash signatures.  

The MinHash principle involves using the word with the smallest hash value to represent the entire document, enhancing accuracy by incorporating additional hash functions. Minor word changes are likely to be overlooked as they typically do not affect the minimum hash value. In contrast, more substantial changes tend to alter the hash value and are more easily detected. This method can be seen as a min-pooling of hash values across various words. In addition to MinHash, alternatives like SimHash are available for generating document signatures, but those will not be discussed here.


### Step 2: Identifying Similar Documents via LSH

Even with compact MinHash signatures, comparing every pair across millions or billions of documents remains computationally expensive. That’s where **Locality Sensitive Hashing (LSH)** comes in.

The key idea of LSH is to use hash functions that **intentionally cause collisions**—similar items are more likely to hash into the same bucket, while dissimilar ones are not. This is the opposite of traditional hashing, which aims to avoid collisions.

For MinHash, a popular LSH strategy is the **banding technique**:

1. **Banding**: Split each MinHash signature (a vector of length _N_) into _b_ bands, each with _r_ dims (_N = b × r_).

2. **Hashing Bands:** Hash each band (a sub-vector of _r_ values) into a bucket using a standard hash function.

3. **Candidate Pairs:** If two documents share a bucket in **any** band, they are flagged as potential matches.

By adjusting the number of bands (b) and the number of dimensions per band (r), you can control the trade-off between recall, precision, and search efficiency. 

The key idea is: highly similar documents will have many matching hash values in their MinHash signatures. When these signatures are split into bands, even one band with all matching values is enough to place two documents in the same bucket. The more similar the documents are, the higher the probability that this happens in at least one band, allowing LSH to efficiently surface candidate pairs without exhaustively comparing all signatures.

In short, **MinHash + LSH** enables scalable approximate deduplication: MinHash compresses documents into compact signatures, and LSH efficiently narrows the search space by grouping likely matches. It’s like spotting twins in a crowd: first, take a quick feature snapshot of everyone (MinHash), group lookalikes (LSH), then inspect the smaller groups closely for actual duplicates.


## Integrating MinHash LSH in Milvus 2.6

A real-world need drove the integration of MinHash LSH into Milvus 2.6. As mentioned earlier, a Milvus user—one of the leading LLM companies—approached us with a challenge: efficiently deduplicating massive volumes of text data for LLM pre-training. 

Traditional deduplication pipelines typically rely on external tools decoupled from storage and retrieval systems, requiring costly data transfers between components. This fragmented workflow increases operational overhead and prevents full utilization of distributed computing resources.

Recognizing Milvus’s strengths in handling high-throughput vector data, a natural idea emerged: **_What if MinHash LSH were built into Milvus natively, making approximate deduplication a first-class database feature?_**

This approach enables a complete workflow from deduplication to semantic retrieval within Milvus, simplifying MLOps while leveraging its scalability and unified API. Together with our partner, we optimized MinHash LSH for Milvus’s cloud-native architecture, resulting in a fast and scalable solution for large-scale deduplication.


### Core capabilities in Milvus 2.6 include:

- **Native MinHash LSH Indexing:** Implements the standard banding technique for LSH and supports optional Jaccard re-ranking to improve recall. Provides both in-memory and mmap-based implementations for flexibility across different workloads.

- **Seamless API Integration:** Users can define MinHash vector fields, build `MINHASH_LSH` indexes, insert signature data, and perform approximate similarity searches using Milvus’s standard SDK and declarative APIs.

- **Distributed and Scalable:** Built on Milvus’s cloud-native architecture, the feature supports horizontal scaling for large datasets and high-throughput processing.

This integration delivered impressive results. By running MinHash LSH on fully-managed Milvus ([Zilliz Cloud](https://zilliz.com/cloud)), we helped this user deduplicate **10 billion documents** efficiently. Compared to their previous MapReduce-based approach, the new solution **more than doubled processing speed** and achieved **3-5x cost savings**, thanks to Milvus’s optimized indexing and query execution.


## Hands-On: Deduplicating LLM Datasets Using Milvus

Let's roll up our sleeves and use MinHash LSH in Milvus 2.6 to perform approximate deduplication at scale.


### Prerequisite: Generating MinHash Signatures

Milvus handles the indexing and search of **pre-generated** MinHash signatures. You’ll need to generate these during preprocessing using tools like `datasketch` in Python or a custom implementation. The typical steps are:

1. Read raw documents

2. Shingle (tokenize or chunk) each document

3. Apply multiple hash functions to generate a MinHash signature (e.g., an uint64 array of size 128 )

```
from datasketch import MinHash

text = "example text for minhash signature"
tokens = text.lower().split()  # Step 1 & 2: preprocess + tokenize/shingle
mh = MinHash(num_perm=128)     # Step 3: initialize MinHash
for token in tokens:
    mh.update(token.encode('utf-8'))  # Add shingles to MinHash
signature = mh.hashvalues  # This is your MinHash signature (128-dimensional)
```



### Step 1: Create a Schema in Milvus

We need to create a Milvus collection to store the MinHash signatures and their corresponding document IDs.

```
import numpy as np
from pymilvus import MilvusClient
from pymilvus import DataType
MILVUS_URI = "localhost:19530"
COLLECTION_NAME = "llm_data_dedup_minhash"
MINHASH_DIM = 128
MINHASH_BIT_WIDTH = 64 # Assuming 64-bit hash values

# Load data from NPY file
base = np.load('minhash_vectors.npy')
ids = [str(i) for i in range(base.shape[0])]  # Generate string IDs

client = MilvusClient(uri=MILVUS_URI)
# Check and drop existing collection if needed
if collection_name in client.list_collections():
    print(f"Collection {collection_name} exists, dropping it...")
    client.drop_collection(collection_name)
# Create collection schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=False,
)

schema.add_field(field_name="input_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="minhash", datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name="id", datatype=DataType.VARCHAR, max_length=200)
```


### **Step 2: Create the MINHASH_LSH Index and Collection**

This is the core step. We need to specify JACCARD as the metric type and configure LSH-related parameters. 

```
INDEX_FIELD_NAME = "minhash_signature"
# Metric type, should be JACCARD for MinHash LSH
METRIC_TYPE = "MHJACCARD"
INDEX_TYPE = "MINHASH_LSH"
MINHASH_DIM = 128
MINHASH_BIT_WIDTH = 64 # Assuming 64-bit hash values

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        # LSH-specific parameters might be configured here, e.g.:
        # "band": 32, # Hypothetical parameter: number of bands
        # "element_bit_width": 64 # Bit width of minhash values
    }
)
# Create collection
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
```


A Note on Parameter Tuning: The effectiveness of MinHash LSH heavily depends on parameter choices. For instance, the number of hash functions used during MinHash signature generation (i.e., `MINHASH_DIM`) affects the signature's precision and size. In the LSH phase, the number of bands (`num_bands`) and rows per band together determine the sensitivity range of the similarity threshold and the balance between recall and precision. Users need to experiment and fine-tune based on their dataset characteristics and deduplication requirements. This is often an iterative process.


### **Step 3: Insert MinHash Signatures**

Let's say you have a batch of documents and their corresponding MinHash signatures.

```
# Insert data in batches
batch_size = 2000
total_records = base.shape[0]
num_batches = (total_records + batch_size - 1) // batch_size

for batch_idx in range(num_batches):
    start = batch_idx * batch_size
    end = min((batch_idx + 1) * batch_size, total_records)
    
    print(f"Inserting batch {batch_idx + 1}/{num_batches} (records {start}-{end})")
    
    # Prepare batch data
    batch_data = [{
        "input_id": i,
        "minhash": base[i].tobytes(),
        "id": ids[i]
    } for i in range(start, end)]
    
    # Insert batch
    client.insert(collection_name, batch_data)

print("Data insertion complete")
```


### Step 5: Search for Near-Duplicates

Use a document’s MinHash signature to search for similar documents in the collection.

```
# Perform search
search_vectors = [vec.tobytes() for vec in base[:10]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={"metric_type": METRIC_TYPE, "params": search_params_lsh},
    limit=1, 
    output_fields=["id"])

print("\nSearch results:")
for i, result in enumerate(results):
    print(f"Query {i}:")
    for hit in result:
        print(f"  - ID: {hit['entity']['id']}, Distance: {hit['distance']}")
```



### Step 6: Post-Processing and Clustering

The returned results are **candidate near-duplicates**. To form complete deduplication groups, you can apply clustering techniques like **Union-Find** on the candidate pairs. Each resulting group represents a set of duplicates; keep one representative document and archive or remove the rest.


## **Conclusion**

MinHash LSH in Milvus 2.6 is a leap forward in AI data processing. What started as a solution for LLM data deduplication now opens doors to broader use cases—web content cleanup, catalog management, plagiarism detection, and more.

## Getting Started with Milvus 2.6

Milvus 2.6 is available now. In addition to MinHash LSH, it introduces dozens of new features and performance optimizations such as tiered storage, RabbitQ quantization method, and enhanced full-text search and multitenancy, directly addressing the most pressing challenges in vector search today: scaling efficiently while keeping costs under control.

Ready to explore everything Milvus offers? Dive into our[ release notes](https://milvus.io/docs/release_notes.md), browse the[ complete documentation](https://milvus.io/docs), or check out our[ feature blogs](https://milvus.io/blog). 

If you have any questions or have a similar use case, feel free to reach out to us through our [Discord community](https://discord.com/invite/8uyFbECzPX) or file an issue on[ GitHub](https://github.com/milvus-io/milvus) — we're here to help you make the most of Milvus 2.6.




