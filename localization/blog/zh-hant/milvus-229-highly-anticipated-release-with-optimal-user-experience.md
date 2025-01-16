---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: Milvus 2.2.9：令人期待的最佳使用者體驗版本
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們非常興奮地宣布 Milvus 2.2.9 的到來，這個萬眾期待的版本標誌著團隊和社群的重要里程碑。此版本提供許多令人振奮的功能，包括期待已久的 JSON 資料類型、動態模式和分割鍵支援，確保最佳化的使用者體驗和簡化的開發工作流程。此外，此版本還納入了許多增強功能和錯誤修正。請與我們一起探索 Milvus 2.2.9，並發現此版本為何如此令人振奮。</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">透過 JSON 支援優化使用者體驗<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 引進了備受期待的 JSON 資料類型支援，讓 JSON 資料與向量的元資料一起無縫儲存於使用者的資料集中。有了這項強化功能，使用者可以有效率地大量插入 JSON 資料，並根據 JSON 欄位的內容執行進階查詢與篩選。此外，使用者還可利用表達式，針對資料集的 JSON 欄位執行操作、建構查詢，以及根據 JSON 欄位的內容和結構套用篩選程式，從而擷取相關資訊並更好地處理資料。</p>
<p>未來，Milvus 團隊將為 JSON 類型內的欄位新增索引，進一步優化混合標量與向量查詢的效能。敬請期待未來令人振奮的發展！</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">支援動態模式，增加彈性<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>由於支援 JSON 資料，Milvus 2.2.9 現在透過簡化的軟體開發套件 (SDK) 提供動態模式功能。</p>
<p>從 Milvus 2.2.9 開始，Milvus SDK 包含一個高階 API，可自動將動態欄位填入集合的隱藏 JSON 欄位，讓使用者只需專注於其業務欄位。</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">利用分區鑰匙更好地分離資料並加強搜尋效率<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 透過引入 Partition Key 功能，增強了其分區功能。它允許用戶特定列作為分區的主鍵，省去了額外的 API，如<code translate="no">loadPartition</code> 和<code translate="no">releasePartition</code> 。這項新功能還取消了對分區數量的限制，從而提高了資源利用效率。</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">支援阿里雲 OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 現在支援阿里巴巴雲物件儲存服務 (OSS)。Alibaba Cloud 使用者可輕鬆將<code translate="no">cloudProvider</code> 設定至 Alibaba Cloud，並利用無縫整合的優勢，在雲端有效率地儲存與擷取向量資料。</p>
<p>除了前面提到的功能外，Milvus 2.2.9還提供了基於角色的存取控制（RBAC）中的數據庫支援，引入了連接管理，並包含多個增強功能和錯誤修復。如需更多資訊，請參閱<a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 發行紀錄</a>。</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">讓我們保持聯繫<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您有任何關於 Milvus 的問題或回饋，請隨時透過<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 聯絡我們。也歡迎您加入我們的<a href="https://milvus.io/slack/">Slack 頻道</a>，直接與我們的工程師和社群聊天，或查看我們的<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">週二辦公時間</a>！</p>
