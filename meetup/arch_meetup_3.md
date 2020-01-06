---
id: meetup_no.3.md
title: 【Arch Meetup No.3 Recap:】ZILLIZ & PingCAP Meetup
author: 顾钧
---

# 【Arch Meetup No.3 Recap:】Milvus 向量搜索引擎简介

日期：2019-12-21

主讲人：顾钧、冯立元

### Topic 1：Milvus 向量搜索引擎简介

![JinHai](https://raw.githubusercontent.com/milvus-io/community/master/meetup/assets/meetup3/GuJun.jpg)

> 讲师介绍：顾钧，ZILLIZ 首席架构师。

- [视频 | Arch Meetup No.3: Milvus 向量搜索引擎简介](https://www.bilibili.com/video/av80630550)

本次的分享会，顾钧介绍了开源向量搜索引擎 Milvus 的设计背景和整体架构，包括：

- Milvus 的设计背景，向量数据的运算、管理与一般数值型数据的查避；
- Milvus 向量搜索引擎的整体架构设计；
- Milvus 提供的索引类型，及其技术、性能特点；
- Milvus 目前在非结构化数据分析处理（CV、NLP等）领域的典型使用场景。

### Topic 2：TiDB 向量化执行引擎近期成果

![YangJie](https://raw.githubusercontent.com/milvus-io/community/master/meetup/assets/meetup3/FengLiyuan.jpg)

> 讲师介绍：冯立元，PingCAP TiDB 研发工程师

本次 talk 主要介绍了 TiDB 向量化的成果和最近的工作，内容主要有：

- 火山模型的背景和优点；
- 向量化执行器是如何实现，以及和传统火山模型的对比优势；
- 如何构建向量化 hash join 和社区正在参与的事项：
  - 向量化 Hash Join
  - 向量化 Stream Aggregation
  - 向量化表达式计算
  - 未来社区可以参与的工作