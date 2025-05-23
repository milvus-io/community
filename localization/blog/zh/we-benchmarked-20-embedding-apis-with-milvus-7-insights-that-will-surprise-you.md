---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: 我们用 Milvus 对 20 多个嵌入式应用程序接口进行了基准测试：7 项见解将让您大吃一惊
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: 最流行的 Embeddings API 并不是最快的。地理位置比模型架构更重要。有时，每月 20 美元的 CPU 能胜过每月 200 美元的 API 调用。
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>可能每个人工智能开发人员都建立过一个在本地环境下完美运行的 RAG 系统。</strong></p>
<p>你已经保证了检索的准确性，优化了向量数据库，你的演示也运行得如鱼得水。然后，你部署到生产环境中，突然发现</p>
<ul>
<li><p>实际用户需要花费 3 秒才能完成 200 毫秒的本地查询</p></li>
<li><p>不同地区的同事报告的性能完全不同</p></li>
<li><p>您为 "最佳准确性 "而选择的 Embeddings 提供商成了您最大的瓶颈</p></li>
</ul>
<p>发生了什么？这里有一个没有基准的性能杀手：<strong>Embeddings API 延迟</strong>。</p>
<p>当 MTEB 排名沉迷于召回分数和模型大小时，他们却忽略了用户的感受指标--他们在看到任何响应之前需要等待多长时间。我们在现实条件下测试了各大 Embeddings 提供商，发现了极度的延迟差异，这会让你对整个提供商选择策略产生怀疑。</p>
<p><strong><em>剧透最受欢迎的 Embeddings API 并不是最快的。地理位置比模型架构更重要。有时，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>20</mn><mi>/</mi><mn>月的</mn></mrow><annotation encoding="application/x-tex">CPU 性能比</annotation><mrow><mn>20/月的</mn></mrow><annotation encoding="application/x-tex">CPU 性能比</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">200</span><span class="mord">/月的</span></span></span></span>API 调用性能还要<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">高</annotation></semantics></math></span></span>，<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"></span></span></span></span>。</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">为什么嵌入 API 延迟是 RAG 隐藏的瓶颈？<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在构建 RAG 系统、电子商务搜索或推荐引擎时，嵌入模型是将文本转换为向量的核心组件，使机器能够理解语义并执行高效的相似性搜索。虽然我们通常会预先计算文档库的嵌入，但用户查询仍需要实时调用嵌入 API，在检索前将问题转换为向量，这种实时延迟往往成为整个应用链的性能瓶颈。</p>
<p>流行的 Embeddings 基准（如 MTEB）侧重于召回准确率或模型大小，往往忽略了关键的性能指标--API 延迟。利用 Milvus 的<code translate="no">TextEmbedding</code> 功能，我们对北美和亚洲的主要嵌入式服务提供商进行了全面的实际测试。</p>
<p>嵌入延迟体现在两个关键阶段：</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">查询时间影响</h3><p>在典型的 RAG 工作流程中，当用户提问时，系统必须</p>
<ul>
<li><p>通过嵌入式 API 调用将查询转换为向量</p></li>
<li><p>在 Milvus 中搜索类似向量</p></li>
<li><p>将结果和原始问题反馈给 LLM</p></li>
<li><p>生成并返回答案</p></li>
</ul>
<p>许多开发人员认为 LLM 的答案生成是最慢的部分。然而，许多 LLM 的流式输出功能会给人一种速度很快的错觉--你很快就能看到第一个标记。实际上，如果您的嵌入式 API 调用需要数百毫秒甚至数秒的时间，那么它就会成为您响应链中的第一个、也是最明显的瓶颈。</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">数据输入影响</h3><p>无论是从头开始建立索引还是执行例行更新，批量导入都需要对数千或数百万文本块进行向量处理。如果每次嵌入调用都出现高延迟，那么整个数据管道的速度就会大大降低，从而延误产品发布和知识库更新。</p>
<p>这两种情况都使得嵌入式 API 延迟成为生产型 RAG 系统不可或缺的性能指标。</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">使用 Milvus 测量现实世界中的嵌入式 API 延迟<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一个开源的高性能向量数据库，它提供了一个全新的<code translate="no">TextEmbedding</code> 函数接口。该功能可将 OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AI 以及更多提供商的流行嵌入模型直接集成到您的数据管道中，只需一次调用即可简化您的向量搜索管道。</p>
<p>利用这个新的功能接口，我们测试了来自 OpenAI 和 Cohere 等知名提供商以及 AliCloud 和 SiliconFlow 等其他提供商的流行 Embeddings API 并对其进行了基准测试，测量了它们在实际部署场景中的端到端延迟。</p>
<p>我们的综合测试套件涵盖了各种模型配置：</p>
<table>
<thead>
<tr><th><strong>提供商</strong></th><th><strong>模型</strong></th><th><strong>尺寸</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>text-embedding-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-embedding-3-small</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>文本嵌入-3-大号</td><td>3072</td></tr>
<tr><td>AWS 基岩</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>谷歌顶点人工智能</td><td>text-embedding-005</td><td>768</td></tr>
<tr><td>谷歌顶点人工智能</td><td>文本-多语种-嵌入-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>Voyage-3-large</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>Voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>Voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>Voyage-code-3</td><td>1024</td></tr>
<tr><td>聚合</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>嵌入式多语种</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>嵌入式多语种</td><td>embed-english-light-v3.0</td><td>384</td></tr>
<tr><td>多语种</td><td>embed-multilingual-light-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>文本嵌入-v1</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>文本嵌入-v2</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>嵌入式文本-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>矽流</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>专业版/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-en-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 基准测试结果的主要发现<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>我们在不同的批量大小、令牌长度和网络条件下测试了领先的嵌入模型，测量了所有情况下的中位延迟。结果揭示了一些关键见解，这些见解可能会重塑您选择和优化嵌入式 API 的方式。让我们一起来看看。</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1.全球网络效应比您想象的更重要</h3><p>网络环境可能是影响嵌入式 API 性能的最关键因素。同一个嵌入式 API 服务提供商在不同网络环境下的性能可能大相径庭。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>当您的应用程序部署在亚洲，并访问部署在北美的 OpenAI、Cohere 或 VoyageAI 等服务时，网络延迟会显著增加。我们的实际测试表明，API 调用延迟普遍增加了<strong>3 到 4 倍</strong>！</p>
<p>相反，当您的应用程序部署在北美并访问亚洲服务（如阿里云 Dashscope 或 SiliconFlow）时，性能下降会更加严重。特别是 SiliconFlow，在跨区域场景中，延迟增加了<strong>近 100 倍</strong>！</p>
<p>这意味着您必须始终根据部署地点和用户地理位置选择 Embeddings 提供商--没有网络背景的性能声称毫无意义。</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2.模型性能排名揭示了令人惊讶的结果</h3><p>我们的全面延迟测试揭示了清晰的性能等级：</p>
<ul>
<li><p><strong>基于北美的模型（延迟中位数）</strong>：Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>基于亚洲的模型（延迟中值）</strong>：SiliconFlow &gt; 阿里云 Dashscope</p></li>
</ul>
<p>这些排名挑战了有关提供商选择的传统观念。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>注：由于网络环境和服务器地理区域对实时嵌入 API 延迟的影响很大，我们分别比较了基于北美和亚洲的模型延迟。</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3.模型大小对提供商的影响差异巨大</h3><p>我们观察到一个普遍趋势，即大型模型的延迟高于标准模型，而标准模型的延迟又高于小型/轻型模型。然而，这种模式并不普遍，它揭示了有关后端架构的重要见解。例如</p>
<ul>
<li><p><strong>Cohere 和 OpenAI</strong>在不同大小的模型之间表现出最小的性能差距</p></li>
<li><p><strong>VoyageAI</strong>根据模型大小表现出明显的性能差异</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>这表明，API 响应时间取决于模型架构之外的多种因素，包括后端批处理策略、请求处理优化和提供商特定的基础架构。教训是显而易见的：<em>不要相信模型大小或发布日期是可靠的性能指标--一定要在自己的部署环境中进行测试。</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4.令牌长度和批量大小会产生复杂的权衡</h3><p>取决于您的后端实施，尤其是批处理策略。令牌长度对延迟的影响可能很小，直到批量规模扩大。我们的测试揭示了一些清晰的模式：</p>
<ul>
<li><p><strong>OpenAI 的延迟</strong>在小批量和大批量之间保持相当一致，这表明后端批处理能力很强</p></li>
<li><p><strong>VoyageAI</strong>显示出明显的令牌长度效应，这意味着后端批处理优化程度极低</p></li>
</ul>
<p>较大的批量会增加绝对延迟，但会提高总体吞吐量。在我们的测试中，从批量=1 到批量=10，延迟增加了 2-5倍，但总吞吐量却大幅提高。这为批量处理工作流提供了一个重要的优化机会，您可以用单个请求的延迟来换取整体系统吞吐量的显著提高。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>从批量=1 到 10，延迟增加了 2×-5× 5.</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5.API 可靠性带来生产风险</h3><p>我们观察到延迟存在很大差异，尤其是 OpenAI 和 VoyageAI，这给生产系统带来了不可预测性。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>批量=1 时的延迟差异</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>批量=10 时的延迟差异</p>
<p>虽然我们的测试主要集中在延迟上，但依赖任何外部 API 都会带来固有的故障风险，包括网络波动、提供商的速率限制和服务中断。如果提供商没有明确的服务水平协议，开发人员应实施强大的错误处理策略，包括重试、超时和断路器，以保持生产环境中的系统可靠性。</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6.本地推理具有惊人的竞争力</h3><p>我们的测试还显示，在本地部署中型嵌入模型可以提供与云应用程序接口相当的性能--这对于预算有限或对延迟敏感的应用来说至关重要。</p>
<p>例如，通过 TEI（文本嵌入推理）在 4c8g CPU 上部署开源<code translate="no">bge-base-en-v1.5</code> 与 SiliconFlow 的延迟性能相当，提供了一种经济实惠的本地推理替代方案。对于缺乏企业级 GPU 资源但仍需要高性能嵌入功能的个人开发者和小型团队来说，这一发现尤为重要。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEI 延迟</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7.Milvus 的开销微不足道</h3><p>由于我们使用 Milvus 测试嵌入 API 的延迟，我们验证了 Milvus 的 TextEmbedding 函数带来的额外开销极小，几乎可以忽略不计。我们的测量结果表明，Milvus 操作总共只增加了 20-40ms 的开销，而嵌入式 API 调用则需要数百毫秒到数秒的时间，这意味着 Milvus 为总操作时间增加的开销不到 5%。性能瓶颈主要在于网络传输和嵌入式 API 服务提供商的处理能力，而不是 Milvus 服务器层。</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">小贴士如何优化 RAG 嵌入性能<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>根据我们的基准测试，我们建议采取以下策略来优化 RAG 系统的嵌入性能：</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1.始终进行本地化测试</h3><p>不要相信任何通用的基准报告（包括本报告！）。您应该始终在实际部署环境中测试模型，而不是仅仅依赖于公布的基准。网络条件、地理位置的远近以及基础设施的差异都会极大地影响实际性能。</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2.战略性地对提供商进行地理匹配</h3><ul>
<li><p><strong>对于北美部署</strong>：考虑使用 Cohere、VoyageAI、OpenAI/Azure 或 GCP Vertex AI，并始终进行自己的性能验证。</p></li>
<li><p><strong>亚洲部署</strong>：认真考虑亚洲模型提供商，如阿里云 Dashscope 或 SiliconFlow，它们能提供更好的区域性能</p></li>
<li><p><strong>针对全球受众</strong>：实施多区域路由或选择具有全球分布式基础设施的提供商，以尽量减少跨区域延迟惩罚</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3.质疑默认提供商选择</h3><p>OpenAI 的 Embeddings 模型非常受欢迎，许多企业和开发人员都将其作为默认选项。然而，我们的测试表明，尽管 OpenAI 很受市场欢迎，但其延迟和稳定性充其量只能算一般。对于 "最佳 "提供商的假设，请用自己的严格基准来质疑--受欢迎程度并不总是与特定用例的最佳性能相关联。</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4.优化批量和分块配置</h3><p>一种配置并不适合所有模型或使用案例。由于后端架构和批处理策略不同，不同提供商的最佳批处理大小和分块长度也大不相同。考虑到特定应用需求的吞吐量与延迟权衡，系统地试验不同的配置，找到最佳性能点。</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5.实施战略性缓存</h3><p>对于高频查询，同时缓存查询文本及其生成的 Embeddings（使用 Redis 等解决方案）。随后的相同查询可以直接访问缓存，从而将延迟降低到毫秒级。这是最具成本效益和影响力的查询延迟优化技术之一。</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6.考虑本地推理部署</h3><p>如果您对数据摄取延迟、查询延迟和数据隐私有极高的要求，或者 API 调用成本过高，可以考虑在本地部署 Embeddings 模型进行推理。标准 API 计划通常有 QPS 限制、不稳定的延迟和缺乏 SLA 保证--这些限制可能会给生产环境带来问题。</p>
<p>对于许多个人开发者或小型团队来说，缺乏企业级 GPU 是本地部署高性能嵌入式模型的障碍。不过，这并不意味着完全放弃本地推理。利用高性能推理引擎（如<a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face 的 text-embeddings-inference</a>），即使在 CPU 上运行中小型嵌入模型，也能获得不错的性能，其表现可能优于高延迟 API 调用，尤其是在大规模离线嵌入生成方面。</p>
<p>这种方法需要仔细考虑成本、性能和维护复杂性之间的权衡。</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Milvus 如何简化嵌入工作流程<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>如前所述，Milvus 不仅仅是一个高性能的向量数据库--它还提供了一个便捷的嵌入功能接口，可将 OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AI 等全球不同提供商的流行嵌入模型无缝集成到您的向量搜索管道中。</p>
<p>Milvus 的功能超越了向量存储和检索，可简化嵌入式集成：</p>
<ul>
<li><p><strong>高效向量管理</strong>：作为专为海量向量 Collections 而建的高性能数据库，Milvus 提供可靠的存储、灵活的索引选项（HNSW、IVF、RaBitQ、DiskANN 等）以及快速准确的检索功能。</p></li>
<li><p><strong>流线型提供商切换</strong>：Milvus 提供<code translate="no">TextEmbedding</code> 功能界面，让您可以使用 API 密钥配置功能，即时切换提供商或模型，并测量实际性能，而无需复杂的 SDK 集成。</p></li>
<li><p><strong>端到端数据管道</strong>：使用原始文本调用<code translate="no">insert()</code> ，Milvus 会在一次操作中自动嵌入和存储向量，从而大大简化您的数据管道代码。</p></li>
<li><p><strong>从文本到结果的一次调用</strong>：使用文本查询调用<code translate="no">search()</code> ，Milvus 会处理嵌入、搜索和返回结果--所有这些都只需调用一次 API。</p></li>
<li><p><strong>与提供商无关的集成</strong>：Milvus 抽象了提供商的实施细节；只需配置一次您的功能和 API 密钥，即可使用。</p></li>
<li><p><strong>开源生态系统兼容性</strong>：无论您是通过我们内置的<code translate="no">TextEmbedding</code> 函数、本地推理或其他方法生成 Embeddings，Milvus 都能提供统一的存储和检索功能。</p></li>
</ul>
<p>这就创造了一种简化的 "数据输入，洞察输出 "体验，Milvus 在内部处理向量生成，使您的应用代码更加简单明了、易于维护。</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">结论：您的 RAG 系统需要的性能真相<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG 性能的隐形杀手并不是大多数开发人员所关注的。当团队将资源投入到及时工程和 LLM 优化时，嵌入 API 的延迟却悄悄地破坏了用户体验，其延迟可能比预期的要严重 100 倍。我们的综合基准揭示了残酷的现实：流行并不意味着性能卓越，在许多情况下，地理位置比算法选择更重要，本地推理有时会击败昂贵的云 API。</p>
<p>这些发现凸显了 RAG 优化中的一个关键盲点。跨区域延迟惩罚、意想不到的提供商性能排名以及本地推理令人惊讶的竞争力都不是边缘案例，而是影响实际应用的生产现实。了解和衡量 Embeddings API 性能对于提供响应迅速的用户体验至关重要。</p>
<p>嵌入式提供商的选择是 RAG 性能拼图的关键一环。通过在实际部署环境中进行测试、选择地理位置合适的提供商并考虑本地推理等替代方案，您可以消除面向用户的延迟的主要来源，并构建真正响应迅速的人工智能应用。</p>
<p>有关我们如何进行基准测试的更多详情，请查看<a href="https://github.com/zhuwenxing/text-embedding-bench">此笔记本</a>。</p>
