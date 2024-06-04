---
id: introducing-milvus-lite.md
title: 'Introducing Milvus Lite: Start Building a GenAI Application in Seconds'
author: Jiang Chen
date: 2024-05-30
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, GenAI developers, Retrieval Augmented Generation, RAG 
recommend: true
canonicalUrl: https://milvus.io/blog/introducing-milvus-lite.md
---

![](https://assets.zilliz.com/2_72e444c8dc.JPG)

We are excited to introduce [Milvus Lite](https://milvus.io/docs/milvus_lite.md), a lightweight vector database that runs locally within your Python application. Based on the popular open-source [Milvus](https://milvus.io/intro) vector database, Milvus Lite reuses the core components for vector indexing and query parsing while removing elements designed for high scalability in distributed systems. This design makes a compact and efficient solution ideal for environments with limited computing resources, such as laptops, Jupyter Notebooks, and mobile or edge devices.

Milvus Lite integrates with various AI development stacks like LangChain and LlamaIndex, enabling its use as a vector store in Retrieval Augmented Generation (RAG) pipelines without the need for server setup. Simply run `pip install pymilvus` (version 2.4.3 or above) to incorporate it into your AI application as a Python library.

Milvus Lite shares the Milvus API, ensuring that your client-side code works for both small-scale local deployments and Milvus servers deployed on Docker or Kubernetes with billions of vectors.

## Why We Built Milvus Lite

Many AI applications require vector similarity search for unstructured data, including text, images, voices, and videos, for applications such as chatbots and shopping assistants. Vector databases are crafted for storing and searching vector embeddings and are a crucial part of the AI development stack, particularly for generative AI use cases like [Retrieval Augmented Generation (RAG)](https://zilliz.com/learn/Retrieval-Augmented-Generation).

Despite the availability of numerous vector search solutions, an easy-to-start option that also works for large-scale production deployments was missing. As the creators of Milvus, we designed Milvus Lite to help AI developers build applications faster while ensuring a consistent experience across various deployment options, including Milvus on Kubernetes, Docker, and managed cloud services.

Milvus Lite is a crucial addition to our suite of offerings within the Milvus ecosystem. It provides developers with a versatile tool that supports every stage of their development journey. From prototyping to production environments and from edge computing to large-scale deployments, Milvus is now the only vector database that covers use cases of any size and all stages of development.

## How Milvus Lite Works 

Milvus Lite supports all the basic operations available in Milvus, such as creating collections and inserting, searching, and deleting vectors. It will soon support advanced features like hybrid search. Milvus Lite loads data into memory for efficient searches and persists it as an SQLite file.

Milvus Lite is included in the [Python SDK of Milvus](https://github.com/milvus-io/pymilvus) and can be deployed with a simple `pip install pymilvus`. The following code snippet demonstrates how to set up a vector database with Milvus Lite by specifying a local file name and then creating a new collection. For those familiar with the Milvus API, the only difference is that the `uri` refers to a local file name instead of a network endpoint, e.g., `"milvus_demo.db"` instead of `"http://localhost:19530"` for a Milvus server. Everything else remains the same. Milvus Lite also supports storing raw text and other labels as metadata, using a dynamic or explicitly defined schema, as shown below.

```
from pymilvus import MilvusClient

client = MilvusClient("milvus_demo.db")
# This collection can take input with mandatory fields named "id", "vector" and
# any other fields as "dynamic schema". You can also define the schema explicitly.
client.create_collection(
    collection_name="demo_collection",
    dimension=384  # Dimension for vectors.
)
```
For scalability, an AI application developed with Milvus Lite can easily transition to using Milvus deployed on Docker or Kubernetes by simply specifying the `uri` with the server endpoint.


## Integration with AI Development Stack

In addition to introducing Milvus Lite to make vector search easy to start with, Milvus also integrates with many frameworks and providers of the AI development stack, including [LangChain](https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/), [LlamaIndex](https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/), [Haystack](https://haystack.deepset.ai/integrations/milvus-document-store), [Voyage AI](https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/), [Ragas](https://milvus.io/docs/integrate_with_ragas.md), [Jina AI](https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/), [DSPy](https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM), [BentoML](https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite), [WhyHow](https://chiajy.medium.com/70873c7576f1), [Relari AI](https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1), [Airbyte](https://docs.airbyte.com/integrations/destinations/milvus), [HuggingFace](https://milvus.io/docs/integrate_with_hugging-face.md) and [MemGPT](https://memgpt.readme.io/docs/storage#milvus). Thanks to their extensive tooling and services, these integrations simplify the development of AI applications with vector search capability.

And this is just the beginning—many more exciting integrations are coming soon! Stay tuned! 


## More Resources and Examples

Explore [Milvus quickstart documentation](https://milvus.io/docs/quickstart.md) for detailed guides and code examples on using Milvus Lite to build AI applications like Retrieval-Augmented Generation ([RAG](https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb)) and [image search](https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb).

Milvus Lite is an open-source project, and we welcome your contributions. Check out our [Contributing Guide](https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md) to get started. You can also report bugs or request features by filing an issue on the [Milvus Lite GitHub](https://github.com/milvus-io/milvus-lite) repository.
