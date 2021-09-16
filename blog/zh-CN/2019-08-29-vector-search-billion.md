---
id: 2019-08-29-vector-search-billion.md
title: 如何玩转十亿向量检索（SIFT1B）
author: 陈室余
date: 2019-08-29
desc:

cover:
tag:
---

# 如何轻松玩转十亿向量检索（SIFT1B）

> 作者：陈室余
>
> 日期：2019-08-29

## 开始之前

请阅读以下文章，以了解 Milvus 的基本操作原理：

- [Milvus 快速上手](https://github.com/milvus-io/docs/blob/branch-0.3.1/QuickStart.md)
- [小试牛刀：百万向量搜索 ](2019-08-26-vector-search-million.md)

这次需要用到的服务器大概长这样子：

| 组件         | 最低配置                               |
| ------------ | -------------------------------------- |
| 操作系统     | CentOS 7.6                             |
| CPU          | Intel Xeon E5-2678 v3 @ 2.50GHz x 2    |
| GPU          | NVIDIA GeForce GTX 1080, 8GB GDDR5 x 2 |
| GPU 驱动软件 | CUDA 10.1, Driver 418.74               |
| 内存         | 256 GB                                 |
| 硬盘         | NVMe SSD 2 TB                          |

（实验中约需消耗 140 GB 内存）

## 十亿向量检索

### ANN_SIFT1B 数据集

本文十亿向量来自 [ANN_SIFT1B](http://corpus-texmex.irisa.fr/) ,下载 ANN_SIFT1B 的四个文件。其中 Base set 是基础数据集，有 10 亿个 128 维的向量； Learning set 代表特定参数的学习集； Query set 是 1 万个 128 维的查询向量集； Ground truth 针对不同大小的数据集，使用欧式距离计算穷举得到最相近的 1,000 个向量。

### 数据预处理与数据导入

#### Step 1 数据预处理

Milvus 支持的向量数据为浮点型（小数）的二维数组，故而需要将特征向量转为二维数组，如本文十亿向量来自 [ANN_SIFT1B](http://corpus-texmex.irisa.fr/) ，其 Base set 数据格式为 `bvecs` ，需要将该文件转为 Milvus 支持的浮点型二维数组，主要通过 Python 代码实现：

```bash
x = np.memmap(fname_base, dtype='uint8', mode='r')
d = x[:4].view('int32')[0]
data = x.reshape(-1, d + 4)[:, 4:]
vectors = data.tolist()
# vectors 可直接用于 Milvus 数据导入
```

#### Step 2 数据导入

首先在 Milvus 中创建表，相关参数 `table_name` （表名）、 `dimension` （维度）、 `index_type` （索引类型）。在创建表时指定索引类型， Milvus 会在向量导入时自动建立索引，本文十亿数据建立索引类型为 `IVF_SQ8` ，可以实现数据文件大小压缩， `ANN_SIFT1B` 十亿数据仅需存储空间 140 GB 。

Milvus 通过调用 `add_vectors` 实现向量数据导入，要求导入向量的维度与建表时的维度一致，如 ANN_SIFT1B 的 Base set 是 128 维，将其 100,000 个向量导入 Milvus 耗时 1.5 秒。

```bash
param = {'table_name':'test01', 'dimension':128, 'index_type':IndexType.IVF_SQ8}
# 在 Milvus 中创建表 'test01'
milvus.create_table(param)
# 向 'test01' 中加入预处理后的向量
milvus.add_vectors(table_name='test01', records=vectors)
```

### 数据检索

Milvus 不仅支持批量检索多个向量，还可以指定 `query_ranges` （检索范围），通过参数 `query_records` （查询向量）和 `top_k` ，在 Milvus 中检索 `query_records` 得到与该向量组相似度最高的 `top_k` 个向量，要求 `query_records` 维度必须与所建表的维度一致，其数据类型为浮点型二维数组。

```bash
# 获取 ANN_SIFT1B 的 Query set 得出 query_records
x = np.memmap(fname_query, dtype='uint8', mode='r')
d = x[:4].view('int32')[0]
data = x.reshape(-1, d + 4)[:, 4:]
query_records = data.tolist()

# 指定 top_k 的大小，在 Milvus 中进行查询
milvus.search_vectors(table_name='test01', query_records=query_records, top_k=10, query_ranges=None)
```

#### 准确率查询

本文使用 ANN_SIFT1B 的 Ground truth 来评估查询准确率。其中 `query_records` 为 ANN_SIFT1B 的 Query set 中随机选择的 20 个向量。在 Milvus 中通过修改参数 `nprobe` 可以控制搜索子空间的范围， `nprobe` 参考值 1~16384 ，该值越大准确率越高，但检索时间也越长。下表为改变 `nprobe` 值计算平均准确率的测试结果：

| 平均准确率   | top_k=1 | top_k=10 | top_k=30 | top_k=50 | top_k=100 | top_k=500 |
| ------------ | ------- | -------- | -------- | -------- | --------- | --------- |
| `nprobe`=16  | 95.0%   | 89.5%    | 85.0%    | 89.8%    | 83.0%     | 81.9%     |
| `nprobe`=32  | 90.0%   | 96.0%    | 91.0%    | 92.3%    | 92.0%     | 94.2%     |
| `nprobe`=64  | 95.0%   | 97.0%    | 96.2%    | 94.5%    | 97.4%     | 93.6%     |
| `nprobe`=128 | 95.0%   | 98.0%    | 98.0%    | 98.5%    | 97.6%     | 97.4%     |

其中，

$$ 平均准确率＝\frac{Milvus 查询结果与 Ground truth 一致的向量个数}{query records 的向量个数 \* top_k} $$

#### 性能查询

根据准确率查询结果，选取 `nprobe` = 32 （确保 `top_k`=1/10/30/50/100/500 时准确率 > 90% ）进行性能评估。

通过改变 `query_records` ，当查询向量只有一条时，得到单条向量查询时间。当查询向量个数大于 1 时，计算得出批量查询平均时间。其中，

$$ 单条向量查询平均时间 = \frac {Milvus 批量查询总时间}{query_records 向量个数}$$
经过多次测试实验，在相同环境下，数据规模与查询时间成正比。下表是在不同环境下的性能查询结果：

| 数据规模                                                            | 单条向量查询时间(s) | 批量查询平均时间(s) |
| ------------------------------------------------------------------- | ------------------- | ------------------- |
| [ANN_SIFT 一百万](https://github.com/milvus-io/bootcamp/tree/0.3.1) | 0.0029              | 0.3-1.4             |
| [ANN_SIFT 一亿](https://github.com/milvus-io/bootcamp/tree/0.3.1)   | 0.092               | 0.0078~0.010        |
| ANN_SIFT 十亿                                                       | 1.3~1.5             | 0.03~0.08           |

> **注意**：1. ANN*SIFT1B 一百万测试在 Intel Core i5-8250U CPU * 1 的环境下进行。[查看教程](https://github.com/milvus-io/bootcamp/tree/0.3.1) <br/> 2. ANN*SIFT1B 一亿测试在 Intel Core i7-8700 CPU * 1 的环境下进行。[查看教程](https://github.com/milvus-io/bootcamp/tree/0.3.1) <br/> 3. ANN_SIFT1B 十亿测试在 Intel Xeon E5-2678 v3 \* 2 的环境下进行。

## 总结

在超大数据量下，Milvus 仍具备超高性能，十亿向量查询时单条向量查询时间不高于 1.5 秒，批量查询的平均时间不高于 0.08 秒，在毫秒级检索十亿向量。

从使用角度来看， Milvus 特征向量数据库不需要考虑复杂数据在不同系统间的转换和迁移，只关心向量数据，它支持不同 AI 模型所训练出的特征向量，同时由于采用了 GPU/CPU 异构带来的超高算力，可以在单机实现十亿向量的高性能检索。

如果您想尝试自己动手进行海量向量检索，请访问 [Milvus 在线训练营](https://github.com/milvus-io/bootcamp/tree/0.3.1)，手把手教您如何进行海量向量检索。

Milvus 正在建设开发者社区，如果对 Milvus 的技术讨论和试用感兴趣，欢迎加入我们的 [Slack channel](https://milvusio.slack.com/join/shared_invite/enQtNzY1OTQ0NDI3NjMzLWNmYmM1NmNjOTQ5MGI5NDhhYmRhMGU5M2NhNzhhMDMzY2MzNDdlYjM5ODQ5MmE3ODFlYzU3YjJkNmVlNDQ2ZTk)，进群讨论。
