---
id: 2019-12-27-meta-table.md
title: Milvus 数据管理系列（四）：元数据管理 - 元数据表的字段
author: 莫毅华
---

# Milvus 数据管理系列（四）：元数据管理 - 元数据表的字段

> 作者：莫毅华
>
> 日期：2019-12-27

## Tables 表的字段

我们以 SQLite 为例。下图显示的打印结果是 0.5.0 版本的示例。0.6.0 版本比 0.5.0 多了几个字段，后面再介绍。这个 Tables 里有一行记录，表示有一张向量表，它的表名叫 table_1，是 512 维度的，建表时设置的index_file_size 是1024 MB，索引类型（engine_type）是 1（FLAT），nlist 是 16384，metric_type 是 1（欧氏距离L2）。另外还有字段 id 是该表的内部唯一标识，state 是表的状态 0（正常），created_on 是创建的时间，flag 是给内部使用预留的标志位信息。

![tables](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables.png)

Tables 的各个字段类型及其简介如下表所示：

| 字段名称          | 字段类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `id`              | int64    | 向量表的内部唯一标识，这是一个自增 id                        |
| `table_id`        | string   | 向量表的名字，必须由用户定义，遵循 linux 的文件命名规范      |
| `state`           | int32    | 向量表的状态，0 代表正常，1 代表删除（指的是软删除）         |
| `dimension`       | int16    | 向量表的向量维度，必须由用户定义                             |
| `created_on`      | int64    | 向量表的创建时间，是从1970年1月1日开始到建表时的微秒数       |
| `flag`            | int64    | 内部使用的标志位，比如向量表的向量 id 是否是由用户提供，默认值为 0 |
| `index_file_size` | int64    | 向量数据文件达到一定大小之后就不会再被合并，并且可以被用来建立索引，默认值是 1024（MB） |
| `engine_type`     | int32    | 对该向量表建立索引时的目标索引类型，默认值 0 代表无效索引，1 代表FLAT，2 代表IVFLAT，3 代表IVFSQ8, 4 代表NSG，5 代表IVFSQ8H |
| `nlist`           | int32    | 建立索引时，每个数据文件里的向量被分为多少个’簇‘，默认值为 16384 |
| `metric_type`     | int32    | 计算向量距离的方式，1 是欧氏距离（L2），2 代表内积（inner product） |

在 0.6.0 版本里我们增加了分区功能，因此多了几个字段，如下图所示。这里我们看到多了 owner_table，partition_tag 和 version 几个字段。这个示例里面有一张向量表，表名叫 table_1，它有一个分区叫 table_1_p1。可以看到分区在内部实际上是以一张向量表的形式存在的，partition_name 实际上对应于 table_id，分区表的参数都继承自它的母表，owner_table 字段记录了母表的名字，partition_tag 则是分区表的标签（tag）。

![tables_new](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tables_new.png)

0.6.0 新增的几个字段类型及简介如下表所示：

| 字段名称        | 字段类型 | 描述                                |
| :-------------- | :------- | :---------------------------------- |
| `owner_table`   | string   | 分区表的母表名                      |
| `partition_tag` | string   | 分区表的标签（tag），不能是空字符串 |
| `version`       | string   | 储存 Milvus 的版本号，暂时没啥用    |

## TableFiles 表的字段

下面这个例子里有两个文件，它们都属于 table_1 向量表。第一个文件的索引类型（engine_type）是1（FLAT），文件状态（file_type）是 7（备份文件），文件大小是 411200113 字节，向量行数是 20 万条。第二个文件除了索引类型是 2（IVFLAT），文件状态为 3（索引文件），它实际上是第一个文件的索引，后面我们会介绍。

![tablefiles](https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/metadata/tablefiles.png)

TableFiles的各个字段类型及其简介如下表所示：

| 字段名称       | 字段类型 | 描述                                                         |
| :------------- | :------- | :----------------------------------------------------------- |
| `id`           | int64    | 数据文件的内部唯一标识，这个一个自增 id                      |
| `table_id`     | string   | 所属的向量表名称                                             |
| `engine_type`  | int32    | 该文件的索引类型，1 代表 FLAT，2 代表 IVFLAT，3 代表 IVFSQ8, 4 代表 NSG，5 代表 IVFSQ8H |
| `file_id`      | string   | 由创建时间生成的文件名，从1970年1月1日开始到建表时的微秒数再乘以1000 |
| `file_type`    | int32    | 文件状态，0 代表新生成的原始向量文件，1 代表原始向量数据文件，2 代表这个文件将要被建立索引，3 代表这是一个索引文件，4 代表这个文件将要被删除（软删除），5 是新生成的准备用来存放合并数据的文件， 6 是新生成的准备用来存放索引数据的文件，7 是原始向量数据文件的备份状态 |
| `file_size`    | int64    | 文件的字节数                                                 |
| `row_count`    | int64    | 文件所存储的向量条数                                         |
| `updated_time` | int64    | 文件的最近更新时间戳，从1970年1月1日开始到建表时的微秒数     |
| `created_on`   | int64    | 文件的创建时间，从1970年1月1日开始到建表时的微秒数           |
| `date`         | int32    | 文件的创建日期，和上面那条有重复，这是历史原因遗留的，后面版本会把它去掉 |

## 相关博客

- [Milvus 数据管理系列（一）：数据管理策略](2019-11-08-data-management.md)
- [Milvus 数据管理系列（二）：数据文件清理机制的改进](2019-12-18-datafile-cleanup.md)
- [Milvus 数据管理系列（三）：怎样查看元数据](2019-12-24-view-metadata.md)

