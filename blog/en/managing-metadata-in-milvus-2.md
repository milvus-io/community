---
id: managing-metadata-in-milvus-2.md
title: Milvus Metadata Management (2)
author: Zilliz
date: 2021-04-12 20:41:13.864+00
desc: Fields in the Metadata Table

cover: ../assets/pc-blog.jpg
tag: test1
origin: zilliz.com/blog/managing-metadata-in-milvus-2
---

# Milvus Metadata Management (2)

In the last blog, we mentioned how to view your metadata using MySQL or SQLite. This article mainly intends to introduce in detail the fields in the metadata tables.

## Fields in the <code>Tables</code> table

Take SQLite as an example. The following result comes from 0.5.0. Some fields are added to 0.6.0, which will be introduced later. There is a row in <code>Tables</code> specifying a 512-dimensional vector table with the name <codetable_1</code>. When the table is created, <code>index_file_size</code> is 1024 MB, <code>engine_type</code> is 1 (FLAT), <code>nlist</code> is 16384, <code>metric_type</code> is 1 (Euclidean distance L2). id is the unique identifier of the table. <code>state</code> is the state of the table with 0 indicating a normal state. <code>created_on</code> is the creation time. <code>flag</code> is the flag reserved for internal use.

![1-image-1.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/1_image_1_be4ca78ccb.png)

The following table shows field types and descriptions of the fields in <code>Tables</code>.

![2-field-types-descriptions-milvus-metadata.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/2_field_types_descriptions_milvus_metadata_d0b068c413.png)

###### Fields in “Tables”

Table partitioning is enabled in 0.6.0 with a few new fields, including <code>owner_table</code>，<code>partition_tag</code> and <code>version</code>. A vector table, <code>table_1</code>, has a partition called <code>table_1_p1</code>, which is also a vector table. <code>partition_name</code> corresponds to <code>table_id</code>. Fields in a partition table are inherited from the <code>owner table</code>, with the owner table field specifying the name of the owner table and the <code>partition_tag</code> field specifying the tag of the partition.

![3-image-2.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/3_image_2_a2a8bbc9ae.png)

The following table shows new fields in 0.6.0:

![4-new-fields-milvus-0.6.0.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/4_new_fields_milvus_0_6_0_bb82bfaadf.png)

###### New fields in “Tables”

## Fields in the TableFiles table

The following example contains two files, which both belong to the <code>table_1</code> vector table. The index type (<code>engine_type</code>) of the first file is 1 (FLAT); file status (<code>file_type</code>) is 7 (backup of the original file); <code>file_size</code> is 411200113 bytes; number of vector rows is 200,000. The index type of the second file is 2 (IVFLAT); file status is 3 (index file). The second file is actually the index of the first file. We will introduce more information in upcoming articles.

![5-image-3.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/5_image_3_5e22c937ed.png)

The following table shows fields and descriptions of <code>TableFiles</code>:

![6-field-types-descriptions-tablefile.png](https://zilliz-cms.s3.us-west-2.amazonaws.com/6_field_types_descriptions_tablefile_7a7b57d715.png)

###### Fields in “Tablefiles”

## What’s coming next

The upcoming article will show you how to use SQLite to manage metadata in Milvus. Stay tuned!

Any questions, welcome to join our [Slack channel](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)or file an issue in the repo.

GitHub repo: https://github.com/milvus-io/milvus
