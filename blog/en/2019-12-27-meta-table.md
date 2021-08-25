---
id: 2019-12-27-meta-table.md
title: Milvus Metadata Management (2) Fields in the Metadata Table
author: Yihua Mo
date: 2021-07-30
desc: Open-source communities are creative and collaborative spaces. In that vein, the Milvus
banner: ../assets/blogCover.png
cover: ../assets/blogCover.png
tag: test4
---

# Milvus Metadata Management (2)

## Fields in the Metadata Table

> Author: Yihua Mo
>
> Date: 2019-12-27

In the last blog, we mentioned how to view your metadata using MySQL or SQLite. This article mainly intends to introduce in detail the fields in the metadata tables.

### Fields in the "`Tables”` table

Take SQLite as an example. The following result comes from 0.5.0. Some fields are added to 0.6.0, which will be introduced later. There is a row in `Tables` specifying a 512-dimensional vector table with the name `table_1`. When the table is created, `index_file_size` is 1024 MB, `engine_type` is 1 (FLAT), `nlist` is 16384, `metric_type` is 1 (Euclidean distance L2). `id` is the unique identifier of the table. `state` is the state of the table with 0 indicating a normal state. `created_on` is the creation time. `flag` is the flag reserved for internal use.

![tables](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png)

The following table shows field types and descriptions of the fields in `Tables`.

| Field Name        | Data Type | Description                                                                                                                                                                                 |
| :---------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`              | int64     | Unique identifier of the vector table. `id` automatically increments.                                                                                                                       |
| `table_id`        | string    | Name of the vector table. `table_id` must be user-defined and follow Linux filename guidelines.                                                                                             |
| `state`           | int32     | State of the vector table. 0 stands for normal and 1 stands for deleted (soft delete).                                                                                                      |
| `dimension`       | int16     | Vector dimension of the vector table. Must be user-defined.                                                                                                                                 |
| `created_on`      | int64     | Number of milliseconds from Jan 1, 1970 to the time when the table is created.                                                                                                              |
| `flag`            | int64     | Flag for internal use, such as whether the vector id is user-defined. The default is 0.                                                                                                     |
| `index_file_size` | int64     | If the size of a data file reaches `index_file_size`, the file is not combined and is used to build indexes. The default is 1024 (MB).                                                      |
| `engine_type`     | int32     | Type of index to build for a vector table. The default is 0, which specifies invalid index. 1 specifies FLAT. 2 specifies IVFLAT. 3 specifies IVFSQ8. 4 specifies NSG. 5 specifies IVFSQ8H. |
| `nlist`           | int32     | Number of clusters the vectors in each data file are divided into when the index is being built. The default is 16384.                                                                      |
| `metric_type`     | int32     | Method to compute vector distance. 1 specifies Euclidean distance (L1) and 2 specifies inner product.                                                                                       |

Table partitioning is enabled in 0.6.0 with a few new fields, including `owner_table`，`partition_tag` and `version`. A vector table, `table_1`, has a partition called `table_1_p1`, which is also a vector table. `partition_name` corresponds to `table_id`. Fields in a partition table are inherited from the owner table, with the `owner table` field specifying the name of the owner table and the `partition_tag` field specifying the tag of the partition.

![tables_new](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png)

The following table shows new fields in 0.6.0:

| Field Name      | Data Type | Description                                        |
| :-------------- | :-------- | :------------------------------------------------- |
| `owner_table`   | string    | Parent table of the partition.                     |
| `partition_tag` | string    | Tag of the partition. Must not be an empty string. |
| `version`       | string    | Milvus version.                                    |

### Fields in the “`TableFiles"` table

The following example contains two files, which both belong to the `table_1` vector table. The index type (`engine_type`) of the first file is 1 (FLAT); file status (`file_type`) is 7 (backup of the original file); `file_size` is 411200113 bytes; number of vector rows is 200,000. The index type of the second file is 2 (IVFLAT); file status is 3 (index file). The second file is actually the index of the first file. We will introduce more information in upcoming articles.

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png)

The following table shows fields and descriptions of `TableFiles`:

| Field Name     | Data Type | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :------------- | :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`           | int64     | Unique identifier of a vector table. `id` automatically increments.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `table_id`     | string    | Name of the vector table.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `engine_type`  | int32     | Type of index to build for a vector table. The default is 0, which specifies invalid index. 1 specifies FLAT. 2 specifies IVFLAT. 3 specifies IVFSQ8. 4 specifies NSG. 5 specifies IVFSQ8H.                                                                                                                                                                                                                                                                                       |
| `file_id`      | string    | Filename generated from file creation time. Equals 1000 multiplied by the number of milliseconds from Jan 1, 1970 to the time when the table is created.                                                                                                                                                                                                                                                                                                                          |
| `file_type`    | int32     | File status. 0 specifies a newly generated raw vector data file. 1 specifies raw vector data file. 2 specifies that index will be built for the file. 3 specifies that the file is an index file. 4 specifies that the file will be deleted (soft delete). 5 specifies that the file is newly-generated and used to store combination data. 6 specifies that the file is newly-generated and used to store index data. 7 specifies the backup status of the raw vector data file. |
| `file_size`    | int64     | File size in bytes.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `row_count`    | int64     | Number of vectors in a file.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `updated_time` | int64     | Timestamp for the latest update time, which specifies the number of milliseconds from Jan 1, 1970 to the time when the table is created.                                                                                                                                                                                                                                                                                                                                          |
| `created_on`   | int64     | Number of milliseconds from Jan 1, 1970 to the time when the table is created.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `date`         | int32     | Date when the table is created. It is still here for historical reasons and will be removed in future versions.                                                                                                                                                                                                                                                                                                                                                                   |

## Related blogs

- [Managing Data in Massive Scale Vector Search Engine](https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f)
- [Milvus Metadata Management (1): How to View Metadata](https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0)
