---
id: 2019-12-24-view-metadata.md
title: Milvus Metadata Management (1) How to View Metadata
author: Yihua Mo
date: 2019-12-24
desc:

cover:
tag: Technology
---

# Milvus Metadata Management (1)

## How to View Metadata

> Author: Yihua Mo
>
> Date: 2019-12-24

We introduced some information about metadata in [Managing Data in Massive-Scale Vector Search Engine](https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f). This article mainly shows how to view the metadata of Milvus.

Milvus supports metadata storage in SQLite or MySQL. There’s a parameter `backend_url` (in the configuration file `server_config.yaml`) by which you can specify if to use SQLite or MySQL to manage your metadata.

### SQLite

If SQLite is used, a `meta.sqlite` file will be generated in the data directory (defined in the `primary_path` of the configuration file `server_config.yaml`) after Milvus is started. To view the file, you only need to install a SQLite client.

Install SQLite3 from the command line:

```shell
sudo apt-get install sqlite3
```

Then enter the Milvus data directory, and open the meta file using SQLite3:

```shell
sqlite3 meta.sqlite
```

Now, you’ve already entered the SQLite client command line. Just use a few commands to see what is in the metadata.

To make the printed results typeset easier for humans to read:

```sql
.mode column
.header on
```

To query Tables and TableFiles using SQL statements (case-insensitive):

```sql
SELECT \* FROM Tables
```

```sql
SELECT \* FROM TableFiles
```

![sqlite3](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/sqlite3.png)

### MySQL

If you are using MySQL, you need to specify the address of the MySQL service in the `backend_url` of the configuration file `server_config.yaml`.

For example, the following settings indicate that the MySQL service is deployed locally, with port ‘3306’, user name ‘root’, password ‘123456’, and database name ‘milvus’:

```
db_config:

   backend_url: mysql://root:123456@127.0.0.1:3306/milvus
```

First of all, install MySQL client:

```shell
sudo apt-get install default-mysql-client
```

After Milvus is started, two tables (Tables and TableFiles) will be created in the MySQL service specified by `backend_url`.

Use the following command to connect to MySQL service:

```shell
mysql -h127.0.0.1 -uroot -p123456 -Dmilvus
```

Now, you can use SQL statements to query metadata information:

![mysql](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/mysql.png)

## 相关博客

- [Managing Data in Massive Scale Vector Search Engine](https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f)
- [Milvus Metadata Management (2): Fields in the Metadata Table](https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d)
