---
id: recover-milvus-data-after-etcd-corruption.md
title: 如何在沒有備份的情況下於 etcd 損毀後復原 Milvus 資料
author: Jack Li
date: 2026-7-22
cover: >-
  assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_1_0d541c7b35.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  milvus data recovery, etcd corruption, minio binlog, milvus bulkinsert, milvus
  backup
meta_title: |
  Recover Milvus Data After etcd Corruption Without a Backup
desc: >-
  etcd 損毀、沒有備份、來源資料也不見了？以下是我們如何透過 bulkInsert 從 MinIO binlogs 搶救出一個 Milvus
  collection，以及如何在匯入前驗證 segments。
origin: 'https://milvus.io/blog/recover-milvus-data-after-etcd-corruption.md'
---
<p><strong>We recently helped a user through a tricky recovery.</strong> The user’s Milvus instance had suffered etcd data corruption. The user no longer had the original source data and had not created a backup with <a href="https://milvus.io/docs/milvus_backup_overview.md">Milvus Backup</a>. For a database operator, this is close to the worst-case scenario. One thing was still intact: the object data directory in MinIO.</p>
<p>When etcd is corrupted and no Milvus Backup exists, Milvus data can sometimes be salvaged from the insert-log binlogs still present in MinIO: start a clean Milvus instance, recreate the collection schema, and import candidate segments with the Java SDK’s bulkInsert in backup mode, validating each segment before it enters the final collection. Concretely, we:</p>
<ol>
<li>Started a clean Milvus instance.</li>
<li>Recreated the collection schema.</li>
<li>Copied the old MinIO binlogs into an isolated recovery prefix.</li>
<li>Used the Java SDK’s bulkInsert API to import candidate segments.</li>
<li>Validated the imported data before selecting the segments for the final recovered collection.</li>
</ol>
<p>We recovered the data, though not before hitting a problem: two readable segments that represented the same logical rows. To document the exact commands, we reproduced the failure in a lab environment rather than operating further on the user’s data; every command, ID, and screenshot below comes from that reproduction.</p>
<blockquote>
<p>Important: This is not a standard backup or recovery procedure. It is a last-resort salvage path for cases where etcd is unavailable, the original data is gone, and no Milvus Backup exists.MinIO is not the source of truth for Milvus metadata. It can show that object files exist, but it cannot reliably tell you which segments are still live. A recovery process must therefore validate candidate segments rather than importing every readable directory, in particular to avoid re-importing historical or pre-compaction segments as duplicates.</p>
</blockquote>
<h2 id="The-Incident-etcd-Was-Lost-and-the-Collection-Disappeared" class="common-anchor-header">The Incident: etcd Was Lost and the Collection Disappeared<button data-href="#The-Incident-etcd-Was-Lost-and-the-Collection-Disappeared" class="anchor-icon" translate="no">
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
    </button></h2><p>The user was running Milvus Standalone with three core services: Milvus, etcd, and MinIO. etcd stored the Milvus metadata. MinIO stored object data such as insert logs, statistics logs, and index files.</p>
<p>In our lab reproduction, the original deployment was initially healthy:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cd</span> /home/zilliz/mnt/lcl/260milvus
docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>Example output:</p>
<pre><code translate="no">NAME                IMAGE                                         SERVICE      STATUS
milvus-etcd         quay.io/coreos/etcd:v3.5.18                   etcd         Up
milvus-minio        minio/minio:RELEASE.2024-12-18T13-15-44Z      minio        Up
milvus-standalone   milvusdb/milvus:v2.6.17                       standalone   Up
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_2_00e086a239.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The deployment’s volumes directory contained three sets of persistent data:</p>
<pre><code translate="no">etcd/
milvus/
minio/
<button class="copy-code-btn"></button></code></pre>
<p>To reproduce complete metadata loss in the lab, we moved the etcd data directory out of the deployment:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cd</span> /home/zilliz/mnt/lcl/260milvus/volumes
<span class="hljs-built_in">mv</span> etcd ../etcd_old
<button class="copy-code-btn"></button></code></pre>
<p>This does not reproduce every possible form of etcd corruption. It simulates the condition this recovery depends on: Milvus can no longer read the original metadata.</p>
<p>After the directory was removed, the original collection no longer appeared in <a href="https://github.com/zilliztech/attu">Attu</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_3_a44c98b217.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The underlying object files had not necessarily disappeared. Milvus had lost the information it needed to interpret them.</p>
<h2 id="Why-Cant-MinIO-Alone-Rebuild-a-Milvus-Collection" class="common-anchor-header">Why Can’t MinIO Alone Rebuild a Milvus Collection?<button data-href="#Why-Cant-MinIO-Alone-Rebuild-a-Milvus-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>MinIO cannot rebuild the collection on its own because it stores only data files.</strong> The metadata that says which files form the current collection (schemas, segment states, compaction history) lives in etcd. The two services serve different roles in Milvus:</p>
<table>
<thead>
<tr><th>What etcd stores (metadata)</th><th>What MinIO stores (object data)</th></tr>
</thead>
<tbody>
<tr><td>Databases, collections, partitions</td><td>insert_log</td></tr>
<tr><td>Schemas</td><td>stats_log</td></tr>
<tr><td>Segment IDs and segment states</td><td>delta_log</td></tr>
<tr><td>Index metadata</td><td>Index files</td></tr>
<tr><td>Pre-/post-compaction segment relationships</td><td>Write-ahead log (WAL) files</td></tr>
</tbody>
</table>
<p>During normal operation, Milvus first reads metadata from etcd to determine which collections exist, how their schemas are defined, and which segments are currently valid. It then reads the corresponding files from MinIO.</p>
<p>When etcd is completely unavailable, MinIO can provide files but cannot answer several critical questions:</p>
<ul>
<li>Which collection name corresponds to this collection ID?</li>
<li>Is this segment live or dropped?</li>
<li>Has this segment been replaced by a compacted segment?</li>
<li>Is this data part of the current deployment or an older experiment?</li>
<li>Can you still trust the mapping between field IDs and the application’s fields?</li>
</ul>
<p>Having the object files is necessary for this recovery, but not sufficient.</p>
<h2 id="Recovery-Strategy-Build-a-New-Instance-Instead-of-Repairing-in-Place" class="common-anchor-header">Recovery Strategy: Build a New Instance Instead of Repairing in Place<button data-href="#Recovery-Strategy-Build-a-New-Instance-Instead-of-Repairing-in-Place" class="anchor-icon" translate="no">
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
    </button></h2><p>The old etcd was unreadable, so we stopped trying to read it. The old MinIO still had insert_log and stats_log files that could serve as data sources. A new Milvus instance would create fresh metadata and new segments.</p>
<p>We did not try to restart or repair the old deployment. If its state was already unreliable, continuing to operate on it risked further corruption. The safer approach was to isolate the old data and start clean.</p>
<p>The diagram below shows the overall recovery flow: skip the old etcd entirely, use the old MinIO insert_log and stats_log as the data source, and let the new Milvus instance create fresh metadata and segments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_5_446e8a8bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We followed these steps:</p>
<ol>
<li>Preserve the old MinIO directory.</li>
<li>Do not modify or depend on the old etcd directory.</li>
<li>Start an empty Milvus Standalone deployment in a new path.</li>
<li>Recreate a schema-compatible collection.</li>
<li>Copy the old insert_log and stats_log directories into a separate <code translate="no">backup_data/</code> prefix in the new MinIO storage.</li>
<li>Scan for candidate segment directories.</li>
<li>Import each candidate through the Java SDK.</li>
<li>Validate row counts, primary keys, sampled fields, and search behavior.</li>
<li>Import only confirmed segments into the final recovery collection.</li>
</ol>
<p><strong>Start the clean Milvus instance</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cd</span> /home/zilliz/mnt/lcl/260milvus/new
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>Example output:</p>
<pre><code translate="no">[+] Running 3/3
 Container milvus-etcd        Started ✔
 Container milvus-minio       Started ✔
 Container milvus-standalone  Started ✔
<button class="copy-code-btn"></button></code></pre>
<p><strong>Define the old and new MinIO paths</strong></p>
<pre><code translate="no" class="language-bash">OLD_BUCKET=/home/zilliz/mnt/lcl/260milvus/volumes/minio/a-bucket/files
NEW_BUCKET=/home/zilliz/mnt/lcl/260milvus/new/volumes/minio/a-bucket/files
<button class="copy-code-btn"></button></code></pre>
<p><strong>Copy the old binlogs into an isolated prefix</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">mkdir</span> -p <span class="hljs-string">&quot;<span class="hljs-variable">$NEW_BUCKET</span>/backup_data&quot;</span>
rsync -a <span class="hljs-string">&quot;<span class="hljs-variable">$OLD_BUCKET</span>/insert_log&quot;</span> <span class="hljs-string">&quot;<span class="hljs-variable">$NEW_BUCKET</span>/backup_data/&quot;</span>
rsync -a <span class="hljs-string">&quot;<span class="hljs-variable">$OLD_BUCKET</span>/stats_log&quot;</span> <span class="hljs-string">&quot;<span class="hljs-variable">$NEW_BUCKET</span>/backup_data/&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>After the copy, the new Milvus instance can access the old files through paths such as:</p>
<pre><code translate="no">backup_data/insert_log/&lt;old_collection_id&gt;<span class="hljs-regexp">/&lt;old_partition_id&gt;/</span>&lt;old_segment_id&gt;
backup_data/stats_log/&lt;old_collection_id&gt;<span class="hljs-regexp">/&lt;old_partition_id&gt;/</span>&lt;old_segment_id&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Do not mix the copied files into the directories used by the new instance’s own collections. Keeping them under <code translate="no">backup_data/</code> makes scanning, importing, and rollback easier to reason about.</p>
<h2 id="Recreate-a-Schema-Compatible-Collection" class="common-anchor-header">Recreate a Schema-Compatible Collection<button data-href="#Recreate-a-Schema-Compatible-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Because the original etcd metadata is unavailable, the new Milvus instance cannot recover the collection schema automatically. <strong>The schema must come from another source; in practice, that is usually the application code that created the collection.</strong></p>
<p>In this reproduction, the original collection was named <code translate="no">hello_milvus</code> and had the following fields:</p>
<pre><code translate="no" class="language-json">{
  <span class="hljs-string">&quot;collection_name&quot;</span>: <span class="hljs-string">&quot;hello_milvus&quot;</span>,
  <span class="hljs-string">&quot;fields&quot;</span>: [
    {
      <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>,
      <span class="hljs-string">&quot;data_type&quot;</span>: <span class="hljs-number">5</span>,
      <span class="hljs-string">&quot;is_primary_key&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;autoID&quot;</span>: <span class="hljs-literal">true</span>
    },
    {
      <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;vector&quot;</span>,
      <span class="hljs-string">&quot;data_type&quot;</span>: <span class="hljs-number">101</span>,
      <span class="hljs-string">&quot;dim&quot;</span>: <span class="hljs-number">128</span>,
      <span class="hljs-string">&quot;indexes&quot;</span>: [
        {
          <span class="hljs-string">&quot;index_name&quot;</span>: <span class="hljs-string">&quot;vector&quot;</span>,
          <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
          <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>
        }
      ]
    },
    {
      <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>,
      <span class="hljs-string">&quot;data_type&quot;</span>: <span class="hljs-number">21</span>,
      <span class="hljs-string">&quot;max_length&quot;</span>: <span class="hljs-number">256</span>
    }
  ],
  <span class="hljs-string">&quot;enable_dynamic_field&quot;</span>: <span class="hljs-literal">false</span>,
  <span class="hljs-string">&quot;consistency_level&quot;</span>: <span class="hljs-string">&quot;Bounded&quot;</span>,
  <span class="hljs-string">&quot;shards_num&quot;</span>: <span class="hljs-number">1</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>We created a compatible collection in the new Milvus deployment:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, db_name=<span class="hljs-string">&quot;default&quot;</span>)

collection_name = <span class="hljs-string">&quot;hello_milvus_recover&quot;</span>

<span class="hljs-keyword">if</span> client.has_collection(collection_name):
    client.drop_collection(collection_name)

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)
schema.add_field(<span class="hljs-string">&quot;varchar&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">256</span>)

index_params = MilvusClient.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_6_6c815f4f71.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The new schema must be compatible with the old binlogs. Relevant settings include:</p>
<ul>
<li>Field types</li>
<li>Vector dimensions</li>
<li>Primary-key configuration</li>
<li>Auto-ID behavior</li>
<li>Dynamic-field configuration</li>
<li>Field mappings</li>
</ul>
<p>A clear mismatch can cause the import to fail. A subtler mismatch is more dangerous: the import may complete while the data is interpreted incorrectly.</p>
<h2 id="Scan-MinIO-for-Candidate-Segments" class="common-anchor-header">Scan MinIO for Candidate Segments<button data-href="#Scan-MinIO-for-Candidate-Segments" class="anchor-icon" translate="no">
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
    </button></h2><p>We then scanned the copied insert_log directory:</p>
<pre><code translate="no" class="language-bash">NEW_BUCKET=/home/zilliz/mnt/lcl/260milvus/new/volumes/minio/a-bucket/files
find <span class="hljs-string">&quot;<span class="hljs-variable">$NEW_BUCKET</span>/backup_data/insert_log&quot;</span> \
    -mindepth 3 -maxdepth 3 -<span class="hljs-built_in">type</span> d \
    | sed <span class="hljs-string">&quot;s#<span class="hljs-variable">${NEW_BUCKET}</span>/##&quot;</span> \
    | <span class="hljs-built_in">sort</span>
<button class="copy-code-btn"></button></code></pre>
<p>The scan found two candidate segment directories:</p>
<pre><code translate="no">backup_data/insert_log/466895334486314780/466895334486314781/466895334486514943
backup_data/insert_log/466895334486314780/466895334486314781/466895334486515954
<button class="copy-code-btn"></button></code></pre>
<p>The path format is:</p>
<pre><code translate="no">backup_data/insert_log/&lt;old_collection_id&gt;<span class="hljs-regexp">/&lt;old_partition_id&gt;/</span>&lt;old_segment_id&gt;
<button class="copy-code-btn"></button></code></pre>
<p>For this reproduction:</p>
<pre><code translate="no">old collection <span class="hljs-built_in">id</span>: <span class="hljs-number">466895334486314780</span>
old partition <span class="hljs-built_in">id</span>: <span class="hljs-number">466895334486314781</span>
candidate segment <span class="hljs-number">1</span>: <span class="hljs-number">466895334486514943</span>
candidate segment <span class="hljs-number">2</span>: <span class="hljs-number">466895334486515954</span>
<button class="copy-code-btn"></button></code></pre>
<p>At this point, we knew only that two segment directories existed — not whether they contained different data. This matters because bulkInsert will accept both: it checks the path, the binlog, and the schema, not whether a segment is still live. If both segments contain the same rows, importing both gives you 200 rows from 100 rows of actual data.</p>
<h2 id="Import-a-Candidate-Segment-with-the-Java-SDK" class="common-anchor-header">Import a Candidate Segment with the Java SDK<button data-href="#Import-a-Candidate-Segment-with-the-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>This reproduction used <code translate="no">MilvusServiceClient.bulkInsert</code> from the Java SDK with the binlog backup import mode.</p>
<p>The relevant options were:</p>
<pre><code translate="no">backup=true
storage_version=<span class="hljs-number">2</span>  <span class="hljs-comment"># Milvus 2.6+ uses storage v2; earlier versions use v1</span>
files=[<span class="hljs-string">&quot;backup_data/insert_log/.../&lt;segment_id&gt;&quot;</span>]  <span class="hljs-comment"># pass the insert_log segment path</span>
<button class="copy-code-btn"></button></code></pre>
<p>These settings are coupled to the versions used in this <em>reproduction.</em> Before using the procedure elsewhere, verify the required storage version and import behavior against the exact Milvus and SDK versions in the recovery environment.</p>
<p>The core Java call was:</p>
<pre><code translate="no" class="language-java">R&lt;<span class="hljs-title class_">ImportResponse</span>&gt; importResp = client.<span class="hljs-title function_">bulkInsert</span>(
    <span class="hljs-title class_">BulkInsertParam</span>.<span class="hljs-title function_">newBuilder</span>()
        .<span class="hljs-title function_">withDatabaseName</span>(dbName)
        .<span class="hljs-title function_">withCollectionName</span>(collectionName)
        .<span class="hljs-title function_">withPartitionName</span>(<span class="hljs-string">&quot;_default&quot;</span>)
        .<span class="hljs-title function_">withOption</span>(<span class="hljs-string">&quot;backup&quot;</span>, <span class="hljs-string">&quot;true&quot;</span>)
        .<span class="hljs-title function_">withOption</span>(<span class="hljs-string">&quot;storage_version&quot;</span>, storageVersion)
        .<span class="hljs-title function_">withFiles</span>(<span class="hljs-title class_">Collections</span>.<span class="hljs-title function_">singletonList</span>(segmentPath))
        .<span class="hljs-title function_">build</span>()
);
<button class="copy-code-btn"></button></code></pre>
<p>The import task was polled until it completed:</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">while</span> (<span class="hljs-literal">true</span>) {
    R&lt;GetImportStateResponse&gt; stateResp = client.getBulkInsertState(
        GetBulkInsertStateParam.newBuilder()
            .withTask(taskID)
            .build()
    );
    <span class="hljs-type">ImportState</span> <span class="hljs-variable">state</span> <span class="hljs-operator">=</span> stateResp.getData().getState();
    System.out.println(<span class="hljs-string">&quot;Import state: &quot;</span> + state);
    <span class="hljs-keyword">if</span> (state == ImportState.ImportCompleted) {
        <span class="hljs-keyword">break</span>;
    }
    <span class="hljs-keyword">if</span> (state == ImportState.ImportFailed ||
        state == ImportState.ImportFailedAndCleaned) {
        <span class="hljs-keyword">throw</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">RuntimeException</span>(<span class="hljs-string">&quot;import failed: &quot;</span> + stateResp.getData());
    }
    Thread.sleep(<span class="hljs-number">1000</span>);
}
<button class="copy-code-btn"></button></code></pre>
<p>The Maven dependency was:</p>
<pre><code translate="no" class="language-xml">&lt;dependency&gt;
    &lt;groupId&gt;io.milvus&lt;/groupId&gt;
    &lt;artifactId&gt;milvus-sdk-java&lt;/artifactId&gt;
    &lt;version&gt;3.0.1&lt;/version&gt;
&lt;/dependency&gt;
<button class="copy-code-btn"></button></code></pre>
<p><strong>Import the first segment</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cat</span> &gt; /tmp/import_paths.txt &lt;&lt;<span class="hljs-string">&#x27;EOF&#x27;</span>
backup_data/insert_log/466895334486314780/466895334486314781/466895334486514943
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Run the import:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cd</span> /home/zilliz/mnt/lcl/260milvus/etcd_recovery/restore-java
DB_NAME=default \
COLLECTION_NAME=<span class="hljs-string">&quot;hello_milvus_recover&quot;</span> \
IMPORT_PATHS_FILE=/tmp/import_paths.txt \
STORAGE_VERSION=2 \
mvn -q <span class="hljs-built_in">exec</span>:java \
    -Dexec.mainClass=io.milvus.recovery.ImportIntoExistingCollection
<button class="copy-code-btn"></button></code></pre>
<p>Example output:</p>
<pre><code translate="no"><span class="hljs-title class_">Target</span> <span class="hljs-attr">collection</span>: <span class="hljs-keyword">default</span>.<span class="hljs-property">hello_milvus_recover</span>
<span class="hljs-title class_">Segment</span> <span class="hljs-attr">paths</span>: <span class="hljs-number">1</span>
<span class="hljs-title class_">Importing</span> <span class="hljs-attr">segment</span>: 
backup_data/insert_log/<span class="hljs-number">466895334486314780</span>/<span class="hljs-number">466895334486314781</span>/<span class="hljs-number">466895334486514943</span>
<span class="hljs-title class_">Import</span> task <span class="hljs-attr">ID</span>: <span class="hljs-number">466896649728034340</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportPending</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportCompleted</span>
collection <span class="hljs-attr">statistics</span>: [<span class="hljs-attr">key</span>: <span class="hljs-string">&quot;row_count&quot;</span>
<span class="hljs-attr">value</span>: <span class="hljs-string">&quot;100&quot;</span>
]
<button class="copy-code-btn"></button></code></pre>
<p>The first result looked correct. The original collection contained 100 rows, and the recovered collection now reported 100 rows. The problem appeared after importing the second candidate.</p>
<p><strong>Import the second segment</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cat</span> &gt; /tmp/import_paths.txt &lt;&lt;<span class="hljs-string">&#x27;EOF&#x27;</span>
backup_data/insert_log/466895334486314780/466895334486314781/466895334486515954
EOF
<button class="copy-code-btn"></button></code></pre>
<p>Import it into the same collection:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-variable constant_">DB_NAME</span>=<span class="hljs-keyword">default</span> \
<span class="hljs-variable constant_">COLLECTION_NAME</span>=<span class="hljs-string">&quot;hello_milvus_recover&quot;</span> \
<span class="hljs-variable constant_">IMPORT_PATHS_FILE</span>=<span class="hljs-regexp">/tmp/im</span>port_paths.<span class="hljs-property">txt</span> \
<span class="hljs-variable constant_">STORAGE_VERSION</span>=<span class="hljs-number">2</span> \
mvn -q <span class="hljs-attr">exec</span>:java \
    -<span class="hljs-title class_">Dexec</span>.<span class="hljs-property">mainClass</span>=io.<span class="hljs-property">milvus</span>.<span class="hljs-property">recovery</span>.<span class="hljs-property">ImportIntoExistingCollection</span>
<button class="copy-code-btn"></button></code></pre>
<p>Example output:</p>
<pre><code translate="no"><span class="hljs-title class_">Target</span> <span class="hljs-attr">collection</span>: <span class="hljs-keyword">default</span>.<span class="hljs-property">hello_milvus_recover</span>
<span class="hljs-title class_">Segment</span> <span class="hljs-attr">paths</span>: <span class="hljs-number">1</span>
<span class="hljs-title class_">Importing</span> <span class="hljs-attr">segment</span>: 
backup_data/insert_log/<span class="hljs-number">466895334486314780</span>/<span class="hljs-number">466895334486314781</span>/<span class="hljs-number">466895334486515954</span>
<span class="hljs-title class_">Import</span> task <span class="hljs-attr">ID</span>: <span class="hljs-number">466896649728083097</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportPending</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportCompleted</span>
collection <span class="hljs-attr">statistics</span>: [<span class="hljs-attr">key</span>: <span class="hljs-string">&quot;row_count&quot;</span>
<span class="hljs-attr">value</span>: <span class="hljs-string">&quot;200&quot;</span>
]
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_7_24b1f4be90.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Both imports succeeded, and that was exactly the problem: the recovery collection now reported 200 rows for an original dataset of 100. The physical state of the recovered collection was wrong even though every import call returned success.</p>
<h2 id="A-Readable-Segment-Is-Not-Necessarily-a-Live-Segment" class="common-anchor-header">A Readable Segment Is Not Necessarily a Live Segment<button data-href="#A-Readable-Segment-Is-Not-Necessarily-a-Live-Segment" class="anchor-icon" translate="no">
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
    </button></h2><p>The two candidate directories were both:</p>
<ul>
<li>Present in MinIO</li>
<li>Readable</li>
<li>Compatible with the reconstructed schema</li>
<li>Accepted by bulkInsert</li>
</ul>
<p>That does not mean they represented two different batches of application data. <strong>This is not a bug in bulkInsert.</strong></p>
<p>bulkInsert imports whatever segment you point it at. As long as the path is valid, the binlog is readable, and the schema is compatible, the import succeeds. It does not judge whether that segment is current data or a pre-compaction historical copy.</p>
<p>In particular, bulkInsert cannot tell whether the segment was:</p>
<ul>
<li>Live at the time of failure</li>
<li>Dropped</li>
<li>Replaced by compaction</li>
<li>A previous physical form of the same rows</li>
<li>Left over from an earlier operation</li>
</ul>
<p>We inspected the files in both segment directories:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> 466895334486514943 466895334486515954; <span class="hljs-keyword">do</span>
    <span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;SEGMENT=<span class="hljs-variable">$s</span>&quot;</span>
    find \
        /home/zilliz/mnt/lcl/260milvus/volumes/minio/a-bucket/files/insert_log/\
466895334486314780/466895334486314781/<span class="hljs-variable">$s</span> \
        -<span class="hljs-built_in">type</span> f -<span class="hljs-built_in">printf</span> <span class="hljs-string">&#x27;%TY-%Tm-%Td %TH:%TM:%TS %s %p\n&#x27;</span> | <span class="hljs-built_in">sort</span>
<span class="hljs-keyword">done</span>
<button class="copy-code-btn"></button></code></pre>
<p>The relevant output was:</p>
<pre><code translate="no">SEGMENT=466895334486514943
2026-06-10 12:15:36 1621  .../514943/0/.../part.1
2026-06-10 12:15:36 2960  .../514943/1/.../part.1
2026-06-10 12:15:36 47724 .../514943/101/.../part.1

SEGMENT=466895334486515954
2026-06-10 12:15:39 1621  .../515954/0/.../part.1
2026-06-10 12:15:39 2960  .../515954/1/.../part.1
2026-06-10 12:15:39 47724 .../515954/101/.../part.1
<button class="copy-code-btn"></button></code></pre>
<p>The segments had several matching characteristics:</p>
<ul>
<li>The same field directories: 0, 1, and 101</li>
<li>The same file sizes: 1621, 2960, and 47724</li>
<li>Timestamps approximately three seconds apart</li>
</ul>
<p><strong>These similarities strongly suggested that the two directories contained the same logical rows in two physical forms.</strong> They were not sufficient proof by themselves. We still needed to import and compare the data.</p>
<p>The core problem was no longer “which segment is readable?” Both were readable.</p>
<p>The problem was “which segment, or set of segments, represents the intended final dataset?”</p>
<p>Without etcd metadata, you answer that question by importing candidates separately and comparing the data.</p>
<h2 id="Validate-Candidates-in-Separate-Temporary-Collections" class="common-anchor-header">Validate Candidates in Separate Temporary Collections<button data-href="#Validate-Candidates-in-Separate-Temporary-Collections" class="anchor-icon" translate="no">
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
    </button></h2><p>Instead of importing all candidates into the final collection, import each candidate into a separate temporary collection. For example:</p>
<ul>
<li><code translate="no">hello_milvus_recover_candidate_1</code></li>
<li><code translate="no">hello_milvus_recover_candidate_2</code></li>
</ul>
<p>Then compare them across several dimensions:</p>
<ul>
<li>Physical row count</li>
<li>Number of distinct primary keys</li>
<li>Minimum and maximum primary keys</li>
<li>Sampled scalar-field values</li>
<li>Vector-search results</li>
<li>Duplicate primary keys</li>
<li>Known records from the application side</li>
</ul>
<p>In this lab run, the comparison used <code translate="no">hello_milvus_recover</code> (both candidate segments imported) against <code translate="no">hello_milvus_recover2</code>, a clean collection holding only the newer candidate; <code translate="no">hello_milvus_recover2</code> becomes the final recovery collection in the next section. In a real recovery with more candidates, name the temporary collections explicitly, as above.</p>
<p>The following PyMilvus code checks collection statistics and primary-key ranges:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>, db_name=<span class="hljs-string">&quot;default&quot;</span>)
<span class="hljs-keyword">for</span> name <span class="hljs-keyword">in</span> [<span class="hljs-string">&quot;hello_milvus_recover&quot;</span>, <span class="hljs-string">&quot;hello_milvus_recover2&quot;</span>]:
    <span class="hljs-built_in">print</span>(name, client.get_collection_stats(name))
    rows = client.query(
        collection_name=name,
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;id &gt;= 0&quot;</span>,
        output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;varchar&quot;</span>],
        limit=<span class="hljs-number">10000</span>,
    )
    ids = [r[<span class="hljs-string">&quot;id&quot;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> rows]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">&quot;query_rows&quot;</span>, <span class="hljs-built_in">len</span>(rows),
        <span class="hljs-string">&quot;distinct_ids&quot;</span>, <span class="hljs-built_in">len</span>(<span class="hljs-built_in">set</span>(ids)),
        <span class="hljs-string">&quot;min&quot;</span>, <span class="hljs-built_in">min</span>(ids),
        <span class="hljs-string">&quot;max&quot;</span>, <span class="hljs-built_in">max</span>(ids)
    )
<button class="copy-code-btn"></button></code></pre>
<p>The result was:</p>
<pre><code translate="no">hello_milvus_recover {<span class="hljs-string">&#x27;row_count&#x27;</span>: <span class="hljs-number">200</span>}
query_rows <span class="hljs-number">100</span> distinct_ids <span class="hljs-number">100</span> <span class="hljs-built_in">min</span> <span class="hljs-number">466895334486314942</span> <span class="hljs-built_in">max</span> <span class="hljs-number">466895334486315041</span>

hello_milvus_recover2 {<span class="hljs-string">&#x27;row_count&#x27;</span>: <span class="hljs-number">100</span>}
query_rows <span class="hljs-number">100</span> distinct_ids <span class="hljs-number">100</span> <span class="hljs-built_in">min</span> <span class="hljs-number">466895334486314942</span> <span class="hljs-built_in">max</span> <span class="hljs-number">466895334486315041</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Together with the file-level evidence and sampled data, this confirmed that the two imported segments represented the same logical primary-key range rather than two independent sets of 100 records.</strong></p>
<p>Attu can also be used for this comparison by importing candidates into separate temporary collections and comparing their rows, primary-key ranges, and sampled values.</p>
<p>Directory structure alone is not enough. Segment selection requires data-level validation.</p>
<h2 id="Build-the-Final-Recovery-Collection-from-Confirmed-Candidates" class="common-anchor-header">Build the Final Recovery Collection from Confirmed Candidates<button data-href="#Build-the-Final-Recovery-Collection-from-Confirmed-Candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>In this reproduction, the two candidates were found to be logically equivalent. After comparing their file characteristics, separate imports, primary-key ranges, and sampled records, we selected the newer candidate:</p>
<pre><code translate="no">backup_data/insert_log/466895334486314780/466895334486314781/466895334486515954
<button class="copy-code-btn"></button></code></pre>
<p>Recency alone should not be used as proof in a real recovery. Here it was one signal considered after the two candidates had already been shown to contain equivalent logical data.</p>
<p><code translate="no">hello_milvus_recover2</code>, the single-segment collection from the comparison above, became the final recovery collection.</p>
<pre><code translate="no">hello_milvus_recover2
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/recover_milvus_data_after_etcd_corruption_md_8_baa0a5e004.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Then imported only the selected segment:</p>
<pre><code translate="no" class="language-bash"><span class="hljs-built_in">cat</span> &gt; /tmp/import_paths.txt &lt;&lt;<span class="hljs-string">&#x27;EOF&#x27;</span>
backup_data/insert_log/466895334486314780/466895334486314781/466895334486515954
EOF

<span class="hljs-built_in">cd</span> /home/zilliz/mnt/lcl/260milvus/etcd_recovery/restore-java
DB_NAME=default \
COLLECTION_NAME=<span class="hljs-string">&quot;hello_milvus_recover2&quot;</span> \
IMPORT_PATHS_FILE=/tmp/import_paths.txt \
STORAGE_VERSION=2 \
mvn -q <span class="hljs-built_in">exec</span>:java \
    -Dexec.mainClass=io.milvus.recovery.ImportIntoExistingCollection
<button class="copy-code-btn"></button></code></pre>
<p>Example output:</p>
<pre><code translate="no"><span class="hljs-title class_">Target</span> <span class="hljs-attr">collection</span>: <span class="hljs-keyword">default</span>.<span class="hljs-property">hello_milvus_recover2</span>
<span class="hljs-title class_">Segment</span> <span class="hljs-attr">paths</span>: <span class="hljs-number">1</span>
<span class="hljs-title class_">Importing</span> <span class="hljs-attr">segment</span>: 
backup_data/insert_log/<span class="hljs-number">466895334486314780</span>/<span class="hljs-number">466895334486314781</span>/<span class="hljs-number">466895334486515954</span>
<span class="hljs-title class_">Import</span> task <span class="hljs-attr">ID</span>: <span class="hljs-number">466896649729193732</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportPending</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportStarted</span>
<span class="hljs-title class_">Import</span> <span class="hljs-attr">state</span>: <span class="hljs-title class_">ImportCompleted</span>
collection <span class="hljs-attr">statistics</span>: [<span class="hljs-attr">key</span>: <span class="hljs-string">&quot;row_count&quot;</span>
<span class="hljs-attr">value</span>: <span class="hljs-string">&quot;100&quot;</span>
]
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jul_22_2026_05_42_26_PM_bd74036921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The final recovered collection contained the expected 100 rows.</p>
<p>We did not import every readable segment into the final collection. We validated each candidate separately and imported only the one we had confirmed.</p>
<h2 id="Limitations-of-This-Recovery-Method" class="common-anchor-header">Limitations of This Recovery Method<button data-href="#Limitations-of-This-Recovery-Method" class="anchor-icon" translate="no">
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
    </button></h2><p>This reproduction succeeded, but it does not establish that MinIO alone can always recover a collection after etcd failure. The method has several hard limitations.</p>
<p><strong>MinIO does not identify live segments.</strong> Object storage contains files, not the complete Milvus segment lifecycle. Without etcd metadata, MinIO cannot reliably indicate whether a segment is live, dropped, superseded, or an intermediate result of compaction.</p>
<p><strong>Duplicate imports are possible.</strong> The increase from 100 to 200 physical rows demonstrates the risk. If pre-compaction and post-compaction segments are both imported, the new Milvus instance registers both as live segments in the reconstructed collection, and the physical row count goes up.</p>
<p><strong>The original schema must be known.</strong> Recovery becomes significantly harder if the schema is completely lost. Field types, vector dimensions, primary-key configuration, auto-ID behavior, dynamic-field settings, and field ID mappings can all affect whether the import succeeds and whether the data is interpreted correctly.</p>
<p><strong>Deletes make recovery more complicated.</strong> If the original collection contained deletes, importing only insert_log data may restore rows that were no longer visible before the failure. Reconstructing the correct state may require handling delta_log data. The exact procedure depends on the Milvus version and the state of the available files. This reproduction did not establish a general delta-log recovery process.</p>
<p><strong>Multiple collections and partitions increase the ambiguity.</strong> The lab environment contained one small collection, making it possible to compare row counts, primary-key ranges, and samples manually. A production deployment may have far more collections, partitions, and databases, and many more segments, than this lab setup; at that scale, manual inspection becomes expensive and error-prone.</p>
<p>This technique should therefore be treated as data salvage, not as a normal disaster-recovery design.</p>
<h2 id="Backups-Are-Cheaper-Than-Data-Salvage" class="common-anchor-header">Backups Are Cheaper Than Data Salvage<button data-href="#Backups-Are-Cheaper-Than-Data-Salvage" class="anchor-icon" translate="no">
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
    </button></h2><p>When etcd is unavailable, the original source data is gone, and no Milvus Backup exists, readable MinIO binlogs may provide one final recovery path. But the process is costly and uncertain. You may need to:</p>
<ul>
<li>Reconstruct schemas manually.</li>
<li>Discover candidate segments.</li>
<li>Import them one at a time.</li>
<li>Compare physical and logical row counts.</li>
<li>Detect duplicate primary keys.</li>
<li>Account for compaction history.</li>
<li>Determine whether deletes must be reconstructed.</li>
<li>Validate the result against application-side records.</li>
</ul>
<p>The safer approach is to avoid reaching this state.</p>
<p><strong>Back up etcd regularly.</strong> etcd is the metadata authority for collections, schemas, partitions, and segment state. Losing it while retaining only object data leaves the physical files without the metadata required to interpret them reliably.</p>
<p><strong>Use</strong> <a href="https://milvus.io/docs/milvus_backup_overview.md"><strong>Milvus Backup</strong></a> <strong>for production recovery.</strong> Milvus Backup provides a structured backup and restore path. It is a better fit for repeatable, automated recovery than manually inferring segment state from object-storage directories. Backups should also be tested: run an actual restore drill.</p>
<p><strong>Back up the complete volume set for Standalone deployments.</strong> For Docker Compose or other Standalone environments, preserve the complete volume directory:</p>
<pre><code translate="no">Plaintext
volumes/
├── etcd/
├── milvus/
└── minio/
<button class="copy-code-btn"></button></code></pre>
<p>Do not back up only MinIO. Do not back up only etcd. A complete recovery depends on both metadata and object data.</p>
<p>If you run Milvus yourself, treat backup and recovery as part of the deployment. If you would rather not own that operational work, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>, a fully managed Vector Lakebase platform built by the same team behind Milvus. It handles backups, metadata, and recovery for you.</p>
<p>Readable MinIO files gave this user one last chance to get the data back. A tested backup would have made the whole exercise unnecessary.</p>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
<li>Set up <a href="https://github.com/zilliztech/milvus-backup">Milvus Backup</a> before you need it — the <a href="https://milvus.io/docs/milvus_backup_overview.md">docs</a> cover install and restore drills.</li>
<li><a href="https://github.com/zilliztech/attu">Attu</a> makes collection inspection and validation easier.</li>
<li>Hit a recovery scenario like this one? Ask in the <a href="https://claude.ai/epitaxy/%E9%93%BE%E6%8E%A5%E5%BE%85%E6%A0%B8%E5%AF%B9">Milvus Discord</a> or book a <a href="https://claude.ai/epitaxy/%E9%93%BE%E6%8E%A5%E5%BE%85%E6%A0%B8%E5%AF%B9">Milvus Office Hours</a> session.</li>
</ul>
