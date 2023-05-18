---
id: how-to-get-started-with-milvus.md
title: 
 > 
 How to Get Started with Milvus
author: Eric Goebelbecker
date: 2023-05-18
cover: assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management
recommend: true
canonicalUrl: https://milvus.io/blog/how-to-get-started-with-milvus.md
---

![How to get started with Milvus](https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png)


As the volume and complexity of information grow, so does the need for tools to store and search large-scale, unstructured datasets. [Milvus](https://github.com/milvus-io/milvus) is an open-source vector database that efficiently handles complex unstructured data like images, audio, and text. It's a popular choice for applications that need high-speed and scalable access to vast data collections. 

In this post, you'll learn how to install and run Milvus. You'll understand how to run this robust [vector database](https://zilliz.com/learn/what-is-vector-database), setting you on the path to harnessing its full potential for your projects. Whether you're a developer, data scientist, or simply curious about the power of vector similarity search engines, this blog post is the perfect starting point for your journey with [Milvus](https://milvus.io/). 

## What is Milvus?

Milvus is an open-source vector database designed to handle large-scale unstructured data. It's powered by an advanced indexing system and provides various search algorithms to efficiently handle high-dimensional data such as images, audio, and text. 

Some of the advantages you can expect from leveraging Milvus include the following: 
1. Improved search efficiency for high-dimensional data
2. Scalability for handling large-scale datasets
3. Extensive support for various search algorithms and indexing techniques
4. A wide range of applications, including image search, natural language processing, recommender systems, anomaly detection, bioinformatics, and audio analysis

## Prerequisites

To follow this tutorial, you'll need a system installed with the latest version of Docker. This tutorial relies on [Docker Compose](https://docs.docker.com/compose/), which is already included in the most recent version of the Docker runtime. 

To use Milvus, you need to download both the Milvus Python libraries and the command line interface (CLI). Ensure that you have Python version 3.9 or later, and note that the CLI is compatible with Windows, macOS, and Linux. The sample shell commands provided below are for a Linux system but can also be used with macOS or the Windows Subsystem for Linux. 

The tutorial uses **wget** to download files from GitHub. For macOS, you can install **wget** with [Homebrew](https://brew.sh/), or download the files with your browser. For Windows, you will find **wget** in the Windows Subsystem for Linux (WSL). 

## Running Milvus Standalone
### Allocate Additional Memory to Docker

For optimal performance, Milvus requires a minimum of 8GB of available memory. However, Docker usually only allocates 2GB by default. To fix this, go to Settings and click on Resources to [increase the Docker memory](https://docs.docker.com/config/containers/resource_constraints/#memory) in the Docker desktop before running the server.

![The Docker desktop](https://assets.zilliz.com/The_Docker_desktop_a18626750c.png)

### Download Docker Compose Configuration

You need three containers to run a Milvus standalone server: 
- **[etcd](https://etcd.io/)** - a distributed key value store for metadata storage and access
- **[minio](https://min.io/)** - AWS S3-compatible persistent storage for logs and index files
- **milvus** - the database server

Rather than configure and run each container individually, you'll use Docker Compose to connect and orchestrate them. 

1. Create a directory to run the service. 
2. Download the sample [Docker compose file](https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml) from Github and save it as **docker-compose.yml**. You can also download the file with **wget**. 

```
$ mkdir milvus_compose
$ cd milvus_compose
$ wget https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
--2023-04-10 16:44:13-- https://github.com/milvus-io/milvus/releases/download/v2.2.8/milvus-standalone-docker-compose.yml
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230410T204413Z&X-Amz-Expires=300&X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=208728772&response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&response-content-type=application%2Foctet-stream [following]
--2023-04-10 16:44:13-- https://objects.githubusercontent.com/github-production-release-asset-2e65be/208728772/c319ebef-7bcb-4cbf-82d8-dcd3c54cb3af?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230410%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230410T204413Z&X-Amz-Expires=300&X-Amz-Signature=b26b9b461fd3a92ab17e42e5a68b268b12a56cb07db57cf4db04e38a8e74525a&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=208728772&response-content-disposition=attachment%3B%20filename%3Dmilvus-standalone-docker-compose.yml&response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.110.133, 185.199.111.133, 185.199.109.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.110.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1356 (1.3K) [application/octet-stream]
Saving to: ‘docker-compose.yml’

docker-compose.yml 100%[==========================================================>] 1.32K --.-KB/s in 0s

2023-04-10 16:44:13 (94.2 MB/s) - ‘docker-compose.yml’ saved [1356/1356]
```

Let's look at this configuration before running it. 

## Standalone Configuration

This compose file defines the three services needed for Milvus: **etcd, minio**, and **milvus-standalone**. 

```
version: '3.5'

services:
  etcd:
    container_name: milvus-etcd
    image: quay.io/coreos/etcd:v3.5.0
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/etcd:/etcd
    command: etcd -advertise-client-urls=http://127.0.0.1:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    container_name: milvus-minio
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/minio:/minio_data
    command: minio server /minio_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  standalone:
    container_name: milvus-standalone
    image: milvusdb/milvus:v2.2.8
    command: ["milvus", "run", "standalone"]
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
    volumes:
      - ${DOCKER_VOLUME_DIRECTORY:-.}/volumes/milvus:/var/lib/milvus
    ports:
      - "19530:19530"
      - "9091:9091"
    depends_on:
      - "etcd"
      - "minio"

networks:
  default:
    name: milvus
```

This configuration assigns a volume to **etcd** for persistent data. It defines four environment variables and runs the service with a command line instructing it to listen for requests on port 2379.

The configuration also provides **minio** with a volume and uses default access keys. However, you should create a new **minio** image with unique keys for production use. Also, the configuration includes a health check for **minio**, which restarts the service if it fails. Note that Minio uses port 9000 for client requests by default.

Finally, there's the **standalone** service that runs Milvus. It also has a volume plus environment variables that direct it to the service ports for **etcd** and **minio**. The last section provides a name for the network the services to share. This makes it easier to identify with monitoring tools. 

## Running Milvus

Start the service with **docker compose up -d**.

```
$ docker compose up -d
[*] Running 4/4
✔ Network milvus               Created          .0s
✔ Container milvus-minio       Started          .2s
✔ Container milvus-etcd        Started          .3s
✔ Container milvus-standalone  Started
```

Docker **ps** will show three containers running: 

```
$ docker ps -a
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                             PORTS                                              NAMES
eb1caca5d6a5   milvusdb/milvus:v2.2.8                     "/tini -- milvus run…"   21 seconds ago   Up 19 seconds                      0.0.0.0:9091->9091/tcp, 0.0.0.0:19530->19530/tcp   milvus-standalone
ce19d90d89d0   quay.io/coreos/etcd:v3.5.0                 "etcd -advertise-cli…"   22 seconds ago   Up 20 seconds                      2379-2380/tcp                                      milvus-etcd
e93e33a882d5   minio/minio:RELEASE.2023-03-20T20-16-18Z   "/usr/bin/docker-ent…"   22 seconds ago   Up 20 seconds (health: starting)   9000/tcp                                           milvus-minio
```

And, you can check on the Milvus server with **docker logs**: 

```
$ docker logs milvus-standalone
2023/04/13 13:40:04 maxprocs: Leaving GOMAXPROCS=4: CPU quota undefined
    __  _________ _   ____  ______    
   /  |/  /  _/ /| | / / / / / __/    
  / /|_/ // // /_| |/ / /_/ /\ \    
 /_/  /_/___/____/___/\____/___/     

Welcome to use Milvus!
Version:   v2.2.8
Built:     Wed Mar 29 11:32:15 UTC 2023
GitCommit: 47e28fbe
GoVersion: go version go1.18.3 linux/amd64

open pid file: /run/milvus/standalone.pid
lock pid file: /run/milvus/standalone.pid
[2023/04/13 13:40:04.976 +00:00] [INFO] [roles/roles.go:192] ["starting running Milvus components"]
(snipped)
```

Your server is up and running. Now, let's use Python to connect to it. 

## How to Use Milvus
### Using Milvus with Python

Let's test your database with a Python example program. Start by installing **PyMilvus** with **pip3**: 

```
$ pip3 install pymilvus
Defaulting to user installation because normal site-packages is not writeable
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Collecting pymilvus
  Using cached pymilvus-2.2.6-py3-none-any.whl (133 kB)
Collecting grpcio<=1.53.0,>=1.49.1
  Using cached grpcio-1.53.0-cp311-cp311-manylinux_2_17_x86_64.manylinux2014_x86_64.whl (4.9 MB)
Requirement already satisfied: mmh3>=2.0 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (3.0.0)
Requirement already satisfied: ujson>=2.0.0 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (5.4.0)
Requirement already satisfied: pandas>=1.2.4 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pymilvus) (2.0.0)
Requirement already satisfied: python-dateutil>=2.8.2 in /usr/lib/python3.11/site-packages (from pandas>=1.2.4->pymilvus) (2.8.2)
Requirement already satisfied: pytz>=2020.1 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas>=1.2.4->pymilvus) (2023.3)
Requirement already satisfied: tzdata>=2022.1 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas>=1.2.4->pymilvus) (2023.3)
Requirement already satisfied: numpy>=1.21.0 in /home/egoebelbecker/.local/lib/python3.11/site-packages (from pandas>=1.2.4->pymilvus) (1.24.2)
Requirement already satisfied: six>=1.5 in /usr/lib/python3.11/site-packages (from python-dateutil>=2.8.2->pandas>=1.2.4->pymilvus) (1.16.0)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Installing collected packages: grpcio, pymilvus
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
WARNING: Ignoring invalid distribution ~rpcio (/home/egoebelbecker/.local/lib/python3.11/site-packages)
Successfully installed grpcio pymilvus-2.2.6
```

Then, download the [hello_milvus](https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py) example program: 

```
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.2.6/examples/hello_milvus.py
```

This script will create a collection, add an index, and run some calculations. Run it. Depending on your processor and available memory, it will take a few minutes to complete. 

```
$ python3 ./hello_milvus.py 

=== start connecting to Milvus     ===

Does collection hello_milvus exist in Milvus: False

=== Create collection `hello_milvus` ===


=== Start inserting entities       ===

Number of entities in Milvus: 3000

=== Start Creating index IVF_FLAT  ===


=== Start loading                  ===


=== Start searching based on vector similarity ===

hit: (distance: 0.0, id: 2998), random field: 0.9728033590489911
hit: (distance: 0.08883658051490784, id: 1262), random field: 0.2978858685751561
hit: (distance: 0.09590047597885132, id: 1265), random field: 0.3042039939240304
hit: (distance: 0.0, id: 2999), random field: 0.02316334456872482
hit: (distance: 0.05628091096878052, id: 1580), random field: 0.3855988746044062
hit: (distance: 0.08096685260534286, id: 2377), random field: 0.8745922204004368
search latency = 0.3663s

=== Start querying with `random > 0.5` ===

query result:
-{'random': 0.6378742006852851, 'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0'}
search latency = 0.4352s
query pagination(limit=4):
	[{'pk': '0', 'random': 0.6378742006852851}, {'pk': '100', 'random': 0.5763523024650556}, {'pk': '1000', 'random': 0.9425935891639464}, {'pk': '1001', 'random': 0.7893211256191387}]
query pagination(offset=1, limit=3):
	[{'random': 0.5763523024650556, 'pk': '100'}, {'random': 0.9425935891639464, 'pk': '1000'}, {'random': 0.7893211256191387, 'pk': '1001'}]

=== Start hybrid searching with `random > 0.5` ===

hit: (distance: 0.0, id: 2998), random field: 0.9728033590489911
hit: (distance: 0.14606499671936035, id: 747), random field: 0.5648774800635661
hit: (distance: 0.1530652642250061, id: 2527), random field: 0.8928974315571507
hit: (distance: 0.08096685260534286, id: 2377), random field: 0.8745922204004368
hit: (distance: 0.20354536175727844, id: 2034), random field: 0.5526117606328499
hit: (distance: 0.21908017992973328, id: 958), random field: 0.6647383716417955
search latency = 0.3732s

=== Start deleting with expr `pk in ["0" , "1"]` ===

query before delete by expr=`pk in ["0" , "1"]` -> result: 
-{'random': 0.6378742006852851, 'embeddings': [0.20963514, 0.39746657, 0.12019053, 0.6947492, 0.9535575, 0.5454552, 0.82360446, 0.21096309], 'pk': '0'}
-{'random': 0.43925103574669633, 'embeddings': [0.52323616, 0.8035404, 0.77824664, 0.80369574, 0.4914803, 0.8265614, 0.6145269, 0.80234545], 'pk': '1'}

query after delete by expr=`pk in ["0" , "1"]` -> result: []

=== Drop collection `hello_milvus` ===
```

## Milvus CLI

Let's wrap up by recreating the collection in the **hello_milvus** example and use the CLI to examine it. 

Start by editing **hello_milvus.py** and comment out the last two lines: 

```
###############################################################################
# 7. drop collection
# Finally, drop the hello_milvus collection
#print(fmt.format("Drop collection `hello_milvus`"))
#utility.drop_collection("hello_milvus")
```

Next, install the [Milvus command line interface (CLI)](https://github.com/zilliztech/milvus_cli) for interacting with the database. You can install with Python, or download a binary for your system from the [releases page](https://github.com/zilliztech/milvus_cli/releases). Here is an example of downloading the binary for Linux: 

```
$ wget https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
--2023-04-13 09:58:15--  https://github.com/zilliztech/milvus_cli/releases/download/v0.3.2/milvus_cli-v0.3.2-Linux
Resolving github.com (github.com)... 140.82.113.3
Connecting to github.com (github.com)|140.82.113.3|:443... connected.
HTTP request sent, awaiting response... 302 Found
Location: https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230413T135816Z&X-Amz-Expires=300&X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=436910525&response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&response-content-type=application%2Foctet-stream [following]
--2023-04-13 09:58:16--  https://objects.githubusercontent.com/github-production-release-asset-2e65be/436910525/25c43a55-dd72-41f8-acfa-05598267a2cb?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20230413%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230413T135816Z&X-Amz-Expires=300&X-Amz-Signature=3697b3583bfa71a3e8b9773fa550f4d18e32110cfe6315035fd4fff01d694446&X-Amz-SignedHeaders=host&actor_id=0&key_id=0&repo_id=436910525&response-content-disposition=attachment%3B%20filename%3Dmilvus_cli-v0.3.2-Linux&response-content-type=application%2Foctet-stream
Resolving objects.githubusercontent.com (objects.githubusercontent.com)... 185.199.111.133, 185.199.110.133, 185.199.108.133, ...
Connecting to objects.githubusercontent.com (objects.githubusercontent.com)|185.199.111.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 50254816 (48M) [application/octet-stream]
Saving to: ‘milvus_cli-v0.3.2-Linux’

milvus_cli-v0.3.2-L 100%[===================>]  47.93M  62.7MB/s    in 0.8s    

2023-04-13 09:58:16 (62.7 MB/s) - ‘milvus_cli-v0.3.2-Linux’ saved [50254816/50254816]

$ chmod +x ./milvus_cli-v0.3.2-Linux 
```

Run the modified **hello_milvus.py** script and it will exit without dropping the collection. Now, run the CLI and connect to your database. **Connect** defaults to connecting to a Milvus instance on localhost and the default port: 

```
$ ./milvus_cli-v0.3.2-Linux

  __  __ _ _                    ____ _     ___
 |  \/  (_) |_   ___   _ ___   / ___| |   |_ _|
 | |\/| | | \ \ / / | | / __| | |   | |    | |
 | |  | | | |\ V /| |_| \__ \ | |___| |___ | |
 |_|  |_|_|_| \_/  \__,_|___/  \____|_____|___|

Milvus cli version: 0.3.2
Pymilvus version: 2.2.1

Learn more: https://github.com/zilliztech/milvus_cli.


milvus_cli > connect
Connect Milvus successfully.
+---------+-----------------+
| Address | 127.0.0.1:19530 |
|  User   |                 |
|  Alias  |     default     |
+---------+-----------------+
```

List the current collections, then use **describe** to view **hello_milvus**. 

```
milvus_cli > list collections
+----+-------------------+
|    | Collection Name   |
+====+===================+
|  0 | hello_milvus      |
+----+-------------------+
milvus_cli > describe collection -c hello_milvus
+---------------+----------------------------------------------------------------------+
| Name          | hello_milvus                                                         |
+---------------+----------------------------------------------------------------------+
| Description   | hello_milvus is the simplest demo to introduce the APIs              |
+---------------+----------------------------------------------------------------------+
| Is Empty      | False                                                                |
+---------------+----------------------------------------------------------------------+
| Entities      | 3000                                                                 |
+---------------+----------------------------------------------------------------------+
| Primary Field | pk                                                                   |
+---------------+----------------------------------------------------------------------+
| Schema        | Description: hello_milvus is the simplest demo to introduce the APIs |
|               |                                                                      |
|               | Auto ID: False                                                       |
|               |                                                                      |
|               | Fields(* is the primary field):                                      |
|               |  - *pk VARCHAR                                                       |
|               |  - random DOUBLE                                                     |
|               |  - embeddings FLOAT_VECTOR dim: 8                                    |
+---------------+----------------------------------------------------------------------+
| Partitions    | - _default                                                           |
+---------------+----------------------------------------------------------------------+
| Indexes       | - embeddings                                                         |
+---------------+----------------------------------------------------------------------+
```

The collection has three fields. Let's finish with a query to view all three inside a single entry. We'll query for an entry with an ID of 100.

The **query** command will prompt you for several options. To complete this, you need: 
- Collection name: **hello_milvus**
- Expression **pk == "100"**
- Fields: **pk, random, embeddings**

Accept the defaults for the other options. 

```
milvus_cli > k
Collection name (hello_milvus): hello_milvus
The query expression: pk == "100"
The names of partitions to search (split by "," if multiple) ['_default'] []: 
Fields to return(split by "," if multiple) ['pk', 'random', 'embeddings'] []: pk, random, embeddings
timeout []: 
Guarantee timestamp. This instructs Milvus to see all operations performed before a provided timestamp. If no such timestamp is provided, then Milvus will search all operations performed to date. [0]: 
Graceful time. Only used in bounded consistency level. If graceful_time is set, PyMilvus will use current timestamp minus the graceful_time as the guarantee_timestamp. This option is 5s by default if not set. [5]: 
Travel timestamp. Users can specify a timestamp in a search to get results based on a data view at a specified point in time. [0]: 
+----+------+----------+------------------------------------------------------------------------------------------------+
|    |   pk |   random | embeddings                                                                                     |
+====+======+==========+================================================================================================+
|  0 |  100 | 0.576352 | [0.5860017, 0.24227226, 0.8318699, 0.0060517574, 0.27727962, 0.5513293, 0.47201252, 0.6331349] |
+----+------+----------+------------------------------------------------------------------------------------------------+
```

There's the field and its random embeddings. Your values will differ. 

## Wrapping Up
In this tutorial, you installed Milvus with [Docker Compose](https://docs.docker.com/compose/) along with its Python API and CLI. After starting the server, you ran a sample program that seeded it with random data, then used the CLI to query the database. 

Milvus is a powerful open-source [vector database](https://zilliz.com/blog/scalar-quantization-and-product-quantization) engine for storing and searching large datasets. Try it out today, and see how it can help you with your multimedia and AI projects.  If you are not ready to tackle the full version of Milvus, give [Milvus lite](https://github.com/milvus-io/bootcamp/tree/master/notebooks) a whirl.


*This post was written by Eric Goebelbecker. [Eric](http://ericgoebelbecker.com/) has worked in the financial markets in New York City for 25 years, developing infrastructure for market data and financial information exchange (FIX) protocol networks. He loves to talk about what makes teams effective (or not so effective!).*

