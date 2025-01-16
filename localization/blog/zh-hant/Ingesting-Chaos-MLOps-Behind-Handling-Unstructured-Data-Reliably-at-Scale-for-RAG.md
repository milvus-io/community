---
id: >-
  Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
title: 接收混沌：以 RAG 的規模可靠處理非結構化資料背後的 MLOps
author: David Garnitz
date: 2023-10-16T00:00:00.000Z
cover: assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Retrieval Augmented Generation, RAG, Unstructured Data
recommend: true
desc: 透過 VectorFlow 和 Milvus 等技術，團隊可以有效率地跨不同環境進行測試，同時符合隱私權和安全性的要求。
canonicalUrl: >-
  https://milvus.io/blog/Ingesting-Chaos-MLOps-Behind-Handling-Unstructured-Data-Reliably-at-Scale-for-RAG.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ingesting_Chaos_20231017_110103_54fe2009cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>以各種想像得到的形式產生資料的速度比以往任何時候都快。這些資料是推動新一輪人工智慧應用程式的汽油，但這些增進生產力的引擎需要協助才能攝取這些燃料。圍繞著非結構化資料的各種情境與邊緣案例，使其在生產型人工智慧系統中的使用充滿挑戰。</p>
<p>首先，有大量的資料來源。這些資料來源以各種檔案格式匯出資料，每種格式都有其特殊性。例如，您處理 PDF 的方式會因 PDF 的來源而有很大差異。為證券訴訟案件擷取 PDF 可能會著重於文字資料。相反地，火箭工程師的系統設計規格則會充滿需要視覺處理的圖表。非結構化資料缺乏定義的模式，進一步增加了複雜性。即使克服了處理資料的挑戰，大規模擷取資料的問題仍然存在。檔案的大小可能差異很大，這就改變了處理的方式。您可以透過 HTTP 在 API 上快速處理 1MB 的上傳資料，但從單一檔案讀入數十 GB 的資料則需要串流和專用的工作人員。</p>
<p>要透過<a href="https://github.com/milvus-io/milvus">Milvus</a> 等<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫將</a>原始資料連接到<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM，</a>克服這些傳統資料工程的挑戰是不可能的。然而，新興的使用案例（例如在向量資料庫的協助下執行語意相似性搜尋）需要新的處理步驟，例如將原始資料分塊、為混合搜尋協調元資料、選擇合適的向量嵌入模型，以及調整搜尋參數以決定哪些資料要饋入 LLM。這些工作流程非常新穎，因此沒有既定的最佳實務可供開發人員遵循。相反地，他們必須進行實驗，才能找到適合其資料的正確配置和使用個案。為了加速這個過程，使用向量嵌入管道來處理向量資料庫的資料擷取是非常有價值的。</p>
<p>像<a href="https://github.com/dgarnitz/vectorflow">VectorFlow</a>這樣的向量嵌入管道可以將原始資料連接到向量資料庫，包括分塊、元資料協調、嵌入和上傳。VectorFlow 可讓工程團隊專注於核心應用程式邏輯，嘗試從嵌入模型、分塊策略、元資料欄位和搜尋的各個方面產生不同的檢索參數，看看哪個表現最佳。</p>
<p>在我們協助工程團隊將他們的<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">檢索擴增生成 (RAG)</a>系統從原型轉移至生產階段的工作中，我們發現以下方法可以成功測試 RAG 搜尋管道的不同參數：</p>
<ol>
<li>使用一小組您熟悉的資料以加快迭代速度，例如幾個 PDF 檔案，其中有搜尋查詢的相關區塊。</li>
<li>製作一組關於該資料子集的標準問題與答案。例如，在閱讀 PDF 之後，寫一份問題清單，並讓您的團隊就答案達成一致。</li>
<li>建立一個自動評估系統，對每個問題的檢索結果進行評分。其中一種方法是從 RAG 系統中取得答案，然後透過 LLM 將其運回，並提示此 RAG 結果是否回答了所給出的正確答案。這應該是一個「是」或「否」的答案。舉例來說，如果您的文件上有 25 個問題，而系統得到 20 個正確答案，您就可以以此作為其他方法的基準。</li>
<li>確保您使用的評估 LLM 與您用來編碼資料庫中儲存的向量內嵌的 LLM 不同。評估 LLM 通常是解碼器類型的模型，例如 GPT-4。需要記住的一件事是重複執行這些評估的成本。像 Llama2 70B 或 Deci AI LLM 6B 這樣的開放原始碼模型，可以在單一較小的 GPU 上執行，其效能大致相同，但成本卻很低。</li>
<li>多次執行每項測試，並求出平均分數，以消除 LLM 的隨機性。</li>
</ol>
<p>除了一個選項之外，其他選項都保持不變，您就可以快速確定哪些參數最適合您的使用情況。像 VectorFlow 這樣的向量嵌入管道，可以讓擷取方面的工作變得特別容易，您可以快速嘗試不同的分塊策略、分塊長度、分塊重疊，以及開放原始碼的嵌入模型，看看哪種結果最好。當您的資料集擁有需要自訂邏輯的各種檔案類型和資料來源時，這一點尤其有用。</p>
<p>一旦團隊知道什麼適合其使用個案，向量嵌入管道就能讓他們快速投入生產，而無需重新設計系統，以考慮可靠性和監控等問題。透過 VectorFlow 和<a href="https://zilliz.com/what-is-milvus">Milvus</a> 等開放原始碼且平台獨立的技術，該團隊可以有效率地在不同環境中進行測試，同時符合隱私權和安全性的要求。</p>
