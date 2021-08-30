---
id: inside-milvus-1.1.0.md
title: Inside Milvus 1.1.0
author: Zilliz
date: 2021-05-20 08:35:42.7+00
desc: Milvus v1.1.0 has arrived! New features, improvements, and bug fixes are available now.
banner: ../assets/blogCover.png
cover: ../assets/blogCover.png
tag: test1
origin: zilliz.com/blog/inside-milvus-1.1.0
---
  
# Inside Milvus 1.1.0
[Milvus](https://github.com/milvus-io) is an ongoing open-source software (OSS) project focused on building the world's fastest and most reliable vector database. New features inside Milvus v1.1.0 are the first of many updates to come, thanks to long-term support from the open-source community and sponsorship from Zilliz. This blog article covers the new features, improvements, and bug fixes included with Milvus v1.1.0.

**Jump to:**

- [New features](#new-features)
- [Improvements](#improvements)
- [Bug fixes](#bug-fixes)

<br/>

## New features

Like any OSS project, Milvus is a perpetual work in progress. We strive to listen to our users and the open-source community to prioritize the features that matter most. The latest update, Milvus v1.1.0, offers the following new features:

### Specify partitions with `get_entity_by_id()` method calls

To further accelerate vector similarity search, Milvus 1.1.0 now supports retrieving vectors from a specified partition. Generally, Milvus supports querying vectors through specified vector IDs. In Milvus 1.0, calling the method `get_entity_by_id()` searches the entire collection, which can be time consuming for large datasets. As we can see from the code below, `GetVectorsByIdHelper` uses a `FileHolder` structure to loop through and find a specific vector. 

```
std::vector<meta::CollectionSchema> collection_array; 
 auto status = meta_ptr_->ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_->FilesByTypeEx(collection_array, file_types, files_holder); 
 if (!status.ok()) { 
     std::string err_msg = "Failed to get files for GetVectorByID: " + status.message(); 
     LOG_ENGINE_ERROR_ << err_msg; 
     return status; 
 } 
  
 if (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ << "No files to get vector by id from"; 
     return Status(DB_NOT_FOUND, "Collection is empty"); 
 } 
  
 cache::CpuCacheMgr::GetInstance()->PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers& id_array, std::vector<engine::VectorsData>& vectors, 
                              meta::FilesHolder& files_holder) { 
     // attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal 
     milvus::engine::meta::SegmentsSchema files = files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ << "Getting vector by id in " << files.size() << " files, id count = " << id_array.size(); 
  
     // sometimes not all of id_array can be found, we need to return empty vector for id not found 
     // for example: 
     // id_array = [1, -1, 2, -1, 3] 
     // vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] 
     // the ID2RAW is to ensure returned vector sequence is consist with id_array 
     using ID2VECTOR = std::map<int64_t, VectorsData>; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     IDNumbers temp_ids = id_array; 
     for (auto& file : files) { 
```

However, this structure is not filtered by any partitions in `FilesByTypeEx()`. In Milvus v1.1.0, it is possible for the system to pass partition names to the `GetVectorsIdHelper` loop so that the `FileHolder` only contains segments from specified partitions. Put differently, if you know exactly which partition the vector for a search belongs to, you can specify the partition name in a `get_entity_by_id()` method call to accelerate the search process.

We not only made modifications to code controlling system queries at the Milvus server level, but also updated all our SDKs(Python, Go, C++, Java, and RESTful) by adding a parameter for specifying partition names. For example, in pymilvus, the definition of `get_entity_by_id` `def get_entity_by_id(self, collection_name, ids, timeout=None)` is changed to `def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)`.

<br/>

### Specify partitions with `delete_entity_by_id()` method calls

To make vector management more efficient, Milvus v1.1.0 now supports specifying partition names when deleting a vector in a collection. In Milvus 1.0, vectors in a collection can only be deleted by ID. When calling the delete method, Milvus will scan all vectors in the collection. However, it is far more efficient to scan only relevant partitions when working with massive million, billion, or even trillion vector datasets. Similar to the new feature for specifying partitions with `get_entity_by_id()` method calls, modifications were made to the Milvus code using the same logic.

<br/>

### New method `release_collection()`

To free up memory Milvus used to load collections at runtime, a new method `release_collection()` has been added in Milvus v1.1.0 to manually unload specific collections from cache.

<br/>

## Improvements

Although new features are usually all the rage, it's also important to improve what we already have. What follows are upgrades and other general improvements over Milvus v1.0.

<br/>

### Improved performance of `get_entity_by_id()` method call

The chart below is a comparison of vector search performance between Milvus v1.0 and Milvus v1.1.0:

> CPU: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz * 8 <br/>
> Segment file size = 1024 MB <br/>
> Row count = 1,000,000 <br/>
> Dim = 128 

| Query ID Num | v 1.0.0 | v1.1.0 |
| :-----------: | :-----------: | :-----------: |
| 10 | 9 ms | 2 ms |
| 100 | 149 ms | 19 ms |

<br/>

### Hnswlib upgraded to v0.5.0

Milvus adopts multiple widely used index libraries, including Faiss, NMSLIB, Hnswlib, and Annoy to simplify the process of choosing the right index type for a given scenario.

Hnswlib has been upgraded from v0.3.0 to v0.5.0 in Milvus 1.1.0 due to a bug detected in the earlier version. Additionally, upgrading Hnswlib improves `addPoint()` performance in index building.

A Zilliz developer created a pull request (PR) to improve Hnswlib performance while building indexes in Milvus. See [PR #298](https://github.com/nmslib/hnswlib/pull/298) for details.

The chart below is a comparison of `addPoint()` performance between Hnswlib 0.5.0 and the proposed PR:

> CPU: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz * 8 <br/>
> Dataset: sift_1M (row count = 1000000, dim = 128, space = L2)

|  | 0.5.0 | PR-298 |
| :-----------: | :-----------: | :-----------: |
| M = 16, ef_construction = 100 | 274406 ms | 265631 ms |
| M = 16, ef_construction = 200 | 522411 ms | 499639 ms |

<br/>

### Improved IVF index training performance

Creating an index includes training, inserting and writing data to disk. Milvus 1.1.0 improves the training component of index building. The chart below is a comparison of IVF index training performance between Milvus 1.0 and Milvus 1.1.0:

> CPU: Intel(R) Core(TM) i7-8550U CPU @ 1.80GHz * 8 <br/>
> Dataset: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)

|  | v1.0.0 (ms) | v1.1.0 (ms) |
| :-----------: | :-----------: | :-----------: |
| ivf_flat (nlist = 2048) | 90079 | 81544 |
| ivf_pq (nlist = 2048, m=16) | 103535 | 97115 |
| ivf_pq (nlist = 2048, m=32) | 108638 | 104558 |
| ivf_flat (nlist = 4096) | 340643 | 310685 |
| ivf_pq (nlist = 4096, m=16) | 351982 | 323758 |
| ivf_pq (nlist = 4096, m=32) | 357359 | 330887 |


<br/>

## Bug fixes

We also fixed some bugs to make Milvus more stable and efficient when managing vector datasets. See [Fixed Issues](https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues) for more details.

  