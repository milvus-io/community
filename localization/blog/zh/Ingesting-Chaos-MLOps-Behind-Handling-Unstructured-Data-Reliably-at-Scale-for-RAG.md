---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: 摄取混乱：为 RAG 大规模可靠处理非结构化数据背后的 MLOps
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: 借助 VectorFlow 和 Milvus 等技术，该团队可以在遵守隐私和安全要求的同时，高效地在不同环境中进行测试。
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>以各种可以想象到的形式生成数据的速度比以往任何时候都快。这些数据是推动新一轮人工智能应用的汽油，但这些提高生产力的引擎需要帮助来摄取这些燃料。围绕非结构化数据的各种应用场景和边缘案例使其在生产型人工智能系统中的应用充满挑战。</p>
<p>首先，有大量的数据源。这些数据源以各种文件格式输出数据，每种格式都有其独特之处。例如，处理 PDF 文件的方式因其来源而大不相同。为证券诉讼案件输入 PDF 文件时，可能会侧重于文本数据。相比之下，火箭工程师的系统设计说明书则充满了需要可视化处理的图表。非结构化数据缺乏确定的 Schema，进一步增加了复杂性。即使克服了处理数据的难题，大规模采集数据的问题依然存在。文件的大小可能相差很大，这就改变了文件的处理方式。您可以通过 HTTP API 快速处理 1MB 的上传数据，但从单个文件中读取数十 GB 的数据则需要流式处理和专用工作者。</p>
<p>对于通过<a href="https://github.com/milvus-io/milvus">Milvus</a> 等<a href="https://zilliz.com/learn/what-is-vector-database">向量数据库</a>将原始数据连接到<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLMs</a>来说，克服这些传统的数据工程挑战是小菜一碟。但是，借助向量数据库执行语义相似性搜索等新兴用例需要新的处理步骤，如对源数据进行分块、为混合搜索协调元数据、选择合适的向量嵌入模型以及调整搜索参数以确定向 LLM 输入哪些数据。这些工作流程非常新颖，没有既定的最佳实践可供开发人员遵循。相反，他们必须通过实验来找到适合其数据的正确配置和用例。为了加快这一过程，使用向量嵌入管道将数据摄入向量数据库是非常有价值的。</p>
<p>像<a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a>这样的向量嵌入管道将把原始数据连接到向量数据库，包括分块、元数据协调、嵌入和上传。VectorFlow 使工程团队能够专注于核心应用逻辑，试验从嵌入模型、分块策略、元数据字段和搜索的各个方面生成的不同检索参数，看看哪种性能最好。</p>
<p>在帮助工程团队将<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">检索增强生成（RAG）</a>系统从原型推向生产的过程中，我们发现以下方法可以成功测试 RAG 搜索管道的不同参数：</p>
<ol>
<li>使用一小部分你熟悉的数据来加快迭代速度，比如一些 PDF 文件，其中有与搜索查询相关的数据块。</li>
<li>针对该数据子集制定一套标准的问题和答案。例如，在阅读 PDF 文件后，编写一份问题清单，然后让团队商定答案。</li>
<li>创建一个自动评估系统，对每个问题的检索结果进行评分。其中一种方法是从 RAG 系统中获取答案，并通过 LLM 进行回放，同时提示 RAG 结果是否回答了给出的正确答案。答案应为 "是 "或 "否"。例如，如果您的文档上有 25 个问题，而系统得到了 20 个正确答案，那么您就可以以此为基准与其他方法进行比较。</li>
<li>确保在评估时使用的 LLM 与对数据库中存储的向量 Embeddings 进行编码时使用的 LLM 不同。评估 LLM 通常是解码器类型的模型，如 GPT-4。需要记住的一点是，重复运行这些评估的成本很高。像 Llama2 70B 或 Deci AI LLM 6B 这样的开源模型，可以在单个较小的 GPU 上运行，其性能大致相同，而成本只是其一小部分。</li>
<li>将每个测试运行多次，取平均值来平滑 LLM 的随机性。</li>
</ol>
<p>在所有选项都保持不变的情况下，您可以快速确定哪些参数最适合您的使用情况。像 VectorFlow 这样的向量嵌入管道可以让摄取方面的工作变得尤为简单，你可以快速尝试不同的分块策略、分块长度、分块重叠和开源嵌入模型，看看哪种方法能带来最好的结果。当你的数据集有各种文件类型和数据源，需要自定义逻辑时，这一点尤其有用。</p>
<p>一旦团队知道什么适合其用例，向量嵌入流水线就能让他们快速投入生产，而无需重新设计系统来考虑可靠性和监控等问题。借助 VectorFlow 和<a href="https://zilliz.com/what-is-milvus">Milvus</a> 等开源和平台无关的技术，团队可以在不同环境中高效地进行测试，同时遵守隐私和安全要求。</p>
