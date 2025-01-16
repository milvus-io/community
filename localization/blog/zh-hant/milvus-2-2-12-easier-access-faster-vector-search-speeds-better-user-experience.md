---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: Milvus 2.2.12：更方便的存取、更快的向量搜尋速度和更好的使用者體驗
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們很高興地宣布 Milvus 2.2.12 的最新版本。這次更新包含多項新功能，例如支援 RESTful API、<code translate="no">json_contains</code> 功能，以及在 ANN 搜尋過程中因應使用者回饋的向量擷取功能。我們也簡化了使用者體驗、提升向量搜尋速度，並解決了許多問題。讓我們深入了解 Milvus 2.2.12 的功能。</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">支援 RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 現在支援 RESTful API，讓使用者不需安裝用戶端即可存取 Milvus，讓客戶端伺服器操作變得毫不費力。此外，由於 Milvus SDK 和 RESTful API 共用相同的連接埠號，部署 Milvus 變得更加方便。</p>
<p><strong>注意</strong>：我們仍然建議使用 SDK 來部署 Milvus 進階作業，或者如果您的業務對延遲敏感。</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">ANN 搜尋時的向量擷取<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>在早期版本中，Milvus 不允許在近似近鄰 (ANN) 搜尋期間進行向量擷取，以優先處理效能和記憶體使用。因此，原始向量的擷取必須分為兩個步驟：執行 ANN 搜尋，然後根據其 ID 查詢原始向量。這種方法增加了開發成本，也使用戶更難部署和採用 Milvus。</p>
<p>有了 Milvus 2.2.12，使用者可以在 ANN 搜尋過程中擷取原始向量，只要將向量欄位設定為輸出欄位，並在 HNSW、DiskANN 或 IVF-FLAT 索引的集合中進行查詢即可。此外，使用者可以預期更快的向量擷取速度。</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">支援 JSON 陣列上的操作<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>我們最近在 Milvus 2.2.8 中新增了對 JSON 的支援。自此之後，使用者提出許多要求，希望能支援其他 JSON 陣列操作，例如包含、排除、交集、聯合、差異等。在 Milvus 2.2.12 中，我們優先支援<code translate="no">json_contains</code> 函式來啟用包含操作。我們將繼續在未來的版本中增加對其他運算符號的支援。</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">增強功能和錯誤修正<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>除了引入新功能外，Milvus 2.2.12 還提高了向量搜索性能，降低了開銷，使其更容易處理廣泛的 topk 搜索。此外，它還加強了在啟用了分割區鑰匙和多分割區情況下的寫入性能，並優化了大型機器的 CPU 使用。 此更新解決了多個問題：磁碟使用率過高、壓縮卡住、資料刪除不頻繁，以及大量插入失敗。如需更多資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12 發行紀錄</a>。</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">讓我們保持聯繫<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
