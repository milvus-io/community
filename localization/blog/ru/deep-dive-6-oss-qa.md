---
id: deep-dive-6-oss-qa.md
title: Open Source Software (OSS) Quality Assurance - A Milvus Case Study
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  Quality assurance is a process of determining whether a product or service
  meets certain requirements.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> and transcreated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Quality assurance (QA) is a systematic process of determining whether a product or service meets certain requirements. A QA system is an indispensable part of the R&amp;D process because, as its name suggests, it ensures that quality of the product.</p>
<p>This post introduces the QA framework adopted in developing the Milvus vector database, aiming to provide a guideline for contributing developers and users to participate in the process. It will also cover the major test modules in Milvus as well as methods and tools that can be leveraged to improve the efficiency of QA testings.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">A general introduction to the Milvus QA system</a></li>
<li><a href="#Test-modules-in-Milvus">Test modules in Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Tools and methods for better QA efficiency</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">A general introduction to the Milvus QA system<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>The <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">system architecture</a> is critical to conducting QA testings. The more a QA engineer is familiar with the system, the more likely he or she is going to come up with a reasonable and efficient testing plan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
    <span>Milvus architecture</span>
  </span>
</p>
<p>Milvus 2.0 adopts a <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">cloud-native, distributed, and layered architecture</a>, with SDK being the <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">main entrance for data</a> to flow in Milvus. The Milvus users leverage the SDK very frequently, hence functional testing on the SDK side is much needed. Also, function tests on SDK can help detect the internal issues that might exist within the Milvus system. Apart from function tests, other types of tests will also be conducted on the vector database, including unit tests, deployment tests, reliability tests, stability tests, and performance tests.</p>
<p>A cloud-native and distributed architecture brings both convenience and challenges to QA testings. Unlike systems that are deployed and run locally, a Milvus instance deployed and run on a Kubernetes cluster can ensure that software testing is carried out under the same circumstance as software development. However, the downside is that the complexity of distributed architecture brings more uncertainties that can make QA testing of the system even harder and strenuous. For instance, Milvus 2.0 uses microservices of different components, and this leads to an increased number of <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">services and nodes</a>, and a greater possibility of a system error. Consequently, a more sophisticated and comprehensive QA plan is needed for better testing efficiency.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">QA testings and issue management</h3><p>QA in Milvus involves both conducting tests and managing issues emerged during software development.</p>
<h4 id="QA-testings" class="common-anchor-header">QA testings</h4><p>Milvus conducts different types of QA testing according to Milvus features and user needs in order of priority as shown in the image below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
    <span>QA testing priority</span>
  </span>
</p>
<p>QA testings are conducted on the following aspects in Milvus in the following priority:</p>
<ol>
<li><strong>Function</strong>: Verify if the functions and features work as originally designed.</li>
<li><strong>Deployment</strong>: Check if a user can deploy, reinstall, and upgrade both Mivus standalone version and Milvus cluster with different methods (Docker Compose, Helm, APT or YUM, etc.).</li>
<li><strong>Performance</strong>:  Test the performance of data insertion, indexing, vector search and query in Milvus.</li>
<li><strong>Stability</strong>: Check if Milvus can run stably for 5-10 days under a normal level of workload.</li>
<li><strong>Reliability</strong>: Test if Milvus can still partly function if certain system error occurs.</li>
<li><strong>Configuration</strong>: Verify if Milvus works as expected under certain configuration.</li>
<li><strong>Compatibility</strong>: Test if Milvus is compatible with different types of hardware or software.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Issue management</h4><p>Many issues may emerge during software development. The author of the templated issues can be QA engineers themselves or Milvus users from the open-source community. The QA team is responsible for figuring out the issues.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
    <span>Issue management workflow</span>
  </span>
</p>
<p>When an <a href="https://github.com/milvus-io/milvus/issues">issue</a> is created, it will go through triage first. During triage, new issues will be examined to ensure that sufficient details of the issues are provided. If the issue is confirmed, it will be accepted by the developers and they will try to fix the issues. Once development is done, the issue author needs to verify if it is fixed. If yes, the issue will be ultimately closed.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">When is QA needed?</h3><p>One common misconception is that QA and development are independent from each other. However, the truth is to ensure the quality of the system, efforts are needed from both developers and QA engineers. Therefore, QA needs to be involved throughout the whole lifecycle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
    <span>QA lifecycle</span>
  </span>
</p>
<p>As shown in the figure above, a complete software R&amp;D lifecycle includes three stages.</p>
<p>During the initial stage, the developers publish design documentation while QA engineers come up with test plans, define release criteria, and assign QA tasks. Developers and QA engineers need to be familiar with both the design doc and test plan so that a mutual understanding of the objective of the release (in terms of features, performance, stability, bug convergence, etc.) is shared among the two teams.</p>
<p>During R&amp;D, development and QA testings interact frequently to develop and verify features and functions, and fix bugs and issues reported by the open-source <a href="https://slack.milvus.io/">community</a> as well.</p>
<p>During the final stage, if the release criteria is met, a new Docker image of the new Milvus version will be released. A release note focusing on new features and fixed bugs and a release tag is needed for the official release. Then the QA team will also publish a testing report on this release.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Test modules in Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>There are several test modules in Milvus and this section will explain each module in detail.</p>
<h3 id="Unit-test" class="common-anchor-header">Unit test</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
    <span>Unit test</span>
  </span>
</p>
<p>Unit tests can help identify software bugs at an early stage and provide a verification criteria for code restructuring. According to the Milvus pull request (PR) acceptance criteria, the <a href="https://app.codecov.io/gh/milvus-io/milvus/">coverage</a> of code unit test should be 80%.</p>
<h3 id="Function-test" class="common-anchor-header">Function test</h3><p>Function tests in Milvus are mainly organized around <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> and SDKs. The main purpose of function tests are to verify if the interfaces can work as designed. Function tests have two facets:</p>
<ul>
<li>Test if SDKs can return expected results when correct parameters are passed.</li>
<li>Test if SDKs can handle errors and return reasonable error messages when incorrect parameters are passed.</li>
</ul>
<p>The figure below depicts the current framework for function tests which is based on the mainstream <a href="https://pytest.org/">pytest</a> framework. This framework adds a wrapper to PyMilvus and empowers testing with an automated testing interface.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
    <span>Function test</span>
  </span>
</p>
<p>Considering a shared testing method is needed and some functions need to be reused, the above testing framework is adopted, rather than using the PyMilvus interface directly. A “check” module is also included in the framework to bring convenience to the verification of expected and actual values.</p>
<p>As many as 2,700 function test cases are incorporated into the <code translate="no">tests/python_client/testcases</code> directory, fully covering almost all the PyMilvus interfaces. These function tests strictly supervise the quality of each PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Deployment test</h3><p>Milvus comes in two modes: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">standalone</a> and <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">cluster</a>. And there are two major ways to deploy Milvus: using Docker Compose or Helm. And after deploying Milvus, users can also restart or upgrade the Milvus service. There are two main categories of deployment test: restart test and upgrade test.</p>
<p>Restart test refers to the process of testing data persistence, i.e. whether data are still available after a restart. Upgrade test refers to the process of testing data compatibility to prevent situations where incompatible formats of data are inserted into Milvus. Both the two types of deployment tests share the same workflow as illustrated in the image below.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
    <span>Deployment test</span>
  </span>
</p>
<p>In a restart test, the two deployments uses the same docker image. However in an upgrade test, the first deployment uses a docker image of a previous version while the second deployment uses a docker image of a later version. The test results and data are saved in the <code translate="no">Volumes</code> file or <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">persistent volume claim</a> (PVC).</p>
<p>When running the first test, multiple collections are created and different operations are made to each of the collection. When running the second test, the main focus will be on verifying if the created collections are still available for CRUD operations, and if new collections can be further created.</p>
<h3 id="Reliability-test" class="common-anchor-header">Reliability test</h3><p>Testings on the reliability of cloud-native distributed system usually adopt a chaos engineering method whose purpose is to nip errors and system failures in the bud. In other words, in an chaos engineering test, we purposefully create system failures to identify issues in pressure tests and fix system failures before they really start to do hazards. During a chaos test in Milvus, we choose <a href="https://chaos-mesh.org/">Chaos Mesh</a> as the tool to create a chaos. There are several types of failures that needs to be created:</p>
<ul>
<li><strong>Pod kill</strong>: a simulation of the scenario where nodes are down.</li>
<li><strong>Pod failure</strong>: Test if one of the worker node pods fails whether the whole system can still continue to work.</li>
<li><strong>Memory stress</strong>: a simulation of heavy memory and CPU resources consumption from the work nodes.</li>
<li><strong>Network partition</strong>: Since Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">separates storage from computing</a>, the system relies heavily on the communication between various components. A simulation of the scenario where the communication between different pods are partitioned is needed to test the interdependency of different Milvus components.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
    <span>Reliability test</span>
  </span>
</p>
<p>The figure above demonstrates the reliability test framework in Milvus that can automate chaos tests. The workflow of a reliability test is as follows:</p>
<ol>
<li>Initialize a Milvus cluster by reading the deployment configurations.</li>
<li>When the cluster is ready, run <code translate="no">test_e2e.py</code> to test if the Milvus features are available.</li>
<li>Run <code translate="no">hello_milvus.py</code> to test data persistence. Create a collection named “hello_milvus” for data insertion, flush, index building, vector search and query. This collection will not be released or dropped during the test.</li>
<li>Create a monitoring object which will start six threads executing create, insert, flush, index, search and query operations.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Make the first assertion - all operations are successful as expected.</li>
<li>Introduce a system failure to Milvus by using Chaos Mesh to parse the yaml file which defines the failure. A failure can be killing the query node every five seconds for instance.</li>
<li>Make the second assertion while introducing a system failure - Judge whether the returned results of the operations in Milvus during a system failure matches the expectation.</li>
<li>Eliminate the failure via Chaos Mesh.</li>
<li>When the Milvus service is recovered (meaning all pods are ready), make the third assertion - all operations are successful as expected.</li>
<li>Run <code translate="no">test_e2e.py</code> to test if the Milvus features are available. Some of the operations during the chaos might be blocked due to the third assertion. And even after the chaos is eliminated, some operations might continue to be blocked, hampering the third assertion from being successful as expected. This step aims to facilitate the third assertion and serves as a standard for checking if the Milvus service has recovered.</li>
<li>Run <code translate="no">hello_milvus.py</code>, load the created collection, and conduct CRUP operations on the collection. Then, check if the data existing before the system failure are still available after failure recovery.</li>
<li>Collect logs.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Stability and performance test</h3><p>The figure below describes the purposes, test scenarios, and metrics of stability and performance test.</p>
<table>
<thead>
<tr><th></th><th>Stability test</th><th>Performance test</th></tr>
</thead>
<tbody>
<tr><td>Purposes</td><td>- Ensure that Milvus can work smoothly for a fixed period of time under normal workload. <br> - Make sure resources are consumed stably when the Milvus service starts.</td><td>- Test the performance of alll Milvus interfaces. <br> - Find the optimal configuration with the help of performance tests.  <br> - Serve as the benchmark for future releases. <br> - Find the bottleneck that hampers a better performance.</td></tr>
<tr><td>Scenarios</td><td>- Offline read-intensive scenario where data are barely updated after insertion and the percentage of processing each type of request is: search request 90%, insert request 5%, others 5%. <br> - Online write-intensive scenario where data are inserted and searched simultaneously and the percentage of processing each type of request is: insert request 50%, search request 40%, others 10%.</td><td>- Data insertion <br> - Index building <br> - Vector search</td></tr>
<tr><td>Metrics</td><td>- Memory usage <br> - CPU consumption <br> - IO latency <br> - The status of Milvus pods <br> - Response time of the Milvus service <br> etc.</td><td>- Data throughput during data insertion <br> - The time it takes to build an index <br> - Response time during a vector search <br> - Query per second (QPS) <br> - Request per second  <br> - Recall rate <br> etc.</td></tr>
</tbody>
</table>
<p>Both stability test and performance test share the same set of workflow:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
    <span>Stability and performance test</span>
  </span>
</p>
<ol>
<li>Parse and update configurations, and define metrics. The <code translate="no">server-configmap</code> corresponds to the configuration of Milvus standalone or cluster while <code translate="no">client-configmap</code> corresponds to the test case configurations.</li>
<li>Configure the server and the client.</li>
<li>Data preparation</li>
<li>Request interaction between the server and the client.</li>
<li>Report and display metrics.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Tools and methods for better QA efficiency<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>From the module testing section, we can see that the procedure for most of the testings are in fact almost the same, mainly involving modifying Milvus server and client configurations, and passing API parameters. When there are multiple configurations, the more varied the combination of different configurations, the more testing scenarios these experiments and tests can cover. As a result, the reuse of codes and procedures is all the more critical to the process of enhancing testing efficiency.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDK test framework</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
    <span>SDK test framework</span>
  </span>
</p>
<p>To accelerate the testing process, we can add an <code translate="no">API_request</code> wrapper to the original testing framework, and set it as something similar to the API gateway. This API gateway will be in charge of collecting all API requests and then pass them to Milvus to collectively receive responses. These responses will be passed back to the client afterwards. Such a design makes capturing certain log information like parameters, and returned results much more easier. In addition, the checker component in the SDK test framework can verify and examine the results from Milvus. And all checking methods can be defining within this checker component.</p>
<p>With the SDK test framework, some crucial initialization processes can be wrapped into one single function. By doing so, large chunks of tedious codes can be eliminated.</p>
<p>It is also noteworthy that each individual test case is related to its unique collection to ensure data isolation.</p>
<p>When executing test cases,<code translate="no">pytest-xdist</code>, the pytest extension, can be leveraged to execute all individual test cases in parallel, greatly boosting the efficiency.</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub action</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
    <span>GitHub action</span>
  </span>
</p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a> is also adopted to improve QA efficiency for its following characteristics:</p>
<ul>
<li>It is a native CI/CD tool deeply integrated with GitHub.</li>
<li>It comes with a uniformly configured machine environment and pre-installed common software development tools including Docker, Docker Compose, etc.</li>
<li>It supports multiple operating systems and versions including Ubuntu, MacOs, Windows-server, etc.</li>
<li>It has a marketplace that offers rich extensions and out-of-box functions.</li>
<li>Its matrix supports concurrent jobs, and reusing the same test flow to improve efficiency</li>
</ul>
<p>Apart from the characteristics above, another reason for adopting GitHub action is that deployment tests and reliability tests require independent and isolated environment. And GitHub Action is ideal for daily inspection checks on small-scale datasets.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Tools for benchmark tests</h3><p>To make QA tests more efficient, a number of tools are used.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
    <span>QA tools</span>
  </span>
</p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: a set of open-source tools for Kubernetes to run workflows and manage clusters by scheduling tasks. It can also enable running multiple tasks in parallel.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes dashboard</a>: a web-based Kubernetes user interface for visualizing <code translate="no">server-configmap</code>  and <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Network attached storage (NAS) is a file-level computer data storage server for keeping common ANN-benchmark datasets.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> and <a href="https://www.mongodb.com/">MongoDB</a>: Databases for saving results of benchmark tests.</li>
<li><a href="https://grafana.com/">Grafana</a>: An open-source analytics and monitoring solution for monitoring server resource metrics and client performance metrics.</li>
<li><a href="https://redash.io/">Redash</a>: A service that helps visualize your data and create charts for benchmark tests.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
