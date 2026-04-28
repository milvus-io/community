---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: 'DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Model Mana yang Harus Anda Gunakan?'
author: Lumina Wang
date: 2026-4-28
cover: >-
  assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_1_98e0113041.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  Bandingkan DeepSeek V4, GPT-5.5, dan Qwen3.6 dalam pengambilan, debugging, dan
  pengujian konteks panjang, lalu buatlah pipeline Milvus RAG dengan DeepSeek
  V4.
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>New model releases are moving faster than production teams can evaluate them. DeepSeek V4, GPT-5.5, and Qwen3.6-35B-A3B all look strong on paper, but the harder question for AI application developers is practical: which model should you use for retrieval-heavy systems, coding tasks, long-context analysis, and <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG pipelines</a>?</p>
<p><strong>This article compares the three models in practical tests:</strong> live information retrieval, concurrency-bug debugging, and long-context marker retrieval. Then it shows how to connect DeepSeek V4 to <a href="https://zilliz.com/learn/what-is-vector-database">Milvus vector database</a>, so retrieved context comes from a searchable knowledge base instead of the model’s parameters alone.</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">What Are DeepSeek V4, GPT-5.5, and Qwen3.6-35B-A3B?<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4, GPT-5.5, and Qwen3.6-35B-A3B are different AI models that target different parts of the model stack.</strong> DeepSeek V4 focuses on open-weight long-context inference. GPT-5.5 focuses on frontier-hosted performance, coding, online research, and tool-heavy tasks. Qwen3.6-35B-A3B focuses on open-weight multimodal deployment with a much smaller active-parameter footprint.</p>
<p>The comparison matters because a <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">production vector search</a> system rarely depends on the model alone. Model capability, context length, deployment control, retrieval quality, and serving cost all affect the final user experience.</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4: An Open-Weight MoE Model for Long-Context Cost Control</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>is an open-weight MoE model family released by DeepSeek on April 24, 2026.</strong> The official release lists two variants: DeepSeek V4-Pro and DeepSeek V4-Flash. V4-Pro has 1.6T total parameters with 49B activated per token, while V4-Flash has 284B total parameters with 13B activated per token. Both support a 1M-token context window.</p>
<p>The <a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Pro model card</a> also lists the model as MIT-licensed and available through Hugging Face and ModelScope. For teams building long-context document workflows, the main appeal is cost control and deployment flexibility compared with fully closed frontier APIs.</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5: A Hosted Frontier Model for Coding, Research, and Tool Use</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>is a closed frontier model released by OpenAI on April 23, 2026.</strong> OpenAI positions it for coding, online research, data analysis, document work, spreadsheet work, software operation, and tool-based tasks. The official model docs list <code translate="no">gpt-5.5</code> with a 1M-token API context window, while Codex and ChatGPT product limits may differ.</p>
<p>OpenAI reports strong coding benchmark results: 82.7% on Terminal-Bench 2.0, 73.1% on Expert-SWE, and 58.6% on SWE-Bench Pro. The tradeoff is price: the official API pricing lists GPT-5.5 at <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>5</mn><mi>p</mi><mi>e</mi><mi>r</mi><mn>1</mn><mi>M</mi><mi>i</mi><mi>n</mi><mi>p</mi><mi>u</mi><mi>t</mi><mi>t</mi><mi>o</mi><mi>k</mi><mi>e</mi><mi>n</mi><mi>s</mi><mi>a</mi><mi>n</mi><mi>d</mi></mrow><annotation encoding="application/x-tex">5 per 1M input tokens and</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord">5</span><span class="mord mathnormal">p</span><span class="mord mathnormal" style="margin-right:0.02778em;">er</span><span class="mord">1</span><span class="mord mathnormal" style="margin-right:0.10903em;">M</span><span class="mord mathnormal">in</span><span class="mord mathnormal">p</span><span class="mord mathnormal">u</span><span class="mord mathnormal">tt</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.03148em;">k</span><span class="mord mathnormal">e</span><span class="mord mathnormal">n</span><span class="mord mathnormal">s</span><span class="mord mathnormal">an</span><span class="mord mathnormal">d</span></span></span></span>30 per 1M output tokens, before any product-specific or long-context pricing details.</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B: A Smaller Active-Parameter Model for Local and Multimodal Workloads</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>is an open-weight MoE model from Alibaba’s Qwen team.</strong> Its model card lists 35B total parameters, 3B activated parameters, a vision encoder, and Apache-2.0 licensing. It supports a native 262,144-token context window and can extend to about 1,010,000 tokens with YaRN scaling.</p>
<p>That makes Qwen3.6-35B-A3B attractive when local deployment, private serving, image-text input, or Chinese-language workloads matter more than managed frontier-model convenience.</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6: Model Specs Compared</h3><table>
<thead>
<tr><th>Model</th><th>Deployment model</th><th>Public parameter info</th><th>Context window</th><th>Strongest fit</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>Open-weight MoE; API available</td><td>1.6T total / 49B active</td><td>1M tokens</td><td>Long-context, cost-sensitive engineering deployments</td></tr>
<tr><td>GPT-5.5</td><td>Hosted closed model</td><td>Undisclosed</td><td>1M tokens in the API</td><td>Coding, live research, tool use, and highest overall capability</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Open-weight multimodal MoE</td><td>35B total / 3B active</td><td>262K native; ~1M with YaRN</td><td>Local/private deployment, multimodal input, and Chinese-language scenarios</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">How We Tested DeepSeek V4, GPT-5.5, and Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>These tests are not a replacement for full benchmark suites. They are practical checks that mirror common developer questions: can the model retrieve current information, reason about subtle code bugs, and locate facts inside a very long document?</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">Which Model Handles Real-Time Information Retrieval Best?</h3><p>We asked each model three time-sensitive questions using web search where available. The instruction was simple: return only the answer and include the source URL.</p>
<table>
<thead>
<tr><th>Question</th><th>Expected answer at test time</th><th>Source</th></tr>
</thead>
<tbody>
<tr><td>How much does it cost to generate a 1024×1024 medium-quality image with <code translate="no">gpt-image-2</code> through the OpenAI API?</td><td><code translate="no">$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">OpenAI image generation pricing</a></td></tr>
<tr><td>What is the No. 1 song on this week’s Billboard Hot 100, and who is the artist?</td><td><code translate="no">Choosin' Texas</code> by Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Billboard Hot 100 chart</a></td></tr>
<tr><td>Who is currently leading the 2026 F1 driver standings?</td><td>Kimi Antonelli</td><td><a href="https://www.formula1.com/en/results/2026/drivers">Formula 1 driver standings</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>Note: These are time-sensitive questions. The expected answers reflect the results at the time we ran the test.</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>OpenAI’s image pricing page uses the label “medium” rather than “standard” for the $0.053 1024×1024 result, so the question is normalized here to match the current API wording.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_2_408d990bb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_3_082d496650.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_4_7fd44e596b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">Real-Time Retrieval Results: GPT-5.5 Had the Clearest Advantage</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro answered the first question incorrectly. It could not answer the second and third questions through live web search in this setup.</p>
<p>The second answer included the correct Billboard URL but did not retrieve the current No. 1 song. The third answer used the wrong source, so we counted it as incorrect.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 handled this test much better. Its answers were short, accurate, sourced, and fast. When a task depends on current information and the model has live retrieval available, GPT-5.5 had the clear advantage in this setup.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B produced a result similar to DeepSeek V4-Pro. It did not have live web access in this setup, so it could not complete the real-time retrieval task.</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">Which Model Is Better at Debugging Concurrency Bugs?<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>The second test used a Python bank-transfer example with three layers of concurrency problems. The task was not just to find the obvious race condition, but also to explain why the total balance breaks and provide corrected code.</p>
<table>
<thead>
<tr><th>Layer</th><th>Problem</th><th>What goes wrong</th></tr>
</thead>
<tbody>
<tr><td>Basic</td><td>Race condition</td><td><code translate="no">if self.balance &gt;= amount</code> and <code translate="no">self.balance -= amount</code> are not atomic. Two threads can pass the balance check at the same time, then both subtract money.</td></tr>
<tr><td>Medium</td><td>Deadlock risk</td><td>A naive per-account lock can deadlock when transfer A→B locks A first while transfer B→A locks B first. This is the classic ABBA deadlock.</td></tr>
<tr><td>Advanced</td><td>Incorrect lock scope</td><td>Protecting only <code translate="no">self.balance</code> does not protect <code translate="no">target.balance</code>. A correct fix must lock both accounts in a stable order, usually by account ID, or use a global lock with lower concurrency.</td></tr>
</tbody>
</table>
<p>The prompt and code are as shown below:</p>
<pre><code translate="no" class="language-cpp">The following Python code simulates two bank accounts transferring
  money to each other. The total balance should always equal 2000,                                              
  but it often doesn&#x27;t after running.                                                                           
                                                                                                                
  Please:                                                                                                       
  1. Find ALL concurrency bugs in this code (not just the obvious one)                                          
  2. Explain why Total ≠ 2000 with a concrete thread execution example                                          
  3. Provide the corrected code                                                                                 
                                                                                                                
  import threading                                                                                              
                                                                  
  class BankAccount:
      def __init__(self, balance):
          self.balance = balance                                                                                
   
      def transfer(self, target, amount):                                                                       
          if self.balance &gt;= amount:                              
              self.balance -= amount
              target.balance += amount
              return True
          return False
                                                                                                                
  def stress_test():
      account_a = BankAccount(1000)                                                                             
      account_b = BankAccount(1000)                               

      def transfer_a_to_b():                                                                                    
          for _ in range(1000):
              account_a.transfer(account_b, 1)                                                                  
                                                                  
      def transfer_b_to_a():
          for _ in range(1000):
              account_b.transfer(account_a, 1)                                                                  
   
      threads = [threading.Thread(target=transfer_a_to_b) for _ in range(10)]                                   
      threads += [threading.Thread(target=transfer_b_to_a) for _ in range(10)]
                                                                                                                
      for t in threads: t.start()
      for t in threads: t.join()                                                                                
                                                                  
      print(f&quot;Total: {account_a.balance + account_b.balance}&quot;)                                                  
      print(f&quot;A: {account_a.balance}, B: {account_b.balance}&quot;)
                                                                                                                
  stress_test()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">Code Debugging Results: GPT-5.5 Gave the Most Complete Answer</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro gave a concise analysis and went straight to the ordered-lock solution, which is the standard way to avoid ABBA deadlock. Its answer demonstrated the right fix, but it did not spend much time explaining why the naive lock-based fix could introduce a new failure mode.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_8_e2b4c41c46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_9_d6b1e62c32.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 performed best on this test. It found the core issues, anticipated the deadlock risk, explained why the original code could fail, and provided a complete corrected implementation.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B identified the bugs accurately, and its example execution sequence was clear. The weaker part was the fix: it chose a global class-level lock, which makes every account share the same lock. That works for a small simulation, but it is a poor tradeoff for a real banking system because unrelated account transfers must still wait on the same lock.</p>
<p><strong>In short:</strong> GPT-5.5 not only solved the current bug, but also warned about the next bug a developer might introduce. DeepSeek V4-Pro gave the cleanest non-GPT fix. Qwen3.6 found the issues and produced working code, but did not call out the scalability compromise.</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">Which Model Handles Long-Context Retrieval Best?<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>For the long-context test, we used the full text of <em>Dream of the Red Chamber</em>, roughly 850,000 Chinese characters. We inserted a hidden marker around the 500,000-character position:</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>Then we uploaded the file to each model and asked it to find both the marker content and its position.</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">Long-Context Retrieval Results: GPT-5.5 Found the Marker Most Precisely</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro found the hidden marker, but it did not find the correct character position. It also gave the wrong surrounding context. In this test, it seemed to locate the marker semantically but lose track of the exact position while reasoning over the document.</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 found the marker content, the position, and the surrounding context correctly. It reported the position as 500,002 and even distinguished between zero-indexed and one-indexed counting. The surrounding context also matched the text used when inserting the marker.</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B found the marker content and nearby context correctly, but its position estimate was wrong.</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">What Do These Tests Say About Model Selection?<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>The three tests point to a practical selection pattern: <strong>GPT-5.5 is the capability pick, DeepSeek V4-Pro is the long-context cost-performance pick, and Qwen3.6-35B-A3B is the local-control pick.</strong></p>
<table>
<thead>
<tr><th>Model</th><th>Best fit</th><th>What happened in our tests</th><th>Main caveat</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>Best overall capability</td><td>Won the live retrieval, concurrency-debugging, and long-context marker tests</td><td>Higher cost; strongest when accuracy and tool use justify the premium</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>Long-context, lower-cost deployment</td><td>Gave the strongest non-GPT fix for the concurrency bug and found the marker content</td><td>Needs external retrieval tools for live web tasks; exact character-location tracking was weaker in this test</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>Local deployment, open weights, multimodal input, Chinese-language workloads</td><td>Did well on bug identification and long-context comprehension</td><td>Fix quality was less scalable; live web access was unavailable in this setup</td></tr>
</tbody>
</table>
<p>Use GPT-5.5 when you need the strongest result, and cost is secondary. Use DeepSeek V4-Pro when you need long context, lower serving cost, and API-friendly deployment. Use Qwen3.6-35B-A3B when open weights, private deployment, multimodal support, or serving-stack control matter most.</p>
<p>For retrieval-heavy applications, though, model choice is only half the story. Even a strong long-context model performs better when the context is retrieved, filtered, and grounded by a dedicated <a href="https://zilliz.com/learn/generative-ai">semantic search system</a>.</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">Why RAG Still Matters for Long-Context Models<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>A long context window does not remove the need for retrieval. It changes the retrieval strategy.</p>
<p>In a RAG application, the model should not scan every document on every request. A <a href="https://zilliz.com/learn/introduction-to-unstructured-data">vector database architecture</a> stores embeddings, searches for semantically relevant chunks, applies metadata filters, and returns a compact context set to the model. That gives the model better input while reducing cost and latency.</p>
<p>Milvus fits this role because it handles <a href="https://milvus.io/docs/schema.md">collection schemas</a>, vector indexing, scalar metadata, and retrieval operations in one system. You can start locally with <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, move to a standalone <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart</a>, deploy with <a href="https://milvus.io/docs/install_standalone-docker.md">Docker installation</a> or <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose deployment</a>, and scale further with <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetes deployment</a> when the workload grows.</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">How to Build a RAG Pipeline with Milvus and DeepSeek V4<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>The following walkthrough builds a small RAG pipeline using DeepSeek V4-Pro for generation and Milvus for retrieval. The same structure applies to other LLMs: create embeddings, store them in a collection, search for relevant context, and pass that context into the model.</p>
<p>For a broader walkthrough, see the official <a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG tutorial</a>. This example keeps the pipeline small so the retrieval flow is easy to inspect.</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">Prepare the Environment<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">Install the Dependencies</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>If you are using Google Colab, you may need to restart the runtime after installing dependencies. Click the <strong>Runtime</strong> menu, then select <strong>Restart session</strong>.</p>
<p>DeepSeek V4-Pro supports an OpenAI-style API. Log in to the official DeepSeek website and set <code translate="no">DEEPSEEK_API_KEY</code> as an environment variable.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">Prepare the Milvus Documentation Dataset</h3><p>We use the FAQ pages from the <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.x documentation archive</a> as the private knowledge source. This is a simple starter dataset for a small RAG demo.</p>
<p>First, download the ZIP file and extract the documentation into the <code translate="no">milvus_docs</code> folder.</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>We load all Markdown files from the <code translate="no">milvus_docs/en/faq</code> folder. For each document, we split the file content by <code translate="no">#</code>, which roughly separates major Markdown sections.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">Set Up DeepSeek V4 and the Embedding Model</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Next, choose an embedding model. This example uses <code translate="no">DefaultEmbeddingFunction</code> from the PyMilvus model module. See the Milvus docs for more on <a href="https://milvus.io/docs/embeddings.md">embedding functions</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>Generate a test vector, then print the vector dimension and the first few elements. The returned dimension is used when creating the Milvus collection.</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">Load Data into Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">Create a Milvus Collection</h3><p>A Milvus collection stores vector fields, scalar fields, and optional dynamic metadata. The quick setup below uses the high-level <code translate="no">MilvusClient</code> API; for production schemas, review the docs on <a href="https://milvus.io/docs/manage-collections.md">collection management</a> and <a href="https://milvus.io/docs/create-collection.md">creating collections</a>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>A few notes about <code translate="no">MilvusClient</code>:</p>
<ul>
<li>Setting <code translate="no">uri</code> to a local file, such as <code translate="no">./milvus.db</code>, is the easiest option because it automatically uses <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> and stores all data in that file.</li>
<li>If you have a large dataset, you can set up a higher-performance Milvus server on <a href="https://milvus.io/docs/quickstart.md">Docker or Kubernetes</a>. In that setup, use the server URI, such as <code translate="no">http://localhost:19530</code>, as your <code translate="no">uri</code>.</li>
<li>If you want to use <a href="https://docs.zilliz.com/">Zilliz Cloud</a>, the fully managed cloud service for Milvus, set <code translate="no">uri</code> and <code translate="no">token</code> to the <a href="https://docs.zilliz.com/docs/connect-to-cluster">public endpoint and API key</a> from Zilliz Cloud.</li>
</ul>
<p>Check whether the collection already exists. If it does, delete it.</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Create a new collection with the specified parameters. If we do not specify field information, Milvus automatically creates a default <code translate="no">id</code> field as the primary key and a vector field to store vector data. A reserved JSON field stores scalar data that is not defined in the schema.</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>The <code translate="no">IP</code> metric means inner product similarity. Milvus also supports other metric types and index choices depending on the vector type and workload; see the guides on <a href="https://milvus.io/docs/id/metric.md">metric types</a> and <a href="https://milvus.io/docs/index_selection.md">index selection</a>. The <code translate="no">Strong</code> setting is one of the available <a href="https://milvus.io/docs/consistency.md">consistency levels</a>.</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">Insert the Embedded Documents</h3><p>Iterate through the text data, create embeddings, and insert the data into Milvus. Here, we add a new field named <code translate="no">text</code>. Since it is not explicitly defined in the collection schema, it is automatically added to the reserved dynamic JSON field. For production metadata, review <a href="https://milvus.io/docs/enable-dynamic-field.md">dynamic field support</a> and the <a href="https://milvus.io/docs/json-field-overview.md">JSON field overview</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>For larger datasets, the same pattern can be extended with explicit schema design, <a href="https://milvus.io/docs/index-vector-fields.md">vector field indexes</a>, scalar indexes, and data lifecycle operations such as <a href="https://milvus.io/docs/insert-update-delete.md">insert, upsert, and delete</a>.</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">Build the RAG Retrieval Flow<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">Search Milvus for Relevant Context</h3><p>Let’s define a common question about Milvus.</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Search the collection for the question and retrieve the top three semantic matches. This is a basic <a href="https://milvus.io/docs/single-vector-search.md">single-vector search</a>. In production, you can combine it with <a href="https://milvus.io/docs/filtered-search.md">filtered search</a>, <a href="https://milvus.io/docs/full-text-search.md">full-text search</a>, <a href="https://milvus.io/docs/multi-vector-search.md">multi-vector hybrid search</a>, and <a href="https://milvus.io/docs/reranking.md">reranking strategies</a> to improve relevance.</p>
<pre><code translate="no" class="language-python">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries(
        [question]
    ),  <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Now let’s look at the search results for the query.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">Generate a RAG Answer with DeepSeek V4</h3><p>Convert the retrieved documents into string format.</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Define the system and user prompts for the LLM. This prompt is assembled from the documents retrieved from Milvus.</p>
<pre><code translate="no" class="language-python">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Use the model provided by DeepSeek V4-Pro to generate a response based on the prompt.</p>
<pre><code translate="no">response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-v4-pro&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
print(response.choices[<span class="hljs-number">0</span>].message.content)
Milvus stores data <span class="hljs-keyword">in</span> two distinct ways depending <span class="hljs-keyword">on</span> the type:
- **Inserted data** (vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema) are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, such <span class="hljs-keyword">as</span> MinIO, AWS S3, Google Cloud Storage, Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object Storage. Before reaching persistent storage, the data <span class="hljs-keyword">is</span> initially loaded <span class="hljs-keyword">into</span> a message queue; a data node then writes it to disk, <span class="hljs-keyword">and</span> calling `flush()` forces an immediate write.
- **Metadata**, generated <span class="hljs-keyword">by</span> each Milvus module, <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
<button class="copy-code-btn"></button></code></pre>
<p>At this point, the pipeline has completed the core RAG loop: embed documents, store vectors in Milvus, search for relevant context, and generate an answer with DeepSeek V4-Pro.</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">What Should You Improve Before Production?<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>The demo uses simple section splitting and top-k retrieval. That is enough to show the mechanics, but production RAG usually needs more retrieval control.</p>
<table>
<thead>
<tr><th>Production need</th><th>Milvus feature to consider</th><th>Why it helps</th></tr>
</thead>
<tbody>
<tr><td>Mix semantic and keyword signals</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">hybrid search with Milvus</a></td><td>Combines dense vector search with sparse or full-text signals</td></tr>
<tr><td>Merge results from multiple retrievers</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvus hybrid search retriever</a></td><td>Lets LangChain workflows use weighted or RRF-style ranking</td></tr>
<tr><td>Restrict results by tenant, timestamp, or document type</td><td>Metadata and scalar filters</td><td>Keeps retrieval scoped to the right data slice</td></tr>
<tr><td>Move from self-managed Milvus to managed service</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">Milvus to Zilliz migration</a></td><td>Reduces infrastructure work while keeping Milvus compatibility</td></tr>
<tr><td>Connect hosted applications securely</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Zilliz Cloud API keys</a></td><td>Provides token-based access control for application clients</td></tr>
</tbody>
</table>
<p>The most important production habit is to evaluate retrieval separately from generation. If the retrieved context is weak, swapping the LLM often hides the problem instead of solving it.</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">Get Started with Milvus and DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>If you want to reproduce the tutorial, start with the official <a href="https://milvus.io/docs">Milvus documentation</a> and the <a href="https://milvus.io/docs/build-rag-with-milvus.md">Build RAG with Milvus guide</a>. For a managed setup, <a href="https://docs.zilliz.com/docs/connect-to-cluster">connect to Zilliz Cloud</a> with your cluster endpoint and API key instead of running Milvus locally.</p>
<p>If you want help tuning chunking, indexing, filters, or hybrid retrieval, join the <a href="https://slack.milvus.io/">Milvus Slack community</a> or book a free <a href="https://milvus.io/office-hours">Milvus Office Hours session</a>. If you would rather skip infrastructure setup, use <a href="https://cloud.zilliz.com/login">Zilliz Cloud login</a> or create a <a href="https://cloud.zilliz.com/signup">Zilliz Cloud account</a> to run managed Milvus.</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">Questions Developers Ask About DeepSeek V4, Milvus, and RAG<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">Is DeepSeek V4 good for RAG?</h3><p>DeepSeek V4-Pro is a strong fit for RAG when you need long-context processing and lower serving cost than premium closed models. You still need a retrieval layer such as Milvus to select relevant chunks, apply metadata filters, and keep the prompt focused.</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">Should I use GPT-5.5 or DeepSeek V4 for a RAG pipeline?</h3><p>Use GPT-5.5 when answer quality, tool use, and live research matter more than cost. Use DeepSeek V4-Pro when long-context processing and cost control matter more, especially if your retrieval layer already supplies high-quality grounded context.</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">Can I run Qwen3.6-35B-A3B locally for private RAG?</h3><p>Yes, Qwen3.6-35B-A3B is open weight and designed for more controllable deployment. It is a good candidate when privacy, local serving, multimodal input, or Chinese-language performance matters, but you still need to validate latency, memory, and retrieval quality for your hardware.</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">Do long-context models make vector databases unnecessary?</h3><p>No. Long-context models can read more text, but they still benefit from retrieval. A vector database narrows the input to relevant chunks, supports metadata filtering, reduces token cost, and makes the application easier to update as documents change.</p>
