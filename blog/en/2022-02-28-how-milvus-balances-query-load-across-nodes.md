---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: How Milvus Balances Query Load across Nodes?
author: Xi Ge
date: 2022-02-28
desc: Milvus 2.0 supports automatic load balance across query nodes.
cover: assets.zilliz.com/20220228_145318_eb8d1ce83f.png
tag: Engineering
tags: Data science, Database, Technology, Artificial Intelligence, Vector Management
canonicalUrl: http://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---

![Binlog Cover Image](https://assets.zilliz.com/20220228_145318_eb8d1ce83f.png "How Milvus Balances Query Load across Nodes?")

By [Xi Ge](https://github.com/xige-16).

In previous blog articles, we have successively introduced the Deletion, Bitset, and Compaction functions in Milvus 2.0. To culminate this series, we would like to share the design behind Load Balance, a vital function in the distributed cluster of Milvus.


## Usage

Milvus 2.0 supports automatic load balance by default. But you can still trigger load balance manually. Please note that only sealed segments can be transferred across query nodes.

Now, without further ado, let's try this feature first. (The following example uses PyMilvus 2.0.0 on Milvus 2.0.0).

```python
from pymilvus import connections, utility, Collection, DataType, FieldSchema, CollectionSchema
# Connect to Milvus
connections.connect(
    alias="default", 
    host='x.x.x.x', 
    port='19530'
)
# Create a collection
pk_field = FieldSchema(
    name="id", 
    dtype=DataType.INT64, 
    is_primary=True, 
)
vector_field = FieldSchema(
    name="vector", 
    dtype=DataType.FLOAT_VECTOR, 
    dim=2
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description="Try out load balance"
)
collection_name = "try_load_balance"
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using='default', 
    shards_num=2
)
# Insert randomly generated vectors
import random
data = [
    [i for i in range(100000)],
    [[random.random() for _ in range(2)] for _ in range(100000)]
]
collection.insert(data)
# Load the collection
collection.load()
# Check the number of the entities in the collection to seal the segments
collection.num_entities
# Check the segment information
utility.get_query_segment_info(collection_name)
# [segmentID: 431092560210952194    // Segment ID
# collectionID: 431092538449330177  // Collection ID corresponding to the collection name
# partitionID: 431092538449330178
# mem_size: 2162688                 // Memory usage of the segment
# num_rows: 49937                   // Row count of the segment
# nodeID: 29                        // ID of the query node
# state: Sealed                     // State of the segment, including {Growing, Sealed}
# , segmentID: 431092560210952193
# collectionID: 431092538449330177
# partitionID: 431092538449330178
# mem_size: 2162688
# num_rows: 50063
# nodeID: 29
# state: Sealed
# ]

# Transfer segment with ID 431092560210952193 from query node with ID 29 to that with 28
utility.load_balance(
    src_node_id=29, 
    dst_node_ids=[28], 
    sealed_segment_ids=[431092560210952193]
)
```

## Implementation

Whereas the number and size of segments buffered in query nodes differ, the search performance across the query nodes may also vary. The worst case could happen when a few query nodes are exhausted searching on a large amount of data, but newly created query nodes remain idle because no segment is distributed to them, causing a massive waste of CPU resources and a huge drop in search performance.

To avoid such circumstances, the query coordinator (query coord) is programmed to distribute segments evenly to each query node according to the RAM usage of the nodes. Therefore, CPU resources are consumed equally across the nodes, thereby significantly improving search performance.

### Trigger automatic load balance

According to the default value of the configuration queryCoord.balanceIntervalSeconds, the query coord checks the RAM usage (in percentage) of all query nodes every 60 seconds. If either of the following conditions is satisfied, the query coord starts to balance the query load across the query node:

1. RAM usage of any query node in the cluster is larger than queryCoord.overloadedMemoryThresholdPercentage (default: 90);
2. Or the absolute value of any two query nodes' RAM usage difference is larger than queryCoord.memoryUsageMaxDifferencePercentage (default: 30).

After the segments are transferred from the source query node to the destination query node, they should also satisfy both the following conditions:

1. RAM usage of the destination query node is no larger than queryCoord.overloadedMemoryThresholdPercentage (default: 90);
2. The absolute value of the source and destination query nodes' RAM usage difference after load balancing is less than that before load balancing.

With the above conditions satisfied, the query coord proceeds to balance the query load across the nodes.

## Load balance

When load balance is triggered, the query coord first loads the target segment(s) to the destination query node. Both query nodes return search results from the target segment(s) at any search request at this point to guarantee the completeness of the result.

After the destination query node successfully loads the target segment, the query coord publishes a `sealedSegmentChangeInfo` to the Query Channel. As shown below, `onlineNodeID` and `onlineSegmentIDs` indicate the query node that loads the segment and the segment loaded respectively, and `offlineNodeID` and `offlineSegmentIDs` indicate the query node that needs to release the segment and the segment to release respectively.

![sealedSegmentChangeInfo](https://assets.zilliz.com/20220228_145413_f253cec15b.png "sealedSegmentChangeInfo")

Having received the `sealedSegmentChangeInfo`, the source query node then releases the target segment. 

![Load Balance Workflow](https://assets.zilliz.com/20220228_145436_2604bc57a5.png "Load Balance Workflow")

The whole process succeeds when the source query node releases the target segment. By completing that, the query load is set balanced across the query nodes, meaning the RAM usage of all query nodes is no larger than `queryCoord.overloadedMemoryThresholdPercentage`, and the absolute value of the source and destination query nodes' RAM usage difference after load balancing is less than that before load balancing.

This is the finale of the Milvus 2.0 New feature blog series. Following this series, we are planning a new series of Milvus Deep Dive, which introduces the basic architecture of Milvus 2.0. Please stay tuned.
