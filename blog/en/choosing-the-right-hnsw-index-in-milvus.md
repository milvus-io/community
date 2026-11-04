---
id: choosing-the-right-hnsw-index-in-milvus.md
title: >
 Choosing the Right HNSW Index in Milvus
author: Jack Li
date: 2026-11-1
cover: assets.zilliz.com/cms-cn/Choosing_the_Right_HNSW_Index_in_Milvus_cover_image_aa502ff741.png
tag: Engineering
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Milvus HNSW, HNSW quantization, vector index benchmark, vector search performance, HNSW refinement
meta_title: >
 Milvus HNSW Index Comparison: SQ, PQ, PRQ, and Refinement
desc: >
 Compare Milvus HNSW, SQ, PQ, and PRQ benchmarks to balance recall, latency, throughput, memory, and refinement costs.
origin: https://milvus.io/blog/choosing-the-right-hnsw-index-in-milvus.md
---
Milvus offers HNSW, HNSW_SQ, HNSW_PQ, and HNSW_PRQ for graph\-based vector search\. All four use a hierarchical graph to find nearby vectors, but they store and compare those vectors differently\. Those differences affect recall, query performance, memory usage, and index build cost\.

Choosing between them starts with what your retrieval stage needs to deliver\. An index that returns results directly to an application has different requirements from one that generates a larger candidate set for a downstream reranker\. Memory limits and how often you rebuild the index also influence the choice\. Optional refinement adds another consideration: a compressed index can use a higher\-precision representation to rerank its candidates, improving recall at an additional cost\.

To compare these choices, we benchmarked all four index types in **Milvus 2.6.17** on the **VectorDBBench Cohere 1M** dataset\. We measured recall, throughput, latency, memory, and build cost, then varied quantization precision, search breadth, and refinement\. The results show where each tested configuration worked well and which adjustments were worth making when recall fell short\.

## How the four HNSW index types differ

HNSW organizes vectors into a hierarchical proximity graph\. Search starts in the sparse upper layers, moves toward a promising region, and expands candidates in the bottom layer\. Milvus's HNSW variants share this search framework; the main difference is the vector representation used for graph construction and distance calculations\.

|**Index**|**Vector representation**|**When to evaluate it**|
|---|---|---|
|HNSW|Full\-precision FP32 vectors|Establish a reference without vector quantization\.|
|HNSW_SQ|Fewer bits per dimension|Reduce vector memory and compare the recall loss at different bit widths\.|
|HNSW_PQ|Codebook indices for groups of dimensions|Evaluate stronger compression with a configurable code length\.|
|HNSW_PRQ|PQ approximation plus residual codes|Evaluate additional encoding stages when a PQ approximation loses too much information\.|

These are starting points for evaluation\. Within each quantized index type, the encoding parameters and optional refinement settings can substantially change the result\.

![](https://assets.zilliz.com/cms-cn/HNSW_index_variants_in_Milvus_d2a7ab87a8.PNG)

Figure 1. Milvus HNSW index variants share the same graph\-search framework while using different vector representations\. Optional refinement applies to the quantized variants; their graph connections need not match FP32 HNSW\.

### HNSW keeps the full vector representation

Our standard HNSW configuration uses FP32 vectors, with no vector quantization\. It provides a reference for measuring what compression changes: the recall difference, query performance, memory usage, and build time\.

Full\-precision vectors do not make HNSW search exact\. Graph traversal still determines which candidates are found\. Establishing an FP32 reference therefore includes tuning the graph search, rather than assuming an unquantized index will return every true nearest neighbor\.

### HNSW_SQ reduces precision dimension by dimension

**Scalar quantization \(SQ\)** represents each dimension with fewer bits\. SQ8 and SQ6 use 8 and 6 bits per dimension, respectively, with separately estimated ranges for each dimension\. They retain the vector's dimensional structure while reducing the precision of individual values\.

SQ4U, available in Milvus 2.6.8 and later, uses 4\-bit unsigned values with a shared global range\. That shared range makes it better suited to normalized vectors or datasets with similar value distributions across dimensions\. A smaller representation can save more space, but its effect on recall and throughput needs measurement; lowering the bit width does not guarantee a useful performance improvement\.

### HNSW_PQ compresses groups of dimensions

**Product quantization \(PQ\)** divides a vector into m subvectors and represents each with an index into a learned codebook\. The parameter nbits determines the number of bits used for each codebook index\. Together, m and nbits control the code length and the approximation budget\.

For our 768\-dimensional vectors, m=96 gives eight dimensions per subvector\. With nbits=8, each codebook index takes one byte, producing a 96\-byte code per vector\. This is much smaller than the 768\-byte SQ8 representation in the same test, but it is also a different compression budget\. Comparing the two requires considering the resulting recall, not just the index size\.

### HNSW_PRQ also encodes the remaining approximation error

**Product residual quantization \(PRQ\)** uses additional stages to encode the error left by earlier approximations\. After a first PQ approximation, another stage encodes its residual\. More stages retain additional information and add encoding, training, and search work\.

Our PRQ configuration used m=96, nbits=8, and nrq=2, for two quantization stages and a 192\-byte code per vector\. Its comparison with the 96\-byte PQ configuration therefore measures the effect of both residual encoding and a larger code budget\. It is not a comparison at the same compression ratio\.

![](https://assets.zilliz.com/cms-cn/Compression_Granularity_sq_vs_pq_vs_prq_e8c93fc8f7.PNG)

Figure 2. SQ quantizes individual dimensions, PQ encodes groups of dimensions, and PRQ adds stages to encode residual error\. The theoretical code lengths exclude graph, codebook, metadata, and refinement overhead\.

The representations used in this benchmark had the following theoretical payload sizes:

|**Index**|**Representation tested**|**Bytes per vector**|
|---|---|---|
|HNSW|FP32|3,072|
|HNSW_SQ|SQ8 / SQ6 / SQ4U|768 / 576 / 384|
|HNSW_PQ|m=96, nbits=8|96|
|HNSW_PRQ|m=96, nbits=8, nrq=2|192|

For PQ, the code length is m × nbits / 8 bytes; PRQ multiplies that budget by nrq\. These payload sizes exclude the HNSW graph, codebooks, metadata, and optional refinement data\. Actual index files and runtime memory are larger\.

Vector representation can also affect the graph itself\. Quantization error may change neighbor selection during construction and candidate ordering during search, so using the same graph parameters does not guarantee identical connections across index types\.

## Where refinement fits into the choice

Quantization affects the distances used to find and rank candidates\. **Refinement** gives a quantized index another representation for the final ranking step: the base index retrieves candidates, Milvus recomputes their distances using refine_type, and the search returns the best TopK results after reranking\.

The distinction matters when selecting an index\. A base encoding may be small enough for your memory budget, yet the representation retained for refinement can make the complete configuration much larger\.

|**Parameter**|**Set during**|**Purpose**|
|---|---|---|
|refine|Index construction|Enable refinement and retain refinement data\.|
|refine_type|Index construction|Choose the representation used for reranking\.|
|ef|Search|Control the breadth of graph search\.|
|refine_k|Search|Request a candidate count of TopK multiplied by refine_k for refinement\.|

For HNSW_SQ, the refinement representation must be more precise than the base sq_type\. For example, SQ6 can use SQ8 or FP32 refinement; SQ8 can use BF16, FP16, or FP32. FP32 provides full\-precision reranking, while SQ8 refinement still introduces representation error\.

refine_k sets the candidate count relative to TopK\. With TopK=100 and refine_k=4, the base search is asked for up to 400 candidates, which are reranked to return 100 results\. A larger candidate set gives refinement more opportunities to recover true neighbors ranked below the initial top 100. It also adds retrieval, distance\-calculation, and memory\-access costs\. A neighbor absent from the candidate set remains unavailable to the reranker\.

![](https://assets.zilliz.com/cms-cn/quantized_hnsw_search_with_refinement_4818df763b.png)

Figure 3. Conceptual workflow for quantized HNSW retrieval and higher\-precision refinement\. The base search requests TopK multiplied by refine_k candidates, reranks them using refine_type, and returns TopK results\.

ef and refine_k address different parts of this process\. Increasing ef widens graph search; increasing refine_k asks the base index for more candidates to rerank\. Their effects should be measured together, including the cost of finding the expanded candidate set\.

The retained refinement representation adds index storage and runtime memory costs\. FP32 refinement requires access to full\-precision vectors, although their physical memory residency depends on memory mapping, the page cache, loading behavior, and access patterns\.

## What we benchmarked

We used the same dataset and graph construction parameters to compare selected configurations across all four index types\. The tests examined both the base indexes and the cost of recovering recall through refinement\.

|**Item**|**Configuration**|
|---|---|
|Server and client|Milvus milvusdb/milvus:v2.6.17, Docker Standalone; PyMilvus 2.6.15; client and server on the same machine|
|Hardware|KVM virtual machine; Intel Xeon Gold 6226R @ 2.90 GHz; 16 vCPUs; 64 GB RAM; one NUMA node; AVX2 and AVX\-512 support|
|System and storage|Ubuntu 20.04.6 LTS; Linux 5.15.0\-139\-generic; QEMU virtual block device; ext4; Docker 26.1.3; no additional CPU, memory, or cpuset limits|
|Dataset|VectorDBBench Cohere 1M; 1 million stored vectors; 1,000 query vectors; 768 dimensions|
|Retrieval|COSINE; TopK=100; ef=128/256/512; refine_k=1/2/4/8 when refinement was enabled|
|Index configurations|M=16, efConstruction=200; SQ8, SQ6, and SQ4U; PQ: m=96, nbits=8; PRQ: the same parameters plus nrq=2|

M controls graph connectivity, and efConstruction controls the candidate breadth during construction\. We fixed them at 16 and 200 rather than independently optimizing the graph for each representation\.

We calculated **Recall@100** for each query as the fraction of returned vector IDs also present in the COSINE ground\-truth top 100, then averaged the results across 1,000 queries\. **Serial latency** comes from executing those queries sequentially\. **Peak QPS** is the highest throughput observed in concurrent load testing; its corresponding P95 comes from that same concurrent test, separately from serial P95.

Key configurations were tested at concurrency levels of 8, 16, and 32 and run three times, with the main comparison generally reporting median QPS and latency\. Parameter sweeps used concurrency levels of 8 and 16 and were separate measurement series\. Values for the same configuration can therefore differ between the main comparison and the sweeps\.

The resource measurements use these definitions:

- **Memory** is the container memory increase before and after loading the collection, measured with docker stats \-\-no\-stream\. It includes effects such as allocation behavior, segment metadata, the page cache, and memory mapping; it is not strict Milvus process RSS\.

- **Index artifacts** estimate the additional index files produced during construction, excluding the rest of the instance's disk usage\.

- **Build time** runs from create_index until construction completes, excluding data ingestion\.

The client and Milvus shared one VM and competed for CPU resources\. The results exclude cross\-host network latency\. These measurements compare configurations within this environment and should not be used directly to size another deployment\.

## What the index comparison shows

The main comparison used configured ef=256. Refined configurations used FP32 and refine_k=4. Matching the configured ef does not make the query work equal: refinement asks the base search for a larger candidate set and then recomputes distances\.

In the tables, **\+ FP32** or **\+ SQ8** identifies the refinement precision\. A quantized index name on its own means refinement is disabled\.

|**Configuration**|**Recall@100**|**Peak QPS**|**Concurrency**|**Serial P95**<br>**\(ms\)**|**P95 at peak**<br>**\(ms\)**|
|---|---|---|---|---|---|
|FP32 HNSW|0.9807|614.8|32|8.3|96.7|
|SQ8|0.9761|793.1|16|7.4|76.8|
|SQ8 \+ FP32|0.9881|653.6|32|9.3|89.7|
|SQ4U|0.8861|1,042.9|16|4.9|26.1|
|PQ|0.6083|1,001.4|16|6.1|26.5|
|PQ \+ FP32|0.9667|748.2|32|8.4|80.5|
|PRQ|0.7869|570.4|16|11.7|39.7|
|PRQ \+ FP32|0.9869|420.4|32|16.2|109.5|

Table 1. Recall and query performance at configured ef=256. Each peak QPS value has its own concurrency and corresponding P95 latency\.

|**Configuration**|**Memory**<br>**\(MB\)**|**Index artifacts**<br>**\(MB\)**|**Build time**<br>**\(s\)**|
|---|---|---|---|
|FP32 HNSW|3,217|3,071|284.7|
|SQ8|1,006|874|161.5|
|SQ8 \+ FP32|3,975|3,804|193.7|
|SQ4U|608|508|170.7|
|PQ|446|236|363.3|
|PQ \+ FP32|3,422|3,166|393.9|
|PRQ|516|337|5,378.4|
|PRQ \+ FP32|3,508|3,266|5,337.1|

Table 2. Resource measurements for the same configurations\. Memory and index artifacts are increases measured as defined above\.

### SQ8 was a strong first compression option

SQ8 without refinement kept recall close to the FP32 reference: 0.9761 versus 0.9807, a difference of **0.46 percentage points**\. Its peak throughput was 793.1 QPS versus 614.8 QPS, about 1.29 times as high, although the peaks occurred at different concurrency levels\.

The memory increase after loading fell from 3,217 MB to 1,006 MB, **31.3% of the FP32 reference**, or a reduction of about 68.7%\. Index artifacts fell from 3,071 MB to 874 MB, and build time fell from 284.7 seconds to 161.5 seconds\. For a workload that can accept the recall difference, SQ8 is a useful first configuration to evaluate\.

Lower SQ bit widths shifted the balance further:

|**SQ type**|**Recall@100**|**Peak QPS**|**P95 / P99**<br>**\(ms\)**|**Memory**<br>**\(MB\)**|**Artifacts**<br>**\(MB\)**|**Build**<br>**\(s\)**|
|---|---|---|---|---|---|---|
|SQ8|0.9761|793.1|7.4 / 12.7|1,006|874|161.5|
|SQ6|0.9563|794.9|7.9 / 15.6|828|691|182.1|
|SQ4U|0.8861|1,042.9|4.9 / 6.1|608|508|170.7|

Table 3. SQ configurations without refinement at ef=256. Latency is serial; memory and artifact sizes are in MB\.

SQ6 saved another 178 MB of memory relative to SQ8, while recall fell by about 2.0 percentage points and peak throughput stayed almost unchanged\. SQ4U delivered higher throughput and lower memory usage, with recall of 0.8861. The lower\-bit configurations offer additional compression, but they need a quality requirement that justifies that loss or a way to recover it\.

### PQ and PRQ made different compromises for smaller codes

Without refinement, the tested PQ configuration had the smallest memory increase, 446 MB, with Recall@100 of 0.6083. PRQ's larger code budget improved recall to 0.7869 and used 516 MB\. Both were substantially smaller than SQ8 in this setup, with much lower recall at the tested TopK\.

Build cost further separated them\. PQ took 363.3 seconds to build; PRQ took 5,378.4 seconds, about 89.6 minutes\. PRQ's additional stages recovered some information but were expensive to construct in this test\. That cost matters when an index needs frequent rebuilding or must fit a short deployment window\.

The results describe these particular code budgets\. They do not establish a fixed recall ceiling for PQ or an inherent build time for PRQ\. Changing m, nbits, or nrq can change the comparison\.

### FP32 refinement changed the resource comparison

With refine_k=4, SQ8 plus FP32 refinement reached 0.9881 Recall@100, but its memory increase rose to 3,975 MB, above the 3,217 MB FP32 HNSW reference\. PQ reached 0.9667 with 3,422 MB, and PRQ reached 0.9869 with 3,508 MB\.

PRQ also retained its long build time and higher query latency\. With refinement, it delivered 420.4 peak QPS and 109.5 ms P95 at that operating point\. Refinement made higher recall possible, but comparing only the base codes would substantially understate the resulting configuration's cost\.

## Which adjustments recovered recall

The base comparison identifies the tradeoffs at one set of search parameters\. The following sweeps test what to change when a configuration misses the required recall\.

### Widening graph search helped SQ8 more than the tested PQ encoding

|**Configuration**|**ef=128**|**ef=256**|**ef=512**|
|---|---|---|---|
|FP32 HNSW|0.9599|0.9812|0.9903|
|SQ8|0.9567|0.9762|0.9844|
|SQ8 \+ FP32|0.9874|0.9874|0.9903|
|SQ4U|0.8755|0.8861|0.8911|
|PQ|0.6068|0.6083|0.6088|
|PQ \+ FP32|0.9668|0.9668|0.9697|
|PRQ|0.7816|0.7869|0.7896|
|PRQ \+ FP32|0.9873|0.9873|0.9899|

Table 4. Recall@100 as configured ef increases\. Refined configurations use FP32 and refine_k=4.

Refined configurations requested 400 candidates for reranking at every point in this sweep\. The configured ef value alone does not describe the complete retrieval and reranking cost\.

FP32 HNSW and SQ8 without refinement continued to gain recall as ef increased\. **SQ8 reached 0.9844 at ef=512 without refinement**, making a wider search one option for exceeding 0.98 recall in this workload\.

The tested PQ configuration improved only from 0.6068 to 0.6088, while PRQ improved from 0.7816 to 0.7896. For those unrefined configurations, a wider search over this range produced little additional recall\. That plateau is a reason to evaluate another encoding budget or refinement\. It does not isolate one cause for all the recall loss\.

![](https://assets.zilliz.com/cms-cn/qps_vs_ef_55ebf7c35c.png)

Figure 4. Peak QPS versus configured ef from the separate parameter sweep\. Refined configurations use FP32 and refine_k=4.

Wider search generally reduced throughput\. An increase in ef is useful when the resulting recall gain is worth its latency and throughput cost\.

### More refinement candidates improved recall and reduced throughput

With FP32 refinement enabled and configured ef=256, increasing refine_k produced these recall results:

|**Configuration**|**refine_k=1**|**refine_k=2**|**refine_k=4**|**refine_k=8**|
|---|---|---|---|---|
|SQ8 \+ FP32|0.9807|0.9807|0.9881|0.9940|
|PQ \+ FP32|0.8629|0.9322|0.9667|0.9848|
|PRQ \+ FP32|0.9704|0.9779|0.9869|0.9931|

Table 5. Recall@100 at different refine_k values with FP32 refinement\.

PQ showed the largest gain, rising from 0.8629 at refine_k=1 to 0.9848 at 8. Passing more candidates to FP32 refinement substantially improved the final result for this encoding\.

PRQ improved from 0.9704 to 0.9931, while peak QPS fell from 560.1 to 270.9 and serial P95 rose from 12.3 ms to 24.5 ms\. SQ8 recorded 0.9807 at both refine_k=1 and 2, then reached 0.9940 at 8; peak QPS fell from 768.6 to 443.0 across the sweep\.

![](https://assets.zilliz.com/cms-cn/qps_vs_refine_k_43455a2244.png)

Figure 5. Peak QPS versus refine_k at configured ef=256 from the separate parameter sweep\. All three configurations use FP32 refinement\.

FP32 refinement also narrowed the recall gap between SQ bit widths\. At refine_k=4 and 8, respectively, Recall@100 was:

- **SQ4U:** 0.9830 and 0.9899.

- **SQ6:** 0.9875 and 0.9936.

- **SQ8:** 0.9881 and 0.9940.

Those configurations approached similar recall, but retaining FP32 data remained expensive\. SQ4U's memory increase rose from 608 MB without refinement to 3,564 MB with FP32 refinement\. Lower precision in the base index did not preserve the same memory advantage once full\-precision refinement data was included\.

The SQ parameter sweep also showed that lower\-bit base encodings could retain a throughput advantage with FP32 refinement\. At configured ef=256 and refine_k=8, the measured configurations were:

|**Configuration**|**Recall@100**|**Peak QPS**|**Memory \(MB\)**|
|---|---|---|---|
|SQ8 \+ FP32|0.9940|443.0|3,975|
|SQ6 \+ FP32|0.9936|460.9|3,764|
|SQ4U \+ FP32|0.9899|613.5|3,564|

Table 6. SQ configurations with FP32 refinement at configured ef=256 and refine_k=8. QPS values are from the SQ parameter sweep; memory is the container increase after loading\.

SQ4U retained a throughput advantage, but its 0.9899 recall did not meet a strict 0.99 minimum\. These are nearby recall points, not an equal\-recall comparison\. Lower\-bit SQ remains worth evaluating when throughput matters, even if FP32 refinement absorbs much of the memory savings\.

### Refinement precision offered another way to control cost

FP32 is one choice of refinement representation\. At ef=256 and refine_k=4, we also tested SQ8 refinement for SQ6 and SQ4U:

|**Base \+ refinement**|**Recall@100**|**Peak QPS**|**P95**<br>**\(ms\)**|**Memory**<br>**\(MB\)**|**Artifacts**<br>**\(MB\)**|**Build**<br>**\(s\)**|
|---|---|---|---|---|---|---|
|SQ6 \+ FP32|0.9875|656.2|9.1|3,764|3,621|216.2|
|SQ6 \+ SQ8|0.9818|661.9|9.6|1,555|1,423|192.5|
|SQ4U \+ FP32|0.9830|810.3|7.5|3,564|3,438|204.3|
|SQ4U \+ SQ8|0.9779|839.2|7.3|1,381|1,240|176.3|

Table 7. Refinement precision comparison\. P95 is serial latency; memory and artifact sizes are in MB\.

For SQ6, switching refinement from FP32 to SQ8 reduced the memory increase from 3,764 MB to **1,555 MB**, while recall fell from 0.9875 to **0.9818**, a difference of 0.57 percentage points\. Peak QPS was similar in these measurements\. This configuration met a 0.98 recall threshold while retaining substantially more of the memory savings\.

SQ4U with SQ8 refinement used 1,381 MB and reached 0.9779 recall\. It may be useful when that recall is sufficient, but it did not meet a strict 0.98 threshold at these settings\. Select the refinement precision and candidate count together; the highest\-precision representation may exceed what the application needs and can afford\.

### What these experiments do not establish

The benchmark covers Cohere 1M's 768\-dimensional vectors, COSINE, and TopK=100. We did not sweep M, efConstruction, m, nbits, or nrq, or test BF16 and FP16 encodings\. The VM exposed a QEMU virtual block device, so the physical storage type and host\-level I/O contention were not observable\.

The experiments also excluded scalar filters, hybrid retrieval, ongoing inserts and deletes, compaction, cluster deployments, and multitenant contention\. Different vector distributions, dimensions, metrics, TopK values, and hardware can change the results\. The measurements narrow the configurations worth testing; they do not determine a universal best index\.

## Matching an index to your workload

The first decision is the minimum acceptable result quality at the TopK your application actually uses\. After that, compare the complete configurations against throughput, concurrent latency, memory, index storage, and build\-window requirements\.

### For a full precision reference start with HNSW

Use FP32 HNSW to establish recall and latency before quantization, sweeping ef under fixed M and efConstruction\. This gives you a reference for deciding whether a quantized configuration saves enough resources to justify its recall loss or additional refinement work\.

If memory permits and the recall requirement is demanding, keep that reference in the final comparison\. A refined quantized configuration that beats one FP32 recall point may be doing more candidate retrieval and reranking work; compare the resulting service performance as well\.

### For balanced recall and resource usage evaluate SQ8 first

SQ8 without refinement is a useful first compression candidate based on this benchmark\. If it meets the required recall, its memory and build\-time savings can make the configuration straightforward to adopt\. If recall falls short, compare a wider search with refinement before choosing a more complex encoding\.

The following measured configurations sit near 0.98 Recall@100 at ef=256. They span different recall levels and measurement series, so this is a comparison around a target, not an equal\-recall benchmark\.

|**Configuration**|**refine_k**|**Recall@100**|**Peak QPS**|**Memory**<br>**\(MB\)**|**Artifacts**<br>**\(MB\)**|
|---|---|---|---|---|---|
|HNSW FP32|—|0.9807|614.8|3,217|3,071|
|SQ8|—|0.9761|793.1|1,006|874|
|SQ8 \+ FP32|1|0.9807|768.6|3,975|3,804|
|SQ6 \+ SQ8|4|0.9818|661.9|1,555|1,423|
|PQ \+ FP32|8|0.9848|553.3|3,422|3,166|
|PRQ \+ FP32|2|0.9779|533.1|3,508|3,266|

Table 8. Measured configurations around 0.98 Recall@100 at ef=256. Memory and artifact sizes are in MB; QPS values come from the corresponding measurement series\.

If **0.9761 is sufficient**, SQ8 without refinement offered substantial savings and higher peak throughput than the FP32 reference\. For a strict **0.98 minimum**, that row and PRQ at refine_k=2 do not qualify\. SQ6 with SQ8 refinement is another candidate: it reached 0.9818 using substantially less memory than the configurations retaining FP32 refinement data\.

Also include **SQ8 without refinement at ef=512**, which reached 0.9844 in the earlier sweep\. The table's fixed ef=256 does not imply that refinement is necessary to exceed 0.98. Compare wider search and refinement at the required recall and concurrent latency\.

### For tighter memory limits test the cost of more compression

SQ6, SQ4U, PQ, and PRQ provide further options for reducing the base representation\. Choose candidates according to the recall you can accept, then measure whether wider search or refinement is needed\. Include the retained refinement data in the memory and storage budget\.

For a retrieval stage feeding a downstream reranker, test candidate coverage at the shortlist size actually passed to that model and assess the complete pipeline\. These Recall@100 results do not establish how well a much larger shortlist will work\. A downstream model can reorder retrieved candidates, but cannot recover a relevant item omitted by retrieval\.

### For frequent rebuilds include construction cost in the decision

If index rebuilds are frequent, a configuration's offline cost can rule it out even when query performance is acceptable\. The tested PRQ build took about 89.6 minutes without refinement, compared with seconds to a few minutes for the SQ and PQ configurations in this environment\. Include SQ and alternative PQ budgets in the comparison and verify that any PRQ configuration fits the actual build window\.

Once you have a shortlist, tune ef, refine_type, and refine_k against the required recall\. For PQ and PRQ, also test the encoding parameters rather than treating this benchmark's values as defaults\. Record QPS with its concurrency and corresponding P95/P99, then check memory, index artifacts, and build time in the target environment\.

The HNSW variants give you different ways to balance vector precision and search cost\. Select the configuration whose complete retrieval path meets the workload's quality and resource requirements, using these results to choose the experiments worth running first\.

### Experiment code and reference documentation

- Experiment scripts and results: [milvus\-hnsw\-quantization\-cohere\-1m\-experiments](https://github.com/JackLCL/milvus-hnsw-quantization-cohere-1m-experiments)

- [HNSW](https://milvus.io/docs/v2.6.x/hnsw.md)

- [HNSW_SQ](https://milvus.io/docs/v2.6.x/hnsw-sq.md)

- [HNSW_PQ](https://milvus.io/docs/v2.6.x/hnsw-pq.md)

- [HNSW_PRQ](https://milvus.io/docs/v2.6.x/hnsw-prq.md)
