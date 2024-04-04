---
id: getting-started-with-milvus-cluster-and-k8s.md
title: Getting started with Milvus cluster and K8s
author: Stephen Batifol
date: 2024-04-03
desc: Through this tutorial, you'll learn the basics of setting up Milvus with Helm, creating a collection, and performing data ingestion and similarity searches.
cover: assets.zilliz.com/Getting_started_with_Milvus_cluster_and_K8s_1_34b2c81802.png
tag: Engineering
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management, Kubernetes
recommend: true
canonicalUrl: https://milvus.io/blog/getting-started-with-milvus-and-k8s.md
---


## Introduction

Milvus is a distributed vector database that aims to store, index and manage massive embedding vectors. Its ability to efficiently index and search through trillions of vectors makes Milvus a go-to choice for AI and machine learning workloads.

Kubernetes (K8s), on the other hand, excels in managing and scaling containerized applications. It provides features like auto-scaling, self-healing, and load balancing, which are crucial for maintaining high availability and performance in production environments.


## Why Use Them Together? 

K8s can automatically scale the Milvus clusters based on the workload. As your data grows or the number of queries increases, K8s can spin up more Milvus instances to handle the load, ensuring your applications remain responsive.

One of the standout features of K8s is its horizontal scaling, which makes expanding your Milvus cluster a breeze. As your dataset grows, K8s effortlessly accommodates this growth, making it a straightforward and efficient solution.

In addition, the ability to handle queries also scales horizontally with K8s. As the query load increases, K8s can deploy more Milvus instances to handle the increased similarity search queries, ensuring low latency responses even under heavy loads.


## Prerequisites & Setting Up K8s

### Prerequisites

- **Docker** - Ensure Docker is installed on your system.

- **Kubernetes** - Have a Kubernetes cluster ready. You can use `minikube` for local development or a cloud provider's Kubernetes service for production environments.

- **Helm** - Install Helm, a package manager for Kubernetes, to help you manage Kubernetes applications, you can check our documentation to see how to do that <https://milvus.io/docs/install_cluster-helm.md>

- **Kubectl** - Install `kubectl`, a command-line tool for interacting with Kubernetes clusters, to deploy applications, inspect and manage cluster resources, and view logs.

### Setting Up K8s

After installing everything needed to run a K8s cluster, and if you used `minikube`, start your cluster with: 

```
minikube start
```

Check the status of your K8s cluster with:

```
kubectl cluster-info
```

### Deploying Milvus on K8s

For this deployment, we're opting for Milvus in cluster-mode to leverage its full distributed capabilities. We'll be using Helm, to streamline the installation process.

**1. Helm Installation Command** 

```
helm install my-milvus milvus/milvus --set pulsar.enabled=false --set kafka.enabled=true
```

This command installs Milvus on your K8s cluster with Kafka enabled and Pulsar disabled. Kafka serves as the messaging system within Milvus, handling data streaming between different components. Disabling Pulsar and enabling Kafka tailors the deployment to our specific messaging preferences and requirements.

**2. Port Forwarding**

To access Milvus from your local machine, create a port forward: `kubectl port-forward svc/my-milvus 27017:19530`.

This command maps port `19530` from the Milvus service `svc/my-milvus` to the same port on your local machine, allowing you to connect to Milvus using local tools. If you leave the local port unspecified (as in `:19530`), K8s will allocate an available port, making it dynamic. Ensure you note the allocated local port if you choose this method.

**3. Verifying the Deployment:**

```
kubectl get pods 

NAME                                    READY   STATUS    RESTARTS   AGE
my-milvus-datacoord-595b996bd4-zprpd    1/1     Running   0          85m
my-milvus-datanode-d9d555785-47nkt      1/1     Running   0          85m
my-milvus-etcd-0                        1/1     Running   0          84m
my-milvus-etcd-1                        1/1     Running   0          85m
my-milvus-etcd-2                        1/1     Running   0          85m
my-milvus-indexcoord-65bc68968c-6jg6q   1/1     Running   0          85m
my-milvus-indexnode-54586f55d-z9vx4     1/1     Running   0          85m
my-milvus-kafka-0                       1/1     Running   0          85m
my-milvus-kafka-1                       1/1     Running   0          85m
my-milvus-kafka-2                       1/1     Running   0          85m
my-milvus-minio-0                       1/1     Running   0          96m
my-milvus-minio-1                       1/1     Running   0          96m
my-milvus-minio-2                       1/1     Running   0          96m
my-milvus-minio-3                       1/1     Running   0          96m
my-milvus-proxy-76bb7d497f-sqwvd        1/1     Running   0          85m
my-milvus-querycoord-6f4c7b7598-b6twj   1/1     Running   0          85m
my-milvus-querynode-677bdf485b-ktc6m    1/1     Running   0          85m
my-milvus-rootcoord-7498fddfd8-v5zw8    1/1     Running   0          85m
my-milvus-zookeeper-0                   1/1     Running   0          85m
my-milvus-zookeeper-1                   1/1     Running   0          85m
my-milvus-zookeeper-2                   1/1     Running   0          85m
```


You should see a list of pods similar to the output above, all in the Running state. This indicates that your Milvus cluster is operational. Specifically, look for the 1/1 under the `READY` column, which signifies that each pod is fully ready and running. If any pods are not in the Running state, you may need to investigate further to ensure a successful deployment.

With your Milvus cluster deployed and all components confirmed running, you're now ready to proceed to data ingestion and indexing. This will involve connecting to your Milvus instance, creating collections, and inserting vectors for search and retrieval.


## Data Ingestion and Indexing

To start ingesting and indexing data in our Milvus cluster, we'll use the pymilvus SDK. There are two installation options:

- Basic SDK: `pip install pymilvus`

- For rich text embeddings and advanced models: `pip install pymilvus[model]`

Time to insert data in our cluster, we’ll be using `pymilvus`, you can either install the SDK only with `pip install pymilvus` or if you want to extract rich text embeddings, you can also use `PyMilvus Models` by installing `pip install pymilvus[model]`. 

### Connecting and Creating a Collection:

First, connect to your Milvus instance using the port you forwarded earlier. Ensure the URI matches the local port assigned by K8s:

```
from pymilvus import MilvusClient

client = MilvusClient(
        uri="http://127.0.0.1:52070",
    )

client.create_collection(collection_name="quick_setup", dimension=5)
```

The `dimension=5` parameter defines the vector size for this collection, essential for the vector search capabilities.


### Insert Data

Here's how to insert an initial set of data, where each vector represents an item, and the color field adds a descriptive attribute:

```
data=[
    {"id": 0, "vector": [0.3580376395471989, -0.6023495712049978, 0.18414012509913835, -0.26286205330961354, 0.9029438446296592], "color": "pink_8682"},
    {"id": 1, "vector": [0.19886812562848388, 0.06023560599112088, 0.6976963061752597, 0.2614474506242501, 0.838729485096104], "color": "red_7025"},
    {"id": 2, "vector": [0.43742130801983836, -0.5597502546264526, 0.6457887650909682, 0.7894058910881185, 0.20785793220625592], "color": "orange_6781"},
    {"id": 3, "vector": [0.3172005263489739, 0.9719044792798428, -0.36981146090600725, -0.4860894583077995, 0.95791889146345], "color": "pink_9298"},
    {"id": 4, "vector": [0.4452349528804562, -0.8757026943054742, 0.8220779437047674, 0.46406290649483184, 0.30337481143159106], "color": "red_4794"},
    {"id": 5, "vector": [0.985825131989184, -0.8144651566660419, 0.6299267002202009, 0.1206906911183383, -0.1446277761879955], "color": "yellow_4222"},
    {"id": 6, "vector": [0.8371977790571115, -0.015764369584852833, -0.31062937026679327, -0.562666951622192, -0.8984947637863987], "color": "red_9392"},
    {"id": 7, "vector": [-0.33445148015177995, -0.2567135004164067, 0.8987539745369246, 0.9402995886420709, 0.5378064918413052], "color": "grey_8510"},
    {"id": 8, "vector": [0.39524717779832685, 0.4000257286739164, -0.5890507376891594, -0.8650502298996872, -0.6140360785406336], "color": "white_9381"},
    {"id": 9, "vector": [0.5718280481994695, 0.24070317428066512, -0.3737913482606834, -0.06726932177492717, -0.6980531615588608], "color": "purple_4976"}
]

res = client.insert(
    collection_name="quick_setup",
    data=data
)

print(res)
```


The provided code assumes that you have created a collection in the Quick Setup manner. As shown in the above code,

The data to insert is organized into a list of dictionaries, where each dictionary represents a data record, termed as an entity.

Each dictionary contains a non-schema-defined field named color.

Each dictionary contains the keys corresponding to both pre-defined and dynamic fields.


### Insert Even More Data

```
colors = ["green", "blue", "yellow", "red", "black", "white", "purple", "pink", "orange", "brown", "grey"]
data = [ {
    "id": i, 
    "vector": [ random.uniform(-1, 1) for _ in range(5) ], 
    "color": f"{random.choice(colors)}_{str(random.randint(1000, 9999))}" 
} for i in range(1000) ]

res = client.insert(
    collection_name="quick_setup",
    data=data[10:]
)

print(res)
```


## Similarity Search

After populating the collection, you can perform a similarity search to find vectors close to a query vector. The value of the query_vectors variable is a list containing a sub-list of floats. The sub-list represents a vector embedding of 5 dimensions.

```
query_vectors = [
    [0.041732933, 0.013779674, -0.027564144, -0.013061441, 0.009748648]
]

res = client.search(
    collection_name="quick_setup",     # target collection
    data=query_vectors,                # query vectors
    limit=3,                           # number of returned entities
)

print(res)
```


This query searches for the top 3 vectors most similar to our query vector, demonstrating Milvus's powerful search capabilities.


## Uninstall Milvus from K8s

Once you are done with this tutorial, feel free to uninstall Milvus from your K8s cluster with:`helm uninstall my-milvus`.

This command will remove all Milvus components deployed in the `my-milvus` release, freeing up cluster resources.

## Conclusion

- Deploying Milvus on a Kubernetes cluster showcases the scalability and flexibility of vector databases in handling AI and machine learning workloads. Through this tutorial, you've learned the basics of setting up Milvus with Helm, creating a collection, and performing data ingestion and similarity searches.

- Installing Milvus on a Kubernetes cluster with Helm should be straightforward. To go deeper into scaling Milvus clusters for larger datasets or more intensive workloads, our documentation offers detailed guidance <https://milvus.io/docs/scaleout.md>

Feel free to check out the code on [Github](https://github.com/stephen37/K8s-tutorial-milvus), check out [Milvus](https://github.com/milvus-io/milvus), experiment with different configurations and use cases, and share your experiences with the community by joining our [Discord](https://discord.gg/FG6hMJStWu).
