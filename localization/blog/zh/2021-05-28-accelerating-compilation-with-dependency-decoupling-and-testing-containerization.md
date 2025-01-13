---
id: >-
  accelerating-compilation-with-dependency-decoupling-and-testing-containerization.md
title: 通过依赖解耦和测试容器化将编译速度提高 2.5 倍
author: Zhifeng Zhang
date: 2021-05-28T00:00:00.000Z
desc: 了解 zilliz 如何利用依赖解耦和容器化技术将大规模人工智能和 MLOps 项目的编译时间缩短 2.5 倍。
cover: assets.zilliz.com/cover_20e3cddb96.jpeg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-compilation-with-dependency-decoupling-and-testing-containerization
---
<custom-h1>通过依赖解耦和测试容器化将编译速度提高 2.5 倍</custom-h1><p>复杂的内部和外部依赖关系会在整个开发过程中不断演变，编译环境（如操作系统或硬件架构）的变化也会导致编译时间延长。以下是在大型人工智能或 MLOps 项目中可能遇到的常见问题：</p>
<p><strong>编译时间过长</strong>- 代码集成每天都要进行数百次。在有数十万行代码的情况下，即使是很小的改动也可能导致通常需要一个或多个小时才能完成的全面编译。</p>
<p><strong>复杂的编译环境</strong>- 项目代码需要在不同的环境下进行编译，这涉及到不同的操作系统（如 CentOS 和 Ubuntu）、底层依赖（如 GCC、LLVM 和 CUDA）以及硬件架构。在特定环境下进行的编译通常无法在不同环境下运行。</p>
<p><strong>复杂的依赖关系</strong>- 项目编译涉及 30 多个组件间和第三方依赖关系。项目开发经常会导致依赖关系发生变化，不可避免地会造成依赖关系冲突。依赖项之间的版本控制非常复杂，更新依赖项的版本很容易影响其他组件。</p>
<p><strong>第三方依赖</strong>库<strong>下载缓慢或失败</strong>- 网络延迟或第三方依赖库不稳定会导致资源下载缓慢或访问失败，严重影响代码集成。</p>
<p>通过解耦依赖关系和实施测试容器化，我们在开发开源嵌入式相似性搜索项目<a href="https://milvus.io/">Milvus</a> 时，成功地将平均编译时间缩短了 60%。</p>
<p><br/></p>
<h3 id="Decouple-the-dependencies-of-the-project" class="common-anchor-header">解耦项目的依赖关系</h3><p>项目编译通常涉及大量内部和外部组件依赖。项目的依赖关系越多，管理起来就越复杂。随着软件的发展，更改或移除依赖关系以及识别这样做的影响会变得更加困难和昂贵。在整个开发过程中都需要定期维护，以确保依赖关系正常运行。 维护不善、复杂的依赖关系或有问题的依赖关系可能会导致冲突，从而减缓或阻碍开发。在实践中，这可能意味着滞后的资源下载、对代码集成产生负面影响的访问故障等。解耦项目依赖关系可以减少缺陷，缩短编译时间，加快系统测试，避免对软件开发造成不必要的拖累。</p>
<p>因此，我们建议对项目的依赖关系进行解耦：</p>
<ul>
<li>拆分具有复杂依赖关系的组件</li>
<li>使用不同的版本库进行版本管理。</li>
<li>使用配置文件管理版本信息、编译选项、依赖关系等。</li>
<li>将配置文件添加到组件库中，以便在项目迭代时更新。</li>
</ul>
<p><strong>组件间的编译优化</strong>--根据依赖关系和配置文件中记录的编译选项拉取并编译相关组件。标记并打包二进制编译结果和相应的清单文件，然后上传到你的私有资源库。如果未对组件或其依赖的组件进行更改，则根据清单文件回放其编译结果。对于网络延迟或第三方依赖库不稳定等问题，可尝试建立内部版本库或使用镜像版本库。</p>
<p>优化组件之间的编译</p>
<p>1.创建依赖关系图 - 使用组件库中的配置文件创建依赖关系图。使用依赖关系检索上游和下游依赖组件的版本信息（Git 分支、标签和 Git 提交 ID）和编译选项等。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_949dffec32.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>2<strong>.检查依赖关系</strong>--针对组件之间出现的循环依赖关系、版本冲突和其他问题生成警报。</p>
<p>3<strong>.扁平化依赖关系</strong>--通过深度优先搜索（DFS）对依赖关系进行排序，并将具有重复依赖关系的组件前置合并，形成依赖关系图。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_45130c55e4.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>4.使用 MerkleTree 算法生成哈希值（根哈希值），其中包含基于版本信息、编译选项等的每个组件的依赖关系。结合组件名称等信息，该算法可为每个组件生成唯一标签。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_6a4fcdf4e3.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>5.根据组件的唯一标签信息，检查私有软件仓库中是否存在相应的编译存档。如果检索到编译存档，则解压缩以获取播放清单文件；如果没有，则编译组件，标记生成的编译对象文件和清单文件，并上传到私有资源库。</p>
<p><br/></p>
<p><strong>在组件内实施编译优化</strong>- 选择特定语言的编译缓存工具来缓存编译对象文件，并将其上传到你的私有资源库中。对于 C/C++ 编译，可选择 CCache 等编译缓存工具来缓存 C/C++ 编译中间文件，然后在编译后将本地 CCache 缓存归档。此类编译缓存工具只需在编译后逐一缓存已更改的代码文件，并复制未更改代码文件的编译组件，使其直接参与最终编译。 组件内的编译优化包括以下步骤：</p>
<ol>
<li>在 Dockerfile 中添加必要的编译依赖。使用 Hadolint 对 Dockerfile 执行合规性检查，确保映像符合 Docker 的最佳实践。</li>
<li>根据项目冲刺版本（版本+构建）、操作系统等信息镜像编译环境。</li>
<li>运行镜像编译环境容器，并将镜像 ID 作为环境变量传输到容器中。下面是获取镜像 ID 的命令示例："docker inspect ' - type=image' - format '{{.ID}}' repository/build-env:v0.1-centos7"。</li>
<li>选择合适的编译缓存工具：输入要集成和编译代码的包含器，并在私有资源库中检查是否存在合适的编译缓存。如果有，请下载并解压到指定目录。所有组件编译完成后，编译缓存工具生成的缓存将根据项目版本和映像 ID 打包并上传到您的私有资源库。</li>
</ol>
<p><br/></p>
<h3 id="Further-compilation-optimization" class="common-anchor-header">进一步编译优化</h3><p>我们最初构建的版本占用了太多的磁盘空间和网络带宽，部署时间长，因此我们采取了以下措施：</p>
<ol>
<li>选择最精简的基础镜像以减小镜像大小，如 alpine、busybox 等。</li>
<li>减少图像层数。尽可能重复使用依赖关系。用"&amp;&amp;"合并多个命令。</li>
<li>清理图像生成过程中的中间产品。</li>
<li>尽可能使用图像缓存来构建图像。</li>
</ol>
<p>随着我们项目的不断推进，磁盘使用率和网络资源开始随着编译缓存的增加而飙升，而一些编译缓存却未得到充分利用。于是，我们做出了以下调整：</p>
<p><strong>定期清理缓存文件</strong>- 定期检查私有资源库（例如使用脚本），清理一段时间没有更改或下载次数不多的缓存文件。</p>
<p><strong>选择性编译缓存</strong>- 仅缓存需要资源的编译，跳过缓存不需要太多资源的编译。</p>
<p><br/></p>
<h3 id="Leveraging-containerized-testing-to-reduce-errors-improve-stability-and-reliability" class="common-anchor-header">利用容器化测试减少错误，提高稳定性和可靠性</h3><p>代码必须在不同的环境中编译，其中涉及各种操作系统（如 CentOS 和 Ubuntu）、底层依赖（如 GCC、LLVM 和 CUDA）以及特定的硬件架构。在特定环境下成功编译的代码在不同环境下会失败。通过在容器内运行测试，测试过程变得更快、更准确。</p>
<p>容器化可确保测试环境的一致性，并确保应用程序按预期运行。容器化测试方法将测试打包为镜像容器，并构建一个真正隔离的测试环境。我们的测试人员发现这种方法非常有用，最终将编译时间缩短了 60%。</p>
<p><strong>确保一致的编译环境</strong>- 由于编译后的产品对系统环境的变化非常敏感，因此在不同的操作系统中可能会出现未知的错误。我们必须根据编译环境的变化对编译后的产品缓存进行标记和归档，但它们很难归类。因此，我们引入了容器化技术来统一编译环境，以解决此类问题。</p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">结论</h3><p>本文通过分析项目依赖关系，介绍了组件之间和组件内部编译优化的不同方法，为构建稳定高效的持续代码集成提供了思路和最佳实践。这些方法有助于解决复杂依赖关系导致的代码集成缓慢问题，统一容器内部的操作以保证环境的一致性，并通过回放编译结果和使用编译缓存工具缓存中间编译结果来提高编译效率。</p>
<p>上述做法使项目的编译时间平均缩短了 60%，大大提高了代码集成的整体效率。今后，我们将继续在组件之间和组件内部进行并行编译，以进一步缩短编译时间。</p>
<p><br/></p>
<p><em>本文采用了以下资料来源：</em></p>
<ul>
<li>"将源代码树与构建级组件解耦</li>
<li><a href="https://dev.to/brpaz/factors-to-consider-when-adding-third-party-dependencies-to-a-project-46hf">"在项目中添加第三方依赖关系时应考虑的因素</a></li>
<li><a href="https://queue.acm.org/detail.cfm?id=3344149">"软件依赖关系的生存</a></li>
<li><a href="https://www.cc.gatech.edu/~beki/t1.pdf">"理解依赖关系：软件开发中的协调挑战研究</a></li>
</ul>
<p><br/></p>
<h3 id="About-the-author" class="common-anchor-header">关于作者</h3><p>张志峰，Zilliz.com 高级 DevOps 工程师，从事开源向量数据库 Milvus 的开发工作，同时也是中国 LF 开源软件大学授权讲师。他拥有广州软件工程职业技术学院物联网专业学士学位。他的职业生涯主要参与和领导 CI/CD、DevOps、IT 基础架构管理、Cloud-Native 工具包、容器化和编译流程优化等领域的项目。</p>
