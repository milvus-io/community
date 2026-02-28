---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  The most popular embedding APIs aren't the fastest. Geography matters more
  than model architecture. And sometimes a $20/month CPU beats a $200/month API
  call.
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
<p><strong>Probably every AI developer has built a RAG system that works perfectly… in their local environment.</strong></p>
<p>You’ve nailed the retrieval accuracy, optimized your vector database, and your demo runs like butter. Then you deploy to production and suddenly:</p>
<ul>
<li><p>Your 200ms local queries take 3 seconds for actual users</p></li>
<li><p>Colleagues in different regions report completely different performance</p></li>
<li><p>The embedding provider you chose for “best accuracy” becomes your biggest bottleneck</p></li>
</ul>
<p>What happened? Here’s the performance killer no one benchmarks: <strong>embedding API latency</strong>.</p>
<p>While MTEB rankings obsess over recall scores and model sizes, they ignore the metric your users feel—how long they wait before seeing any response. We tested every major embedding provider across real-world conditions and discovered extreme latency differences they’ll make you question your entire provider selection strategy.</p>
<p><strong><em>Spoiler: The most popular embedding APIs aren’t the fastest. Geography matters more than model architecture. And sometimes a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>20</mn><mi mathvariant="normal">/</mi><mi>m</mi><mi>o</mi><mi>n</mi><mi>t</mi><mi>h</mi><mi>C</mi><mi>P</mi><mi>U</mi><mi>b</mi><mi>e</mi><mi>a</mi><mi>t</mi><mi>s</mi><mi>a</mi></mrow><annotation encoding="application/x-tex">20/month CPU beats a</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">20/</span><span class="mord mathnormal">m</span><span class="mord mathnormal">o</span><span class="mord mathnormal">n</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord mathnormal" style="margin-right:0.13889em;">CP</span><span class="mord mathnormal" style="margin-right:0.10903em;">U</span><span class="mord mathnormal">b</span><span class="mord mathnormal">e</span><span class="mord mathnormal">a</span><span class="mord mathnormal">t</span><span class="mord mathnormal">s</span><span class="mord mathnormal">a</span></span></span></span>200/month API call.</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">Why Embedding API Latency Is the Hidden Bottleneck in RAG<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>When building RAG systems, e-commerce search, or recommendation engines, embedding models are the core component that transforms text into vectors, enabling machines to understand semantics and perform efficient similarity searches. While we typically pre-compute embeddings for document libraries, user queries still require real-time embedding API calls to convert questions into vectors before retrieval, and this real-time latency often becomes the performance bottleneck in the entire application chain.</p>
<p>Popular embedding benchmarks like MTEB focus on recall accuracy or model size, often overlooking the crucial performance metric—API latency. Using Milvus’s <code translate="no">TextEmbedding</code> Function, we conducted comprehensive real-world tests on major embedding service providers in North America and Asia.</p>
<p>Embedding latency manifests at two critical stages:</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">Query-Time Impact</h3><p>In a typical RAG workflow, when a user asks a question, the system must:</p>
<ul>
<li><p>Convert the query to a vector via an embedding API call</p></li>
<li><p>Search for similar vectors in Milvus</p></li>
<li><p>Feed results and the original question to an LLM</p></li>
<li><p>Generate and return the answer</p></li>
</ul>
<p>Many developers assume the LLM’s answer generation is the slowest part. However, many LLMs’ streaming output capability creates an illusion of speed—you see the first token quickly. In reality, if your embedding API call takes hundreds of milliseconds or even seconds, it becomes the first—and most noticeable—bottleneck in your response chain.</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">Data Ingestion Impact</h3><p>Whether building an index from scratch or performing routine updates, bulk ingestion requires vectorizing thousands or millions of text chunks. If each embedding call experiences high latency, your entire data pipeline slows dramatically, delaying product releases and knowledge base updates.</p>
<p>Both situations make embedding API latency a non-negotiable performance metric for production RAG systems.</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Measuring Real-World Embedding API Latency with Milvus<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is an open-source, high-performance vector database that offers a new <code translate="no">TextEmbedding</code> Function interface. This feature directly integrates popular embedding models from OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI, and many more providers into your data pipeline, streamlining your vector search pipeline with a single call.</p>
<p>Using this new function interface, we tested and benchmarked popular embedding APIs from well-known providers like OpenAI and Cohere, as well as others like AliCloud and SiliconFlow, measuring their end-to-end latency in realistic deployment scenarios.</p>
<p>Our comprehensive test suite covered various model configurations:</p>
<table>
<thead>
<tr><th><strong>Provider</strong></th><th><strong>Model</strong></th><th><strong>Dimensions</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>text-embedding-ada-002</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-embedding-3-small</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>text-embedding-3-large</td><td>3072</td></tr>
<tr><td>AWS Bedrock</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>Google Vertex AI</td><td>text-embedding-005</td><td>768</td></tr>
<tr><td>Google Vertex AI</td><td>text-multilingual-embedding-002</td><td>768</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-large</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3</td><td>1024</td></tr>
<tr><td>VoyageAI</td><td>voyage-3-lite</td><td>512</td></tr>
<tr><td>VoyageAI</td><td>voyage-code-3</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>embed-english-light-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>embed-multilingual-light-v3.0</td><td>384</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-embedding-v1</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-embedding-v2</td><td>1536</td></tr>
<tr><td>Aliyun Dashscope</td><td>text-embedding-v3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-large-en-v1.5</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>netease-youdao/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>Siliconflow</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>Siliconflow</td><td>Pro/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-en-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 Key Findings from Our Benchmarking Results<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>We tested leading embedding models under varying batch sizes, token lengths, and network conditions, measuring median latency across all scenarios. The results uncover key insights that could reshape how you choose and optimize embedding APIs. Let’s take a look.</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1. Global Network Effects Are More Significant Than You Think</h3><p>The network environment is perhaps the most critical factor affecting embedding API performance. The same embedding API service provider can perform dramatically differently across network environments.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>When your application is deployed in Asia and accesses services like OpenAI, Cohere, or VoyageAI deployed in North America, network latency increases significantly. Our real-world tests show API call latency universally increased by <strong>3 to 4 times</strong>!</p>
<p>Conversely, when your application is deployed in North America and accesses Asian services like AliCloud Dashscope or SiliconFlow, performance degradation is even more severe. SiliconFlow, in particular, showed latency increases of <strong>nearly 100 times</strong> in cross-region scenarios!</p>
<p>This means you must always select embedding providers based on your deployment location and user geography—performance claims without network context are meaningless.</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2. Model Performance Rankings Reveal Surprising Results</h3><p>Our comprehensive latency testing revealed clear performance hierarchies:</p>
<ul>
<li><p><strong>North America-based Models (median latency)</strong>: Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>Asia-based Models (median latency)</strong>: SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>These rankings challenge conventional wisdom about provider selection.</p>
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
<p>Note: Due to the significant impact of network environment and server geographic regions on real-time embedding API latency, we compared North America and Asia-based model latencies separately.</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3. Model Size Impact Varies Dramatically by Provider</h3><p>We observed a general trend where larger models have higher latency than standard models, which have higher latency than smaller/lite models. However, this pattern wasn’t universal and revealed important insights about backend architecture. For example:</p>
<ul>
<li><p><strong>Cohere and OpenAI</strong> showed minimal performance gaps between model sizes</p></li>
<li><p><strong>VoyageAI</strong> exhibited clear performance differences based on model size</p></li>
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
<p>This indicates that API response time depends on multiple factors beyond model architecture, including backend batching strategies, request handling optimization, and provider-specific infrastructure. The lesson is clear: <em>don’t trust model size or release date as reliable performance indicators—always test in your own deployment environment.</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4. Token Length and Batch Size Create Complex Trade-offs</h3><p>Depending on your backend implementation, especially your batching strategy. Token length may have little impact on latency until batch sizes grow. Our testing revealed some clear patterns:</p>
<ul>
<li><p><strong>OpenAI’s latency</strong> remained fairly consistent between small and large batches, suggesting generous backend batching capabilities</p></li>
<li><p><strong>VoyageAI</strong> showed clear token-length effects, implying minimal backend batching optimization</p></li>
</ul>
<p>Larger batch sizes increase absolute latency but improve overall throughput. In our tests, moving from batch=1 to batch=10 increased latency by 2×-5×, while substantially boosting total throughput. This represents a critical optimization opportunity for bulk processing workflows where you can trade individual request latency for dramatically improved overall system throughput.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Going from batch=1 to 10, latency increased 2×–5×</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5. API Reliability Introduces Production Risk</h3><p>We observed significant variability in latency, particularly with OpenAI and VoyageAI, introducing unpredictability into production systems.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latency variance when batch=1</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Latency variance when batch=10</p>
<p>While our testing focused primarily on latency, relying on any external API introduces inherent failure risks, including network fluctuations, provider rate limiting, and service outages. Without clear SLAs from providers, developers should implement robust error handling strategies, including retries, timeouts, and circuit breakers to maintain system reliability in production environments.</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6. Local Inference Can Be Surprisingly Competitive</h3><p>Our tests also revealed that deploying mid-sized embedding models locally can offer performance comparable to cloud APIs—a crucial finding for budget-conscious or latency-sensitive applications.</p>
<p>For example, deploying the open-source <code translate="no">bge-base-en-v1.5</code> via TEI (Text Embeddings Inference) on a modest 4c8g CPU matched SiliconFlow’s latency performance, providing an affordable local-inference alternative. This finding is particularly significant for individual developers and small teams who may lack enterprise-grade GPU resources but still need high-performance embedding capabilities.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEI Latency</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7. Milvus Overhead Is Negligible</h3><p>Since we used Milvus to test embedding API latency, we validated that the additional overhead introduced by Milvus’s TextEmbedding Function is minimal and virtually negligible. Our measurements show Milvus operations add only 20-40ms in total while embedding API calls take hundreds of milliseconds to several seconds, meaning Milvus adds less than 5% overhead to the total operation time. The performance bottleneck primarily lies in network transmission and the embedding API service providers’ processing capabilities, not in the Milvus server layer.</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">Tips: How to Optimize Your RAG Embedding Performance<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Based on our benchmarks, we recommend the following strategies to optimize your RAG system’s embedding performance:</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1. Always Localize Your Testing</h3><p>Don’t trust any generic benchmark reports (including this one!). You should always test models within your actual deployment environment rather than relying solely on published benchmarks. Network conditions, geographic proximity, and infrastructure differences can dramatically impact real-world performance.</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2. Geo-Match Your Providers Strategically</h3><ul>
<li><p><strong>For North American deployments</strong>: Consider Cohere, VoyageAI, OpenAI/Azure, or GCP Vertex AI—and always conduct your own performance validation</p></li>
<li><p><strong>For Asian deployments</strong>: Seriously consider Asian model providers such as AliCloud Dashscope or SiliconFlow, which offer better regional performance</p></li>
<li><p><strong>For global audiences</strong>: Implement multi-region routing or select providers with globally distributed infrastructure to minimize cross-region latency penalties</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3. Question Default Provider Choices</h3><p>OpenAI’s embedding models are so popular that many enterprises and developers choose them as default options. However, our tests revealed that OpenAI’s latency and stability were average at best, despite its market popularity. Challenge assumptions about “best” providers with your own rigorous benchmarks—popularity doesn’t always correlate with optimal performance for your specific use case.</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4. Optimize Batch and Chunk Configurations</h3><p>One configuration doesn’t fit all models or use cases. The optimal batch size and chunk length vary significantly between providers due to different backend architectures and batching strategies. Experiment systematically with different configurations to find your optimal performance point, considering the throughput vs. latency trade-offs for your specific application requirements.</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5. Implement Strategic Caching</h3><p>For high-frequency queries, cache both the query text and its generated embeddings (using solutions like Redis). Subsequent identical queries can directly hit the cache, reducing latency to milliseconds. This represents one of the most cost-effective and impactful query latency optimization techniques.</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6. Consider Local Inference Deployment</h3><p>If you have extremely high requirements for data ingestion latency, query latency, and data privacy, or if API call costs are prohibitive, consider deploying embedding models locally for inference. Standard API plans often come with QPS limitations, unstable latency, and lack of SLA guarantees—constraints that can be problematic for production environments.</p>
<p>For many individual developers or small teams, the lack of enterprise-grade GPUs is a barrier to local deployment of high-performance embedding models. However, this doesn’t mean abandoning local inference entirely. With high-performance inference engines like <a href="https://github.com/huggingface/text-embeddings-inference">Hugging Face’s text-embeddings-inference</a>, even running small to medium-sized embedding models on a CPU can achieve decent performance that may outperform high-latency API calls, especially for large-scale offline embedding generation.</p>
<p>This approach requires careful consideration of trade-offs between cost, performance, and maintenance complexity.</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">How Milvus Simplifies Your Embedding Workflow<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>As mentioned, Milvus is not just a high-performance vector database—it also offers a convenient embedding function interface that seamlessly integrates with popular embedding models from various providers such as OpenAI, Cohere, AWS Bedrock, Google Vertex AI, Voyage AI, and more across the world into your vector search pipeline.</p>
<p>Milvus goes beyond vector storage and retrieval with features that streamline embedding integration:</p>
<ul>
<li><p><strong>Efficient Vector Management</strong>: As a high-performance database built for massive vector collections, Milvus offers reliable storage, flexible indexing options (HNSW, IVF, RaBitQ, DiskANN, and more), and fast, accurate retrieval capabilities.</p></li>
<li><p><strong>Streamlined Provider Switching</strong>: Milvus offers a <code translate="no">TextEmbedding</code> Function interface, allowing you to configure the function with your API keys, switch providers or models instantly, and measure real-world performance without complex SDK integration.</p></li>
<li><p><strong>End-to-End Data Pipelines</strong>: Call <code translate="no">insert()</code> with raw text, and Milvus automatically embeds and stores vectors in one operation, dramatically simplifying your data pipeline code.</p></li>
<li><p><strong>Text-to-Results in One Call</strong>: Call <code translate="no">search()</code> with text queries, and Milvus handles embedding, searching, and returning results—all in a single API call.</p></li>
<li><p><strong>Provider-Agnostic Integration</strong>: Milvus abstracts provider implementation details; just configure your Function and API key once, and you’re ready to go.</p></li>
<li><p><strong>Open-Source Ecosystem Compatibility</strong>: Whether you generate embeddings via our built-in <code translate="no">TextEmbedding</code> Function, local inference, or another method, Milvus provides unified storage and retrieval capabilities.</p></li>
</ul>
<p>This creates a streamlined “Data-In, Insight-Out” experience where Milvus handles vector generation internally, making your application code more straightforward and maintainable.</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">Conclusion: The Performance Truth Your RAG System Needs<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>The silent killer of RAG performance isn’t where most developers are looking. While teams pour resources into prompt engineering and LLM optimization, embedding API latency quietly sabotages user experience with delays that can be 100x worse than expected. Our comprehensive benchmarks expose the harsh reality: popular doesn’t mean performant, geography matters more than algorithm choice in many cases, and local inference sometimes beats expensive cloud APIs.</p>
<p>These findings highlight a crucial blind spot in RAG optimization. Cross-region latency penalties, unexpected provider performance rankings, and the surprising competitiveness of local inference aren’t edge cases—they’re production realities affecting real applications. Understanding and measuring embedding API performance is essential for delivering responsive user experiences.</p>
<p>Your embedding provider choice is one critical piece of your RAG performance puzzle. By testing in your actual deployment environment, selecting geographically appropriate providers, and considering alternatives like local inference, you can eliminate a major source of user-facing delays and build truly responsive AI applications.</p>
<p>For more details on how we did this benchmarking, check <a href="https://github.com/zhuwenxing/text-embedding-bench">this notebook</a>.</p>
