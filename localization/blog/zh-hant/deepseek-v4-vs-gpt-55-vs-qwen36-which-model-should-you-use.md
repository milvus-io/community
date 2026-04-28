---
id: deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
title: DeepSeek V4 vs GPT-5.5 vs Qwen3.6：您應該使用哪一種模式？
author: Lumina Wang
date: 2026-4-28
cover: assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'DeepSeek V4, GPT-5.5 benchmark, Milvus RAG, Qwen3.6, vector database'
meta_title: |
  DeepSeek V4 RAG Benchmark with Milvus vs GPT-5.5 and Qwen
desc: >-
  比較 DeepSeek V4、GPT-5.5 和 Qwen3.6 的檢索、除錯和長內容測試，然後用 DeepSeek V4 建立 Milvus RAG
  管道。
origin: >-
  https://milvus.io/blog/deepseek-v4-vs-gpt-55-vs-qwen36-which-model-should-you-use.md
---
<p>新模型發布的速度比生產團隊評估它們的速度還要快。DeepSeek V4、GPT-5.5 和 Qwen3.6-35B-A3B 在紙上看來都很強大，但對於 AI 應用程式開發人員而言，更困難的問題是實用性：您應該使用哪一種模型來處理檢索繁重的系統、編碼任務、長內容分析和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 管道</a>？</p>
<p><strong>本文在實際測試中比較這三種模型：</strong>即時資訊檢索、並發調試和長內容標記檢索。然後，它展示了如何將 DeepSeek V4 連接到<a href="https://zilliz.com/learn/what-is-vector-database">Milvus 向量資料</a>庫，因此擷取的上下文來自可搜尋的知識庫，而不只是模型的參數。</p>
<h2 id="What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="common-anchor-header">什麼是DeepSeek V4、GPT-5.5和Qwen3.6-35B-A3B？<button data-href="#What-Are-DeepSeek-V4-GPT-55-and-Qwen36-35B-A3B" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>DeepSeek V4、GPT-5.5 和 Qwen3.6-35B-A3B 是不同的 AI 模型，針對模型堆疊的不同部分。</strong>DeepSeek V4 專注於開放式長內容推論。GPT-5.5 著重於前沿託管效能、編碼、線上研究和重工具的任務。Qwen3.6-35B-A3B 著重於開放式多模式部署，其主動參數足跡要小得多。</p>
<p>比較很重要，因為<a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">生產向量搜尋系統</a>很少會單靠模型。模型能力、上下文長度、部署控制、檢索品質和服務成本都會影響最終的使用者體驗。</p>
<h3 id="DeepSeek-V4-An-Open-Weight-MoE-Model-for-Long-Context-Cost-Control" class="common-anchor-header">DeepSeek V4：用於長內容成本控制的開放式 MoE 模型</h3><p><a href="https://api-docs.deepseek.com/news/news260424"><strong>DeepSeek V4</strong></a> <strong>是 DeepSeek 於 2026 年 4 月 24 日發佈的開放重量 MoE 模型系列。</strong>官方版本列出了兩個變體：DeepSeek V4-Pro 和 DeepSeek V4-Flash。V4-Pro 總參數為 1.6T ，每個令牌激活 49B 的參數，而 V4-Flash 總參數為 284B ，每個令牌激活 13B 的參數。兩者皆支援 1M 記憶體上下文視窗。</p>
<p><a href="https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro">DeepSeek V4-Pro 模型卡還</a>列出該模型為 MIT 授權，可透過 Hugging Face 和 ModelScope 取得。對於建立長上下文文件工作流程的團隊而言，與完全封閉的前沿 API 相比，主要的吸引力在於成本控制與部署彈性。</p>
<h3 id="GPT-55-A-Hosted-Frontier-Model-for-Coding-Research-and-Tool-Use" class="common-anchor-header">GPT-5.5：用於編碼、研究與工具使用的託管式前沿模型</h3><p><a href="https://openai.com/index/introducing-gpt-5-5/"><strong>GPT-5.5</strong></a> <strong>是 OpenAI 於 2026 年 4 月 23 日發佈的封閉式前沿模型。</strong>OpenAI 將其定位為編碼、線上研究、資料分析、文件工作、試算表工作、軟體操作和工具型任務。官方機型文件列出<code translate="no">gpt-5.5</code> 有 1M-token API 上下文視窗，而 Codex 和 ChatGPT 產品的限制可能有所不同。</p>
<p>OpenAI 報告了強大的編碼基準結果：Terminal-Bench 2.0 的測試成績為 82.7%，Expert-SWE 的測試成績為 73.1%，SWE-Bench Pro 的測試成績為 58.6%。取捨的關鍵在於價格：官方 API 定價列出 GPT-5.5 的價格為每 100 萬個輸入代幣 5 美元，每 100 萬個輸出代幣 30 美元，在此之前還沒有任何特定產品或長內容定價細節。</p>
<h3 id="Qwen36-35B-A3B-A-Smaller-Active-Parameter-Model-for-Local-and-Multimodal-Workloads" class="common-anchor-header">Qwen3.6-35B-A3B：適用於本地和多模式工作負載的小型主動參數模型</h3><p><a href="https://huggingface.co/Qwen/Qwen3.6-35B-A3B"><strong>Qwen3.6-35B-A3B</strong></a> <strong>是阿里巴巴 Qwen 團隊推出的開放式 MoE 模型。</strong>它的模型卡列出了 35B 總參數、3B 啟動參數、視覺編碼器和 Apache-2.0 授權。它支援原生的 262,144 代幣上下文視窗，並可透過 YaRN 擴充擴展至約 1,010,000 代幣。</p>
<p>這使得 Qwen3.6-35B-A3B 在本地部署、私人服務、圖像文字輸入或中文工作負載比管理前沿模型的便利性更重要時更具吸引力。</p>
<h3 id="DeepSeek-V4-vs-GPT-55-vs-Qwen36-Model-Specs-Compared" class="common-anchor-header">DeepSeek V4 vs GPT-5.5 vs Qwen3.6：機型規格比較</h3><table>
<thead>
<tr><th>機型</th><th>部署模型</th><th>公開參數資訊</th><th>上下文視窗</th><th>最強擬合</th></tr>
</thead>
<tbody>
<tr><td>DeepSeek V4-Pro</td><td>開放重量的 MoE；提供 API</td><td>總計 1.6T / 49B 活躍</td><td>1M 代幣</td><td>長情境、成本敏感的工程部署</td></tr>
<tr><td>GPT-5.5</td><td>託管式封閉模型</td><td>未公開</td><td>API 中有 1M 代幣</td><td>編碼、現場研究、工具使用、最高整體能力</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>開放式重量級多模式 MoE</td><td>總計 35B / 3B 活躍</td><td>262K 原生； ~1M 與 YaRN</td><td>本地/私有部署、多模態輸入和中文情境</td></tr>
</tbody>
</table>
<h2 id="How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="common-anchor-header">我們如何測試 DeepSeek V4、GPT-5.5 和 Qwen3.6<button data-href="#How-We-Tested-DeepSeek-V4-GPT-55-and-Qwen36" class="anchor-icon" translate="no">
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
    </button></h2><p>這些測試並不能取代完整的基準套件。它們是反映開發人員常見問題的實用檢查：模型能否擷取目前的資訊、推理細微的程式碼錯誤，以及在冗長的文件中找出事實？</p>
<h3 id="Which-Model-Handles-Real-Time-Information-Retrieval-Best" class="common-anchor-header">哪個模型最能夠處理即時資訊擷取？</h3><p>我們使用可用的網路搜尋，詢問每個模型三個時間敏感的問題。指令很簡單：只傳回答案並包含來源 URL。</p>
<table>
<thead>
<tr><th>問題</th><th>測試時的預期答案</th><th>來源</th></tr>
</thead>
<tbody>
<tr><td>透過 OpenAI API 以<code translate="no">gpt-image-2</code> 產生一張 1024×1024 中等品質的圖像需要多少費用？</td><td><code translate="no">\$0.053</code></td><td><a href="https://developers.openai.com/api/docs/guides/image-generation">OpenAI 圖片產生價格</a></td></tr>
<tr><td>本週 Billboard Hot 100 排名第一的歌曲是什麼，歌手是誰？</td><td><code translate="no">Choosin' Texas</code> 作者：Ella Langley</td><td><a href="https://www.billboard.com/charts/hot-100/">Billboard Hot 100 排行榜</a></td></tr>
<tr><td>目前誰在 2026 年 F1 車手排行榜上領先？</td><td>基米-安東內利</td><td><a href="https://www.formula1.com/en/results/2026/drivers">F1 車手排名</a></td></tr>
</tbody>
</table>
<table>
<thead>
<tr><th>注意：這些都是有時間性的問題。預期答案反映的是我們進行測試時的結果。</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>OpenAI 的圖片定價網頁使用標籤「中」而非「標準」來表示 <br>

  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_narrow_1152x720_87d33982dd.jpg" alt="blog cover narrow 1152x720" class="doc-image" id="blog-cover-narrow-1152x720" />
   </span> <span class="img-wrapper"> <span>blog cover narrow 1152x720</span>$0 </span>.053 1024×1024 的結果，因此問題在此經過規範化，以符合目前的 API 措辭。</p>
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
<h3 id="Real-Time-Retrieval-Results-GPT-55-Had-the-Clearest-Advantage" class="common-anchor-header">即時擷取結果：GPT-5.5 擁有最明顯的優勢</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_5_1e9d7c4c06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro 錯誤回答了第一個問題。在此設定中，它無法透過即時網路搜尋回答第二和第三個問題。</p>
<p>第二個答案包含正確的 Billboard URL，但沒有檢索到目前排名第一的歌曲。第三個答案使用了錯誤的來源，因此我們將其計為錯誤。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_6_b146956865.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 在這項測試中表現得更好。它的答案簡短、準確、有來源且快速。當任務取決於當前資訊，且模型有即時檢索功能時，GPT-5.5 在此設定中有明顯的優勢。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_7_91686c177e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 的結果與 DeepSeek V4-Pro 相似。Qwen3.6-35B-A3B 在此設定中沒有即時網路存取功能，因此無法完成即時檢索任務。</p>
<h2 id="Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="common-anchor-header">哪個模型更擅長調試並發錯誤？<button data-href="#Which-Model-Is-Better-at-Debugging-Concurrency-Bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>第二個測試使用 Python 銀行轉帳範例，其中有三層的並發問題。我們的任務不只是找出明顯的競賽條件，還要解釋為什麼總餘額會斷開，並提供修正程式碼。</p>
<table>
<thead>
<tr><th>層次</th><th>問題</th><th>出錯原因</th></tr>
</thead>
<tbody>
<tr><td>基本問題</td><td>競爭條件</td><td><code translate="no">if self.balance &gt;= amount</code> 和<code translate="no">self.balance -= amount</code> 不是原子性的。兩個線程可以同時通過餘額檢查，然後都減去金錢。</td></tr>
<tr><td>中級</td><td>死鎖風險</td><td>當轉移 A→B 先鎖定 A，而轉移 B→A 先鎖定 B 時，天真的每帳戶鎖可能會造成死鎖。這是典型的 ABBA 死鎖。</td></tr>
<tr><td>進階</td><td>鎖定範圍不正確</td><td>只保護<code translate="no">self.balance</code> 並不保護<code translate="no">target.balance</code> 。正確的修復方法必須以穩定的順序鎖定兩個帳號，通常是以帳號 ID 鎖定，或使用並發度較低的全局鎖。</td></tr>
</tbody>
</table>
<p>提示和程式碼如下所示：</p>
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
<h3 id="Code-Debugging-Results-GPT-55-Gave-the-Most-Complete-Answer" class="common-anchor-header">程式碼偵錯結果：GPT-5.5 給出了最完整的答案</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>DeepSeek V4-Pro 提供了簡明的分析，並直接使用命令鎖解決方案，這是避免 ABBA 死鎖的標準方法。它的答案展示了正確的修復方法，但沒有花太多時間解釋為何基於鎖的天真修復方法會帶來新的失敗模式。</p>
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
<p>GPT-5.5 在這項測試中表現最佳。它發現了核心問題、預測了死鎖風險、解釋了原始程式碼可能失敗的原因，並提供了完整的修正實作。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_10_1177f51906.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 準確地找出了錯誤，其範例執行順序也很清楚。較弱的部分是修正：它選擇了全局類別層級鎖，這使得每個帳號共享相同的鎖。這對於小型模擬來說是可行的，但對於真實的銀行系統來說，這是一個很差的取捨，因為不相關的帳號轉移仍必須等待相同的鎖位。</p>
<p><strong>簡而言之：</strong>GPT-5.5 不僅解決了目前的錯誤，還警告了開發人員可能引入的下一個錯誤。DeepSeek V4-Pro 給出了最乾淨的非 GPT 修正。Qwen3.6 發現了問題並產生了可運作的程式碼，但卻沒有喊出在擴充性上的妥協。</p>
<h2 id="Which-Model-Handles-Long-Context-Retrieval-Best" class="common-anchor-header">哪種模型最能處理長內容檢索？<button data-href="#Which-Model-Handles-Long-Context-Retrieval-Best" class="anchor-icon" translate="no">
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
    </button></h2><p>在長內容測試中，我們使用了《<em>紅樓夢</em>》的全文，大約有 850,000 個中文字。我們在 500,000 字左右的位置插入了一個隱藏標記：</p>
<p><code translate="no">【Milvus test verification code: ZK-7749-ALPHA】</code></p>
<p>然後，我們將檔案上傳到每個模型，要求它找出標記內容及其位置。</p>
<h3 id="Long-Context-Retrieval-Results-GPT-55-Found-the-Marker-Most-Precisely" class="common-anchor-header">長內容檢索結果：GPT-5.5 能最精確地找到標記</h3><h4 id="DeepSeek-V4-Pro" class="common-anchor-header">DeepSeek V4-Pro</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_11_1f1ee0ec72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSeek V4-Pro 找到了隱藏的標記，但沒有找到正確的字元位置。它還提供了錯誤的周圍上下文。在這個測試中，它似乎能從語意上找到標記，但在推理文件時卻找不到確切的位置。</p>
<h4 id="GPT-55" class="common-anchor-header">GPT-5.5</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_12_5b09068036.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-5.5 能正確找到標記內容、位置和周遭上下文。它將位置報告為 500,002，甚至區分了零索引和單索引計數。周圍上下文也與插入標記時使用的文字相符。</p>
<h4 id="Qwen36-35B-A3B" class="common-anchor-header">Qwen3.6-35B-A3B</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepseek_v4_vs_gpt_55_vs_qwen36_which_model_should_you_use_md_13_ca4223c01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Qwen3.6-35B-A3B 能正確找到標記內容和鄰近上下文，但其位置估算錯誤。</p>
<h2 id="What-Do-These-Tests-Say-About-Model-Selection" class="common-anchor-header">這些測試對於模型選擇有何啟示？<button data-href="#What-Do-These-Tests-Say-About-Model-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>這三項測試指出了一個實際的選擇模式：<strong>GPT-5.5 是能力型選擇，DeepSeek V4-Pro 是長內容性价比型選擇，Qwen3.6-35B-A3B 是本地控制型選擇。</strong></p>
<table>
<thead>
<tr><th>型號</th><th>最適合</th><th>測試結果</th><th>主要注意事項</th></tr>
</thead>
<tbody>
<tr><td>GPT-5.5</td><td>整體能力最佳</td><td>贏得即時檢索、並發調試和長內容標記測試</td><td>成本較高；當準確性和工具使用證明價格合理時效果最佳</td></tr>
<tr><td>DeepSeek V4-Pro</td><td>長情境、低成本部署</td><td>提供最強大的非 GPT 並行錯誤修復，並發現標記內容</td><td>需要外部檢索工具來執行即時網路任務；精確的字元位置追蹤在本測試中較弱</td></tr>
<tr><td>Qwen3.6-35B-A3B</td><td>本地部署、開放權重、多模態輸入、中文工作負載</td><td>在識別錯誤和長內容理解方面表現良好</td><td>修正品質的擴充性較低；在此設定中無法進行即時網路存取</td></tr>
</tbody>
</table>
<p>當您需要最強大的結果時，請使用 GPT-5.5，成本是次要的。當您需要長上下文、較低的服務成本，以及對 API 友善的部署時，請使用 DeepSeek V4-Pro。當您需要開放權重、私人部署、多模式支援或服務堆疊控制時，請使用 Qwen3.6-35B-A3B。</p>
<p>對於重檢索的應用程式來說，模型的選擇只是成功的一半。即使是強大的長上下文模型，在上下文經過專用<a href="https://zilliz.com/learn/generative-ai">語意搜尋系統的</a>擷取、過濾和基礎處理後，也會有更好的表現。</p>
<h2 id="Why-RAG-Still-Matters-for-Long-Context-Models" class="common-anchor-header">為何 RAG 對於長上下文模型仍然重要<button data-href="#Why-RAG-Still-Matters-for-Long-Context-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>長上下文視窗不會消除檢索需求。它會改變檢索策略。</p>
<p>在 RAG 應用程式中，模型不應該在每次請求時掃描每個文件。<a href="https://zilliz.com/learn/introduction-to-unstructured-data">向量資料庫架構會</a>儲存嵌入、搜尋語義相關的區塊、套用元資料篩選器，然後將精簡的上下文集傳回給模型。這可讓模型獲得更好的輸入，同時降低成本與延遲。</p>
<p>Milvus 符合這個角色，因為它在一個系統中處理<a href="https://milvus.io/docs/schema.md">集合模式</a>、向量索引、標量元資料和檢索作業。您可以從本機使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> 開始，移至獨立的<a href="https://milvus.io/docs/quickstart.md">Milvus 快速啟動</a>，使用<a href="https://milvus.io/docs/install_standalone-docker.md">Docker 安裝</a>或<a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose 部署</a>，並在工作負載增加時使用<a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Kubernetes 部署</a>進一步擴充。</p>
<h2 id="How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="common-anchor-header">如何使用 Milvus 和 DeepSeek V4 建立 RAG 管道<button data-href="#How-to-Build-a-RAG-Pipeline-with-Milvus-and-DeepSeek-V4" class="anchor-icon" translate="no">
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
    </button></h2><p>以下示例使用 DeepSeek V4-Pro 生成 RAG，并使用 Milvus 进行检索。相同的結構適用於其他 LLM：建立嵌入、將嵌入儲存在集合中、搜尋相關上下文，並將上下文傳入模型。</p>
<p>如需更廣泛的說明，請參閱官方的<a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus RAG 教學</a>。本範例保持較小的管道，因此檢索流程很容易檢查。</p>
<h2 id="Prepare-the-Environment" class="common-anchor-header">準備環境<button data-href="#Prepare-the-Environment" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Install-the-Dependencies" class="common-anchor-header">安裝相依性</h3><pre><code translate="no" class="language-python">! pip install --upgrade <span class="hljs-string">&quot;pymilvus[model]&quot;</span> openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>如果您使用 Google Colab，您可能需要在安裝相依性後重新啟動執行時間。點選執行<strong>時</strong>功能表，然後選擇<strong>重新啟動會話</strong>。</p>
<p>DeepSeek V4-Pro 支援 OpenAI-style API。登錄 DeepSeek 官方網站，將<code translate="no">DEEPSEEK_API_KEY</code> 設為環境變數。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Prepare-the-Milvus-Documentation-Dataset" class="common-anchor-header">準備 Milvus 文件資料集</h3><p>我們使用<a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus 2.4.x 文件檔案</a>中的常見問題（FAQ）頁面作為私人知識來源。這是小型 RAG 示範的簡單入門資料集。</p>
<p>首先，下載 ZIP 檔案並解壓縮文件到<code translate="no">milvus_docs</code> 資料夾。</p>
<pre><code translate="no" class="language-python">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>我們從<code translate="no">milvus_docs/en/faq</code> 資料夾載入所有 Markdown 檔案。對於每個文件，我們以<code translate="no">#</code> 來分割文件內容，大致分隔主要的 Markdown 區段。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []

<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()

    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Set-Up-DeepSeek-V4-and-the-Embedding-Model" class="common-anchor-header">設定 DeepSeek V4 和嵌入模型</h3><pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://api.deepseek.com&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>接下來，選擇嵌入模型。本範例使用 PyMilvus 模型模組的<code translate="no">DefaultEmbeddingFunction</code> 。有關<a href="https://milvus.io/docs/embeddings.md">嵌入</a>函數的詳細資訊，請參閱 Milvus 文件。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

embedding_model = milvus_model.<span class="hljs-title class_">DefaultEmbeddingFunction</span>()
<button class="copy-code-btn"></button></code></pre>
<p>產生一個測試向量，然後列印向量的尺寸和前幾個元素。傳回的尺寸會在建立 Milvus 集合時使用。</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<span class="hljs-number">768</span>
[-<span class="hljs-number">0.04836066</span>  <span class="hljs-number">0.07163023</span> -<span class="hljs-number">0.01130064</span> -<span class="hljs-number">0.03789345</span> -<span class="hljs-number">0.03320649</span> -<span class="hljs-number">0.01318448</span>
 -<span class="hljs-number">0.03041712</span> -<span class="hljs-number">0.02269499</span> -<span class="hljs-number">0.02317863</span> -<span class="hljs-number">0.00426028</span>]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Load-Data-into-Milvus" class="common-anchor-header">載入資料到 Milvus<button data-href="#Load-Data-into-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Create-a-Milvus-Collection" class="common-anchor-header">建立 Milvus 集合</h3><p>Milvus 集合儲存向量欄位、標量欄位和可選的動態元資料。以下的快速設定使用高階的<code translate="no">MilvusClient</code> API；對於生產模式，請檢閱有關<a href="https://milvus.io/docs/manage-collections.md">集合管理</a>和<a href="https://milvus.io/docs/create-collection.md">建立集合的</a>文件。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>關於<code translate="no">MilvusClient</code> 的一些注意事項：</p>
<ul>
<li>將<code translate="no">uri</code> 設定為本機檔案，例如<code translate="no">./milvus.db</code> ，是最簡單的選項，因為它會自動使用<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>並將所有資料儲存在該檔案中。</li>
<li>如果您有一個大型的資料集，您可以在<a href="https://milvus.io/docs/quickstart.md">Docker 或 Kubernetes</a> 上設定一個效能較高的 Milvus 伺服器。在該設定中，請使用伺服器 URI，例如<code translate="no">http://localhost:19530</code> ，作為您的<code translate="no">uri</code> 。</li>
<li>如果您要使用<a href="https://docs.zilliz.com/">Zilliz Cloud</a>（Milvus 的完全管理<a href="https://docs.zilliz.com/docs/connect-to-cluster">雲端</a>服務），請將<code translate="no">uri</code> 和<code translate="no">token</code> 設定為 Zilliz Cloud 的<a href="https://docs.zilliz.com/docs/connect-to-cluster">公共端點和 API 金鑰</a>。</li>
</ul>
<p>檢查集合是否已經存在。若已存在，請將其刪除。</p>
<pre><code translate="no" class="language-python">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定的參數建立新的集合。如果我們沒有指定欄位資訊，Milvus 會自動建立預設的<code translate="no">id</code> 欄位作為主索引鍵，並建立向量欄位來儲存向量資料。保留的 JSON 欄位儲存模式中未定義的標量資料。</p>
<pre><code translate="no" class="language-python">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">IP</code> 公制表示內積相似度。Milvus 也支援其他度量類型和索引選擇，視向量類型和工作量而定；請參閱<a href="https://milvus.io/docs/id/metric.md">度量類型</a>和<a href="https://milvus.io/docs/index_selection.md">索引選擇</a>指南。<code translate="no">Strong</code> 設定是可用的<a href="https://milvus.io/docs/consistency.md">一致性等級</a>之一。</p>
<h3 id="Insert-the-Embedded-Documents" class="common-anchor-header">插入內嵌文件</h3><p>迭代文字資料、建立嵌入，然後將資料插入 Milvus。在此，我們新增一個名為<code translate="no">text</code> 的欄位。由於它沒有在集合模式中明確定義，因此會自動加入保留的動態 JSON 欄位。對於生產元資料，請檢閱<a href="https://milvus.io/docs/enable-dynamic-field.md">動態欄位支援</a>和<a href="https://milvus.io/docs/json-field-overview.md">JSON 欄位概觀</a>。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []

doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
Creating embeddings: <span class="hljs-number">100</span>%|█████████████████████████████████████████████████████████████████████████████████████████████████████████████████| <span class="hljs-number">72</span>/<span class="hljs-number">72</span> [<span class="hljs-number">00</span>:<span class="hljs-number">00</span>&lt;<span class="hljs-number">00</span>:<span class="hljs-number">00</span>, <span class="hljs-number">1222631.13</span>it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">72</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>, <span class="hljs-number">5</span>, <span class="hljs-number">6</span>, <span class="hljs-number">7</span>, <span class="hljs-number">8</span>, <span class="hljs-number">9</span>, <span class="hljs-number">10</span>, <span class="hljs-number">11</span>, <span class="hljs-number">12</span>, <span class="hljs-number">13</span>, <span class="hljs-number">14</span>, <span class="hljs-number">15</span>, <span class="hljs-number">16</span>, <span class="hljs-number">17</span>, <span class="hljs-number">18</span>, <span class="hljs-number">19</span>, <span class="hljs-number">20</span>, <span class="hljs-number">21</span>, <span class="hljs-number">22</span>, <span class="hljs-number">23</span>, <span class="hljs-number">24</span>, <span class="hljs-number">25</span>, <span class="hljs-number">26</span>, <span class="hljs-number">27</span>, <span class="hljs-number">28</span>, <span class="hljs-number">29</span>, <span class="hljs-number">30</span>, <span class="hljs-number">31</span>, <span class="hljs-number">32</span>, <span class="hljs-number">33</span>, <span class="hljs-number">34</span>, <span class="hljs-number">35</span>, <span class="hljs-number">36</span>, <span class="hljs-number">37</span>, <span class="hljs-number">38</span>, <span class="hljs-number">39</span>, <span class="hljs-number">40</span>, <span class="hljs-number">41</span>, <span class="hljs-number">42</span>, <span class="hljs-number">43</span>, <span class="hljs-number">44</span>, <span class="hljs-number">45</span>, <span class="hljs-number">46</span>, <span class="hljs-number">47</span>, <span class="hljs-number">48</span>, <span class="hljs-number">49</span>, <span class="hljs-number">50</span>, <span class="hljs-number">51</span>, <span class="hljs-number">52</span>, <span class="hljs-number">53</span>, <span class="hljs-number">54</span>, <span class="hljs-number">55</span>, <span class="hljs-number">56</span>, <span class="hljs-number">57</span>, <span class="hljs-number">58</span>, <span class="hljs-number">59</span>, <span class="hljs-number">60</span>, <span class="hljs-number">61</span>, <span class="hljs-number">62</span>, <span class="hljs-number">63</span>, <span class="hljs-number">64</span>, <span class="hljs-number">65</span>, <span class="hljs-number">66</span>, <span class="hljs-number">67</span>, <span class="hljs-number">68</span>, <span class="hljs-number">69</span>, <span class="hljs-number">70</span>, <span class="hljs-number">71</span>], <span class="hljs-string">&#x27;cost&#x27;</span>: <span class="hljs-number">0</span>}
<button class="copy-code-btn"></button></code></pre>
<p>對於較大型的資料集，可透過明確的模式設計、<a href="https://milvus.io/docs/index-vector-fields.md">向量欄位索引</a>、標量索引，以及<a href="https://milvus.io/docs/insert-update-delete.md">插入、上移和刪除</a>等資料生命週期作業，擴展相同的模式。</p>
<h2 id="Build-the-RAG-Retrieval-Flow" class="common-anchor-header">建立 RAG 檢索流程<button data-href="#Build-the-RAG-Retrieval-Flow" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Search-Milvus-for-Relevant-Context" class="common-anchor-header">搜尋 Milvus 相關內容</h3><p>讓我們定義一個關於 Milvus 的常見問題。</p>
<pre><code translate="no" class="language-python">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在資料集中搜尋該問題，並擷取前三個符合的語意。這是基本的<a href="https://milvus.io/docs/single-vector-search.md">單向量搜尋</a>。在生產中，您可以將它與<a href="https://milvus.io/docs/filtered-search.md">篩選搜尋</a>、<a href="https://milvus.io/docs/full-text-search.md">全文搜尋</a>、<a href="https://milvus.io/docs/multi-vector-search.md">多向量混合搜尋</a>以及<a href="https://milvus.io/docs/reranking.md">reranking 策略</a>結合，以提高相關性。</p>
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
<p>現在讓我們來看看查詢的搜尋結果。</p>
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
<h3 id="Generate-a-RAG-Answer-with-DeepSeek-V4" class="common-anchor-header">使用 DeepSeek V4 生成 RAG 答案</h3><p>將擷取的文件轉換成字串格式。</p>
<pre><code translate="no" class="language-python">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>定義 LLM 的系統和使用者提示。這個提示是由Milvus擷取的文件組合而成。</p>
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
<p>使用 DeepSeek V4-Pro 提供的模型，根據提示產生回應。</p>
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
<p>至此，管道已完成核心 RAG 環路：嵌入文件、在 Milvus 中儲存向量、搜尋相關上下文，並使用 DeepSeek V4-Pro 產生答案。</p>
<h2 id="What-Should-You-Improve-Before-Production" class="common-anchor-header">生產前應該改善什麼？<button data-href="#What-Should-You-Improve-Before-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>本演示使用了簡單的分段和 top-k 檢索。這足以展示其機制，但生產級的 RAG 通常需要更多的檢索控制。</p>
<table>
<thead>
<tr><th>生產需要</th><th>需要考慮的 Milvus 功能</th><th>為什麼有幫助</th></tr>
</thead>
<tbody>
<tr><td>混合語意和關鍵字信號</td><td><a href="https://milvus.io/docs/hybrid_search_with_milvus.md">與 Milvus 混合搜尋</a></td><td>結合密集向量檢索與稀疏或全文信號</td></tr>
<tr><td>合併來自多個檢索器的結果</td><td><a href="https://milvus.io/docs/milvus_hybrid_search_retriever.md">Milvus 混合搜尋擷取器</a></td><td>讓 LangChain 工作流程使用加權或 RRF 式排序</td></tr>
<tr><td>根據租戶、時戳或文件類型限制結果</td><td>元資料與標量篩選器</td><td>保持檢索範圍至正確的資料切片</td></tr>
<tr><td>從自我管理的 Milvus 移轉到管理服務</td><td><a href="https://docs.zilliz.com/docs/migrate-from-milvus">從 Milvus 遷移到 Zilliz</a></td><td>減少基礎架構工作，同時保持 Milvus 的相容性</td></tr>
<tr><td>安全連接託管的應用程式</td><td><a href="https://docs.zilliz.com/docs/manage-api-keys">Zilliz 雲 API 金鑰</a></td><td>為應用程式用戶端提供基於令牌的存取控制</td></tr>
</tbody>
</table>
<p>最重要的生產習慣是將擷取與產生分開評估。如果擷取的上下文很弱，交換 LLM 常常會掩蓋問題，而不是解決問題。</p>
<h2 id="Get-Started-with-Milvus-and-DeepSeek-RAG" class="common-anchor-header">開始使用 Milvus 和 DeepSeek RAG<button data-href="#Get-Started-with-Milvus-and-DeepSeek-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您想重現本教程，請從<a href="https://milvus.io/docs">Milvus</a>官方<a href="https://milvus.io/docs">文檔</a>和使用<a href="https://milvus.io/docs/build-rag-with-milvus.md">Milvus 建置 RAG 指南</a>開始。若要管理設定，請使用您的集群端點和 API key<a href="https://docs.zilliz.com/docs/connect-to-cluster">連線到 Zilliz Cloud</a>，而不是在本機執行 Milvus。</p>
<p>如果您需要協助調整分塊、索引、篩選器或混合檢索，請加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>或預約免費的<a href="https://milvus.io/office-hours">Milvus Office Hours 課程</a>。如果您想跳過基礎架構的設定，請使用<a href="https://cloud.zilliz.com/login">Zilliz Cloud 登入</a>或建立<a href="https://cloud.zilliz.com/signup">Zilliz Cloud 帳戶</a>來執行受管理的 Milvus。</p>
<h2 id="Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="common-anchor-header">開發人員問到關於DeepSeek V4、Milvus和RAG的問題<button data-href="#Questions-Developers-Ask-About-DeepSeek-V4-Milvus-and-RAG" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Is-DeepSeek-V4-good-for-RAG" class="common-anchor-header">DeepSeek V4適合RAG嗎？</h3><p>DeepSeek V4-Pro非常適合RAG，當您需要長內容處理以及比高級封閉模型更低的服務成本時。您仍然需要一個檢索層，例如 Milvus，來選擇相關的區塊、套用元資料篩選器，並保持提示的重點。</p>
<h3 id="Should-I-use-GPT-55-or-DeepSeek-V4-for-a-RAG-pipeline" class="common-anchor-header">RAG 管道應該使用 GPT-5.5 還是 DeepSeek V4？</h3><p>當答案品質、工具使用和即時研究比成本更重要時，請使用 GPT-5.5。當長內容處理和成本控制比較重要時，請使用 DeepSeek V4-Pro，特別是當您的檢索層已經提供高品質的基礎內容時。</p>
<h3 id="Can-I-run-Qwen36-35B-A3B-locally-for-private-RAG" class="common-anchor-header">我可以在本地運行Qwen3.6-35B-A3B進行私人RAG嗎？</h3><p>可以，Qwen3.6-35B-A3B 是開放式的，專為更可控的部署而設計。當需要保護隱私、本機服務、多模態輸入或中文效能時，Qwen3.6-35B-A3B 是一個很好的選擇，但您仍需要針對您的硬體來驗證延遲、記憶體和檢索品質。</p>
<h3 id="Do-long-context-models-make-vector-databases-unnecessary" class="common-anchor-header">長內容模型是否使向量資料庫變得不必要？</h3><p>長內容模型可以讀取更多文字，但仍可從檢索中獲益。向量資料庫可將輸入縮小為相關的區塊、支援元資料篩選、降低代幣成本，並使應用程式更容易在文件變更時更新。</p>
