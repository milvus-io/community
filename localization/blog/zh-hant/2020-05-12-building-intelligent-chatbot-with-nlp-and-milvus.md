---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: 整體架構
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: 下一代 QA Bot 在此
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>使用 NLP 和 Milvus 建立智慧 QA 系統</custom-h1><p>Milvus 計畫：github.com/milvus-io/milvus</p>
<p>問題回答系統常用於自然語言處理領域。它用於回答自然語言形式的問題，應用範圍非常廣泛。典型的應用包括：智慧型語音互動、線上客服、知識獲取、個人化情感聊天等。大多數的問題回答系統可以分為：產生式問題回答系統和檢索式問題回答系統、單輪問題回答系統和多輪問題回答系統、開放式問題回答系統和特定問題回答系統。</p>
<p>本文主要討論針對特定領域所設計的問答系統，也就是通常所說的智慧客服機器人。過去，建構客服機器人通常需要將領域知識轉換成一系列的規則和知識圖表。建構過程非常依賴「人」的智慧。一旦場景改變，就需要進行大量的重複工作。 透過深度學習在自然語言處理 (NLP) 中的應用，機器閱讀可以直接從文件中自動找到匹配問題的答案。深度學習的語言模型會將問題與文件轉換成語意向量，從而找出匹配的答案。</p>
<p>本文利用 Google 開源的 BERT 模型與開源向量搜尋引擎 Milvus，快速建構一個以語意理解為基礎的問答機器人。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">整體架構<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>本文透過語意相似性比對來實作一個問答系統。一般建構流程如下：</p>
<ol>
<li>取得大量在特定領域有答案的問題（標準問題集）。</li>
<li>使用 BERT 模型將這些問題轉換成特徵向量，並儲存在 Milvus 中。而 Milvus 會同時為每個特徵向量指定一個向量 ID。</li>
<li>在 PostgreSQL 中儲存這些具有代表性的問題 ID 及其對應的答案。</li>
</ol>
<p>當使用者提出問題時：</p>
<ol>
<li>BERT 模型會將其轉換為特徵向量。</li>
<li>Milvus 執行相似性搜尋，並擷取與問題最相似的 ID。</li>
<li>PostgreSQL 會傳回相對應的答案。</li>
</ol>
<p>系統架構圖如下（藍線代表匯入流程，黃線代表查詢流程）：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>接下來，我們將教您如何逐步建立線上問答系統。</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">建立問答系統的步驟<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>在開始之前，您需要安裝 Milvus 和 PostgreSQL。具體的安裝步驟，請參閱 Milvus 官方網站。</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1.資料準備</h3><p>本文的實驗資料來自：https://github.com/chatopera/insuranceqa-corpus-zh</p>
<p>该数据集包含与保险行业相关的问答数据对。本文將從中抽取 20,000 個問題和答案對。透過這套問答資料集，您可以快速建立一個保險業的客服機器人。</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2.產生特徵向量</h3><p>本系統使用 BERT 已經預先訓練好的模型。在開始服務之前，請從以下連結下載： https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>使用此模型將問題資料庫轉換為特徵向量，以便日後進行相似性搜索。有關 BERT 服務的更多資訊，請參閱 https://github.com/hanxiao/bert-as-service。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3.匯入 Milvus 和 PostgreSQL</h3><p>將產生的特徵向量匯入到 Milvus，再將 Milvus 傳回的 ID 和相對應的答案匯入 PostgreSQL。以下為 PostgreSQL 中的表結構：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4.讀取答案</h3><p>使用者輸入一個問題，透過 BERT 產生特徵向量後，就可以在 Milvus 的資料庫中找到最相似的問題。本文使用余弦距離來表示兩個句子之間的相似度。由於所有向量都經過歸一化處理，因此兩個特徵向量的余弦距離越接近 1，相似度就越高。</p>
<p>實際上，您的系統資料庫中可能沒有完全匹配的問題。那麼，您可以設定臨界值為 0.9。如果擷取到的最大相似距離小於這個臨界值，系統就會提示不包含相關的問題。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answers.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">系統示範<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>以下是系統的範例介面：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>在對話方塊中輸入您的問題，您將收到相應的答案：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>閱讀完這篇文章後，我們希望您會發現建立自己的 Q&amp;A 系統非常容易。</p>
<p>使用 BERT 模型，您不再需要事先分類和組織文字庫。同時，由於開放原始碼向量搜尋引擎 Milvus 的高效能和高擴充性，您的 QA 系統可以支援多達上億個文字的語料庫。</p>
<p>Milvus 已正式加入 Linux AI (LF AI) 基金會進行孵化。歡迎您加入 Milvus 社群，與我們一起加速人工智能技術的應用！</p>
<p>=&gt; 請在這裡試用我們的線上示範：https://www.milvus.io/scenarios</p>
