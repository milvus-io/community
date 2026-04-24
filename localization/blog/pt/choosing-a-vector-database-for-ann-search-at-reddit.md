---
id: choosing-a-vector-database-for-ann-search-at-reddit.md
title: |
  Choosing a vector database for ANN search at Reddit
author: Chris Fournie
date: 2025-11-28T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Nov_29_2025_12_03_05_AM_min_1_05250269a8.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, reddit'
meta_keywords: 'Milvus, vector database, reddit'
meta_title: |
  Choosing a vector database for ANN search at Reddit
desc: >-
  This post describes the process the Reddit team used to select their most
  suitable vector database and why they chose Milvus.
origin: 'https://milvus.io/blog/choosing-a-vector-database-for-ann-search-at-reddit.md'
---
<p><em>This post was written by Chris Fournie, the Staff Software Engineer at Reddit, and originally published on</em> <a href="https://www.reddit.com/r/RedditEng/comments/1ozxnjc/choosing_a_vector_database_for_ann_search_at/">Reddit</a>, and is reposted here with permission.</p>
<p>In 2024, Reddit teams used a variety of solutions to perform approximate nearest neighbour (ANN) vector search. From Google’s <a href="https://docs.cloud.google.com/vertex-ai/docs/vector-search/overview">Vertex AI Vector Search</a> and experimenting with using <a href="https://solr.apache.org/guide/solr/latest/query-guide/dense-vector-search.html">Apache Solr’s ANN vector search</a> for some larger datasets, to Facebook’s <a href="https://github.com/facebookresearch/faiss">FAISS library</a> for smaller datasets (hosted in vertically scaled side-cars). More and more teams at Reddit wanted a broadly supported ANN vector search solution that was cost-effective, had the search features they desired, and could scale to Reddit-sized data. To address this need, in 2025, we sought out the ideal vector database for Reddit teams.</p>
<p>This post describes the process we used to select the best vector database for Reddit’s needs today. It does not describe the best vector database overall, nor the most essential set of functional and non-functional requirements for all situations. It describes what Reddit and its engineering culture valued and prioritized when selecting a vector database. This post may serve as inspiration for your own requirements collection and evaluation, but each organization has its own culture, values, and needs.</p>
<h2 id="Evaluation-process" class="common-anchor-header">Evaluation process<button data-href="#Evaluation-process" class="anchor-icon" translate="no">
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
    </button></h2><p>Overall, the selection steps were:</p>
<p>1. Collect context from teams</p>
<p>2. Qualitatively evaluate solutions</p>
<p>3. Quantitatively evaluate top contenders</p>
<p>4. Final selection</p>
<h3 id="1-Collect-context-from-teams" class="common-anchor-header">1. Collect context from teams</h3><p>Three pieces of context were collected from teams interested in performing ANN vector search:</p>
<ul>
<li><p>Functional requirements (e.g., Hybrid vector and lexical search? Range search queries? Filtering by non-vector attributes?)</p></li>
<li><p>Non-functional requirements (e.g, Can it support 1B vectors? Can it reach &lt;100ms P99 latency?)</p></li>
<li><p>Vector databases teams were already interested in</p></li>
</ul>
<p>Interviewing teams for requirements is not trivial. Many will describe their needs in terms of how they are currently solving a problem, and your challenge is to understand and remove that bias.</p>
<p>For example, a team was already using FAISS for ANN vector search and stated that the new solution must efficiently return 10K results per search call. Upon further discussion, the reason for the 10K results was that they needed to perform post-hoc filtering, and FAISS does not offer filtering ANN results at query time. Their actual problem was that they needed filtering, so any solution that offered efficient filtering would suffice, and returning 10K results was simply a workaround required to improve their recall. They would ideally like to pre-filter the entire collection before finding nearest neighbours.</p>
<p>Asking for the vector databases that teams were already using or were interested in was also valuable. If at least one team had a positive view of their current solution, it’s a sign that vector database could be a useful solution to share across the entire company. If teams only had negative views of a solution, then we should not include it as an option. Accepting solutions that teams were interested in was also a way to make sure that teams felt included in the process and helped us form an initial list of leading contenders to evaluate; there are too many ANN vector search solutions in new and existing databases to exhaustively test all of them.</p>
<h3 id="2-Qualitatively-evaluate-solutions" class="common-anchor-header">2. Qualitatively evaluate solutions</h3><p>Starting with the list of solutions that teams were interested in, to qualitatively evaluate which ANN vector search solution best fit our needs, we:</p>
<ul>
<li><p>Researched each solution and scored how well it fulfilled each requirement vs the weighted importance of that requirement</p></li>
<li><p>Removed solutions based on qualitative criteria and discussion</p></li>
<li><p>Picked our top N solutions to quantitatively test</p></li>
</ul>
<p>Our starting list of ANN vector search solutions included:</p>
<ul>
<li><p><a href="https://milvus.io/">Milvus</a></p></li>
<li><p>Qdrant</p></li>
<li><p>Weviate</p></li>
<li><p>Open Search</p></li>
<li><p>Pgvector (already using Postgres as an RDBMS)</p></li>
<li><p>Redis (already used as a KV store and cache)</p></li>
<li><p>Cassandra (already used for non-ANN search)</p></li>
<li><p>Solr (already using for lexical search and experimented with vector search)</p></li>
<li><p>Vespa</p></li>
<li><p>Pinecone</p></li>
<li><p>Vertex AI (already used for ANN vector search)</p></li>
</ul>
<p>We then took every functional and non-functional requirement that was mentioned by teams, plus some more constraints representing our engineering values and objectives, made those rows in a spreadsheet, and weighed how important they were (from 1 to 3; shown in the abridged table below).</p>
<p>For each solution we were comparing, we evaluated (on a scale of 0 to 3) how well each system satisfied that requirement (as shown in the table below). Scoring in this way was somewhat subjective, so we picked one system and gave examples of scores with written rationale and had reviewers refer back to those examples. We also gave the following guidance for assigning each score value: assign this value if:</p>
<ul>
<li><p>0: No support/evidence of requirement support</p></li>
<li><p>1: Basic or inadequate requirement support</p></li>
<li><p>2: Requirement reasonably supported</p></li>
<li><p>3: Robust requirement support that goes above and beyond comparable solutions</p></li>
</ul>
<p>We then created an overall score for each solution by taking the sum of the product of a solution’s requirement score and that requirement’s importance (e.g., Qdrant scored 3 for re-ranking/score combining, which has importance 2, so 3 x 2 = 6, repeat that for all rows and sum together). At the end, we have an overall score that can be used as the basis for ranking and discussing solutions, and which requirements matter most (note that the score is not used to make a final decision but as a discussion tool).</p>
<p><strong><em>Editor’s note:</em></strong> <em>This review was based on Milvus 2.4. We’ve since rolled out Milvus 2.5,</em> <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><em>Milvus 2.6</em></a><em>, and Milvus 3.0 is right around the corner, so a few numbers may be out of date. Even so, the comparison still offers strong insights and remains very helpful.</em></p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Category</strong></td><td><strong>Importance</strong></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>(2.4)</strong></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Search Type</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Hybrid Search</a></td><td>1</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Keyword Search</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Approximate NN search</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Range Search</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td><td>0</td></tr>
<tr><td>Re-ranking/score combining</td><td>2</td><td>3</td><td>2</td><td>0</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Indexing Method</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>HNSW</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Supports multiple indexing methods</td><td>3</td><td>0</td><td>3</td><td>1</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Quantization</td><td>1</td><td>3</td><td>3</td><td>0</td><td>3</td><td>0</td><td>0</td></tr>
<tr><td>Locality Sensitive Hashing (LSH)</td><td>1</td><td>0</td><td>0Note: <a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 2.6 supports it. </a></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Data</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Vector types other than float</td><td>1</td><td>2</td><td>2</td><td>0</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Metadata attributes on vectors (supports multiple attribs, a large record size, etc.)</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Metadata filtering options (can filter on metadata, has pre/post filtering)</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td></tr>
<tr><td>Metadata attribute datatypes (robust schema, e.g. bool, int, string, json, arrays)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>3</td><td>1</td></tr>
<tr><td>Metadata attributes limits (range queries, e.g. 10 &lt; x &lt; 15)</td><td>1</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Diversity of results by attribute (e.g. getting not more than N results from each subreddit in a response)</td><td>1</td><td>2</td><td>1</td><td>2</td><td>3</td><td>3</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Scale</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hundreds of millions vector index</td><td>3</td><td>2</td><td>3</td><td></td><td>1</td><td>2</td><td>3</td></tr>
<tr><td>Billion vector index</td><td>1</td><td>2</td><td>2</td><td></td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Support vectors at least 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td></tr>
<tr><td>Support vectors greater than 2k</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>P95 Latency 50-100ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>1</td><td>2</td></tr>
<tr><td>P99 Latency &lt;= 10ms @ X QPS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>1</td><td>2</td></tr>
<tr><td>99.9% availability retrieval</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>99.99% availability indexing/storage</td><td>2</td><td>1</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Storage Operations</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Hostable in AWS</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Multi-Region</td><td>1</td><td>1</td><td>2</td><td>3</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Zero-downtime upgrades</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Multi-Cloud</td><td>1</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>APIs/Libraries</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>gRPC</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td><td>2</td></tr>
<tr><td>RESTful API</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Go Library</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Java Library</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Python</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Other languages (C++, Ruby, etc)</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Runtime Operations</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Prometheus Metrics</td><td>3</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Basic DB Operations</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upserts</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td>Kubernetes Operator</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Pagination of results</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Embedding lookup by ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Return Embeddings with Candidate ID and candidate scores</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>User supplied ID</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Able to search in large scale batch context</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Backups / Snapshots: supports the ability to create backups of the entire database</td><td>1</td><td>2</td><td>2</td><td>2</td><td>3</td><td>3</td><td>2</td></tr>
<tr><td>Efficient large index support (cold vs hot storage distinction)</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Support/Community</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Vendor neutrality</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Robust api support</td><td>3</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Vendor support</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Community Velocity</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td>Production Userbase</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>1</td><td>2</td></tr>
<tr><td>Community Feel</td><td>1</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td>Github Stars</td><td>1</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Configuration</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Secrets Handling</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td><td>2</td><td>2</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Source</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Open Source</td><td>3</td><td>3</td><td>3</td><td>3</td><td>2</td><td>3</td><td>0</td></tr>
<tr><td>Language</td><td>2</td><td>3</td><td>3</td><td>2</td><td>3</td><td>2</td><td>0</td></tr>
<tr><td>Releases</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Upstream testing</td><td>1</td><td>2</td><td>3</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Availability of documentation</td><td>3</td><td>3</td><td>3</td><td>2</td><td>1</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Cost</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Cost Effective</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>1</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td><strong>Performance</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Support for tuning resource utilization for CPU, memory, and disk</td><td>3</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Multi-node (pod) sharding</td><td>3</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Have the ability to tune the system to balance between latency and throughput</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>User-defined partitioning (writes)</td><td>1</td><td>3</td><td>2</td><td>3</td><td>1</td><td>2</td><td>0</td></tr>
<tr><td>Multi-tenant</td><td>1</td><td>3</td><td>2</td><td>1</td><td>3</td><td>2</td><td>2</td></tr>
<tr><td>Partitioning</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Replication</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Redundancy</td><td>1</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Automatic Failover</td><td>3</td><td>2</td><td>0 Note: <a href="https://milvus.io/docs/coordinator_ha.md">Milvus 2.6 supports it. </a></td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>Load Balancing</td><td>2</td><td>2</td><td>2</td><td>3</td><td>2</td><td>2</td><td>2</td></tr>
<tr><td>GPU Support</td><td>1</td><td>0</td><td>2</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td><strong>Qdrant</strong></td><td><a href="https://milvus.io/"><strong>Milvus</strong></a></td><td><strong>Cassandra</strong></td><td><strong>Weviate</strong></td><td><strong>Solr</strong></td><td><strong>Vertex AI</strong></td></tr>
<tr><td><strong>Overall solution scores</strong></td><td></td><td>292</td><td>281</td><td>264</td><td>250</td><td>242</td><td>173</td></tr>
</tbody>
</table>
<p>We discussed the overall and requirement scores of the various systems and sought to understand whether we had appropriately weighted the importance of the requirements and whether some requirements were so important that they should be considered core constraints. One such requirement we identified was whether the solution was open-source or not, because we desired a solution that we could become involved with, contribute towards, and quickly fix small issues if we experienced them at our scale. Contributing to and using open-source software is an important part of Reddit’s engineering culture. This eliminated the hosted-only solutions (Vertex AI, Pinecone) from our consideration.</p>
<p>During discussions, we found that a few other key requirements were of outsized importance to us:</p>
<ul>
<li><p>Scale and reliability: we wanted to see evidence of other companies running the solution with 100M+ or even 1B vectors</p></li>
<li><p>Community: We wanted a solution with a healthy community with a lot of momentum in this rapidly maturing space</p></li>
<li><p>Expressive metadata types and filtering to enable more of our use-cases (filtering by date, boolean, etc.)</p></li>
<li><p>Supports for multiple index types (not just HNSW or DiskANN) to better fit performance for our many unique use-cases</p></li>
</ul>
<p>The result of our discussions and honing of key requirements led us to choose to test (in order) quantitatively:</p>
<ol>
<li><p>Qdrant</p></li>
<li><p>Milvus</p></li>
<li><p>Vespa, and</p></li>
<li><p>Weviate</p></li>
</ol>
<p>Unfortunately, decisions like this take time and resources, and no organization has unlimited amounts of either. Given our budget, we decided to test Qdrant and Milvus, and to leave testing Vespa and Weviate as stretch goals.</p>
<p>Qdrant vs Milvus was also an interesting test of two different architectures:</p>
<ul>
<li><p><strong>Qdrant:</strong> Homogeneous node types that perform all ANN vector database operations</p></li>
<li><p><strong>Milvus:</strong> <a href="https://milvus.io/docs/architecture_overview.md">Heterogeneous node types</a> (Milvus; one for queries, another for indexing, another for data ingest, a proxy, etc.)</p></li>
</ul>
<p>Which one was easy to set up (a test of their documentation)? Which one was easy to run (a test of their resiliency features and polish)? And which one performed best for the use cases and scale that we cared about? These questions we sought to answer as we quantitatively compared the solutions.</p>
<h3 id="3-Quantitatively-evaluate-top-contenders" class="common-anchor-header">3. Quantitatively evaluate top contenders</h3><p>We wanted to better understand how scalable each solution was, and in the process, experience what it would be like to set up, configure, maintain, and run each solution at scale. To do this, we collected three datasets of document and query vectors for three different use-cases, set up each solution with similar resources within Kubernetes, loaded documents into each solution, and sent identical query loads using <a href="https://k6.io/">Grafana’s K6</a> with a ramping arrival rate executor to warm systems up before then hitting a target throughput (e.g., 100 QPS).</p>
<p>We tested throughput, the breaking point of each solution, the relationship between throughput and latency, and how they react to losing nodes under load (error rate, latency impact, etc.). Of key interest was <strong>the effect of filtering on latency</strong>. We also had simple yes/no tests to verify that a capability in documentation worked as described (e.g., upserts, delete, get by ID, user administration, etc.) and to experience the ergonomics of those APIs.</p>
<p><strong>Testing was done on Milvus v2.4 and Qdrant v1.12.</strong> Due to time constraints, we did not exhaustively tune or test all types of index settings; similar settings were used with each solution, with a bias towards high ANN recall, and tests focused on the performance of HNSW indexes. Similar CPU and memory resources were also given to each solution.</p>
<p>In our experimentation, we found a few interesting differences between the two solutions. In the following experiments, each solution had approximately 340M Reddit post vectors of 384 dimensions each, for HNSW, M=16, and efConstruction=100.</p>
<p>In one experiment, we found that for the same query throughput (100 QPS with no ingestion at the same time), adding filtering affected the latency of Milvus more than Qdrant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_filtering_2cb4c03d5b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Posts query latency with filtering</p>
<p>In another, we found that there was far more of an interaction between ingestion and query load on Qdrant than on Milvus (shown below at constant throughput). This is likely due to their architecture; Milvus splits much of its ingestion over separate node types from those that serve query traffic, whereas Qdrant serves both ingestion and query traffic from the same nodes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Posts_query_latency_100_QPS_during_ingest_e919a448cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Posts query latency @ 100 QPS during ingest</p>
<p>When testing the diversity of results by attribute (e.g. getting not more than N results from each subreddit in a response), we found that for the same throughput, Milvus had worse latency than Qdrant (at 100 QPS).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Post_query_latency_with_result_diversity_b126f562cd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Post query latency with result diversity</p>
<p>We also wanted to see how effectively each solution scaled when more replicas of data were added (i.e. the replication factor, RF, was increased from 1 to 2). Initially, looking at RF=1, Qdrant was able to give us satisfactory latency for more throughput than Milvus (higher QPS not shown because tests did not complete without errors).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_1_latency_for_varying_throughput_bc161c8b1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant posts RF=1 latency for varying throughput</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_1_latency_for_varying_throughput_e81775b3af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus posts RF=1 latency for varying throughput</p>
<p>However, when increasing the replication factor, Qdrant’s p99 latency improved, but Milvus was able to sustain higher throughput than Qdrant was, with acceptable latency (Qdrant 400 QPS not shown because the test did not complete due to high latency and errors).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_posts_RF_2_latency_for_varying_throughput_7737dfb8a3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus posts RF=2 latency for varying throughput</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Qdrant_posts_RF_2_latency_for_varying_throughput_13fb26aaa1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qdrant posts RF=2 latency for varying throughput</p>
<p>Due to time constraints, we did not have enough time to compare ANN recall between solutions on our datasets, but we did take into account the ANN recall measurements for solutions provided by <a href="https://ann-benchmarks.com/">https://ann-benchmarks.com/</a> on publicly available datasets.</p>
<h3 id="4-Final-selection" class="common-anchor-header">4. Final selection</h3><p><strong>Performance-wise</strong>, without much tuning and only using HNSW, Qdrant appeared to have better raw latency in many tests than Milvus. Milvus looked like it would, however, scale better with increased replication, and had better isolation between ingestion and query load due to its multiple-node-type architecture.</p>
<p><strong>Operation-wise,</strong> despite the complexity of Milvus’ architecture (multiple node types, relying upon an external write-ahead log like Kafka and a metadata store like etcd), we had an easier time debugging and fixing Milvus than Qdrant when either solution entered a bad state. Milvus also has automatic rebalancing when increasing the replication factor of a collection, whereas in open-source Qdrant, manual creation or dropping of shards is required to increase the replication factor (a feature we would have had to build ourselves or use the non-open-source version).</p>
<p>Milvus is a more “Reddit-shaped” technology than Qdrant; it shares more similarities with the rest of our tech stack. Milvus is written in Golang, our preferred backend programming language, and thus easier for us to contribute to than Qdrant, which is written in Rust. Milvus has excellent project velocity for its open-source offering compared to Qdrant, and it met more of our key requirements.</p>
<p>In the end, both solutions met most of our requirements, and in some cases, Qdrant had a performance edge, but we felt that we could scale Milvus further, felt more comfortable running it, and it was a better match for our organization than Qdrant. We wish we had had more time to test Vespa and Weaviate, but they too may have been selected out for organizational fit (Vespa being Java-based) and architecture (Weaviate being single-node-type like Qdrant).</p>
<h2 id="Key-takeaways" class="common-anchor-header">Key takeaways<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
<li><p>Challenge the requirements you are given and try to remove existing solution bias.</p></li>
<li><p>Score candidate solutions, and use that to inform the discussion of essential requirements, not as a be-all end-all</p></li>
<li><p>Quantitatively evaluate solutions, but along the way, take note of what it’s like to work with the solution.</p></li>
<li><p>Pick the solution that fits best within your organization from a maintenance, cost, usability, and performance perspective, not just because a solution performs the best.</p></li>
</ul>
<h2 id="Acknowledgements" class="common-anchor-header">Acknowledgements<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>This evaluation work was performed by Ben Kochie, Charles Njoroge, Amit Kumar, and me. Thanks also to others who contributed to this work, including Annie Yang, Konrad Reiche, Sabrina Kong, and Andrew Johnson, for qualitative solution research.</p>
<h2 id="Editor’s-Notes" class="common-anchor-header">Editor’s Notes<button data-href="#Editor’s-Notes" class="anchor-icon" translate="no">
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
    </button></h2><p>We want to give a genuine thank-you to the Reddit engineering team — not just for choosing Milvus for their vector search workloads, but for taking the time to publish such a detailed and fair evaluation. It’s rare to see this level of transparency in how real engineering teams compare databases, and their write-up will be helpful to anyone in the Milvus community (and beyond) who’s trying to make sense of the growing vector database landscape.</p>
<p>As Chris mentioned in the post, there’s no single “best” vector database. What matters is whether a system fits your workload, constraints, and operational philosophy. Reddit’s comparison reflects that reality well. Milvus doesn’t top every category, and that’s completely expected given the trade-offs across different data models and performance goals.</p>
<p>One thing worth clarifying: Reddit’s evaluation used <strong>Milvus 2.4</strong>, which was the stable release at the time. Some features — like LSH and several index optimizations — either didn’t exist yet or weren’t mature in 2.4, so a few scores naturally reflect that older baseline. Since then, we’ve released Milvus 2.5 and then <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a>, and it’s a very different system in terms of performance, efficiency, and flexibility. The community response has been strong, and many teams have already upgraded.</p>
<p><strong>Here’s a quick look at what’s new in Milvus 2.6:</strong></p>
<ul>
<li><p>Up to <strong>72% lower memory usage</strong> and <strong>4× faster queries</strong> with RaBitQ 1-bit quantization</p></li>
<li><p><strong>50% cost reduction</strong> with intelligent tiered storage</p></li>
<li><p><strong>4× faster BM25 full-text search</strong> compared to Elasticsearch</p></li>
<li><p><strong>100× faster JSON filtering</strong> with the new Path Index</p></li>
<li><p>A new zero-disk architecture for fresher search at lower cost</p></li>
<li><p>A simpler “data-in, data-out” workflow for embedding pipelines</p></li>
<li><p>Support for <strong>100K+ collections</strong> to handle large multi-tenant environments</p></li>
</ul>
<p>If you want the full breakdown, here are a few good follow-ups:</p>
<ul>
<li><p>Blog: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Introducing Milvus 2.6: Affordable Vector Search at Billion Scale</a></p></li>
<li><p><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 release notes: </a></p></li>
<li><p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBench 1.0: Real-World Benchmarking for Vector Databases - Milvus Blog</a></p></li>
</ul>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
