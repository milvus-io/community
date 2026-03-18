---
id: troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
title: >
 Troubleshooting a Search Slowdown After Upgrading Milvus: Lessons from the WPS Team
author: the WPS engineering team
date: 2026-3-18
cover: assets.zilliz.com/Version_A_Warm_Background_20b93359df.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting, cross-version restore
meta_keywords: Milvus upgrade, milvus-backup, Milvus search latency, Milvus troubleshooting, cross-version restore
meta_title: >
 Troubleshooting a Search Slowdown After Upgrading Milvus
desc: >
 After upgrading Milvus from 2.2 to 2.5, the WPS team hit a 3-5x search latency regression. The cause: a single milvus-backup restore flag that fragmented segments.
origin: https://milvus.io/blog/troubleshooting-a-search-slowdown-after-upgrading-milvus-lessons-from-the-wps-team.md
---



*This post was contributed by the WPS engineering team at Kingsoft Office Software, who use Milvus in a recommendation system. During their upgrade from Milvus 2.2.16 to 2.5.16, search latency increased by 3 to 5 times. This article walks through how they investigated the problem and fixed it, and may be helpful to others in the community planning a similar upgrade.*

## Why We Upgraded Milvus

We are part of the WPS engineering team building productivity software, and we use Milvus as the vector search engine behind real-time similarity search in our online recommendation system. Our production cluster stored tens of millions of vectors, with an average dimension of 768. The data was served by 16 QueryNodes, and each pod was configured with limits of 16 CPU cores and 48 GB of memory.

While running Milvus 2.2.16, we ran into a serious stability issue that was already affecting the business. Under high query concurrency, `planparserv2.HandleCompare` could cause a null pointer exception, causing the Proxy component to panic and restart frequently. This bug was very easy to trigger in high-concurrency scenarios and directly affected the availability of our online recommendation service.

Below is the actual Proxy error log and stack trace from the incident:

```
[2025/12/23 10:43:13.581 +00:00] [ERROR] [concurrency/pool_option.go:53] ["Conc pool panicked"]
[panic="runtime error: invalid memory address or nil pointer dereference"]
[stack="...
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345
...
github.com/milvus-io/milvus/internal/proxy.(*queryTask).PreExecute
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_query.go:271
github.com/milvus-io/milvus/internal/proxy.(*taskScheduler).processTask
  /go/src/github.com/milvus-io/milvus/internal/proxy/task_scheduler.go:455
..."]

panic: runtime error: invalid memory address or nil pointer dereference [recovered]
panic: runtime error: invalid memory address or nil pointer dereference
[signal SIGSEGV: segmentation violation code=0x1 addr=0x8 pc=0x2f1a02a]
  
goroutine 989 [running]:
github.com/milvus-io/milvus/internal/parser/planparserv2.HandleCompare(...)
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/utils.go:331 +0x2a
github.com/milvus-io/milvus/internal/parser/planparserv2.(*ParserVisitor).VisitEquality(...)
  /go/src/github.com/milvus-io/milvus/internal/parser/planparserv2/parser_visitor.go:345 +0x7e5
```

**What the stack trace shows**: The panic occurred during query preprocessing in Proxy, within `queryTask.PreExecute`. The call path was:

`taskScheduler.processTask` → `queryTask.PreExecute` → `planparserv2.CreateRetrievePlan` → `planparserv2.HandleCompare`

The crash occurred when `HandleCompare` attempted to access invalid memory at address `0x8`, triggering a SIGSEGV and causing the Proxy process to crash.

**To completely eliminate this stability risk, we decided to upgrade the cluster from Milvus 2.2.16 to 2.5.16.**

## Backing Up Data With milvus-backup Before the Upgrade

Before touching the production cluster, we backed up everything using the official [milvus-backup](https://github.com/zilliztech/milvus-backup) tool. It supports backup and restore within the same cluster, across clusters, and across Milvus versions.

### Checking Version Compatibility

milvus-backup has two version rules for [cross-version restores](https://milvus.io/docs/milvus_backup_overview.md):

1.  **The target cluster must run the same Milvus version or a newer one.** A backup from 2.2 can load into 2.5, but not the other way around.
    
2.  **The target must be at least Milvus 2.4.** Older restore targets aren't supported.
    

Our path (backup from 2.2.16, load into 2.5.16) satisfied both rules.

| Backup From ↓ \ Restore To → | 2.4 | 2.5 | 2.6 |
| --- | --- | --- | --- |
| 2.2 | ✅ | ✅ | ✅ |
| 2.3 | ✅ | ✅ | ✅ |
| 2.4 | ✅ | ✅ | ✅ |
| 2.5 | ❌ | ✅ | ✅ |
| 2.6 | ❌ | ❌ | ✅ |

### How Milvus-Backup Works

Milvus Backup facilitates backup and restore of metadata, segments, and data across Milvus instances. It provides northbound interfaces, such as a CLI, an API, and a gRPC-based Go module, for flexible manipulation of backup and restore processes.

  

Milvus Backup reads collection metadata and segments from the source Milvus instance to create a backup. It then copies collection data from the root path of the source Milvus instance and saves it to the backup root path.

  

To restore from a backup, Milvus Backup creates a new collection in the target Milvus instance based on the collection metadata and segment information in the backup. It then copies the backup data from the backup root path to the target instance's root path.

### Running the Backup

We prepared a dedicated config file, `configs/backup.yaml`. The main fields are shown below, with sensitive values removed:

```
milvus:
  address: 1.1.1.1  # Source Milvus address
  port: 19530  # Source Milvus port
  user: root  # Source Milvus username (must have backup permissions)
  password: <PASS> # Source Milvus user password

  etcd:
    endpoints: "2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379" # Endpoints of the etcd cluster connected to Milvus
    rootPath: "by-dev"  # Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.

minio:
  # Source Milvus object storage bucket configuration
  storageType: "aliyun" # support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative
  address: ks3-cn-beijing-internal.ksyuncs.com # Address of MinIO/S3
  port: 443   # Port of MinIO/S3
  accessKeyID: <Source object storage AK>  
  secretAccessKey: <Source object storage SK> 
  useSSL: true
  bucketName: "<Source object storage bucket name>"
  rootPath: "file" # Root directory prefix under the source object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.

  # Object storage bucket configuration for storing backup data
  backupStorageType: "aliyun" # support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com # Address of MinIO/S3
  backupPort: 443   # Port of MinIO/S3
  backupAccessKeyID: <Backup bucket AK> 
  backupSecretAccessKey: <Backup bucket SK> 
  backupBucketName: <Backup bucket name>
  backupRootPath: "backup" # Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath
  backupUseSSL: true # Access MinIO/S3 with SSL
  crossStorage: "true"  # Must be set to true when performing cross-storage backup
```

We then ran this command:

```
# Create a backup using milvus-backup
./milvus-backup create --config configs/backup.yaml -n backup_v2216
```

`milvus-backup` supports **hot backup**, so it usually has little impact on online traffic. Running during off-peak hours is still safer to avoid resource contention.

### Verifying the Backup

After the backup finished, we verified it was complete and usable. We mainly checked whether the number of collections and segments in the backup matched those in the source cluster.

```# List backups
./milvus-backup list --config configs/backup.yaml
# View backup details and confirm the number of Collections and Segments
./milvus-backup get --config configs/backup.yaml -n backup_v2216
```

They matched, so we moved on to the upgrade.

## Upgrading With Helm Chart

Jumping three major versions (2.2 → 2.5) with tens of millions of vectors made an in-place upgrade too risky. We built a new cluster instead and migrated data into it. The old cluster stayed online for rollback.

### Deploying the New Cluster

We deployed the new Milvus 2.5.16 cluster with Helm:

```
# Add the Milvus Helm repository
: helm repo add milvus https://zilliztech.github.io/milvus-helm/
helm repo update  
# Check the Helm chart version corresponding to the target Milvus version
: helm search repo milvus/milvus -l | grep 2.5.16
milvus/milvus        4.2.58               2.5.16                    Milvus is an open-source vector database built ...
  
# Deploy the new version cluster (with mmap disabled)
helm install milvus-v25 milvus/milvus \
  --namespace milvus-new \
  --values values-v25.yaml \
  --version 4.2.58 \
  --wait
```

### Key Configuration Changes (`values-v25.yaml`)

To make the performance comparison fair, we kept the new cluster as similar to the old one as possible. We only changed a few settings that mattered for this workload:

-   **Disable Mmap** (`mmap.enabled: false`): Our recommendation workload is sensitive to latency. If Mmap is enabled, some data may be read from disk when needed, which can add disk I/O delay and cause latency spikes. We turned it off so the data would stay fully in memory and query latency would be more stable.
    
-   **QueryNode count:** kept at **16**, same as the old cluster
    
-   **Resource limits:** each Pod still had **16 CPU cores**, the same as the old cluster
    

### Tips for major-version upgrades:

-   **Build a new cluster instead of upgrading in place.** You avoid metadata-compatibility risks and maintain a clean rollback path.
    
-   **Verify your backup before migrating.** Once data is in the new version's format, you can't easily go back.
    
-   **Keep both clusters running during cutover.** Shift traffic gradually and only decommission the old cluster after full verification.
    

## Migrating Data After the Upgrade with Milvus-Backup Restore

We used `milvus-backup restore` to load the backup into the new cluster. In milvus-backup's terminology, "restore" means "load backup data into a target cluster." The target must run the same Milvus version or a newer one, so, despite the name, restores always move data forward.

### Running the Restore

The restore config file, `configs/restore.yaml`, had to point to the **new cluster** and its storage settings. The main fields looked like this:

```
# Restore target Milvus connection information
milvus:
  address: 1.1.1.1  # Milvus address
  port: 19530  # Milvus port
  user: root  # Milvus username (must have restore permissions)
  password: <PASS> # Milvus user password  
  etcd:
    endpoints: "2.2.2.1:2379,2.2.2.2:2379,2.2.2.3:2379" # Endpoints of the etcd cluster connected to the target Milvus
    rootPath: "by-dev"  # Prefix of Milvus metadata in etcd. If not modified, the default is by-dev. It is recommended to check etcd before proceeding.

minio:
  # Target Milvus object storage bucket configuration
  storageType: "aliyun" # support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent), gcpnative
  address: ks3-cn-beijing-internal.ksyuncs.com # Address of MinIO/S3
  port: 443   # Port of MinIO/S3
  accessKeyID: <Object storage AK>  
  secretAccessKey: <Object storage SK> 
  useSSL: true
  bucketName: "<Object storage bucket name>"
  rootPath: "file" # Root directory prefix under the object storage bucket where the current Milvus data is stored. If Milvus is installed using Helm Chart, the default prefix is file. It is recommended to log in to the object storage and verify before proceeding.

  # Object storage bucket configuration for storing backup data
  backupStorageType: "aliyun" # support storage type: local, minio, s3, aws, gcp, ali(aliyun), azure, tc(tencent)
  backupAddress: ks3-cn-beijing-internal.ksyuncs.com # Address of MinIO/S3
  backupPort: 443   # Port of MinIO/S3
  backupAccessKeyID: <Backup bucket AK> 
  backupSecretAccessKey: <Backup bucket SK> 
  backupBucketName: <Backup bucket name>
  backupRootPath: "backup" # Root path to store backup data. Backup data will be stored in backupBucketName/backupRootPath
  backupUseSSL: true # Access MinIO/S3 with SSL
  crossStorage: "true"  # Must be set to true when performing cross-storage backup
```

We then ran:

```
./milvus-backup restore --config configs/restore.yaml -n backup_v2216 --rebuild_index
```

`restore.yaml` needs the new cluster’s Milvus and MinIO connection information so the restored data is written to the new cluster’s storage.

### Checks After Restore

After the restore finished, we checked four things to make sure the migration was correct:

-   **Schema.** The collection schema in the new cluster had to exactly match the old one, including field definitions and vector dimensions.
    
-   **Total row count.** We compared the total number of entities in the old and new clusters to make sure no data was lost.
    
-   **Index status.** We confirmed that all indexes had finished building and that their status was set to `Finished`.
    
-   **Query results.** We ran the same queries on both clusters and compared the returned IDs and distance scores to make sure the results matched.
    

## Gradual Traffic Shift and the Latency Surprise

We moved production traffic to the new cluster in stages:

| Phase | Traffic Share | Duration | What We Watched |
| --- | --- | --- | --- |
| Phase 1 | 5% | 24 hours | P99 query latency, error rate, and result accuracy |
| Phase 2 | 25% | 48 hours | P99/P95 query latency, QPS, CPU usage |
| Phase 3 | 50% | 48 hours | End-to-end metrics, resource usage |
| Phase 4 | 100% | Continued monitoring | Overall metric stability |

We kept the old cluster running the whole time for instant rollback. 

**During this rollout, we spotted the problem: search latency on the new v2.5.16 cluster was 3-5 times higher than on the old v2.2.16 cluster.**

## Finding the Cause of the Search Slowdown

### Step 1: Check Overall CPU Usage

We started with CPU usage per component to see whether the cluster was short on resources.

| Component | CPU Usage (cores) | Analysis |
| --- | --- | --- |
| QueryNode | 10.1 | The limit was 16 cores, so usage was about 63%. Not fully used |
| Proxy | 0.21 | Very low |
| MixCoord | 0.11 | Very low |
| DataNode | 0.14 | Very low |
| IndexNode | 0.02 | Very low |

This showed that QueryNode still had enough CPU available. So the slowdown was **not caused by overall CPU shortage**.

### Step 2: Check QueryNode Balance

Total CPU looked fine, but individual QueryNode pods had a **clear imbalance**:

| QueryNode Pod | CPU Usage (Last) | CPU Usage (Max) |
| --- | --- | --- |
| querynode-pod-1 | 8.38% | 9.91% |
| querynode-pod-2 | 5.34% | 6.85% |
| querynode-pod-3 | 4.37% | 6.73% |
| querynode-pod-4 | 4.26% | 5.89% |
| querynode-pod-5 | 3.39% | 4.82% |
| querynode-pod-6 | 3.97% | 4.56% |
| querynode-pod-7 | 2.65% | 4.46% |
| querynode-pod-8 | 2.01% | 3.84% |
| querynode-pod-9 | 3.68% | 3.69% |

Pod-1 used nearly 5x as much CPU as pod-8. That's a problem because Milvus fans a query out to all QueryNodes and waits for the slowest one to finish. A few overloaded pods were dragging down every single search.

### Step 3: Compare Segment Distribution

Uneven load usually indicates an uneven data distribution, so we compared the segment layouts between the old and new clusters.

**v2.2.16 segment layout (13 segments total)**

| Row count range | Segment count | State |
| --- | --- | --- |
| 740,000 ~ 745,000 | 12 | Sealed |
| 533,630 | 1 | Sealed |

The old cluster was fairly even. It had only 13 segments, and most of them had about **740,000 rows**.

**v2.5.16 segment layout (21 segments total)**

| Row count range | Segment count | State |
| --- | --- | --- |
| 680,000 ~ 685,000 | 4 | Sealed |
| 560,000 ~ 682,550 | 5 | Sealed |
| 421,575 ~ 481,800 | 4 | Sealed |
| 358,575 ~ 399,725 | 4 | Sealed |
| 379,650 ~ 461,725 | 4 | Sealed |

The new cluster looked very different. It had 21 segments (60% more), with varying segment size: some held ~685k rows, others barely 350k. The restore had scattered data unevenly.

### Root Cause

We traced the problem back to our original restore command:

```
./milvus-backup restore --config configs/restore.yaml -n backup_v2216 \
  --rebuild_index \
  --use_v2_restore \
  --drop_exist_collection \
  --drop_exist_index
```

That `--use_v2_restore` flag enables segment merging restore mode, which groups multiple segments into a single restore job. This mode is designed to speed up restores when you have many small segments. 

But in our cross-version restore (2.2 → 2.5), the v2 logic rebuilt segments differently from the original cluster: it split large segments into smaller, unevenly sized ones. Once loaded, some QueryNodes got stuck with more data than others.

This hurt performance in three ways:

-   **Hot nodes:** QueryNodes with larger or more segments had to do more work
    
-   **Slowest-node effect:** distributed query latency depends on the slowest node
    
-   **More merge overhead:** more segments also meant more work when merging results
    

### The Fix

We removed `--use_v2_restore` and restored with the default logic:

```
./milvus-backup restore --config configs/restore.yaml -n backup_v2216
```

We cleaned up the bad data from the new cluster first, then ran the default restore. Segment distribution returned to balance, search latency returned to normal, and the problem was gone.

## What We'd Do Differently Next Time

In this case, it took us too long to find the real issue: **uneven segment distribution**. Here's what would have made it faster.

### Improve Segment Monitoring

Milvus doesn't expose segment count, row distribution, or size distribution per collection in standard Grafana dashboards. We had to manually dig through [Attu](https://github.com/zilliztech/attu) and etcd, which was slow.

It would help to add:

-   a **segment distribution dashboard** in Grafana, showing how many segments each QueryNode has loaded, plus their row counts and sizes
    
-   an **imbalance alert**, triggered when segment row counts across nodes skew beyond a threshold
    
-   a **migration comparison view**, so users can compare segment distribution between the old and new clusters after an upgrade
    

### Use a Standard Migration Checklist

We checked the row count and deemed it fine. That wasn't enough. A complete post-migration validation should also cover:

-   **Schema consistency.** Do field definitions and vector dimensions match?
    
-   **Segment count.** Did the number of segments change drastically?
    
-   **Segment balance.** Are row counts across segments reasonably even?
    
-   **Index status.** Are all the indexes `finished`?
    
-   **Latency benchmark.** Do P50, P95, and P99 query latencies look similar to the old cluster?
    
-   **Load balance.** Is the CPU usage of QueryNode evenly distributed across pods?
    

### Add Automated Checks

You can script this validation with PyMilvus to catch imbalance before it hits production:

```
from pymilvus import connections, utility, Collection  
def check_segment_balance(collection_name: str):
    """Check Segment distribution balance"""
    collection = Collection(collection_name)
    segments = utility.get_query_segment_info(collection_name)
    # Group statistics by QueryNode
    node_stats = {}
    for seg in segments:
        node_id = seg.nodeID
        if node_id not in node_stats:
            node_stats[node_id] = {"count": 0, "rows": 0}
        node_stats[node_id]["count"] += 1
        node_stats[node_id]["rows"] += seg.num_rows
    # Calculate balance
    row_counts = [v["rows"] for v in node_stats.values()]
    avg_rows = sum(row_counts) / len(row_counts)
    max_deviation = max(abs(r - avg_rows) / avg_rows for r in row_counts)
    print(f"Number of nodes: {len(node_stats)}")
    print(f"Average row count: {avg_rows:.0f}")
    print(f"Maximum deviation: {max_deviation:.2%}")
    if max_deviation > 0.2:  # Raise a warning if deviation exceeds 20%
        print("⚠️ Warning: Segment distribution is unbalanced and may affect query performance!")
    for node_id, stats in sorted(node_stats.items()):
        print(f"  Node {node_id}: {stats['count']} segments, {stats['rows']} rows")
  
# Usage example
connections.connect(host="localhost", port="19530")
check_segment_balance("your_collection_name")
```

### Use Existing Tools Better

A few tools already support segment-level diagnostics:

-   **Birdwatcher:** can read Etcd metadata directly and show segment layout and channel assignment
    
-   **Milvus Web UI (v2.5+):** lets you inspect segment information visually
    
-   **Grafana + Prometheus:** can be used to build custom dashboards for real-time cluster monitoring
    

## Suggestions for the Milvus Community

A few changes to Milvus would make this kind of troubleshooting easier:

1.  **Explain parameter compatibility more clearly**The `milvus-backup` docs should clearly explain how options like `--use_v2_restore` behave during cross-version restores and the risks they may introduce.
    
2.  **Add better checks after restore**After the `restore` finishes, it would be helpful if the tool automatically printed a summary of the segment distribution.
    
3.  **Expose balance-related metrics**Prometheus metrics should include segment balance information, so users can monitor it directly.
    
4.  **Support query plan analysis**Similar to MySQL `EXPLAIN`, Milvus would benefit from a tool that shows how a query is executed and helps locate performance issues.
    

## Conclusion

To sum up:

| Stage | Tool / Method | Key Point |
| --- | --- | --- |
| Backup | milvus-backup create | Hot backup is supported, but the backup must be checked carefully |
| Upgrade | Build a new cluster with Helm | Disable Mmap to reduce I/O jitter, and keep the resource settings the same as the old cluster |
| Migration | milvus-backup restore | Be careful with --use_v2_restore. In cross-version restore, do not use non-default logic unless you clearly understand it |
| Gray rollout | Gradual traffic shift | Move traffic in stages: 5% → 25% → 50% → 100%, and keep the old cluster ready for rollback |
| Troubleshooting | Grafana + segment analysis | Do not only look at CPU and memory. Also check the segment balance and data distribution |
| Fix | Remove bad data and restore it again | Remove the wrong flag, restore with the default logic, and performance returns to normal |

When migrating data, it is important to consider more than just whether the data is present and accurate. You also need to pay attention to **how the data** **is distributed**. 

Segment count and segment sizes determine how evenly Milvus distributes query work across nodes. When segments are unbalanced, a few nodes end up doing most of the work, and every search pays for it. Cross-version upgrades carry extra risk here because the restore process may rebuild segments differently from the original cluster. Flags like `--use_v2_restore` can fragment your data in ways that row counts alone won't show.

Therefore, the safest approach in cross-version migration is to stick with the default restore settings unless you have a specific reason to do otherwise. Also, monitoring should go beyond CPU and memory; you need insight into the underlying data layout, particularly segment distribution and balance, to detect problems earlier. 

## A Note from the Milvus Team

We’d like to thank the WPS engineering team for sharing this experience with the Milvus community. Write-ups like this are valuable because they capture real production lessons and make them useful to others facing similar issues.

If your team has a technical lesson, a troubleshooting story, or practical experience worth sharing, we’d love to hear from you. Join our [Slack Channel](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email) and reach out to us there.

And if you’re working through challenges of your own, those same community channels are a good place to connect with Milvus engineers and other users. You can also book a one-on-one session through [Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md) for help with backup and restore, cross-version upgrades, and query performance.

[![](https://assets.zilliz.com/Blog_Milvus_1_9eca411038.png)](https://zilliz.com/share-your-story)
