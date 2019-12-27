---
id: meetup_no.2.md
title: 【Arch Meetup No.2 Recap:】Milvus 总体架构 & Milvus 在云从的深度实践
author: 金海，杨杰
---

# 【Arch Meetup No.2 Recap:】Milvus 总体架构 & Milvus 在云从的深度实践

日期：2019-12-07

主讲人：金海，杨杰

### Topic 1：Milvus 总体架构

![JinHai](https://raw.githubusercontent.com/milvus-io/community/master/meetup/assets/meetup2/JinHai.jpg)

> 讲师介绍：金海，Milvus 项目负责人，ZILLIZ 产品研发总监。

- [视频 | Arch Meetup No.2: Milvus 的总体架构](https://www.bilibili.com/video/av79955956/)
- [PPT 链接](https://github.com/milvus-io/community/blob/master/meetup/slides/arch-meetup-2-金海-Milvus异构加速向量搜索.pdf)

本次的分享会，金海主要就以下方面对 Milvus 项目进行了介绍:

- 首先介绍了 Milvus 项目的由来，团队如何在 POC 过程中发现传统的数据库搜索已经不适用与非结构化数据的搜索场景，进而产生了研发一款针对海量非结构化数据的搜索引擎 Milvus 的想法。
- 非结构化数据搜索原理，以及目前工业界主流的向量搜索算法库；
- Milvus 的整体架构，包括计算搜索、查询调度、数据存储、元数据管理等组件；
- v0.6.0 新功能以及对 IVFSQ8H 索引的实现原理和性能优势。

### Topic 2：Milvus 在云从的深度实践

![YangJie](https://raw.githubusercontent.com/milvus-io/community/master/meetup/assets/meetup2/YangJie.jpg)

> 讲师介绍：杨杰，云从科技中台产品中心技术总监。

- [PPT 链接](https://github.com/milvus-io/community/blob/master/meetup/slides/arch-meetup-2-杨杰-Milvus与云从一人一档产品.pdf)

杨杰分享的主题是《Milvus 与云从一人一档产品》，主要内容包括 Milvus 在智慧城市类场景的深度实践，从而帮助云从拓展技术边界，加深产品厚度，提升研发效率。

在活动现场，杨杰强调一人一档聚类服务，是云从针对海量高维数据聚类任务，为满足雪亮工程以及公安“一人一档”新技战法等需求所研发的产品，并展示了基于 Milvus 聚类方案的实现。包括如何先将千万级人脸图片提取为特征向量，再将转化好的特征向量导入 Milvus 表中，最后通过 Milvus 批量查询功能，快速得到与要查询的 N 张人脸图片最相似的 Top-K 个人脸。