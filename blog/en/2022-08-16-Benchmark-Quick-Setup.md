---
id: 2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
title: A Quick Guide to Benchmarking Milvus 2.1 
author: Yanliang Qiao
date: 2022-08-16
desc: Follow our step-by-step guide to perform a Milvus 2.1 benchmark by yourself.
cover: assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png
tag: Engineering
tags: Vector Database for AI, Artificial Intelligence, Machine Learning
canonicalUrl: http://milvus.io/blog/2022-08-16-A-Quick-Guide-to-Benchmarking-Milvus-2-1.md
---

![Cover](https://assets.zilliz.com/Benchmark_Quick_Setup_58cc8eed5b.png "A Quick Guide to Benchmarking Milvus 2.1 ")

Recently, we have updated the [benchmark report of Milvus 2.1](https://milvus.io/docs/v2.1.x/benchmark.md). Tests with a dataset of 1 million vectors have proved that QPS can be dramatically increased by merging small-[nq](https://milvus.io/docs/v2.1.x/benchmark.md#Terminology) queries.

Here are some simple scripts for you to easily reproduce the tests.

## Procedures

1. Deploy a Milvus standalone or cluster. In this case, the IP address of the Milvus server is 10.100.31.105.

2. Deploy a client. In this case, we use Ubuntu 18.04 and Python 3.8.13 for the deployment. Run the following code to install PyMilvus 2.1.1.

```
pip install pymilvus==2.1.1
```

3. Download and copy the following files to the same working directory as the client. In this case, the working directory is `/go_ben`.

   - [`collection_prepare.py`](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py)

   - [`go_benchmark.py`](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py)

   - [`benchmark`](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark) (for Ubuntu) or [`benchmark-mac`](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac) (for macOS)
   
   **Note:**
   
   - `benchmark` and `benchmark-mac` are executable files developed and compiled using Go SDK 2.1.1. They are only used to conduct a concurrent search. 
   
   - For Ubuntu users, please download `benchmark`; for macOS users, please download `benchmark-mac`.
   
   - Executable permissions are required to access `benchmark` or `benchmark-mac`. 
   
   - Mac users need to trust the `benchmark-mac` file by configuring Security & Privacy in System Preferences.
   
   - Settings on concurrent search can be found and modified in the `go_benchmark.py` source code.
   

4. Create a collection and insert vector data.

```
root@milvus-pytest:/go_ben# python collection_prepare.py 10.100.31.105 
```

5. Open `/tmp/collection_prepare.log` to check the running result.

```
...
08/11/2022 17:33:34 PM - INFO - Build index costs 263.626
08/11/2022 17:33:54 PM - INFO - Collection prepared completed
```

6. Call `benchmark` (or `benchmark-mac` on macOS) to conduct a concurrent search.

```
root@milvus-pytest:/go_ben# python go_benchmark.py 10.100.31.105 ./benchmark
[write_json_file] Remove file(search_vector_file.json).
[write_json_file] Write json file:search_vector_file.json done.
Params of go_benchmark: ['./benchmark', 'locust', '-u', '10.100.31.105:19530', '-q', 'search_vector_file.json', '-s', '{\n  "collection_name": "random_1m",\n  "partition_names": [],\n  "fieldName": "embedding",\n  "index_type": "HNSW",\n  "metric_type": "L2",\n  "params": {\n    "sp_value": 64,\n    "dim": 128\n  },\n  "limit": 1,\n  "expr": null,\n  "output_fields": [],\n  "timeout": 600\n}', '-p', '10', '-f', 'json', '-t', '60', '-i', '20', '-l', 'go_log_file.log']
[2022-08-11 11:37:39.811][    INFO] - Name      #   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)
[2022-08-11 11:37:39.811][    INFO] - go search     9665     0(0.00%)  |    20.679     6.499    81.761    12.810  |    483.25        0.00 (benchmark_run.go:213:sample)
[2022-08-11 11:37:59.811][    INFO] - Name      #   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)
[2022-08-11 11:37:59.811][    INFO] - go search    19448     0(0.00%)  |    20.443     6.549    78.121    13.401  |    489.22        0.00 (benchmark_run.go:213:sample)
[2022-08-11 11:38:19.811][    INFO] - Name      #   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:212:sample)
[2022-08-11 11:38:19.811][    INFO] - go search    29170     0(0.00%)  |    20.568     6.398    76.887    12.828  |    486.15        0.00 (benchmark_run.go:213:sample)
[2022-08-11 11:38:19.811][   DEBUG] - go search run finished, parallel: 10(benchmark_run.go:95:benchmark)
[2022-08-11 11:38:19.811][    INFO] - Name      #   reqs      # fails  |       Avg       Min       Max    Median  |     req/s  failures/s (benchmark_run.go:159:samplingLoop)
[2022-08-11 11:38:19.811][    INFO] - go search    29180     0(0.00%)  |    20.560     6.398    81.761    13.014  |    486.25        0.00 (benchmark_run.go:160:samplingLoop)
Result of go_benchmark: {'response': True, 'err_code': 0, 'err_message': ''} 
```

7. Open the `go_log_file.log` file under the current directory to check the detailed search log. The following is the search information you can find in the search log.
   - reqs: number of search requests from the moment when concurrency happens to the current moment (the current time-span)
   
   - fails: number of failed requests as a percentage of reqs in the current time-span
   
   - Avg: average request response time in the current time-span (unit: milliseconds)
   
   - Min: minimum request response time in the current time-span (unit: milliseconds)
   
   - Max: maximum request response time in the current time-span (unit: milliseconds)
   
   - Median: median request response time in the current time-span (unit: milliseconds)
   
   - req/s: average request response time per second, i.e. QPS
   
   - failures/s: average number of failed requests per second in the current time-span

## Downloading Scripts and Executable Files

   - [collection_prepare.py](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/collection_prepare.py)

   - [go_benchmark.py](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/go_benchmark.py)

   - [benchmark](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark) for Ubuntu
   
   - [benchmark-mac](https://github.com/milvus-io/milvus-tools/blob/main/benchmark/benchmark-mac) for macOS
