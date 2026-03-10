---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: >-
  Accelerating Compilation 2.5X with Dependency Decoupling & Testing
  Containerization
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: >-
  Discover how zilliz to reduce compile times 2.5x using dependency decoupling
  and containerization techniques for large-scale AI and MLOps projects.
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>Accelerating Compilation 2.5X with Dependency Decoupling &amp; Testing Containerization</custom-h1><p>Compile time can be compounded by complex internal and external dependencies that evolve throughout the development process, as well as changes in compilation environments such as the operating system or hardware architectures. Following are common issues one may encounter when working on large-scale AI or MLOps projects:</p>
<p><strong>Prohibitively long compilation</strong> - Code integration is done hundreds of times each day. With hundreds of thousands of lines of code in place, even a small change could result in a full compilation that typically takes one or more hours.</p>
<p><strong>Complex compilation environment</strong> - The project code needs to be compiled under different environments, which involve different operating systems, such as CentOS and Ubuntu, underlying dependencies, such as GCC, LLVM, and CUDA, and hardware architectures. And compilation under a specific environment normally may not work under a different environment.</p>
<p><strong>Complex dependencies</strong> - Project compilation involves more than 30 between-component and third-party dependencies. Project development often leads to changes in dependencies, inevitably causing dependency conflicts. The version control between dependencies is so complex that updating version of dependencies will easily affect other components.</p>
<p><strong>Third-party dependency download is slow or fails</strong> - Network delays or unstable third-party dependency libraries cause slow resource downloads or access failures, seriously affecting code integration.</p>
<p>By decoupling dependencies and implementing testing containerization, we managed to decrease average compile time by 60% while working on the open-source embeddings similarity search project <a href="https://milvus.io/">Milvus</a>.</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">Decouple the dependencies of the project</h3><p>Project compilation usually involves a large number of internal and external component dependencies. The more dependencies a project has, the more complex it becomes to manage them. As software grows, it becomes more difficult and costly to change or remove dependencies, as well as identify the effects of doing so. Regular maintenance is required throughout the development process to ensure the dependencies functions properly.
Poor maintenance, complex dependencies, or faulty dependencies can cause conflicts that slow or stall development. In practice, this can mean lagging resource downloads, access failures that negatively impact code integration, and more. Decoupling project dependencies can mitigate defects and reduce compile time, accelerating system testing and avoiding unnecessary drag on software development.</p>
<p>Therefore, we recommend decouple dependencies your project:</p>
<ul>
<li>Split up components with complex dependencies</li>
<li>Use different repositories for version management.</li>
<li>Use configuration files to manage version information, compilation options, dependencies, etc.</li>
<li>Add the configuration files to the component libraries so that they are updated as the project iterates.</li>
</ul>
<p><strong>Compile optimization between components</strong> — Pull and compile the relevant component according to the dependencies and the compile options recorded in the configuration files. Tag and pack the binary compilation results and the corresponding manifest files, and then upload them to your private repository. If no change is made to a component or the components it depends on, playback its compilation results according to the manifest files. For issues such as network delays or unstable third-party dependency libraries, try setting up an internal repository or using mirrored repositories.</p>
<p>To optimize compilation between components:</p>
<p>1.Create dependency relationship graph — Use the configuration files in the component libraries to create dependency relationship graph. Use the dependency relationship to retrieve the version information (Git Branch, Tag, and Git commit ID) and compilation options and more of both upstream and downstream dependent components.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p>2.<strong>Check for dependencies</strong> — Generate alerts for circular dependencies, version conflicts, and other issues that arise between components.</p>
<p>3.<strong>Flatten dependencies</strong> — Sort dependencies by Depth First Search (DFS) and front-merge components with duplicate dependencies to form a dependency graph.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
    <span>2.png</span>
  </span>
</p>
<p>4.Use MerkleTree algorithm to generate a hash (Root Hash) containing dependencies of each component based on version information, compilation options, and more. Combined with information such as component name, the algorithm forms a unique tag for each component.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>
</p>
<p>5.Based on the component’s unique tag information, check if a corresponding compilation archive exists in the private repo. If a compilation archive is retrieved, unzip it to get the manifest file for playback; if not, compile the component, mark up the generated compilation object files and manifest file, and upload them to the private repo.</p>
<p><br/></p>
<p><strong>Implement compilation optimizations within components</strong> — Choose a language-specific compilation cache tool to cache the compiled object files, and upload and store them in your private repository. For C/C++ compilation, choose a compilation cache tool like CCache to cache the C/C++ compilation intermediate files, and then archive the local CCache cache after compilation. Such compile cache tools simply cache the changed code files one by one after compilation, and copy the compiled components of the unchanged code file so that they can be directly involved in the final compilation.
Optimization of the compilation within components includes the following steps:</p>
<ol>
<li>Add the necessary compilation dependencies to Dockerfile. Use Hadolint to perform compliance checks on Dockerfile to ensure that the image conforms to Docker’s best practices.</li>
<li>Mirror the compilation environment according to the project sprint version (version + build), operating system, and other information.</li>
<li>Run the mirrored compilation environment container, and transfer the image ID to the container as an environment variable. Here’s an example command for getting image ID: “docker inspect ‘ — type=image’ — format ‘{{.ID}}’ repository/build-env:v0.1-centos7”.</li>
<li>Choose the appropriate compile cache tool: Enter your containter to integrate and compile your codes and check in your private repository if an appropriate compile cache exists. If yes, download and extract it to the specified directory. After all components are compiled, the cache generated by the compile cache tool is packaged and uploaded to your private repository based on the project version and image ID.</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">Further compilation optimization</h3><p>Our initially-built occupies too much disk space and network bandwidth, and takes a long time to deploy, we took the following measures:</p>
<ol>
<li>Choose the leanest base image to reduce the image size, e.g. alpine, busybox, etc.</li>
<li>Reduce the number of image layers. Reuse dependencies as much as possible. Merge multiple commands with “&amp;&amp;”.</li>
<li>Clean up the intermediate products during image building.</li>
<li>Use image cache to build image as much as possible.</li>
</ol>
<p>As our project continues to progress, disk usage and network resource began to soar as the compilation cache increases, while some of the compilation caches are underutilized. We then made the following adjustments:</p>
<p><strong>Regularly clean up cache files</strong> — Regularly check the private repository (using scripts for example), and clean up cache files that have not changed for a while or have not been downloaded much.</p>
<p><strong>Selective compile caching</strong> — Only cache resource-demanding compiles, and skip caching compiles that do not require much resource.</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">Leveraging containerized testing to reduce errors, improve stability and reliability</h3><p>Codes have to be compiled in different environments, which involve variety of operating systems (e.g. CentOS and Ubuntu), underlying dependencies (e.g. GCC, LLVM, and CUDA), and specific hardware architectures. Code that successfully compiles under a specific environment fail in a different environment. By running tests inside containers, the testing process becomes faster and more accurate.</p>
<p>Containerization ensures that the test environment is consistent, and that an application is working as expected. The containerized testing approach packages tests as image containers and builds a truly-isolated test environment. Our testers found that this approach pretty useful, which ended up reducing compile times by as much as 60%.</p>
<p><strong>Ensure a consistent compile environment</strong> — As the compiled products are sensitive to changes in the system environment, unknown errors may occur in different operating systems. We have to tag and archive the compiled product cache according to the changes in the compile environment, but they are difficult to categorize. So we introduced containerization technology to unify the compile environment to solve such issues.</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusion</h3><p>By analyzing project dependencies, this article introduces different methods for compilation optimization between and within components, providing ideas and best practices for building stable and efficient continuous code integration. These methods helped solve slow code integration caused by complex dependencies, unify operations inside the container to ensure the consistency of the environment, and improve compilation efficiency through the playback of the compilation results and the use of compilation cache tools to cache the intermediate compilation results.</p>
<p>This above-mentioned practices have reduced the compile time of the project by 60% on average, greatly improving the overall efficiency of code integration. Moving forward, we will continue parallelizing compilation between and within components to further reduce compilation times.</p>
<p><br/></p>
<p><em>The following sources were used for this article:</em></p>
<ul>
<li>“Decoupling Source Trees into Build-Level Components”</li>
<li>“<a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">Factors to consider when adding third party dependencies to a project</a>”</li>
<li>“<a href="https://queue.acm.org/detail.cfm?id=3344149">Surviving Software Dependencies</a>”</li>
<li>“<a href="https://www.cc.gatech.edu/~beki/t1.pdf">Understanding Dependencies: A Study of the Coordination Challenges in Software Development</a>”</li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">About the author</h3><p>Zhifeng Zhang is a senior DevOps engineer at Zilliz.com working on Milvus, an open-source vector database, and authorized instructor of the LF open-source software university in China. He received his bachelor’s degree in Internet of Things (IOT) from Software Engineering Institute of Guangzhou. He spends his career participating in and leading projects in the area of CI/CD, DevOps, IT infrastructure management, Cloud-Native toolkit, containerization, and compilation process optimization.</p>
