# Open Source Promotion Plan Summer 2020

# “开源软件供应链点亮计划——暑期2020”任务清单“

## 项目简介

今年，中科院软件所与华为 openEuler 项目共同举办了 [“开源软件供应链点亮计划——暑期2020”](https://isrc.iscas.ac.cn/summer2020/) 项目。该项目与 Google Summer of Code 形式类似：开源社区提供项目需求并提供导师（mentor），在校学生利用暑期时间进行开发，主办方为顺利完成的项目提供一定额度的奖金。无论 GSoC 还是这次的“点亮计划”，都是一种非常好的开源实践范式，能够有效地增进高校学生对开源的理解、增加与真实社区的接触，并积累宝贵的经验。

Milvus 作为社区加入这一计划，提供若干项目需求。**欢迎对代码有热情、对大数据项目有高度兴趣的同学一同参加，也欢迎小伙伴们在截止日期（5.29）前提出更多需求**。Milvus 社区愿意和大家一起，为国内的开源生态添砖加瓦。

*感谢上方来自 [TUNA](https://tuna.moe/blog/2020/ospp-summer-2020/) 的文案*



###使用ETCD作为Milvus元数据后端

项目描述：Milvus是一款开源的特征向量搜索引擎。其存储系统使用元数据对数据文件进行统一管理，目前元数据的后台只能选用SQlite或者MySQL，需要支持更多的元数据后台。请实现一套元数据接口以支持ETCD作为元数据后台。

项目难度：中

项目社区导师：莫毅华

导师联系方式： yihua.mo@zilliz.com

项目产出要求：

- 使用 C++ 实现Milvus的元数据接口

- 和原先的元数据后台做性能对比，测试并整理ETCD后台在性能和效果方面的差异

- 完善的功能测试

- 更新用户手册

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发

- 熟悉 C++

- 逻辑思维严密

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus
- https://github.com/etcd-io/etcd



###Milvus 数据备份恢复工具

项目描述：Milvus是一款开源的特征向量搜索引擎。目前正在开发0.10.0版本。由于某些版本间数据无法兼容，需要开发一套数据备份恢复工具和数据迁移工具，将旧版本数据导出备份，能够将备份数据恢复，且能够转换兼容不同版本Milvus。

项目难度：高

项目社区导师：莫毅华

导师联系方式： yihua.mo@zilliz.com

项目产出要求：

- 完成数据的备份、恢复和迁移工作

- 保证工具对各个版本的旧数据有效

- 完善的功能测试
- 提供使用手册

项目技术要求：

- 熟悉 Linux 开发环境

- Python
- 能使用 Git 进行协作开发

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus
- https://github.com/milvus-io/pymilvus



##Milvus CLI 开发

项目描述：开发一个在命令行可以查询和管理Milvus的工具。使用这个工具可以测试Milvus实例的服务状态，可以列出实例上的所有Collection以及每个Collection的一些统计信息等，另外这个工具还可以在运行时修改Milvus的一些系统参数，例如auto_flush_interval等。工具需要交互友好，命令支持模糊自动补全。本项目需要使用Python开发。

项目难度：高

项目社区导师：邹英豪

导师联系方式：yinghao.zou@zilliz.com

项目产出要求：

- 清晰的设计，pythonic的代码
- 完善的功能测试

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus

- https://github.com/milvus-io/pymilvus



### S3 存储支持

项目描述：S3是Simple Storage Service的缩写，即简单存储服务。它是由亚马逊提出的一套云存储服务接口，现在几乎所有的云服务都兼容S3。本项目目标是实现一个兼容S3存储的Codec，使得Milvus能够将结构化数据和非结构化数据存入兼容S3的云端存储，如 MinIO。

项目难度：中

项目社区导师：蔡宇东

导师联系方式：yudong.cai@zilliz.com

项目产出要求：

- 在CMake中的S3 SDK依赖集成
- 基于 S3 接口实现文件读写／目录增删等操作
- Milvus 中的向量数据文件／索引文件／deleted_docs文件实现S3存储
- 配置文件中添加相关配置选项
- 编写相关测试用例

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发

- C++
- Make

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus

- https://github.com/minio/minio
- https://github.com/aws/aws-sdk-cpp



###HDFS存储支持

项目描述：HDFS是基于流数据模式访问和处理超大文件的需求而开发的分布式文件系统，是分布式计算中数据存储管理的基础，为超大数据集（Large Data Set）的应用处理带来了很多便利。本项目目标是实现一个基于HDFS存储格式的Codec，使得Milvus能够使用HDFS格式来存储结构化数据和非结构化数据。

项目难度：中

项目社区导师：余昆

导师联系方式：kun.yu@zilliz.com

项目产出要求：

- 在CMake中的HDFS依赖集成
- 实现HDFS存储的Codec代码
- 结构化数据和非结构化数据存储方式的配置接口
- 使用HDFS存储方式的Milvus通过所有功能和稳定性测试

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发
- CMake使用
- C++编程
- HDFS分布式文件系统

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus
- https://github.com/apache/hadoop-hdfs



###Parquet存储支持

项目描述：Parquet是Hadoop生态系统中任何项目均可使用的列式存储格式，与数据处理框架、数据模型或者编程语言无关。本项目目标是实现一个基于Parquet存储格式的Codec，使得Milvus能够使用Parquet格式来存储结构化数据。

项目难度：中

项目社区导师：王翔宇

导师联系方式：xy.wang@zilliz.com

项目产出要求：

- 在CMake中的Parquet依赖集成方案
- 实现Parquet存储的Codec代码
- 结构化数据存储方式的配置接口
- 使用Parquet存储方式的Milvus通过所有功能、稳定性测试

项目技术要求：

- 熟悉 Linux 开发环境
- CMake使用
- C++开发

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus
- https://github.com/apache/arrow



### Milvus中的新聚类算法实现

项目描述：Milvus是一款开源的特征向量搜索引擎。聚类是一种常见的数据分类方法，在索引中有着重要的应用。Milvus目前使用k-means来实现聚类。请为它添加更多的聚类算法并添加相应的选择开关。

项目难度：中

项目社区导师：李盛俊

导师联系方式： shengjun.li@zilliz.com

合作导师联系方式（选填）：许笑海 xiaohai.xu@zilliz.com

项目产出要求：

- 使用 C++ 在k-means基础上实现k-means++，bisecting k-means
- 和原先k-means相比，测试并整理k-means++，bisecting k-means在性能和效果方面的差异
- 实现k-means算法的扩展k-mode算法，并应用在Binary数据上
- 增加参数，让用户可以选择聚类算法

项目技术要求：

- 熟悉 Linux 开发环境

- 能使用 Git 进行协作开发
- 熟悉 C++
- 热爱算法与数据结构

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus

 

### Milvus提供更多的索引类型

项目描述：Milvus是一款开源的特征向量搜索引擎。目前已经实现了基于空间分类的、基于图的等多种索引类型。请为其再添加一种基于Hash的索引方式。

项目难度：中

项目社区导师：李成明

导师联系方式： chengming.li@zilliz.com

合作导师联系方式（选填）：李盛俊 shengjun.li@zilliz.com

项目产出要求：

- 为Milvus接入开源库FALCONN，

- 用C++实现接口封装，完成端到端的功能实现

- 测试在不同数据规模下，该索引的性能和召回率，并完成测试报告

- 修改用户手册

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发

- 熟悉 C++

- 热爱算法与数据结构

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus
- https://github.com/FALCONN-LIB/FALCONN

###  

### Flat索引支持运行时指定距离类型

项目描述：Milvus是一款开源的特征向量搜索引擎。不过目前尚不支持一份数据的多种距离计算，从而导致了某些场景的使用不便。请为其中的Flat索引支持计算时再指定距离类型的功能。

项目难度：低

项目社区导师：李盛俊

导师联系方式： shengjun.li@zilliz.com

合作导师联系方式（选填）：王翔宇 xiangyu.wang@zilliz.com

项目产出要求：

- 修改Query接口添加可选参数metric_type，完成端到端的功能实现
- 添加单元测试保证代码正确性
- 修改用户手册

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发

- 熟悉 C++

相关的开源软件仓库列表：

- https://github.com/milvus-io/milvus



###GPU 显存使用优化

项目描述：
FAISS IVF GPU 算法运行时所需要的显存与 NQ／nprobe 成正比，但 GPU 上的显存有限，因此当 NQ／nprobe 很大时，会出现 Out Of Memory。
本项目的目的是优化该算法，减小 GPU 显存使用量。

项目难度：高

项目社区导师：王翔宇

导师联系方式：xy.wang@zilliz.com

项目产出要求：

- 优化 FAISS IVF GPU 算法，减小 GPU 显存使用量
- 使用 nvprof 验证 GPU 显存使用符合预期

项目技术要求：

- 熟悉 Linux 开发环境
- 能使用 Git 进行协作开发

- CUDA
- C++

相关的开源软件仓库列表：

- https://github.com/facebookresearch/faiss
