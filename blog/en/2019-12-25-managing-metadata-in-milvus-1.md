---
id: managing-metadata-in-milvus-1.md
title: Milvus Metadata Management (1)
author: milvus
date: 2019-12-25 19:21:42.469+00
desc: How to View Metadata
cover: assets.zilliz.com/header_c2eb459468.jpg
tag: Engineering
origin: zilliz.com/blog/managing-metadata-in-milvus-1
---
  
# Milvus Metadata Management (1)
We introduced some information about metadata in [Managing Data in Massive-Scale Vector Search Engine](https://medium.com/@milvusio/managing-data-in-massive-scale-vector-search-engine-db2e8941ce2f). This article mainly shows how to view the metadata of Milvus.

Milvus supports metadata storage in SQLite or MySQL. There’s a parameter <code>backend_url</code> (in the configuration file <code>server_config.yaml</code>) by which you can specify if to use SQLite or MySQL to manage your metadata.

## SQLite

If SQLite is used, a <code>meta.sqlite</code> file will be generated in the data directory (defined in the <code>primary_path</code> of the configuration file <code>server_config.yaml</code>) after Milvus is started. To view the file, you only need to install a SQLite client.

Install SQLite3 from the command line:

    sudo apt-get install sqlite3

Then enter the Milvus data directory, and open the meta file using SQLite3:

    sqlite3 meta.sqlite

Now, you’ve already entered the SQLite client command line. Just use a few commands to see what is in the metadata.

To make the printed results typeset easier for humans to read:

    . mode column
    . header on

To query Tables and TableFiles using SQL statements (case-insensitive):

    SELECT * FROM Tables
    SELECT * FROM TableFiles

![1-use-sql-lite.png](https://assets.zilliz.com/1_use_sql_lite_2418fc1787.png "Use SQLite3 to view metadata.")

## MySQL

If you are using MySQL, you need to specify the address of the MySQL service in the <code>backend_url</code> of the configuration file <code>server_config.yaml</code>.

For example, the following settings indicate that the MySQL service is deployed locally, with port ‘3306’, user name ‘root’, password ‘123456’, and database name ‘milvus’:

    db_config:
     backend_url: mysql://root:123456@127.0.0.1:3306/milvus

First of all, install MySQL client:

sudo apt-get install default-mysql-client

After Milvus is started, two tables (Tables and TableFiles) will be created in the MySQL service specified by <code>backend_url</code>.

Use the following command to connect to MySQL service:

    mysql -h127.0.0.1 -uroot -p123456 -Dmilvus

Now, you can use SQL statements to query metadata information:

![2-my-sql-view-meta-data.png](https://assets.zilliz.com/2_my_sql_view_meta_data_c871735349.png "Use MySQL to view metadata")

## What’s coming next

Next articles will introduce in details the schema of metadata tables. Stay tuned!

Any questions, welcome to join our [Slack channel](https://join.slack.com/t/milvusio/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk) or file an issue in the repo.

GitHub repo: https://github.com/milvus-io/milvus

If you like this article or find it useful, don’t forget to clap!



  