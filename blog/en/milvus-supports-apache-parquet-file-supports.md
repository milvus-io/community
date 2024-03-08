---
id: milvus-supports-apache-parquet-file-supports.md
title: Milvus Supports Imports of Apache Parquet Files for Enhanced Data Processing Efficiency
author: Cai Zhang, Fendy Feng
date: 2024-3-8
desc: By embracing Apache Parquet, users can streamline their data import processes and enjoy substantial storage and computation cost savings.
metaTitle: Milvus Supports Imports of Apache Parquet Files
cover: assets.zilliz.com/Milvus_Supports_the_Imports_of_Parquet_Files_3288e755b8.png
tag: Engineering
tags: Data science, Database, Tech, Artificial Intelligence, Vector Management, Milvus
recommend: true
canonicalUrl: https://milvus.io/blog/milvus-supports-apache-parquet-file-supports.md
---

[Milvus](https://zilliz.com/what-is-milvus), the highly scalable vector database renowned for its ability to handle vast datasets, takes a significant step forward by introducing Parquet file support in [version 2.3.4](https://zilliz.com/blog/what-is-new-in-milvus-2-3-4). By embracing Apache Parquet, users can streamline their data import processes and enjoy substantial savings in storage and computation costs.

In our latest post, we explore Parquet's advantages and the benefits it brings to Milvus users. We discuss the motivation behind integrating this feature and provide a step-by-step guide on seamlessly importing Parquet files into Milvus, unlocking new possibilities for efficient data management and analysis.

## What Is Apache Parquet? 

[Apache Parquet](https://parquet.apache.org/) is a popular open-source column-oriented data file format designed to enhance the efficiency of storing and processing large-scale datasets. In contrast to traditional row-oriented data formats like CSV or JSON, Parquet stores data by column, offering more efficient data compression and encoding schemes. This approach translates to improved performance, reduced storage requirements, and enhanced processing power, making it ideal for handling complex data in bulk. 

## How Milvus Users Benefit from the Support for Parquet File Imports

Milvus extends support for Parquet file imports, providing users with optimized experiences and various advantages, including lowered storage and computation expenses, streamlined data management, and a simplified importing process.

### Optimized Storage Efficiency and Streamlined Data Management 

Parquet provides flexible compression options and efficient encoding schemes catering to different data types, ensuring optimal storage efficiency. This flexibility is particularly valuable in cloud environments where every ounce of storage savings directly correlates to tangible cost reductions. With this new feature in Milvus, users can effortlessly consolidate all their diverse data into a single file, streamlining data management and enhancing the overall user experience. This feature is particularly beneficial for users working with variable-length Array data types, who can now enjoy a simplified data import process. 

### Improved Query Performance 

Parquet's columnar storage design and advanced compression methods significantly enhance query performance. When conducting queries, users can focus solely on the pertinent data without scanning through the irrelevant data. This selective column reading minimizes CPU usage, resulting in faster query times. 

### Broad Language Compatibility

Parquet is available in multiple languages such as Java, C++, and Python and is compatible with a large number of data processing tools. With the support of Parquet files, Milvus users using different SDKs can seamlessly generate Parquet files for parsing within the database. 

## How to Import Parquet Files into Milvus 

If your data is already in Parquet file format, importing is easy. Upload the Parquet file to an object storage system such as MinIO, and you're ready to import. 

The code snippet below is an example of importing Parquet files into Milvus.


```python
remote_files = []
try:
    print("Prepare upload files")
    minio_client = Minio(endpoint=MINIO_ADDRESS, access_key=MINIO_ACCESS_KEY, secret_key=MINIO_SECRET_KEY,
                         secure=False)
    found = minio_client.bucket_exists(bucket_name)
    if not found:
        minio_client.make_bucket(bucket_name)
        print("MinIO bucket '{}' doesn't exist".format(bucket_name))
        return False, []

    # set your remote data path
    remote_data_path = "milvus_bulkinsert"

    def upload_file(f: str):
        file_name = os.path.basename(f)
        minio_file_path = os.path.join(remote_data_path, "parquet", file_name)
        minio_client.fput_object(bucket_name, minio_file_path, f)
        print("Upload file '{}' to '{}'".format(f, minio_file_path))
        remote_files.append(minio_file_path)

    upload_file(data_file)

except S3Error as e:
    print("Failed to connect MinIO server {}, error: {}".format(MINIO_ADDRESS, e))
    return False, []

print("Successfully upload files: {}".format(remote_files))
return True, remote_files
```

If your data is not Parquet files or has dynamic fields, you can leverage BulkWriter, our data format conversion tool, to help you generate Parquet files. BulkWriter has now embraced Parquet as its default output data format, ensuring a more intuitive experience for developers. 

The code snippet below is an example of using BulkWriter to generate Parquet files. 

```python
import numpy as np
import json

from pymilvus import (
    RemoteBulkWriter,
    BulkFileType,
)

remote_writer = RemoteBulkWriter(
        schema=your_collection_schema,
        remote_path="your_remote_data_path",
        connect_param=RemoteBulkWriter.ConnectParam(
            endpoint=YOUR_MINIO_ADDRESS,
            access_key=YOUR_MINIO_ACCESS_KEY,
            secret_key=YOUR_MINIO_SECRET_KEY,
            bucket_name="a-bucket",
        ),
        file_type=BulkFileType.PARQUET,
)

# append your data
batch_count = 10000
for i in range(batch_count):
    row = {
        "id": i,
        "bool": True if i % 5 == 0 else False,
        "int8": i % 128,
        "int16": i % 1000,
        "int32": i % 100000,
        "int64": i,
        "float": i / 3,
        "double": i / 7,
        "varchar": f"varchar_{i}",
        "json": {"dummy": i, "ok": f"name_{i}"},
        "vector": gen_binary_vector() if bin_vec else gen_float_vector(),
        f"dynamic_{i}": i,
    }
    remote_writer.append_row(row)

# append rows by numpy type
for i in range(batch_count):
    remote_writer.append_row({
        "id": np.int64(i + batch_count),
        "bool": True if i % 3 == 0 else False,
        "int8": np.int8(i % 128),
        "int16": np.int16(i % 1000),
        "int32": np.int32(i % 100000),
        "int64": np.int64(i),
        "float": np.float32(i / 3),
        "double": np.float64(i / 7),
        "varchar": f"varchar_{i}",
        "json": json.dumps({"dummy": i, "ok": f"name_{i}"}),
        "vector": gen_binary_vector() if bin_vec else gen_float_vector(),
        f"dynamic_{i}": i,
    })

print(f"{remote_writer.total_row_count} rows appends")
print(f"{remote_writer.buffer_row_count} rows in buffer not flushed")
print("Generate data files...")
remote_writer.commit()
print(f"Data files have been uploaded: {remote_writer.batch_files}")
remote_files = remote_writer.batch_files
```

Then, you can start to import your Parquet files into Milvus. 

```python
remote_files = [remote_file_path]
task_id = utility.do_bulk_insert(collection_name=collection_name,
                                 files=remote_files)

task_ids = [task_id]         
states = wait_tasks_to_state(task_ids, BulkInsertState.ImportCompleted)
complete_count = 0
for state in states:
    if state.state == BulkInsertState.ImportCompleted:
        complete_count = complete_count + 1
 ```

Now, your data is seamlessly integrated into Milvus.

## hat's Next?

As Milvus continues to support ever-growing data volumes, the challenge arises in managing sizable imports, particularly when Parquet files surpass 10GB. To tackle this challenge, we plan to segregate the import data into scalar and vector columns, creating two Parquet files per import to alleviate the I/O pressure. For datasets exceeding several hundred gigabytes, we recommend importing the data multiple times. 

