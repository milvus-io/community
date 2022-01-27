---
id: 2022-1-27-milvus-2-0-a-glimpse-at-new-features.md
title: Milvus 2.0 - A Glimpse at New Features
author: Qiao Yanliang
date: 2022-01-27
desc: Check the Newest Features of Milvus 2.0. 
cover: assets.zilliz.com/20220127_142811_e8ae2a5864.png
tag: Engineering
---

# Milvus 2.0: A Glimpse at New Features

It has been half a year since the first release candidate of Milvus 2.0. Now we are proud to announce the general availability of the Milvus 2.0. Please follow me to catch a glimpse at some of the new features that Milvus supports.

## Entity deletion

Milvus 2.0 supports entity deletion, allowing users to delete vectors based on the primary keys (IDs) of the vectors. They won't be worried about the expired or invalid data anymore. Let's try it.

1. Connect to Milvus, create a new collection, and insert 300 rows of randomly-generated 128-dimensional vectors.

```python
from pymilvus import connections, utility, Collection, DataType, FieldSchema, CollectionSchema
# connect to milvus
host = 'x.x.x.x'
connections.add_connection(default={"host": host, "port": 19530})
connections.connect(alias='default')
# create a collection with customized primary field: id_field
dim = 128
id_field = FieldSchema(name="cus_id", dtype=DataType.INT64, is_primary=True)
age_field = FieldSchema(name="age", dtype=DataType.INT64, description="age")
embedding_field = FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=dim)
schema = CollectionSchema(fields=[id_field, age_field, embedding_field],
                          auto_id=False, description="hello MilMil")
collection_name = "hello_milmil"
collection = Collection(name=collection_name, schema=schema)
import random
# insert data with customized ids
nb = 300
ids = [i for i in range(nb)]
ages = [random.randint(20, 40) for i in range(nb)]
embeddings = [[random.random() for _ in range(dim)] for _ in range(nb)]
entities = [ids, ages, embeddings]
ins_res = collection.insert(entities)
print(f"insert entities primary keys: {ins_res.primary_keys}")
```
```
insert entities primary keys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299]
```

2. Before proceeding to deletion, check the entities you want to delete exist by search or query, and do it twice to make sure the result is reliable.

```python
# search
nq = 10
search_vec = [[random.random() for _ in range(dim)] for _ in range(nq)]
search_params = {"metric_type": "L2", "params": {"nprobe": 16}}
limit = 3
# search 2 times to verify the vector persists
for i in range(2):
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    ids = results[0].ids
    print(f"search result ids: {ids}")
    expr = f"cus_id in {ids}"
    # query to verify the ids exist
    query_res = collection.query(expr)
    print(f"query results: {query_res}")
```
```
search result ids: [76, 2, 246]
query results: [{'cus_id': 246}, {'cus_id': 2}, {'cus_id': 76}]
search result ids: [76, 2, 246]
query results: [{'cus_id': 246}, {'cus_id': 2}, {'cus_id': 76}]
```

3. Delete the entity with the cus_id of 76, and then search and query for this entity.

```python
print(f"trying to delete one vector: id={ids[0]}")
collection.delete(expr=f"cus_id in {[ids[0]]}")
results = collection.search(search_vec, embedding_field.name, search_params, limit)
ids = results[0].ids
print(f"after deleted: search result ids: {ids}")
expr = f"cus_id in {ids}"
# query to verify the id exists
query_res = collection.query(expr)
print(f"after deleted: query res: {query_res}")
print("completed")
```
```
trying to delete one vector: id=76
after deleted: search result ids: [76, 2, 246]
after deleted: query res: [{'cus_id': 246}, {'cus_id': 2}, {'cus_id': 76}]
completed
```

4. Why is the deleted entity still retrievable? If you have checked the source code of Milvus, you will find that the deletion within Milvus is asynchronous and logical, which means that entities won't be physically deleted. Instead, they will be attached with a "deleted" mark so that no search or query requests will retrieve them. In addition, Milvus searches under Bounded Staleness consistency level by default. Therefore, the deleted entities are still retrievable before the data is synchronized in data node and query node. Try search or query the deleted entity after a few seconds, you will then find it is no longer in the result. 
If you want the deleted data immediately invisible, you can set the consistency level as Strong.

```python
expr = f"cus_id in {[76, 2, 246]}"
# query to verify the id exists
query_res = collection.query(expr)
print(f"after deleted: query res: {query_res}")
print("completed")
```
```
after deleted: query res: [{'cus_id': 246}, {'cus_id': 2}]
completed
```

## Consistency level

The above experiment shows us how the consistency level influences the immediate visibility of the newly deleted data.
Users can adjust the consistency level for Milvus flexibly to adapt it to various service scenarios. Milvus 2.0 supports four levels of consistency:
- `CONSISTENCY_STRONG`: `GuaranteeTs` is set as identical to the newest system timestamp, and query nodes wait until the service time proceeds to the newest system timestamp, and then process the search or query request.
- `CONSISTENCY_EVENTUALLY`: `GuaranteeTs` is set insignificantly smaller than the newest system timestamp to skip the consistency check. Query nodes search immediately on the existing data view.
- `CONSISTENCY_BOUNDED`: `GuaranteeTs` is set relatively smaller than the newest system timestamp, and query nodes search on a tolerable, less updated data view.
- `CONSISTENCY_SESSION`: The client uses the timestamp of the last write operation as the `GuaranteeTs`, so that each client can at least retrieve the data inserted by itself. 

In the previous RC release, Milvus adopts Strong as the default consistency. However, taking account of the fact that most users are less demanding about consistency than performance, Milvus changes the default consistency as Bounded Staleness, which can balance their requirements to a greater extent. In the future, we will further optimize the configuration of the GuaranteeTs, which can be achieved only during collection creation in current release. For more information about `GuaranteeTs`, see Guarantee Timestamp in Search Requests. 

Will lower consistency lead to better performance? You can never find the answer until you try it.

5. Modify the code above to record the search latency.
```python
for i in range(5):
    start = time.time()
    results = collection.search(search_vec, embedding_field.name, search_params, limit)
    end = time.time()
    print(f"search latency: {round(end-start, 4)}")
    ids = results[0].ids
    print(f"search result ids: {ids}")
```

6. Search with the identical data scale and parameters except that `consistency_level` is set as `CONSISTENCY_STRONG`.

```python
collection_name = "hello_milmil_consist_strong"
collection = Collection(name=collection_name, schema=schema,
                        consistency_level=CONSISTENCY_STRONG)
```
```
search latency: 0.3293
search latency: 0.1949
search latency: 0.1998
search latency: 0.2016
search latency: 0.198
completed
```

7. Search in a collection with `consistency_level` set as `CONSISTENCY_BOUNDED`.

```python
collection_name = "hello_milmil_consist_bounded"
collection = Collection(name=collection_name, schema=schema,
                        consistency_level=CONSISTENCY_BOUNDED)
```
```
search latency: 0.0144
search latency: 0.0104
search latency: 0.0107
search latency: 0.0104
search latency: 0.0102
completed
```

8. Clearly, average search latency in CONSISTENCY_BOUNDED collection is 200ms shorter than that in CONSISTENCY_STRONG collection.
Are the deleted entities immediately invisible if the consistency level is set as Strong? The answer is Yes. You can still try this on your own.

## Handoff
Working with streaming dataset, many users are used to building an index and loading the collection before inserting data into it. In previous releases of Milvus, users have to load collection manually after the index building to replace the raw data with the index, which is slow and laborious. The handoff feature allows Milvus 2.0 to automatically load indexed segment to replace the streaming data that reaches certain thresholds of indexing, greatly improving the search performance.

9. Build index and load the collection before inserting more entities.
```python
# index
index_params = {"index_type": "IVF_SQ8", "metric_type": "L2", "params": {"nlist": 64}}
collection.create_index(field_name=embedding_field.name, index_params=index_params)
# load
collection.load()
```

10. Insert 50,000 rows of entities 200 times (same batches of vectors are used for the sake of convenience, but this will not affect the result).
```python
import random
# insert data with customized ids
nb = 50000
ids = [i for i in range(nb)]
ages = [random.randint(20, 40) for i in range(nb)]
embeddings = [[random.random() for _ in range(dim)] for _ in range(nb)]
entities = [ids, ages, embeddings]
for i in range(200):
    ins_res = collection.insert(entities)
    print(f"insert entities primary keys: {ins_res.primary_keys}")
```

11. Check the loading segment information in query node during and after the inserting. 
```python
# did this in another python console
utility.get_query_segment_info("hello_milmil_handoff")
```
12. You will find that all sealed segments loaded to query node are indexed.
```
[segmentID: 430640405514551298
collectionID: 430640403705757697
partitionID: 430640403705757698
mem_size: 394463520
num_rows: 747090
index_name: "_default_idx"
indexID: 430640403745079297
nodeID: 7
state: Sealed
, segmentID: 430640405514551297
collectionID: 430640403705757697
partitionID: 430640403705757698
mem_size: 397536480
num_rows: 752910
index_name: "_default_idx"
indexID: 430640403745079297
nodeID: 7
state: Sealed
...
```

## What's more
In addition to the above functionalities, new features such as Data Compaction, Dynamic Load Balance, and more are introduced into Milvus 2.0. Please enjoy your explorative journey with Milvus!
In the near future, we will share with you a series of blogs introducing the design of Deletion, Data Compaction, Dynamic Load Balance, and Bitset in Milvus 2.0.
Find us on:
[GitHub](https://github.com/milvus-io/milvus)
[Milvus.io](https://milvus.io/)
[Slack Channel](milvusio.slack.com)
