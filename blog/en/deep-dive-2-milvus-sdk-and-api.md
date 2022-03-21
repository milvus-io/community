---
id: deep-dive-2-milvus-sdk-and-api.md
title: An Introduction to Milvus Python SDK and API
author: Xuan Yang
date: 2022-03-21
desc: The first one in a blog series to take a closer look at the thought process and design principles behind the building of the most popular open-source vector database.
cover: assets.zilliz.com/deep_dive_2_a3630c85d3.png
tag: Engineering
tags: Data science, Database, Technology, Artificial Intelligence, Vector Management
canonicalUrl: http://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md
---

![Cover image](https://assets.zilliz.com/deep_dive_2_a3630c85d3.png "An Introduction to Milvus Python SDK and API")

By [Xuan Yang](https://github.com/XuanYang-cn)

## Background

The following illustration depicts the interaction between SDKs and Milvus through gRPC. Imagine that Milvus is a black box. Protocol Buffers are used to define the interfaces of the server, and the structure of the information they carry. Therefore, all operations in the black box Milvus is defined by Protocol API.

![Interaction](https://assets.zilliz.com/SDK_10c9673111.png "The interaction between SDKs and Milvus through gRPC")

## Milvus Protocol API

Milvus Protocol API consists of `milvus.proto`, `common.proto`, and `schema.proto`, which are Protocol Buffers files suffixed with `.proto`. To ensure proper operation, SDKs must interact with Milvus with these Protocol Buffers files.

### milvus.proto

`milvus.proto` is the vital component of Milvus Protocol API because it defines the `MilvusService`, which further defines all RPC interfaces of Milvus.

The following code sample shows the interface `CreatePartitionRequest`. It has two major string-type parameters `collection_name` and `partition_name`, based on which you can start a partition creation request.

![CreatePartitionRequest](https://assets.zilliz.com/code_d5f034d58d.png "CreatePartitionRequest interface")

Check an example of Protocol in [PyMilvus GitHub Repository](https://github.com/milvus-io/pymilvus/blob/master/pymilvus/grpc_gen/proto/milvus.proto) on line 19.

![Example](https://assets.zilliz.com/create_partition_938691f07f.png "An example of Protocol")

You can find the definition of `CreatePartitionRequest` here.

![Definition](https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png "The definition of CreatePartitionRequest")

Contributors who wish to develop a feature of Milvus or an SDK in a different programming language are welcome to find all interfaces Milvus offers via RPC.

### common.proto

`common.proto` defines the common types of information, including `ErrorCode`, and `Status`. 

![common.proto](https://assets.zilliz.com/20220321_112303_eaafc432a8.png "common.proto")

### schema.proto

`schema.proto` defines the schema in the parameters. The following code sample is an example of `CollectionSchema`.

![schema.proto](https://assets.zilliz.com/20220321_112313_df4ebe36e7.png "schema.proto")

`milvus.proto`, `common.proto`, and `schema.proto` together constitutes the API of Milvus, representing all operations that can be called via RPC.

If you dig into the source code and observe carefully, you will find that when interfaces like `create_index` are called, they actually call multiple RPC interfaces such as `describe_collection` and `describe_index`. Many of the outward interface of Milvus is a combination of multiple RPC interfaces.

Having understood the behaviors of RPC, you can then develop new features for Milvus through combination. You are more than welcome to use your imagination and creativeness and contribute to Milvus community.

## PyMilvus 2.0

### Object-relational mapping (ORM)

To put it in a nutshell, Object-relational mapping (ORM) refers to that when you operate on a local object, such operations will affect the corresponding object on server. PyMilvus ORM-style API features the following characteristics:

1. It operates directly on objects.
2. It isolates service logic and data access details.
3. It hides the complexity of implementation, and you can run the same scripts across different Milvus instances regardless of their deployment approaches or implementation.

### ORM-style API

One of the essence of ORM-style API lies in the control of Milvus connection. For example, you can specify aliases for multiple Milvus servers, and connect to or disconnect from them merely with their aliases. You can even delete the local server address, and control certain objects via specific connection precisely.

![Control Connection](https://assets.zilliz.com/20220321_112320_d5ff08a582.png "Control connections to Milvus")

Another feature of ORM-style API is that, after abstraction, all operations can be performed directly on objects, including collection, partition, and index.

You can abstract a collection object by getting an existing one or creating a new one. You can also assign a Milvus connection to specific objects using connection alias, so that you can operate on these objects locally.

To create a partition object, you can either create it with its parent collection object, or you can do it just like when you create a collection object. These methods can be employed on an index object as well.

In the case that these partition or index objects exist, you can get them through their parent collection object.

## What's more

It is recommended to learn about PyMilvus through our technical document. The document consists of two major sections, including an automated API reference and usage instructions made by our contributors.

- [Milvus Technical Document](https://milvus.io/docs)
- [PyMilvus Source Document](https://github.com/milvus-io/pymilvus/tree/master/docs)





