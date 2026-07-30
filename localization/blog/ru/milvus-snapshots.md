---
id: milvus-snapshots.md
title: >-
  Снимки Milvus: представления коллекций на определённый момент времени без
  копирования данных
author: Leo Liu
date: 2026-7-30
cover: assets.zilliz.com/feature_blog_c58ec6904b.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus snapshot, Milvus point-in-time restore, Milvus backup vs snapshot,
  vector database rollback
meta_title: |
  Milvus Snapshots: Point-in-Time Views Without Data Copies
desc: >-
  Снапшоты Milvus фиксируют коллекцию, записывая ссылки на файлы вместо
  копирования данных — недорогие точки восстановления, восстановление без
  перестроения индекса и стабильные входные данные для Spark.
origin: 'https://milvus.io/blog/milvus-snapshots.md'
---
<p>A production database collection doesn’t stop taking writes because you need a stable version of it. Listings change, prices update, new documents land, agents write back. Meanwhile, the work that happens around that collection — evaluating a new embedding model, validating a backfill, standing up a load-test cluster, running a nightly batch job — needs data that holds still.</p>
<p>Currently, the way to get data that holds still is to copy it. That works, and for long-term retention it’s the right answer. But it prices every stable version at a full pass over the collection’s bytes, and prices every recovery at a full re-import plus a full index rebuild. At that price, you take recovery points before quarterly migrations, not before every model push.</p>
<p><strong>Snapshots lower that price. A <a href="https://milvus.io/docs/snapshots.md">Milvus snapshot</a> is a named, read-only version of a collection that records references to existing data, index, and metadata files rather than copying the dataset.</strong> Take one before a risky change, and you can roll back to it, clone it into a second cluster, and feed it to a batch job — three tasks that would otherwise mean three copies of the data.</p>
<h2 id="Why-do-AI-teams-need-Milvus-snapshots" class="common-anchor-header">Why do AI teams need Milvus snapshots?<button data-href="#Why-do-AI-teams-need-Milvus-snapshots" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a> already covers disaster recovery and long-term retention, and for that job it remains the right tool. What changed is that stable versions of a collection are now needed far more often than a backup schedule assumes, and for reasons that have nothing to do with data loss.</p>
<table>
<thead>
<tr><th><strong>What the AI team is doing</strong></th><th><strong>Common approach</strong></th><th><strong>Where it hurts</strong></th></tr>
</thead>
<tbody>
<tr><td>Keeping a recovery point before a model or data change</td><td>Run a full backup on a schedule</td><td>Create time and I/O grow with total data size, so checkpoints stay infrequent</td></tr>
<tr><td>Rolling back a model or data version</td><td>Re-import the old data and rebuild indexes</td><td>Long recovery path, and index-build compute is spent a second time</td></tr>
<tr><td>Preparing a test, staging, or load-test environment</td><td>Export, transfer, and import production data</td><td>Every environment needs its own data-preparation pipeline</td></tr>
<tr><td>Running a long batch job over production data</td><td>Copy the online data offline first</td><td>Production keeps writing, so the job’s input drifts away from what’s live</td></tr>
</tbody>
</table>
<p><strong>Four different tasks, one shared requirement: a version of the Milvus collection that is stable, addressable, and readable by something other than the cluster that produced it.</strong> All four tasks previously satisfied it by copying, because copying was the only way to make a version stop moving.</p>
<p>Take an e-commerce search team, for example. Their <code translate="no">products</code> collection in Milvus holds each item’s attributes plus an embedding, and a vector search compares the shopper’s query embedding against those product embeddings; listings and prices change all day. Now they want to move to a better embedding model, which means re-embedding the entire catalog and replacing every vector in the live collection. Before doing something that’s hard to undo, they want a version to roll back to, the same catalog in an isolated cluster to load-test against, and a fixed product set so Spark can score the old and new models on identical rows.</p>
<p><strong>Before we roll out snapshots, the solution is three copies and three pipelines.</strong></p>
<h2 id="What-a-Milvus-snapshot-records" class="common-anchor-header">What a Milvus snapshot records<button data-href="#What-a-Milvus-snapshot-records" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The snapshot design rests on a property Milvus storage already has: its files are write-once. Sealed segments, index files, and delete logs are written and never modified in place. Compaction doesn’t edit files — it produces new ones and retires old ones.</p>
<p>That makes a point-in-time version expressible without copying anything. If no file is ever mutated, then the state of a collection at a given moment is fully described by the set of file references that were live at that moment. Preserving the state means recording which files those were and preventing them from being deleted.</p>
<p><code translate="no">CreateSnapshot</code> records exactly that: the data boundary for the operation, the file references, and the collection metadata — schema, partitions, properties, and index information. Each segment gets an Apache Avro manifest, and the snapshot’s own metadata is stored as JSON. No vector data is duplicated.</p>
<h2 id="What-you-can-do-with-Milvus-snapshots" class="common-anchor-header">What you can do with Milvus snapshots<button data-href="#What-you-can-do-with-Milvus-snapshots" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>In Milvus 3.0, we introduced four snapshot capabilities that sit on top of that one read-only version:</p>
<table>
<thead>
<tr><th><strong>Capability</strong></th><th><strong>Mechanism</strong></th><th><strong>What it changes</strong></th><th><strong>Availability</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Lightweight snapshots</strong></td><td>Records data, index, and metadata references instead of copying data files</td><td>Recovery points cheap enough to take every risky change before</td><td>Available now</td></tr>
<tr><td><strong>Fast restore</strong></td><td>Copies the data and index files the snapshot references</td><td>No full re-import, no index rebuild</td><td>Available now</td></tr>
<tr><td><strong>Cross-cluster movement</strong></td><td>A second cluster restores straight from the snapshot metadata URI; export only when it can’t reach the storage</td><td>One version reusable for migration, load testing, and isolated environments</td><td>Coming soon.</td></tr>
<tr><td><strong>Stable views</strong></td><td>External Collection and the Spark connector read the frozen version in place</td><td>Batch jobs get a fixed input while production keeps taking writes</td><td>Available now</td></tr>
</tbody>
</table>
<p>The four capabilities are options, not a sequence. Once a snapshot exists, you can restore it where it came from, hand it to a different cluster, or point External Collection and Spark at it — in any combination, or none. Every consumer resolves the same file references, so nobody has to prepare a separate input copy.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_snapshots_b21369bbcd.png" alt="Milvus snapshot" class="doc-image" id="milvus-snapshot" />
    <span>Milvus snapshot</span>
  </span>
</p>
<p><em>Figure 1. A single snapshot supports multiple consumption paths. They are independent options, not sequential steps.</em></p>
<h2 id="Lightweight-snapshot-cost-tracks-file-counts-not-data-size" class="common-anchor-header">Lightweight snapshot: cost tracks file counts, not data size<button data-href="#Lightweight-snapshot-cost-tracks-file-counts-not-data-size" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>A full backup has to move the collection’s data bytes. Snapshot creation processes metadata and file references instead, so its cost is driven by the number of segments, index files, and manifest entries, and by object-storage request latency. It does not grow with the collection’s total size.</p>
<p><code translate="no">CreateSnapshot</code> typically lands in the millisecond range, but that number depends on your segment count and your object store’s request latency, not something to plan capacity against.</p>
<h2 id="Growing-data-is-outside-the-snapshot-unless-you-flush" class="common-anchor-header">Growing data is outside the snapshot unless you flush<button data-href="#Growing-data-is-outside-the-snapshot-unless-you-flush" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><code translate="no">CreateSnapshot</code> does not flush. The reason follows from the same mechanism: growing segments aren’t file-resident yet, so there are no file references for a manifest to record. Whatever is still in growing state when you create a snapshot falls outside its boundary.</p>
<p>If the writes you just made need to be inside the version you’re freezing, run <code translate="no">Flush</code> and await completion first. If they don’t — a scheduled checkpoint, for instance — skipping the flush is a legitimate choice. What matters is knowing where the boundary landed.</p>
<pre><code translate="no" class="language-go">flushTask, err := client.Flush(ctx,
    milvusclient.NewFlushOption(<span class="hljs-string">&quot;products&quot;</span>))
<span class="hljs-keyword">if</span> err != <span class="hljs-literal">nil</span> {
    <span class="hljs-keyword">return</span> err
}
<span class="hljs-keyword">if</span> err := flushTask.Await(ctx); err != <span class="hljs-literal">nil</span> {
    <span class="hljs-keyword">return</span> err
}

err = client.CreateSnapshot(ctx,
    milvusclient.NewCreateSnapshotOption(
        <span class="hljs-string">&quot;before_model_v2&quot;</span>,
        <span class="hljs-string">&quot;products&quot;</span>,
    ).WithDescription(<span class="hljs-string">&quot;Recovery point before model v2&quot;</span>))
<button class="copy-code-btn"></button></code></pre>
<p>For the product search team in our previous example, <code translate="no">before_model_v2</code> now names a fixed set of files: the catalog exactly as it stood before anyone touched the embeddings. That one snapshot serves the rollback point, the isolated load-test cluster, and the Spark evaluation.</p>
<h2 id="Cheap-to-create-is-not-free-to-keep" class="common-anchor-header">Cheap to create is not free to keep<button data-href="#Cheap-to-create-is-not-free-to-keep" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><strong>Creating snapshots does not mean zero storage cost.</strong></p>
<p>Milvus reclaims segment and index files once nothing references them. A snapshot is a reference, so every file it names becomes exempt from garbage collection. Meanwhile, the live collection keeps flushing new segments, compacting old ones into new ones, and applying deletes — each of those operations produces files the snapshot doesn’t reference and retires files it does. The snapshot’s file set and the live collection’s file set diverge over time, and that divergence is what you pay for.</p>
<p>Held long enough on a collection with enough churn, a snapshot approaches the cost of a second full copy. In certain cases, a single snapshot can double object storage cost. So the operational work this feature introduces isn’t creation but retention: give snapshots names that say what they were for (<code translate="no">before_model_v2</code> rather than <code translate="no">snapshot_3</code>), and use <code translate="no">ListSnapshots</code> and <code translate="no">DropSnapshot</code> to retire them once they stop earning their storage.</p>
<h2 id="Fast-restore-reusing-index-files-that-are-already-built" class="common-anchor-header">Fast restore: reusing index files that are already built<button data-href="#Fast-restore-reusing-index-files-that-are-already-built" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><strong>A conventional restore has two expensive stages: importing the data and rebuilding the indexes.</strong> For a large collection with a costly index, both stages hold CPU, network, and object-storage I/O for a long time.</p>
<p><code translate="no">RestoreSnapshot</code> copies the data and index files the snapshot references and rebuilds the collection metadata around them. The index files come from a build that already completed, so nothing is recomputed.</p>
<pre><code translate="no" class="language-go">jobID, err := client.RestoreSnapshot(ctx,
    milvusclient.NewRestoreSnapshotOption(
        <span class="hljs-string">&quot;before_model_v2&quot;</span>,
        <span class="hljs-string">&quot;products&quot;</span>,
        <span class="hljs-string">&quot;products_rollback&quot;</span>,
    ))
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">RestoreSnapshot</code> is asynchronous and non-destructive. It returns a job ID and runs in the background, so application code polls <code translate="no">GetRestoreSnapshotState</code> for progress rather than blocking, then loads the new collection when it completes.</p>
<p><code translate="no">RestoreSnapshot</code> also restores into a new collection — <code translate="no">products_rollback</code>, not <code translate="no">products</code>. The original is never overwritten. The team can validate the restored collection, compare it against what’s live, and only then decide whether to move traffic. A rollback you can inspect before committing to is a different operation from one that begins by destroying the current state.</p>
<h2 id="Cross-cluster-data-movement-an-access-problem-not-a-transfer-problem" class="common-anchor-header">Cross-cluster data movement: an access problem, not a transfer problem<button data-href="#Cross-cluster-data-movement-an-access-problem-not-a-transfer-problem" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Because a snapshot is a set of references plus metadata rather than a payload, getting a version to a second cluster is a question of access, not transfer. The target doesn’t need the data shipped to it; it needs permission and a network path to read where the data already sits.</p>
<p><code translate="no">RestoreExternalSnapshot</code> accepts the snapshot metadata URI directly. If the target cluster can read that metadata and the data and index files it references, it can create the collection. No export step is required.</p>
<pre><code translate="no" class="language-go">snapshot, err := sourceClient.DescribeSnapshot(ctx,
    milvusclient.NewDescribeSnapshotOption(
        <span class="hljs-string">&quot;before_model_v2&quot;</span>,
        <span class="hljs-string">&quot;products&quot;</span>,
    ))
<span class="hljs-keyword">if</span> err != <span class="hljs-literal">nil</span> {
    <span class="hljs-keyword">return</span> err
}

jobID, err := targetClient.RestoreExternalSnapshot(ctx,
    milvusclient.NewRestoreExternalSnapshotOption(
        <span class="hljs-string">&quot;products_staging&quot;</span>,
        snapshot.GetS3Location(),
    ))
<button class="copy-code-btn"></button></code></pre>
<p>When the target can already reach the source snapshot storage, that’s the complete path.</p>
<h2 id="Snapshot-export-is-the-fallback-not-a-prerequisite" class="common-anchor-header">Snapshot export is the fallback, not a prerequisite<button data-href="#Snapshot-export-is-the-fallback-not-a-prerequisite" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p><code translate="no">ExportSnapshot</code> exists for the case where the target genuinely cannot reach the source storage — separate buckets, incompatible root paths, or permission boundaries between environments. Then you export a self-contained bundle to a location the target can read. Treating export as a required first step adds a bulk data movement to a path that often doesn’t need one.</p>
<p>Export relies on server-side copy within the storage service, which is what keeps the data from routing through the Milvus cluster. Where server-side copy isn’t available — across different object-storage services, or between endpoints that can’t address each other — export stops rather than relaying the entire dataset through Milvus. In that case, you need to replicate the objects across the region or provider with your own storage tooling, then restore from the copied location.</p>
<p>Inside that boundary, one snapshot can be consumed by several target clusters at once while the source collection keeps serving normally. Production-to-test cloning, multi-cluster distribution, migration rehearsals, and isolated verification environments no longer need a dedicated pipeline each.</p>
<h2 id="Stable-views-reading-a-snapshot-without-restoring-it" class="common-anchor-header">Stable views: reading a snapshot without restoring it<button data-href="#Stable-views-reading-a-snapshot-without-restoring-it" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The paths we discussed so far all end with a new collection. For read-only work that’s more than the job needs — a snapshot already describes a file set sitting in object storage, and a consumer that can read the description can read those files directly. Production keeps taking writes throughout.</p>
<table>
<thead>
<tr><th><strong>Consumer</strong></th><th><strong>How it reads the snapshot</strong></th><th><strong>Typical work</strong></th></tr>
</thead>
<tbody>
<tr><td>Milvus External Collection</td><td>A StorageV3 internal-table snapshot as a <code translate="no">milvus-table</code> external source</td><td>Querying a historical version, regression verification, audit analysis</td></tr>
<tr><td>Spark connector</td><td>The snapshot metadata URI and its referenced files, as a fixed batch input</td><td>A/B evaluation, deduplication, clustering, quality checks, field backfill</td></tr>
</tbody>
</table>
<h2 id="External-Collection-over-a-snapshot" class="common-anchor-header">External Collection over a snapshot<button data-href="#External-Collection-over-a-snapshot" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Creating an External Collection in Milvus from a snapshot takes three pieces of information: <code translate="no">external_source</code> points at the snapshot metadata URI, <code translate="no">external_spec</code> declares the <code translate="no">milvus-table</code> format along with storage access configuration, and each field maps to a field in the source snapshot through <code translate="no">external_field</code>. Once the collection exists, run a refresh, then create indexes and load it according to what you plan to query.</p>
<h2 id="Spark-batch-on-a-fixed-input" class="common-anchor-header">Spark batch on a fixed input<button data-href="#Spark-batch-on-a-fixed-input" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>A Spark job started against a snapshot does not follow the production collection forward. It reads the fixed set of data the snapshot describes, from start to finish, regardless of how many writes land in <code translate="no">products</code> while it runs.</p>
<pre><code translate="no">Snapshot metadata URI
    -&gt; Spark connector
    -&gt; DataFrame / batch job
    -&gt; A/B evaluation, deduplication, <span class="hljs-keyword">or</span> quality checks
    -&gt; data lake, reports, <span class="hljs-keyword">or</span> optional Milvus backfill
<button class="copy-code-btn"></button></code></pre>
<p>Back to the model upgrade example: with <code translate="no">before_model_v2</code> in place, the batch job reads product IDs, titles, categories, and old-model embeddings for exactly the products that existed at that boundary, generates new embeddings for the same products, and emits A/B evaluation results, duplicate groupings, and anomaly records. Run it again next week, and it reads the same products. Two models compared on inputs that shifted underneath them were never really compared.</p>
<p>Results can stay in the data lake or a reporting system. Updating Milvus fields is a separate, explicit backfill through the backfill interface — reading a snapshot never modifies the source collection.</p>
<p>Three constraints apply to this path:</p>
<ul>
<li>A snapshot-backed External Collection is a read-only source, so high-frequency online inserts and deletes belong on a normal collection.</li>
<li><code translate="no">milvus-table</code> currently supports StorageV3 (loon) internal-table snapshots as external sources. A snapshot of an external table can’t be chained as a new <code translate="no">milvus-table</code> source.</li>
<li>Long-running jobs should hold <code translate="no">PinSnapshotData</code> so the retention policy can’t reclaim referenced files mid-run, releasing the pin when the job finishes.</li>
</ul>
<h2 id="What-changes-with-a-Milvus-snapshot" class="common-anchor-header">What changes with a Milvus snapshot<button data-href="#What-changes-with-a-Milvus-snapshot" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>The gain comes from a change in execution path rather than a fixed performance figure:</p>
<table>
<thead>
<tr><th><strong>Stage</strong></th><th><strong>Traditional copy-based path</strong></th><th><strong>With a snapshot</strong></th><th><strong>What you still pay with a snapshot</strong></th></tr>
</thead>
<tbody>
<tr><td>Creating a recovery point</td><td>Copy the collection’s data</td><td>Write metadata, manifests, and file references</td><td>Object-storage requests, metadata handling, retained old files</td></tr>
<tr><td>Restoring a collection</td><td>Import data and rebuild indexes</td><td>Copy existing data and index files</td><td>A second data copy, object-storage copy</td></tr>
<tr><td>Running a batch job</td><td>Copy online data, then start compute</td><td>Read a fixed metadata and file set directly</td><td>Data scan and Spark compute</td></tr>
</tbody>
</table>
<p>Actual elapsed time still depends on segment count, index size, object-storage performance, network conditions, and job concurrency. We’re not publishing fixed timings or improvement multiples until unified testing is complete.</p>
<h2 id="Where-snapshots-fit-and-where-they-dont" class="common-anchor-header">Where snapshots fit, and where they don’t<button data-href="#Where-snapshots-fit-and-where-they-dont" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Snapshots are useful in cases like this:</p>
<ul>
<li>Creating a recovery point before a model or data version ships, when you need fast validation and rollback.</li>
<li>Copying production data into test, load-test, canary, or isolated clusters.</li>
<li>Providing a fixed input to Spark, an evaluation platform, or a data-governance job.</li>
<li>Querying a historical version through an External Collection for regression or audit work.</li>
</ul>
<h2 id="Milvus-Snapshots-vs-Milvus-backups" class="common-anchor-header">Milvus Snapshots vs. Milvus backups<button data-href="#Milvus-Snapshots-vs-Milvus-backups" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>A snapshot references files owned by the live collection — same bucket, same credentials, same storage service, same garbage-collection authority. It is a view of production data, not an independent instance of it. If the storage is lost, every snapshot in it is lost alongside the collection it describes. That gives a clean division between snapshots and backups:</p>
<ul>
<li><strong>Snapshots address logical failure:</strong> the model that regressed, the backfill that wrote bad data, the migration that half-applied.</li>
<li><strong>Backups address physical failure:</strong> independent copies in a separate failure domain, for long-term retention, compliance, and total storage loss. Milvus Backup or an equivalent independent solution remains the answer there.</li>
</ul>
<p>Snapshots also aren’t continuous version history. A snapshot exists only where someone created one, and it’s immutable once created. Freezing a version is an explicit act — which is exactly why making it cheap matters.</p>
<h2 id="Current-limits" class="common-anchor-header">Current limits<button data-href="#Current-limits" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li>Snapshot creation doesn’t flush, so growing data is outside the snapshot by default.</li>
<li>Direct cross-cluster restore requires the target to reach the snapshot metadata URI and its referenced files, including storage credentials and network path.</li>
<li><code translate="no">ExportSnapshot</code> won’t relay data through Milvus, so crossing regions or cloud providers is <strong>an ordinary object copy at the storage layer</strong> — run it with your own storage tooling, then restore from the copied location.</li>
<li><code translate="no">milvus-table</code> supports StorageV3 (Loon) internal-table snapshots as external sources; external-table snapshots can’t be chained.</li>
<li>Long-running jobs should pin snapshot data and release the pin afterward, with <code translate="no">DropSnapshot</code> governed by a real retention policy.</li>
</ul>
<h2 id="Try-Milvus-Snapshots--and-the-rest-of-Milvus-30" class="common-anchor-header">Try Milvus Snapshots — and the rest of Milvus 3.0<button data-href="#Try-Milvus-Snapshots--and-the-rest-of-Milvus-30" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>Snapshot creation, same-cluster restore, and stable views are available in Milvus 3.0 today. Take a snapshot before your next model push and see what it costs on your own collection — that number is the one that matters, and it’s cheap to find out. Cross-cluster restore and export are landing soon. Stay tuned.</p>
<p>Snapshots are one piece of a much larger release. Our latest release of Milvus 3.0 also ships External Collection, the Spark connector, and the rebuilt StorageV3 storage layer they all sit on — worth a look if any of the workloads in this post sound like yours.</p>
<h2 id="Dig-into-snapshots" class="common-anchor-header">Dig into snapshots<button data-href="#Dig-into-snapshots" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li><a href="https://milvus.io/docs/snapshots.md">Snapshots overview</a> for the concepts, <a href="https://milvus.io/docs/manage-snapshots.md">Manage Snapshots</a> for the API surface, and <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot Use Cases</a> for worked scenarios.</li>
<li>Milvus 3.0 <a href="https://milvus.io/docs/release_notes.md">release notes</a> and <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">launch blog</a> for everything else in this release.</li>
</ul>
<h2 id="Come-talk-to-us" class="common-anchor-header">Come talk to us<button data-href="#Come-talk-to-us" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><ul>
<li>Join the <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord community</a> — the fastest way to get an answer from the people who built this.</li>
<li>Book a 20-minute <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus office hour</a> if you want to walk through your own collection with an engineer.</li>
<li>Tell us how you’re using snapshots, or where you hit a boundary we should move, on <a href="https://github.com/milvus-io/milvus">the milvus-io/milvus repo</a>. That’s what shapes what ships next.</li>
</ul>
