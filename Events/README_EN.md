# Open Source Promotion Plan Summer 2020



## Summary



This year, the Institute of Software of the Chinese Academy of Sciences and the Huawei openEuler project will co-sponsor the initiative of ["Open Source Promotion Plan Summer 2020"] (https://isrc.iscas.ac.cn/summer2020/). Similar to Google's Summer of Code (GSoC), this plan publishes assignments as well as the corresponding mentor information in the open source community, and provides a certain amount of bonus for those college students who have successfully completed one of the assignments during summer holidays. Such initiatives make a perfect touchstone in the way of facilitating understanding of open source and increasing interaction with the community.

Milvus community will take part and publish the requirements of several assignments. ** Students who are passionate about coding and interested in big data projects are welcome to join. For those who plan to publish more assignments, please note that the deadline is May 29.** The Milvus community is willing to work with everyone to contribute to the domestic open source ecosystem.



### Milvus  Data Backup and Recovery Tool

Project description: Milvus is an open source feature vector search engine. Version 0.10.0 is currently under development. Because data between certain versions are incompatible with each other, you are required to develop a tool set for data backup, recovery, and migration, which can export data of an old version and recover it in a way compatible with a specified Milvus version. 

Difficulty level: High

Mentor: Yihua Mo

Email address:  yihua.mo@zilliz.com

Deliveries: 

- A tool for data backup, recovery, and migration. 

- Compatible with the data retrieved from earlier versions.

- A comprehensive set of functional tests.
- A user manual.

Technical requirements: 

- Familiar with Linux development environment.

- Proficient in Python.
- Using Git for collaborative development.

Repositories: 

- https://github.com/milvus-io/milvus
- https://github.com/milvus-io/pymilvus



### Milvus CLI Development Tool

You are required to develop a command line tool for querying and managing Milvus. You can use it to do the following: 

- Test the status of the Milvus instance.

- List all Collections on the instance and show statistics of each Collection.

- Modify system parameters of Milvus, such as `auto_flush_interval`,  at runtime.

The tool needs to be user-friendly and support fuzzy command auto-completion. 

Difficulty level: High

Mentor: Yinghao Zou

Email address: yinghao.zou@zilliz.com

Deliveries: 

- Code implementation in Python.
- A comprehensive set of functional tests.

Repositories: 

- https://github.com/milvus-io/milvus

- https://github.com/milvus-io/pymilvus



### S3 Storage Support

Project description: S3 is short for Simple Storage Service. It refers to a set of cloud storage service interfaces proposed by Amazon, and now almost all cloud services are compatible with S3. You are required to implement a Codec compatible with S3 storage so that Milvus can store structured and unstructured data in S3-compatible cloud storage, such as MinIO.

Difficulty level: Medium

Mentor: Yudong Cai

Email address: yudong.cai@zilliz.com

Deliveries: 

- Integration of S3 SDK dependencies in CMake
- File operations based on the S3 interfaces, such as reading or writing a file, or creating or deleting a directory.
- An implementation of S3 storage for vector data files, index files, and deleted_docs files from Milvus.
- Configurations for structured and unstructured data storage.
- A comprehensive set of functional and stability tests.

Technical requirements: 

- Familiar with Linux development environment.
- Using Git for collaborative development.

- C++.
- CMake

Repositories: 

- https://github.com/milvus-io/milvus

- https://github.com/minio/minio
- https://github.com/aws/aws-sdk-cpp



### HDFS Storage Support

Project description: HDFS is a distributed file system based on the needs for accessing super-large files in streaming data mode. It is the foundation of data storage management in distributed computing, which brings a lot of convenience to the processing of large data sets. You are required to implement a Codec compatible with HDFS storage so that Milvus can store structured and unstructured data in HDFS format.

Difficulty level: Medium

Mentor: Kun Yu

Email address: kun.yu@zilliz.com

Deliveries: 

- Integration of HDFS dependencies in CMake.
- Codec codes for HDFS storage.
- Configuration interfaces for structured and unstructured data storage.
- A comprehensive set of functional and stable tests.

Technical requirements: 

- Familiar with Linux development environment
- Using Git for collaborative development
- C++
- CMake

Repositories: 

- https://github.com/milvus-io/milvus
- https://github.com/apache/hadoop-hdfs



### Parquet Storage Support

Project description: Parquet is a columnar storage format that can be used by any project in the Hadoop ecosystem, regardless of data processing frameworks, data models, or programming languages. You are required to implement a Codec compatible with Parquet storage so that Milvus can store structured and unstructured data in Parquet format.

Difficulty level: Medium

Mentor: Xiangyu Wang

Email address: xy.wang@zilliz.com

Deliveries: 

- Integration of Parquet dependencies in CMake.
- Codec codes for Parquet storage.
- Interfaces configuring storage for structured and unstructured data.
- A comprehensive set of functional and stable tests.

Technical requirements: 

- Familiar with Linux development environment
- CMake
- C++

Repositories: 

- https://github.com/milvus-io/milvus
- https://github.com/apache/arrow



### Implementing a new clustering algorithm in Milvus

Project description: Milvus is an open source feature vector search engine. Clustering is a common data classification method that has important applications in indexing. Currently, Milvus uses k-means to implement clustering. Please add more clustering algorithms to it and add corresponding selection switches.

Difficulty level: Medium

Mentor: Shengjun Li, Xiaohai Xu

Email address: shengjun.li@zilliz.com, xiaohai.xu@zilliz.com

Deliveries: 

- Implementation of k-means ++ on the basis of k-means, bisecting k-means via C ++.
- Comparative test of the difference between k-means ++, bisecting k-means and the original k-means in performance and effect.
- Implementation of the extended k-mode algorithm of k-means algorithm and its appliance to binary data.
- Adding parameters to allow users to choose clustering algorithms.

Repositories: 

- https://github.com/milvus-io/milvus

 

### Implementation of more index types for Milvus

Project description: Milvus is an open source feature vector search engine. Currently, a variety of index types based on spatial classification and graph have been implemented. Please add another index method based on Hash.

Difficulty level: Medium

Mentor: Chengming Li, Shengjun Li

Email address: chengming.li@zilliz.com, shengjun.li@zilliz.com

Deliveries: 

- Access to the open source library FALCONN for Milvus.
- Interface encapsulation via C ++ to implement the end-to-end functions.
- Test of the recall rate and performance of the index under different data scales.
- A user manual.

Technical requirements: 

- Familiar with Linux development environment. 
- Using Git for collaborative development
- Familiar with C++
- Passionate about algorithms and data structures

Repositories: 

- https://github.com/milvus-io/milvus
- https://github.com/FALCONN-LIB/FALCONN

###  

### Specifying distance type at runtime for Flat index

Project description: Milvus is an open source feature vector search engine. However, currently there is no support for multiple distance calculations for a piece of data, which results in inconvenience in certain scenarios. Please add support for specifying distance type at runtime for Flat index.

Difficulty level: Low

Mentor: Shengjun Li, Xiangyu Wang

Email address: shengjun.li@zilliz.com, xiangyu.wang@zilliz.com

Deliveries: 

- A modified Query interface to add the optional parameter metric_type and implement end-to-end functions.
- Unit tests to ensure code correctness.
- An user manual with a description of the new features.

Technical requirements: 

- Familiar with Linux development environment.
- Using Git for collaborative development.
- Proficient in C++

Repositories: 

- https://github.com/milvus-io/milvus



### Optimizing GPU memory usage

Project description: 
The GPU memory required for the FAISS IVF GPU algorithm during run time is proportional to NQ / nprobe. Yet the GPU memory is limited, so a computer may run out of memory when NQ / nprobe is large. The project aims at optimizing the algorithm and reduce the amount of GPU memory used.

Difficulty level: High

Mentor: Xiangyu Wang

Email address: xy.wang@zilliz.com

Deliveries: 

- Optimized FAISS IVF GPU algorithm.
- Using nvprof to verify if GPU memory usage meets expectation.

Technical requirements: 

- Familiar with Linux development environment.
- Using Git for collaborative development.
- CUDA.
- C++

Repositories: 

- https://github.com/facebookresearch/faiss
