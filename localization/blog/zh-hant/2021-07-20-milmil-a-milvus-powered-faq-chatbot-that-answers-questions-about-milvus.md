---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: MilMil 由 Milvus 驅動的常見問題聊天機器人，可回答有關 Milvus 的問題
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: 使用開放原始碼向量搜尋工具建立問題解答服務。
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil：由 Milvus 驅動的常見問題聊天機器人，回答關於 Milvus 的問題</custom-h1><p>最近，Milvus 開源社群創造了 MilMil - 一個由 Milvus 使用者打造、為 Milvus 使用者服務的 Milvus 常見問題聊天機器人。MilMil 可全天候在<a href="https://milvus.io/">Milvus.io</a>上回答關於 Milvus 的常見問題，Milvus 是全球最先進的開放原始碼向量資料庫。</p>
<p>這個問題解答系統不僅能幫助更快速地解決 Milvus 使用者遇到的常見問題，還能根據使用者提交的資料找出新的問題。MilMil 的資料庫包括使用者自該專案於 2019 年首次以開源授權釋出後所提出的問題。問題儲存在兩個集合中，一個是 Milvus 1.x 及更早版本的集合，另一個是 Milvus 2.0 的集合。</p>
<p>MilMil 目前只有英文版本。</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">MilMil 如何運作？<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil 依賴<em>句子轉換器 (sentence-transformers/paraphrase-mpnet-base-v2)</em>模型來取得常見問題資料庫的向量表示，然後再使用 Milvus 進行向量相似性檢索，以傳回語義上相似的問題。</p>
<p>首先，使用自然語言處理 (NLP) 模型 BERT 將常見問題資料轉換成語意向量。然後，將嵌入向量插入 Milvus，並為每個向量指定唯一的 ID。最後，問題和答案會連同向量 ID 一起插入關係資料庫 PostgreSQL。</p>
<p>當使用者提交問題時，系統會使用 BERT 將其轉換為特徵向量。接下來，系統會在 Milvus 中搜尋與查詢向量最相似的五個向量，並擷取它們的 ID。最後，與擷取的向量 ID 相對應的問題和答案會傳送給使用者。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>系統流程.png</span> </span></p>
<p>請參閱 Milvus Bootcamp 中的<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">問題回答系統</a>專案，探索用於建立 AI 聊天機器人的程式碼。</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">詢問 MilMil 關於 Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>要與 MilMil 聊天，請瀏覽<a href="https://milvus.io/">Milvus.io</a>上的任何頁面，然後按一下右下角的鳥圖示。在文字輸入框中輸入您的問題，然後按下傳送。MilMil 會在幾毫秒內回覆您！此外，左上角的下拉清單可用於切換 Milvus 不同版本的技術文件。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>提交問題後，機器人會立即返回三個與查詢問題語義相似的問題。您可以按一下「See answer」來瀏覽問題的潛在答案，或按一下「See more」來檢視更多與您的搜尋相關的問題。如果沒有合適的答案，請按一下「在此填入您的意見」，提出您的問題，並附上電子郵件地址。Milvus 社群的協助將很快送達！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>聊天機_UI.png</span> </span></p>
<p>試試 MilMil，讓我們知道您的想法。歡迎所有問題、意見或任何形式的回饋。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">不要成為陌生人<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a> 與社群互動。</li>
<li>在<a href="https://twitter.com/milvusio">Twitter</a> 上與我們連線。</li>
</ul>
