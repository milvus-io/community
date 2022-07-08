---
id: intelligent-wardrobe-customization-system.md
title: Building an Intelligent Wardrobe Customization System Powered by Milvus Vector Database
author: Yiyun Ni
date: 2022-07-08
desc: Using similarity search technology to unlock the potential of unstructured data, even like wardrobes and its components!
cover: assets.zilliz.com/IKEA_cover_7991d8b215.jpeg
tag: Engineering
tags: Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector Management
canonicalUrl: http://milvus.io/blog/intelligent-wardrobe-customization-system.md
---

![cover image](https://assets.zilliz.com/IKEA_cover_7991d8b215.jpeg "Building an intelligent wardrobe customization system powered by Milvus vector database")

If you are looking for a wardrobe to fit perfectly into your bedroom or fitting room, I bet most people will think of the made-to-measure ones. However, not everyone's budget can stretch that far. Then what about those ready-made ones? The problem with this type of wardrobe is that they are very likely to fall short of your expectation as they are not flexible enough to cater to your unique storage needs. Plus, when searching online, it is rather difficult to summarize the particular type of wardrobe you are looking for with keywords. Very likely, the keyword you type in the search box (eg. A wardrobe with a jewellery tray) might be very different from how it is defined in the search engine (eg. A wardrobe with [pullout tray with insert](https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/)).  

But thanks to emerging technologies, there is a solution! IKEA, the furniture retail conglomerate, provides a popular design tool [PAX wardrobe](https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0) that allows users to choose from a number of ready-made wardrobes and customize the color, size, and interior design of the wardrobes. Whether you need hanging space, multiple shelves or internal drawers, this intelligent wardrobe customization system can always cater to your needs. 

To find or build your ideal wardrobe using this smart wardrobe design system, you need to:
1. Specify the basic requirements - the shape (normal, L-shaped, or U-shaped), length and depth of the wardrobe.
2. Specify your storage need and the interior organization of the wardrobe (eg. Hanging space, a pullout pants rack, etc is needed).
3. Add or remove parts of the wardrobe like drawers or shelves.

Then your design is completed. Simple and easy!




![pax system](https://assets.zilliz.com/Pax_system_ff4c3fa182.png "An online wardrobe customization system.")

A very critical component that makes such a  wardrobe design system possible is the [vector database](https://zilliz.com/learn/what-is-vector-database). Therefore, this article aims to introduce the workflow and similarity search solutions used to build an intelligent wardrobe customization system powered by vector similarity search.

Jump to:
- [System overview](#System-overview)
- [Data flow](#Data-flow)
- [System demo](#System-demo)


## System Overview
In order to deliver such a smart wardrobe customization tool, we need to first define the business logic and understand item attributes and user journey. Wardrobes along with its components like drawers, trays, racks, are all unstructured data. Therefore, the second step is to leverage AI algorithms and rules, prior knowledge, item description, and more, to convert those unstructured data into a type of data that can be understood by computers - vectors!


![Customization tool overview](https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png "An overview of the wardrobe customization tool.")

With the generated vectors, we need powerful vector databases and search engines to process them.


![tool architecture](https://assets.zilliz.com/tool_architecutre_33fb646954.png "The architecture of the customization tool.")

The customization tool leverages some of the most popular search engines and databases: Elasticsearch, [Milvus](http://milvus.io/), and PostgreSQL.

### Why Milvus?
A wardrobe component contains highly complex information, such as color, shape, and interior organization, etc. However, the traditional way of keeping wardrobe data in a relational database is far from enough. A popular way is to use embedding techniques to convert wardrobes into vectors. Therefore, we need to look for a new type of database specifically designed for vector storage and similarity search. After probing into several popular solutions, the [Milvus](https://github.com/milvus-io/milvus) vector database is selected for its excellent performance, stability, compatibility, and ease-of-use. The chart below is a comparison of several popular vector search solutions.


![solution comparison](https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png "Comparing several solutions.")

### System workflow

![System workflow](https://assets.zilliz.com/System_workflow_250c275ec1.png "System workflow.")


Elasticsearch is used for a coarse filtering by the wardrobe size, color, etc. Then the filtered results go through Milvus the vector database for a similarity search and the results are ranked based on their distance/similarity to the query vector. Finally, the results are consolidated and further refined based on business insights.

## Data flow 
The wardrobe customization system is very similar to traditional search engines and recommender systems. It contains three parts:  
- Offline data preparation including data definition and generation.
- Online services including recall and ranking.
- Data post-processing based on business logic.


![Data flow](https://assets.zilliz.com/data_flow_d0d9fa0fca.png "The overall data flow in the wardrobe customization system.")

### Offline data flow 
1. Define data using business insight.
2. Use prior knowledge to define how to combine different components and form them into a wardrobe.
3. Recognize feature labels of the wardrobes and encode the features into Elasticsearch data in `.json` file.
4. Prepare recall data by encoding unstructured data into vectors.
5. Use Milvus the vector database to rank the recalled results obtained in the previous step.


![offline data flow](https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png "How data is processed offline.")

### Online data flow
1. Receive query request from users and collect user profiles.
2. Understand user query by identifying their requirements for the wardrobe.
3. Coarse search using Elasticsearch.
4. Score and rank the results obtained from coarse search based on the calculation of vector similarity in Milvus.
5. Post-process and organize the results on the back-end platform to generate the final results.


![online data flow](https://assets.zilliz.com/online_data_flow_1f2af25cc3.png "How data is processed online.")

### Data post-processing
The business logic varies among each company. You can add a final touch to the results by applying your company's business logic.

## System demo
Now let's see how the system we build actually works.

The user interface (UI) displays the possibility of different combinations of wardrobe components. 

Each component is labelled by its feature (size, color, etc.) and stored in Elasticsearch (ES). When storing the labels in ES, there are four main data fields to be filled out: ID, tags, storage path, and other support fields. ES and the labelled data are used for granular recall and attribute filtering.

![es](https://assets.zilliz.com/es_d5b0639610.png "Using Elasticsearch for labelling.")

Then different AI algorithms are used to encode a wardrobe into a set of vectors. The vector sets are stored in Milvus for similarity search and ranking. This step returns more refined and accurate results.

![Milvus](https://assets.zilliz.com/Milvus_38dd93a439.jpeg "Using Milvus for vector storage and similarity search.")

Elasticsearch, Milvus, and other system components altogether form the customization design platform as a whole. During recall, the domain-specific language (DSL) in Elasticsearch and Milvus is as follows.


![dsl](https://assets.zilliz.com/dsl_df60097d23.png "Recall DSL.")

## Looking for more resources?
Learn how the Milvus vector database can power more AI applications:
- [How Short Video Platform Likee Removes Duplicate Videos with Milvus](https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md)
- [Zhentu - The Photo Fraud Detector Based on Milvus](https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md)
