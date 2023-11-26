---
id: milvus-embraces-nats-messaging.md
title: 'Optimizing Data Communication: Milvus Embraces NATS Messaging'
author: Zhen Ye
date: 2023-10-11
desc: Introducing the integration of NATS and Milvus, exploring its features, setup and migration process, and performance testing results.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: Milvus, Vector Database, Open Source, Data science, Artificial Intelligence, Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---

![](https://assets.zilliz.com/Exploring_NATS_878f48c848.png)

In the intricate tapestry of data processing, seamless communication is the thread that binds operations together. [Milvus](https://zilliz.com/what-is-milvus), the trailblazing [open-source vector database](https://zilliz.com/cloud), has embarked on a transformative journey with its latest feature: NATS messaging integration. In this comprehensive blog post, we'll unravel the intricacies of this integration, exploring its core features, setup process, migration benefits, and how it stacks up against its predecessor, RocksMQ.

## Understanding the role of message queues in Milvus

In Milvus’ cloud-native architecture, the message queue, or Log Broker, holds pivotal importance. It’s the backbone ensuring persistent data streams, synchronization, event notifications, and data integrity during system recoveries. Traditionally, RocksMQ was the most straightforward choice in Milvus Standalone mode, especially when compared with Pulsar and Kafka, but its limitations became evident with extensive data and complex scenarios.

Milvus 2.3 introduces NATS, a single-node MQ implementation, redefining how to manage data streams. Unlike its predecessors, NATS liberates Milvus users from performance constraints, delivering a seamless experience in handling substantial data volumes.

## What is NATS?

NATS is a distributed system connectivity technology implemented in Go. It supports various communication modes like Request-Reply and Publish-Subscribe across systems, provides data persistence through JetStream, and offers distributed capabilities through built-in RAFT. You can refer to the [NATS official website](https://nats.io/) for a more detailed understanding of NATS.

In Milvus 2.3 Standalone mode, NATS, JetStream, and PubSub provide Milvus with robust MQ capabilities.

## Enabling NATS

Milvus 2.3 offers a new control option, `mq.type`, which allows users to specify the type of MQ they want to use. To enable NATS, set `mq.type=natsmq`. If you see logs similar to the ones below after you initiate Milvus instances, you have successfully enabled NATS as the message queue.

  
```
[INFO] [dependency/factory.go:83] ["try to init mq"] [standalone=true] [mqType=natsmq]
```
  

## Configuring NATS for Milvus

NATS customization options include specifying the listening port, JetStream storage directory, maximum payload size, and initialization timeout. Fine-tuning these settings ensures optimal performance and reliability.


```
natsmq:
server: # server side configuration for natsmq.
port: 4222 # 4222 by default, Port for nats server listening.
storeDir: /var/lib/milvus/nats # /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.
maxFileStore: 17179869184 # (B) 16GB by default, Maximum size of the 'file' storage.
maxPayload: 8388608 # (B) 8MB by default, Maximum number of bytes in a message payload.
maxPending: 67108864 # (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.
initializeTimeout: 4000 # (ms) 4s by default, waiting for initialization of natsmq finished.
monitor:
trace: false # false by default, If true enable protocol trace log messages.
debug: false # false by default, If true enable debug log messages.
logTime: true # true by default, If set to false, log without timestamps.
logFile: /tmp/milvus/logs/nats.log # /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.
logSizeLimit: 536870912 # (B) 512MB by default, Size in bytes after the log file rolls over to a new one.
retention:
maxAge: 4320 # (min) 3 days by default, Maximum age of any message in the P-channel.
maxBytes: # (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.
maxMsgs: # None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.
```
  

**Note:**

-   You must specify `server.port` for NATS server listening. If there is a port conflict, Milvus cannot start. Set `server.port=-1` to randomly select a port.
    
-   `storeDir` specifies the directory for JetStream storage. We recommend storing the directory in a high-performant solid-state drive (SSD) for better read/write throughput of Milvus.
    
-   `maxFileStore` sets the upper limit of JetStream storage size. Exceeding this limit will prevent further data writing.
    
-   `maxPayload` limits individual message size. You should keep it above 5MB to avoid any write rejections.
    
-   `initializeTimeout`controls NATS server startup timeout.
    
-   `monitor` configures NATS’ independent logs.
    
-   `retention` controls the retention mechanism of NATS messages.
    

For more information, refer to [NATS official documentation](https://docs.nats.io/running-a-nats-service/configuration).

## Migrating from RocksMQ to NATS

Migrating from RocksMQ to NATS is a seamless process involving steps like stopping write operations, flushing data, modifying configurations, and verifying the migration through Milvus logs.

1.  Before initiating the migration, stop all write operations in Milvus.
    
2.  Execute the `FlushALL` operation in Milvus and wait for its completion. This step ensures that all pending data is flushed and the system is ready for shutdown.
    
3.  Modify the Milvus configuration file by setting `mq.type=natsmq` and adjusting relevant options under the `natsmq` section.
    
4.  Start the Milvus 2.3.
    
5.  Back up and clean the original data stored in the `rocksmq.path` directory. (Optional)
    

## NATS vs. RocksMQ: A Performance Showdown

### Pub/Sub Performance Testing

-   **Testing Platform:** M1 Pro Chip / Memory: 16GB
    
-   **Testing Scenario:** Subscribing and publishing random data packets to a topic repeatedly until the last published result is received.
    
-   **Results:**
    
    -   For smaller data packets (< 64kb), RocksMQ outperforms NATS regarding memory, CPU, and response speed.
    
    -   For larger data packets (> 64kb), NATS outshines RocksMQ, offering much faster response times.
    

  

| Test Type           | MQ      | op count | cost per op      | Memory cost | CPU Total Time | Storage cost |
| ------------------- | ------- | -------- | ---------------- | ----------- | -------------- | ------------ |
| 5MB\*100 Pub/Sub    | NATS    | 50       | 1.650328186 s/op | 4.29 GB     | 85.58          | 25G          |
| 5MB\*100 Pub/Sub    | RocksMQ | 50       | 2.475595131 s/op | 1.18 GB     | 81.42          | 19G          |
| 1MB\*500 Pub/Sub    | NATS    | 50       | 2.248722593 s/op | 2.60 GB     | 96.50          | 25G          |
| 1MB\*500 Pub/Sub    | RocksMQ | 50       | 2.554614279 s/op | 614.9 MB    | 80.19          | 19G          |
| 64KB\*10000 Pub/Sub | NATS    | 50       | 2.133345262 s/op | 3.29 GB     | 97.59          | 31G          |
| 64KB\*10000 Pub/Sub | RocksMQ | 50       | 3.253778195 s/op | 331.2 MB    | 134.6          | 24G          |
| 1KB\*50000 Pub/Sub  | NATS    | 50       | 2.629391004 s/op | 635.1 MB    | 179.67         | 2.6G         |
| 1KB\*50000 Pub/Sub  | RocksMQ | 50       | 0.897638581 s/op | 232.3 MB    | 60.42          | 521M         |

  

Table 1: Pub/Sub performance testing results

### Milvus Integration Testing

**Data size:** 100M

**Result:** In extensive testing with a 100 million vectors dataset, NATS showcased lower vector search and query latency.

| Metrics                                 | RocksMQ (ms) | NATS (ms) |
| --------------------------------------- | ------------ | --------- |
| Average vector search latency           | 23.55        | 20.17     |
| Vector search requests per second (RPS) | 2.95         | 3.07      |
| Average query latency                   | 7.2          | 6.74      |
| Query requests per second (RPS)         | 1.47         | 1.54      |

Table 2: Milvus integration testing results with 100m dataset

  

**Dataset: <100M**

**Result:** For datasets smaller than 100M, NATS and RocksMQ show similar performance.

## Conclusion: Empowering Milvus with NATS messaging

The integration of NATS within Milvus marks a significant stride in data processing. Whether delving into real-time analytics, machine learning applications, or any data-intensive venture, NATS empowers your projects with efficiency, reliability, and speed. As the data landscape evolves, having a robust messaging system like NATS within Milvus ensures seamless, reliable, and high-performing data communication.