---
id: get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
title: Getting Started with Hybrid Semantic / Full-Text Search with Milvus 2.5
author: Stefan Webb
date: 2024-12-17
cover: assets.zilliz.com/Full_Text_Search_with_Milvus_2_5_7ba74461be.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md
---

In this article, we will show you how to quickly get up and running with the new full-text search feature and combine it with the conventional semantic search based on vector embeddings.

## Requirement

First, ensure you have installed Milvus 2.5:


```
pip install -U pymilvus[model]
```

and have a running instance of Milvus Standalone (e.g. on your local machine) using the [installation instructions in the Milvus docs](https://milvus.io/docs/prerequisite-docker.md).

## Building the Data Schema and Search Indices

We import the required classes and functions:

```
from pymilvus import MilvusClient, DataType, Function, FunctionType, model
```

You may have noticed two new entries for Milvus 2.5, `Function` and `FunctionType`, which we will explain shortly.

Next we open the database with Milvus Standalone, that is, locally, and create the data schema. The schema comprises an integer primary key, a text string, a dense vector of dimension 384, and a sparse vector (of unlimited dimensionality).
Note that Milvus Lite does not currently support full-text search, only Milvus Standalone and Milvus Distributed.

```
client = MilvusClient(uri="http://localhost:19530")

schema = client.create_schema()

schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True, auto_id=True)
schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=1000, enable_analyzer=True)
schema.add_field(field_name="dense", datatype=DataType.FLOAT_VECTOR, dim=768),
schema.add_field(field_name="sparse", datatype=DataType.SPARSE_FLOAT_VECTOR)
```

```
{'auto_id': False, 'description': '', 'fields': [{'name': 'id', 'description': '', 'type': <DataType.INT64: 5>, 'is_primary': True, 'auto_id': True}, {'name': 'text', 'description': '', 'type': <DataType.VARCHAR: 21>, 'params': {'max_length': 1000, 'enable_analyzer': True}}, {'name': 'dense', 'description': '', 'type': <DataType.FLOAT_VECTOR: 101>, 'params': {'dim': 768}}, {'name': 'sparse', 'description': '', 'type': <DataType.SPARSE_FLOAT_VECTOR: 104>}], 'enable_dynamic_field': False}
```

You may have noticed the `enable_analyzer=True` parameter. This tells Milvus 2.5 to enable the lexical parser on this field and build a list of tokens and token frequencies, which are required for full-text search. The `sparse` field will hold a vector representation of the documentation as a bag-of-words produced from the parsing `text`.

But how do we connect the `text` and `sparse` fields, and tell Milvus how `sparse` should be calculated from `text`? This is where we need to invoke the `Function` object and add it to the schema:


```
bm25_function = Function(
    name="text_bm25_emb", # Function name
    input_field_names=["text"], # Name of the VARCHAR field containing raw text data
    output_field_names=["sparse"], # Name of the SPARSE_FLOAT_VECTOR field reserved to store generated embeddings
    function_type=FunctionType.BM25,
)

schema.add_function(bm25_function)
```


```
{'auto_id': False, 'description': '', 'fields': [{'name': 'id', 'description': '', 'type': <DataType.INT64: 5>, 'is_primary': True, 'auto_id': True}, {'name': 'text', 'description': '', 'type': <DataType.VARCHAR: 21>, 'params': {'max_length': 1000, 'enable_analyzer': True}}, {'name': 'dense', 'description': '', 'type': <DataType.FLOAT_VECTOR: 101>, 'params': {'dim': 768}}, {'name': 'sparse', 'description': '', 'type': <DataType.SPARSE_FLOAT_VECTOR: 104>, 'is_function_output': True}], 'enable_dynamic_field': False, 'functions': [{'name': 'text_bm25_emb', 'description': '', 'type': <FunctionType.BM25: 1>, 'input_field_names': ['text'], 'output_field_names': ['sparse'], 'params': {}}]}
```

The abstraction of the `Function` object is more general than that of applying full-text search. In the future, it may be used for other cases where one field needs to be a function of another field. In our case, we specify that `sparse` is a function of `text` via the function `FunctionType.BM25`. `BM25` refers to a common metric in information retrieval used for calculating a query's similarity to a document (relative to a collection of documents).

We use the default embedding model in Milvus, which is [paraphrase-albert-small-v2](https://huggingface.co/GPTCache/paraphrase-albert-small-v2):


```
embedding_fn = model.DefaultEmbeddingFunction()
```

The next step is to add our search indices. We have one for the dense vector and a separate one for the sparse vector. The index type is `SPARSE_INVERTED_INDEX` with `BM25` since full-text search requires a different search method than those for standard dense vectors.


```
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="dense",
    index_type="AUTOINDEX", 
    metric_type="COSINE"
)

index_params.add_index(
    field_name="sparse",
    index_type="SPARSE_INVERTED_INDEX", 
    metric_type="BM25"
)
```

Finally, we create our collection:

```
client.drop_collection('demo')
client.list_collections()
```

```
[]
```

```
client.create_collection(
    collection_name='demo', 
    schema=schema, 
    index_params=index_params
)

client.list_collections()
```


```
['demo']
```
And with that, we have an empty database set up to accept text documents and perform semantic and full-text searches!

## Inserting Data and Performing Full-Text Search

Inserting data is no different than previous versions of Milvus:

```
docs = [
    'information retrieval is a field of study.',
    'information retrieval focuses on finding relevant information in large datasets.',
    'data mining and information retrieval overlap in research.'
]

embeddings = embedding_fn(docs)

client.insert('demo', [
    {'text': doc, 'dense': vec} for doc, vec in zip(docs, embeddings)
])
```

```
{'insert_count': 3, 'ids': [454387371651630485, 454387371651630486, 454387371651630487], 'cost': 0}
```

Let's first illustrate a full-text search before we move on to hybrid search:

```
search_params = {
    'params': {'drop_ratio_search': 0.2},
}

results = client.search(
    collection_name='demo', 
    data=['whats the focus of information retrieval?'],
    output_fields=['text'],
    anns_field='sparse',
    limit=3,
    search_params=search_params
)
```

The search parameter `drop_ratio_search` refers to the proportion of lower-scoring documents to drop during the search algorithm.

Let's view the results:

```
for hit in results[0]:
    print(hit)
```

```
{'id': 454387371651630485, 'distance': 1.3352930545806885, 'entity': {'text': 'information retrieval is a field of study.'}}
{'id': 454387371651630486, 'distance': 0.29726022481918335, 'entity': {'text': 'information retrieval focuses on finding relevant information in large datasets.'}}
{'id': 454387371651630487, 'distance': 0.2715056240558624, 'entity': {'text': 'data mining and information retrieval overlap in research.'}}
```

## Performing Hybrid Semantic and Full-Text Search

Let's now combine what we've learned to perform a hybrid search that combines separate semantic and full-text searches with a reranker:

```
from pymilvus import AnnSearchRequest, RRFRanker
query = 'whats the focus of information retrieval?'
query_dense_vector = embedding_fn([query])

search_param_1 = {
    "data": query_dense_vector,
    "anns_field": "dense",
    "param": {
        "metric_type": "COSINE",
    },
    "limit": 3
}
request_1 = AnnSearchRequest(**search_param_1)

search_param_2 = {
    "data": [query],
    "anns_field": "sparse",
    "param": {
        "metric_type": "BM25",
        "params": {"drop_ratio_build": 0.0}
    },
    "limit": 3
}
request_2 = AnnSearchRequest(**search_param_2)

reqs = [request_1, request_2]
```

```
ranker = RRFRanker()

res = client.hybrid_search(
    collection_name="demo",
    output_fields=['text'],
    reqs=reqs,
    ranker=ranker,
    limit=3
)
for hit in res[0]:
    print(hit)
```

```
{'id': 454387371651630485, 'distance': 0.032786883413791656, 'entity': {'text': 'information retrieval is a field of study.'}}
{'id': 454387371651630486, 'distance': 0.032258063554763794, 'entity': {'text': 'information retrieval focuses on finding relevant information in large datasets.'}}
{'id': 454387371651630487, 'distance': 0.0317460335791111, 'entity': {'text': 'data mining and information retrieval overlap in research.'}}
```

As you may have noticed, this is no different than a hybrid search with two separate semantic fields (available since Milvus 2.4). The results are identical to full-text search in this simple example, but for larger databases and keyword specific searches hybrid search typically has higher recall.

## Summary

You're now equipped with all the knowledge needed to perform full-text and hybrid semantic/full-text search with Milvus 2.5. See the following articles for more discussion on how full-text search works and why it is complementary to semantic search:

- [Introducing Milvus 2.5: Full-Text Search, More Powerful Metadata Filtering, and Usability Improvements!](https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md)
- [Semantic Search v.s. Full-Text Search: Which Do I Choose in Milvus 2.5?](https://milvus.io/blog/semantic-search-vs-full-text-search-which-one-should-i-choose-with-milvus-2-5.md)
