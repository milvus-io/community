---
id: How Woodpecker Keeps WAL Writes Fast and Retention Cheap in Milvus 3.0
title: >
 How Woodpecker Keeps WAL Writes Fast and Retention Cheap in Milvus 3.0
author: Zhenyuan Wei
date: 2026-9-2
cover: assets.zilliz.com/cms-cn/woodpecker_milvus_3_cover_17ea8f9006.png
tag: Engineering
recommend: false
publishToMedium: false
tags: Milvus, vector database
meta_keywords: Milvus 3.0, Woodpecker, write-ahead log, cloud-native database, vector database costs
meta_title: >
 Milvus 3.0 Woodpecker Service Mode for Low Latency WAL
desc: >
 Explore how Woodpecker Service mode in Milvus 3.0 separates fast WAL writes from log retention with direct replication, local reads, and object storage.
origin: https://milvus.io/blog/try-woodpecker-on-your-write-workload.md
---
Write-ahead logging (WAL) has always been a balancing act between three goals: durability, latency, and cost.

Traditional distributed log systems such as Kafka, Pulsar, and BookKeeper have become foundational components for databases and streaming platforms. They provide reliable replication and scalable persistence, but many of these systems were designed around assumptions from the data center era. Although they have evolved to support cloud deployments, replication traffic, local retention, and recovery remain significant cost factors.

Cloud environments introduce a different set of constraints. A database running across availability zones needs to consider more than replication correctness. Cross-AZ network traffic directly affects operating costs. Local SSD capacity is expensive compared with object storage. Recovery and scaling need to work efficiently in environments where nodes can be replaced dynamically.

This problem led us to build **Woodpecker**, Milvus's native WAL service designed for cloud deployments. From RocksMQ in standalone deployments to Kafka and Pulsar in distributed clusters, Milvus has continuously evolved its WAL architecture. Woodpecker takes lessons from distributed log systems such as BookKeeper, but redesigns the data path around cloud storage and networking.

Milvus supports two Woodpecker modes:

-   **Embedded mode (available in Milvus 2.6+):** optimized for minimal infrastructure overhead.
-   **Service mode (available in Milvus 3.0+):** designed to deliver low latency while keeping infrastructure costs low.

This article starts with the embedded write path, then examines how Service mode reduces write latency and controls storage and cross-AZ network costs.

## Embedded mode writes directly to object storage

The embedded path is deliberately small. A Woodpecker client inside Milvus collects writes in memory and flushes a batch to object storage. Etcd holds the log metadata. No dedicated log servers sit between the client and storage.

![](./try-woodpecker-on-your-write-workload-1.png)

_Figure 1. Embedded mode buffers writes inside Milvus and sends batches directly to object storage._

For workloads that value throughput over the latency of an individual write, this is an economical arrangement. It removes the compute and operational cost of a separate messaging cluster. The WAL still consumes memory and incurs storage and request charges, but there is very little additional infrastructure to run.

The batching window sets the limit. A write cannot complete until its batch reaches object storage. Reducing that wait requires a different place to acknowledge the write, which is what **Woodpecker Service mode** provides.

## Service mode completes writes on replicated LogStores

Service mode places LogStore replicas between the Woodpecker client and object storage. The client writes to the replicas, waits for a quorum, and can complete the append before the log has been uploaded to object storage. This keeps the object storage upload out of the write's acknowledgment path.

![](./try-woodpecker-on-your-write-workload-2.png)

_Figure 2. LogStore replicas acknowledge new writes; rolled segments are uploaded to shared object storage._

Adding replicas creates its own costs. Woodpecker limits them by letting the client coordinate replication directly, choosing nearby replicas for reads, and moving completed segments off local disks promptly.

### The client coordinates replication in one round trip

In a broker-mediated write path, the client first sends the payload to a broker or leader. That node forwards it to replicas and waits for the required acknowledgments. The initial hop comes before the replication work and can cross an availability zone boundary of its own.

Woodpecker uses client-driven replication. Its client sends the payload directly to the replicas in parallel and collects their acknowledgments. Quorum replication takes one network round trip (RTT), avoiding the extra forwarding step through a broker or leader.

With three replicas in three availability zones (AZs), and the client in one of those zones, two payload copies cross AZ boundaries. A broker-mediated path can incur those same replication transfers plus the initial client-to-broker transfer. Direct replication removes that additional hop without reducing the number of replicas.

### Readers choose a nearby replica and access it directly

Once the log has replicas across AZs, a reader often has the data it needs nearby. Sending the request through a remote broker adds a network hop and potentially a cross-AZ charge, even when a local replica could serve it.

Woodpecker's client uses topology information to choose the closest available replica and reads from it directly. When an eligible replica is available in the reader's AZ, the read stays local. The client can fall back to a remote replica when the local replica cannot serve the request.

### Segment rolling keeps retained history off local disks

LogStore replicas provide a fast place to accept writes. Keeping hours or days of log data there would recreate the storage cost that object storage is meant to avoid.

Woodpecker divides a log stream into segments and tracks each segment's lifecycle, including whether its data is held locally or in object storage. When a segment rolls, you can upload the completed segment as a whole. Its state identifies where the data lives, so moving it to object storage is part of the log's normal lifecycle.

This differs from adding a remote tier beneath a log that is primarily managed on local disks. This design must maintain mappings and metadata between the two stores. Woodpecker manages placement at the segment level and uploads rolled segments promptly, leaving local disks to hold recent writes and segments whose uploads have not yet completed.

The retention window matters even at high throughput. At 1 GB/s, delaying uploads by just one hour leaves 3.6 TB of logical data on local disks before replication, using decimal units. Rolling segments continuously lets uploads keep pace with ingestion. Upload throughput still matters: if uploads fall behind, pending segments continue to occupy local space.

### A failed node does not require copying its entire log history

When a node owns a large retained log, replacing it can require copying that history from surviving nodes. The work competes for their disk and network bandwidth and may incur cross-AZ charges. Replacing many nodes at once creates a much larger copy operation, which is especially risky when spot instances can be reclaimed.

Woodpecker keeps retained segments in shared object storage. On failover, surviving replicas can upload outstanding log data so replica recovery can proceed without waiting to copy a complete node's log history to a replacement.

Retained storage therefore scales through object storage, and recovery avoids the bandwidth bottleneck of rebuilding full histories through node-to-node copying. Large node replacements also avoid the disk and network spikes caused by recopying those histories. The local replicas remain responsible for recent writes; their disks do not have to carry the entire retention period.

## Millisecond writes with lower network and retention costs

In a representative three-replica deployment across AZs, Service mode keeps write latency in the millisecond range on equivalent hardware, comparable in order of magnitude to a traditional WAL with three local-disk replicas. The savings come from the bytes that no longer need an extra network hop or long-term storage on replicated disks.

### Cross AZ traffic

Take a three-AZ deployment with one replica per AZ and a client in one of those zones. If the broker or leader is equally likely to be in any AZ, the initial write hop crosses an AZ boundary with probability 2/3. Replication then adds two cross-AZ payload copies. For reads, the comparison assumes replica selection without a preference for the reader's AZ.

| **Path** | **Broker-mediated baseline** | **Woodpecker Service mode** |
| --- | --- | --- |
| Write | 2 + 2/3 cross-AZ payload copies on average | 2 cross-AZ payload copies |
| Read | 2/3 of reads cross AZs on average | Local reads when an eligible same-AZ replica is available |

The write path saves an expected 2/3 of one payload transfer, or 25% of the baseline's cross-AZ payload traffic. On the read path, locality avoids the transfers that the baseline's remote reads would incur.

At a steady 20 MB/s, a 30-day month contains 51,840 GB of writes (decimal units). With an assumed transfer charge of $0.01/GB at each end of a cross-AZ transfer, the write-path saving is:

51,840 GB × $0.02/GB × 2/3 = $691.20 per month

If reads also sustain 20 MB/s and can all use local replicas, the same calculation yields another $691.20 per month in avoided read traffic. These figures describe the specified topology and routing assumptions; other replica placements and routing policies change the comparison.

### Retained storage

A steady 20 MB/s produces 5,184 GB of logical log data over 72 hours. Retaining that volume on three gp3 replicas requires 15,552 GB of provisioned capacity. Retaining the same history in S3 Standard is billed as one logical copy. Using illustrative rates of $0.12/GB-month for gp3 and $0.023/GB-month for S3 Standard gives:

| **Storage approach** | **Retained storage volume** | **Monthly capacity cost** |
| --- | --- | --- |
| Three gp3 replicas | 15,552 GB | $1,866.24 |
| One logical copy in S3 Standard | 5,184 GB | $119.23 |

At those rates, the capacity-cost difference is about $1,747 per month, with three gp3 replicas costing roughly 15.7 times as much per logical GB. The rates are illustrative rather than a current AWS quote; actual prices depend on region and date.

The retained volume depends on ingestion, retention settings, and consumer progress. Service mode also needs LogStore compute, local capacity for recent data and pending uploads, and object storage requests. The table isolates the cost of retaining the same history on the two storage media.

## Deploy Service mode with the Milvus Helm chart

Service mode runs as dedicated pods in a distributed Milvus deployment and can scale independently of other Milvus components. With the Milvus Helm repository configured, the following command enables it:

```bash
helm upgrade -i my-release zilliztech/milvus \
  --set image.all.tag=v3.0.3 \
  --set streaming.enabled=true \
  --set streaming.woodpecker.embedded=false \
  --set woodpecker.enabled=true \
  --set woodpecker.image.tag=v0.1.46
```

`streaming.woodpecker.embedded=false` switches Milvus away from the embedded path, and `woodpecker.enabled=true` tells the chart to deploy the dedicated service. The image pair above follows the recommendation in the [Woodpecker deployment guide](https://milvus.io/docs/woodpecker.md).

The chart deploys the WAL service alongside Milvus, removing the need to install and maintain a separate Kafka or Pulsar cluster. LogStore capacity can then be adjusted to the write workload independently of Milvus's other components.

# Try Woodpecker on your write workload

Woodpecker's two modes put the write acknowledgment in different places. Embedded mode waits for a batch to reach object storage and keeps dedicated WAL infrastructure to a minimum. Service mode acknowledges writes through replicas, then uses object storage for retention and recovery. Direct replication and local reads keep the additional service from introducing unnecessary network hops.

If your workload needs low write latency across AZs, try the Woodpecker Service mode in Milvus 3.0. The [Woodpecker documentation](https://milvus.io/docs/woodpecker.md) covers deployment and tuning, and the [Milvus 3.0 release notes](https://milvus.io/docs/release_notes.md) cover the broader release. To discuss your ingestion rate, latency requirements, or deployment topology with the team, join the [Milvus Discord community](https://discord.com/invite/8uyFbECzPX).

#
