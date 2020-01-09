---
id: 2020-1-9-milvus-meta.md
title: Milvus 数据管理系列（五）：如何通过元数据管理数据文件
author: 莫毅华
---

# Milvus 数据管理系列（五）：如何通过元数据管理数据文件

> 作者：莫毅华
>
> 日期：2020-1-9



通过上面的介绍我们了解了 Milvus 的元数据里有些什么信息，现在我们来看这些信息是怎样被使用的。我们仍以 SQLite 为例。

## （1）创建向量表

我们用 Python 客户端创建一张表：

```python
milvus.create_table({    
    'table_name': 'table_1',    
    'dimension': 512,    
    'index_file_size': 1000,    
    'metric_type': MetricType.L2})
```

Milvus 立即会在 Tables 里增加一行记录，dimension 为512，index_file_size 为1048576000字节（1000乘1024再乘1024），metric_type 为1（欧氏距离 L2）。而 TableFiles 里仍然是空的。

```sql
INSERT INTO Tables VALUES(1, 'table_1', 0, 512, 1576306272821064, 2, 1048576000, 1, 16384, 1, , , '0.6.0')
```

用 SQLite 客户端去查看 Tables 的信息,这时我们看到这张表的 engine_type 和 nlist 都是默认值：

![tablesqlite](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/table_sqlite.png)

## （2）插入向量

之后我们插入一些向量到这张表里：

```python
milvus.insert(table_name='table_1', records=vec_list, ids=vec_ids)
```

假设我们分批每次1万条向量插入，总共插入了100万条512维的向量，如果在插入过程中去查看 TableFiles 里的信息的话，你会看到 TableFiles 里面不断有新条目生成并且不断地删除一部分旧条目，这是因为合并文件的线程在不断地把小文件合并成大文件，并删除小文件。

当100万条向量插入完成后你再去查询 TableFiles，大致会看到最终有两个文件留下：

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/table_files.png)

从 row_count 字段可以看到，第一个文件有53万条向量，另一个有47万条向量，这是因为在合并文件过程中第一个文件被合并到超过1048576000字节后就不再参与合并（我们可以看到它的大小是1089680113字节）。剩下的向量则被合并到第二个文件里，最终达到966320113字节，还没达到 index_file_size 的大小，这意味着如果还有向量进来的话，这个文件仍会被拿来和其他小文件做合并。

Milvus 内部对 TableFiles 的操作也都是通过 SQL 完成，主要借助两种语句：

```sql
INSERT INTO TableFiles VALUES(...);
DELETE FROM TableFiles WHERE ...;
```

在 Milvus 的数据目录里面你也能找到这两个文件，我这里设的数据目录是 /tmp/milvus，每个向量表都有独立的目录，这两个文件就在 /tmp/milvus/db/tables/table_1 下面：

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tmp_milvus.png)

## （3）查询向量条数

客户端通过 count_table 来获得这个表有多少条向量：

```python
milvus.count_table(table_name='table_1')
```

Milvus 内部会执行一条 SQL 查询：

```sql
SELECT SUM(row_count) FROM TableFiles where table_id = 'table_1' AND file_type IN (1, 2, 3);
```

学过 SQL 的应该很容易看出来这条语句的意思，它是把 TableFiles 里所有符合条件记录的 row_count 字段的值相加，得出这个表总共有多少条向量。要符合什么条件呢？首先表名要是 ”table_1“；其次只统计文件状态为1，2，3的条目，也就是说，只统计原始向量文件，将要建立索引的文件，建立好索引的文件。如果有文件状态为4（软删除状态）或者7（备份状态）的，是不参与统计的。

## （4）搜索向量

客户端通过 search 来搜索向量：

```python
milvus.search(table_name='table_1', query_records=query_vectors, top_k=100, nprobe=32)
```

Mlvus内部执行一条SQL语句来获得需要被检索的文件：

```sql
SELECT * FROM TableFiles WHERE table_id = 'table_1' AND file_type IN (1, 2, 3);
```

这样就获得了所有需要被检索的文件信息，同样，只有文件状态为1，2，3的文件会被拿来检索。接着 Milvus 会通过文件的 file_id 找到它们所在的路径，之后查询调度器会把这些文件逐个加载进内存或者显存计算。

## （5）建立索引

客户端通过 create_index 来建立索引，下面这个调用是建立一个 SQ8 索引，我们指定 nlist 为5000：

```python
milvus.create_index(table_name='table_1', {'index_type': IndexType.IVF_SQ8, 'nlist': 5000})
```

如果我们这时去查看这张表的信息，就会看到有所变化：

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/index_1.png)

该表的目标索引类型以及 nlist 都相应做了改变，这是 Milvus 在内部执行了 SQL 的 UPDATE 操作：

```sql
UPDATE Tables SET engine_type = 3, nlist = 5000 WHERE table_id = 'table_1';
```

接着，Milvus 把属于该表的能够检索引的文件状态置为2（将要被建立索引），也是通过 SQL 操作：

```sql
UPDATE TableFiles SET file_type = 2 WHERE table_id = 'table_1' AND file_type = 1;
```

这时，客户端的 create_index 调用仍然在等待，一直等到全部文件建立索引完成。Milvus 里会不断地检查是否有新的原始向量文件生成，如果有，则立刻把它们的 file_type 置为2（将要建立索引）。而调度器会为 file_type 为2的文件建立任务，逐个建立索引。直到所有文件都建立了索引，客户端调用才会真正返回。

当索引建立完成后，会有新的索引文件生成，而之前的原始向量文件则会被标记为备份状态（file_type 置为7），这是为了之后能够切换成别的索引类型。

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/index_2.png)

上图我们看到多了两个文件，它们的 row_count 对应于之前的两个原始向量文件，而它们的 file_size 比之前两个文件都小很多，这是因为 SQ8 这种索引类型对数据做了简化，所需要的存储空间变少了。从 engine_type 和 file_type 我们可以看出这两组文件的区别。

## （6）删除索引

客户端通过drop_index来删除索引：

```python
milvus.drop_index(table_name='table_1')
```

在 Milvus 内部，删除索引操作要做几件事，先是把向量表的索引类型切换回1（FLAT），然后把索引文件的 file_type 置为4（软删除），同时把备份文件的 file_type 切换为1（原始向量文件）：

```sql
UPDATE Tables SET engine_type = 1 WHERE table_id = 'table_1';

UPDATE TableFiles SET file_type = 4 WHERE table_id = 'table_1' AND file_type = 3;

UPDATE TableFiles SET file_type = 1 WHERE table_id = 'table_1' AND file_type = 7;
```

负责清理数据的线程会拿到需要被删除的文件信息，然后找到文件位置将其从磁盘上真正删除，接着索引文件的条目也会从TableFiles中移除。

```sql
DELETE FROM TableFiles WHERE table_id = 'table_1' AND file_type = 4;
```

## （7）删除向量表

客户端通过 drop_table 来删除向量表：

```python
milvus.drop_table(table_name='table_1')
```

Milvus 内部会把向量表的 state 置为1（软删除），然后把该表的所有文件的 file_type 置为4（软删除）：

```sql
UPDATE Tables SET state = 1 WHERE table_id = 'table_1';
UPDATE TableFiles SET file_type = 4 WHERE table_id = 'table_1' ;
```

负责清理数据的线程会拿到需要被删除的文件信息，然后找到文件位置将其从磁盘上真正删除，接着这些文件的条目也会从 TableFiles 中移除，向量表条目从 tables 中移除。

```sql
DELETE FROM TableFiles WHERE table_id = 'table_1' AND file_type = 4;
DELETE FROM Tables WHERE state = 1;
```

## 总结

通过以上介绍，应该不难看出 Milvus 使用元数据的套路：修改某些条目的状态，根据条目信息做相应的操作（检索引，删除）。具体的实现上有一些技巧，比如需要借助 OLTP 数据库的事务机制来避免某些问题，中途出错时需要把操作回退等等。Milvus 内部定义了元数据管理的接口，其实不光是 SQL 数据库，我们甚至可以用 NoSQL 数据库来管理 Milvus 的元数据。

## 相关博客

- [Milvus 数据管理系列（一）：数据管理策略](2019-11-08-data-management.md)
- [Milvus 数据管理系列（二）：数据文件清理机制的改进](2019-12-18-datafile-cleanup.md)
- [Milvus 数据管理系列（三）：怎样查看元数据](2019-12-24-view-metadata.md)

- [Milvus 数据管理系列（四）：元数据表的字段](2019-12-27-meta-table.md)
