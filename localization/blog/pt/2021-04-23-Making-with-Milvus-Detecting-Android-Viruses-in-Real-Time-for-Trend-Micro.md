---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: Making with Milvus Detecting Android Viruses in Real Time for Trend Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Learn how Milvus is used to mitigate threats to critical data and strengthen
  cybersecurity with real-time virus detection.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Making with Milvus: Detecting Android Viruses in Real Time for Trend Micro</custom-h1><p>Cybersecurity remains a persistent threat to both individuals and businesses, with data privacy concerns increasing for <a href="https://www.getapp.com/resources/annual-data-security-report/">86% of companies</a> in 2020 and just <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">23% of consumers</a> believing their personal data is very secure. As malware becomes steadily more omnipresent and sophisticated, a proactive approach to threat detection has become essential. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> is a global leader in hybrid cloud security, network defense, small business security, and endpoint security. To protect Android devices from viruses, the company built Trend Micro Mobile Security—a mobile app that compares APKs (Android Application Package) from the Google Play Store to a database of known malware. The virus detection system works as follows:</p>
<ul>
<li>External APKs (Android application package) from the Google Play Store are crawled.</li>
<li>Known malware is converted into vectors and stored in <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>New APKs are also converted into vectors, then compared to the malware database using similarity search.</li>
<li>If an APK vector is similar to any of the malware vectors, the app provides users with detailed information about the virus and its threat level.</li>
</ul>
<p>To work, the system has to perform highly efficient similarity search on massive vector datasets in real time. Initially, Trend Micro used <a href="https://www.mysql.com/">MySQL</a>. However, as its business expanded so did the number of APKs with nefarious code stored in its database. The company’s algorithm team began searching for alternative vector similarity search solutions after quickly outgrowing MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Comparing vector similarity search solutions</h3><p>There are a number of vector similarity search solutions available, many of which are open source. Although the circumstances vary from project to project, most users benefit from leveraging a vector database built for unstructured data processing and analytics rather than a simple library that requires extensive configuration. Below we compare some popular vector similarity search solutions and explain why Trend Micro chose Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> is a library developed by Facebook AI Research that enables efficient similarity search and clustering of dense vectors. The algorithms it contains search vectors of any size in sets. Faiss is written in C++ with wrappers for Python/numpy, and supports a number of indexes including IndexFlatL2, IndexFlatIP, HNSW, and IVF.</p>
<p>Although Faiss is an incredibly useful tool, it has limitations. It only works as a basic algorithm library, not a database for managing vector datasets. Additionally, it does not offer a distributed version, monitoring services, SDKs, or high availability, which are the key features of most cloud-based services.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-ins based on Faiss &amp; other ANN search libraries</h4><p>There are several plug-ins built on top of Faiss, NMSLIB, and other ANN search libraries that are designed to enhance the basic functionality of the underlying tool that powers them. Elasticsearch (ES) is a search engine based on the Lucene library with a number of such plugins. Below is an architecture diagram of an ES plug-in:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p>Built in support for distributed systems is a major advantage of an ES solution. This saves developers time and companies money thanks to code that doesn’t have to be written. ES plug-ins are technically advanced and prevalent. Elasticsearch provides a QueryDSL (domain-specific language), which defines queries based on JSON and is easy to grasp. A full set of ES services makes it possible to conduct vector/text search and filter scalar data simultaneously.</p>
<p>Amazon, Alibaba, and Netease are a few large tech companies that currently rely on Elasticsearch plug-ins for vector similarity search. The primary downsides with this solution are high memory consumption and no support for performance tuning. In contrast, <a href="http://jd.com/">JD.com</a> has developed its own distributed solution based on Faiss called <a href="https://github.com/vearch/vearch">Vearch</a>. However, Vearch is still an incubation-stage project and its open-source community is relatively inactive.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> is an open-source vector database created by <a href="https://zilliz.com">Zilliz</a>. It is highly flexible, reliable, and blazing fast. By encapsulating multiple widely adopted index libraries, such as Faiss, NMSLIB, and Annoy, Milvus provides a comprehensive set of intuitive APIs, allowing developers to choose the ideal index type for their scenario. It also provides distributed solutions and monitoring services. Milvus has a highly active open-source community and over 5.5K stars on <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus bests the competition</h4><p>We compiled a number of different test results from the various vector similarity search solutions mentioned above. As we can see in the following comparison table, Milvus was significantly faster than the competition despite being tested on a dataset of 1 billion 128-dimensional vectors.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Engine</strong></th><th style="text-align:left"><strong>Performance (ms)</strong></th><th style="text-align:left"><strong>Dataset Size (million)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Not good</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>A comparison of vector similarity search solutions.</em></h6><p>After weighing the pros and cons of each solution, Trend Micro settled on Milvus for its vector retrieval model. With exceptional performance on massive, billion-scale datasets, it’s obvious why the company chose Milvus for a mobile security service that requires real-time vector similarity search.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Designing a system for real-time virus detection</h3><p>Trend Micro has more than 10 million malicious APKs stored in its MySQL database, with 100k new APKs added each day. The system works by extracting and calculating Thash values of different components of an APK file, then uses the Sha256 algorithm to transform it into binary files and generate 256-bit Sha256 values that differentiate the APK from others. Since Sha256 values vary with APK files, one APK can have one combined Thash value and one unique Sha256 value.</p>
<p>Sha256 values are only used to differentiate APKs, and Thash values are used for vector similarity retrieval. Similar APKs may have the same Thash values but different Sha256 values.</p>
<p>To detect APKs with nefarious code, Trend Micro developed its own system for retrieving similar Thash values and corresponding Sha256 values. Trend Micro chose Milvus to conduct instantaneous vector similarity search on massive vector datasets converted from Thash values. After similarity search is run, the corresponding Sha256 values are queried in MySQL. A Redis caching layer is also added to the architecture to map Thash values to Sha256 values, significantly reducing query time.</p>
<p>Below is the architecture diagram of Trend Micro’s mobile security system.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
    <span>image-20210118-022039.png</span>
  </span>
</p>
<p><br/></p>
<p>Choosing an appropriate distance metric helps improve vector classification and clustering performance. The following table shows the <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">distance metrics</a> and the corresponding indexes that work with binary vectors.</p>
<table>
<thead>
<tr><th><strong>Distance Metrics</strong></th><th><strong>Index Types</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- FLAT <br/> - IVF_FLAT</td></tr>
<tr><td>- Superstructure <br/> - Substructure</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Distance metrics and indexes for binary vectors.</em></h6><p><br/></p>
<p>Trend Micro converts Thash values into binary vectors and stores them in Milvus. For this scenario, Trend Micro is using Hamming distance to compare vectors.</p>
<p>Milvus will soon support string vector ID, and integer IDs won’t have to be mapped to the corresponding name in string format. This makes the Redis caching layer unnecessary and the system architecture less bulky.</p>
<p>Trend Micro adopts a cloud-based solution and deploys many tasks on <a href="https://kubernetes.io/">Kubernetes</a>. To achieve high availability, Trend Micro uses <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>, a Milvus cluster sharding middleware developed in Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro separates storage and distance calculation by storing all vectors in the <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) provided by <a href="https://aws.amazon.com/">AWS</a>. This practice is a popular trend in the industry. Kubernetes is used to start multiple reading nodes, and develops LoadBalancer services on these reading nodes to ensure high availability.</p>
<p>To maintain data consistency Mishards supports just one writing node. However, a distributed version of Milvus with support for multiple writing nodes will be available in the coming months.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Monitoring and Alert Functions</h3><p>Milvus is compatible with monitoring systems built on <a href="https://prometheus.io/">Prometheus</a>, and uses <a href="https://grafana.com/">Grafana</a>, an open-source platform for time-series analytics, to visualize various performance metrics.</p>
<p>Prometheus monitors and stores the following metrics:</p>
<ul>
<li>Milvus performance metrics including insertion speed, query speed, and Milvus uptime.</li>
<li>System performance metrics including CPU/GPU usage, network traffic, and disk access speed.</li>
<li>Hardware storage metrics including data size and total file number.</li>
</ul>
<p>The monitoring and alert system works as follows:</p>
<ul>
<li>A Milvus client pushes customized metrics data to Pushgateway.</li>
<li>The Pushgateway ensures short-lived, ephemeral metric data is safely sent to Prometheus.</li>
<li>Prometheus keeps pulling data from Pushgateway.</li>
<li>Alertmanager sets the alert threshold for different metrics and raises alarms through emails or messages.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">System Performance</h3><p>A couple months have passed since the ThashSearch service built on Milvus was first launched. The graph below shows that end-to-end query latency is less than 95 milliseconds.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
    <span>image-20210118-022116.png</span>
  </span>
</p>
<p><br/></p>
<p>Insertion is also fast. It takes around 10 seconds to insert 3 million 192-dimensional vectors. With help from Milvus, the system performance was able to meet the performance criteria set by Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Don’t be a stranger</h3><ul>
<li>Find or contribute to Milvus on <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interact with the community via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connect with us on <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
