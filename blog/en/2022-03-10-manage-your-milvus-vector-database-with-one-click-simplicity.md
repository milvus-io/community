---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Manage Your Milvus Vector Database with One-click Simplicity
author: Zhen Chen
date: 2022-03-10
desc: Attu - a GUI tool for Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: Data science, Database, Technology, Artificial Intelligence, Vector Management
canonicalUrl: http://milvus.io/blog/2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
---

![Binlog Cover Image](https://assets.zilliz.com/Attu_3ff9a76156.png "Attu - a GUI tool for Milvus 2.0")

Draft by [Zhen Chen](https://github.com/czhen-zilliz) and transcreation by [Lichen Wang](https://github.com/LocoRichard).

<p style="font-size: 12px;color: #4c5a67">Click <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">here</a> to check the original post.</p> 

In the face of rapidly growing demand for unstructured data processing, Milvus 2.0 stands out. It is an AI-oriented vector database system designed for massive production scenarios. Apart from all these Milvus SDKs and Milvus CLI, a command-line interface for Milvus, is there a tool that allows users to operate Milvus more intuitively? The anwer is YES. Zilliz has announced a graphical user interface - Attu - specifically for Milvus. In this article, we would like to show you step by step how to perform a vector similarity search with Attu.

![Attu island](https://assets.zilliz.com/map_aa1cda30d4.png "Attu (/ ˈætu /) is an island on the west edge of Aleutian Islands. This uninhabited realm symbolizes an adventurous spirit.")

In comparison with Milvus CLI which brings the uttermost simplicity of usage, Attu features more:
- Installers for Windows OS, macOS, and Linux OS;
- Intuitive GUI for easier usage of Milvus;
- Coverage of major functionalities of Milvus;
- Plugins for expansion of customized functionalities;
- Complete system topology information for easier understanding and administration of Milvus instance.

## Installation

You can find the newest release of Attu at [GitHub](https://github.com/zilliztech/attu/releases). Attu offers executable installers for different operating systems. It is an open-source project and welcomes contribution from everyone.

![Installation](https://assets.zilliz.com/installation_bbe62873af.png "Attu installers and source code.")

You can also install Attu via Docker.

```shell
docker run -p 8000:3000 -e HOST_URL=http://{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest
```

`attu IP` is the IP address of the environment where Attu runs, and `milvus server IP` is IP address of the environment where Milvus runs.

Having installed Attu successfully, you can input the Milvus IP and Port in the interface to start Attu.

![Connect Milvus with Attu](https://assets.zilliz.com/connect_1fde46d9d5.png "Connect Milvus with Attu")

## Feature overview

![Overview page](https://assets.zilliz.com/overview_591e230514.png "Attu Overview page")

Attu interface consists of **Overview** page, **Collection** page, **Vector Search** page, and **System View** page, corresponding to the four icons on the left-side navigation pane respectively.

The **Overview** page shows the loaded collections. While the **Collection** page lists all the collections and indicates if they are loaded or released.

![Collection page](https://assets.zilliz.com/collection_42656fe308.png "Attu Collection page")

The **Vector Search** and **System View** pages are plugins of Attu. The concepts and usage of the plugins will be introduced in the final part of the blog.

You can perform vector similarity search in **Vector Search** page.

![Vector Search page](https://assets.zilliz.com/vector_search_be7365687c.png "Attu Vector Search page")

In **System View** page, you can check the topological structure of Milvus.

![System View page](https://assets.zilliz.com/system_view_e1df15023d.png "Attu System View page")

You can also check the detailed information of each node by clicking the node.

![Node view](https://assets.zilliz.com/node_view_5bbc25f9b2.png "Attu Node view page")

## Demonstration

Let's explore Attu with a test dataset.

Check our [GitHub repo](https://github.com/zilliztech/attu/tree/main/examples) for the dataset used in the following test.

First, create a collection named test with the following four fields:
- Field Name: id, primary key field
- Field Name: vector, vector field, float vector, Dimension: 128
- Field Name: brand, scalar field, Int64
- Field Name: color, scalar field, Int64

![Create a collection](https://assets.zilliz.com/create_collection_95dfa15354.png "Create a collection with Attu")

Load the collection for search after it was successfully created.

![Load the collection](https://assets.zilliz.com/load_collection_fec39171df.png "Load the collection with Attu")

You can now check the newly created collection in the **Overview** page.

![Check the collection](https://assets.zilliz.com/check_collection_163b05477e.png "Check the collection with Attu")

Import the test dataset into Milvus.

![Import data](https://assets.zilliz.com/import_data_1_f73d71be85.png "Import data with Attu")

![Import data](https://assets.zilliz.com/import_data_2_4b3c3c3c25.png "Import data with Attu")

![Import data](https://assets.zilliz.com/import_data_3_0def4e8550.png "Import data with Attu")

Click the collection name in Overview or Collection page to enter query interface to check the imported data.

Add filter, specify the expression `id != 0`, click **Apply Filter**, and click **Query**.

![Query data](https://assets.zilliz.com/query_data_24d9f71ccc.png "Query data with Attu")

You will find all fifty entries of entities are imported successfully.

![Query result](https://assets.zilliz.com/query_result_bcbbd17084.png "Query result")

Let's try vector similarity search.

Copy one vector from the `search_vectors.csv` and paste it in **Vector Value** field. Choose the collection and field. Click **Search**.

![Search data](https://assets.zilliz.com/search_data_5af3a1db53.png "Search data with Attu")

You can then check the search result. Without compiling any scripts, you can search with Milvus easily.

![Search result](https://assets.zilliz.com/search_result_961886efab.png "Search result")

Finally, let's check the **System View** page.

With Metrics API encapsulated in Milvus Node.js SDK, you can check the system status, node relations, and node status.

As an exclusive feature of Attu, System Overview page includes a complete system topological graph. By clicking on each node, you can check its status (refresh every 10 seconds).

![Milvus node topological graph](https://assets.zilliz.com/topological_graph_d0c5c17586.png "Milvus node topological graph in Attu")

Click on each node to enter the **Node List View**. You can check all child nodes of a coord node. By sorting, you can identify the nodes with high CPU or memory usage quickly, and locate the problem with the system.

![Milvus node list](https://assets.zilliz.com/node_list_64fc610a8d.png "Milvus node list")

## What's more

As mentioned earlier, the **Vector Search** and **System View** pages are plugins of Attu. We encourage users to develop their own plugins in Attu to suit their application scenarios. In the source code, there is folder built specifically for plugin codes.

![Plugins](https://assets.zilliz.com/plugins_a2d98e4e5b.png "Vector Search and System View pages are plugins of Attu")

You can refer to any of the plugin to learn how to build a plugin. By setting the following config file, you can add the plugin to Attu.

![Add plugins to Attu](https://assets.zilliz.com/add_plugins_e3ef53cc0d.png "Add plugins to Attu")

You can see [Attu GitHub Repo](https://github.com/zilliztech/attu/tree/main/doc) and [Milvus Technical Document](https://milvus.io/docs/v2.0.x/attu.md) for detailed instruction.

Attu is an open-source project. All contributions are welcome. You can also [file an issue](https://github.com/zilliztech/attu/issues) if you had any problem with Attu.

We sincerely hope that Attu can bring you a better user experience with Milvus. And if you like Attu, or have some feedbacks about the usage, you can complete this [Attu User Survey](https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r) to help us optimize Attu for a better user experience.
