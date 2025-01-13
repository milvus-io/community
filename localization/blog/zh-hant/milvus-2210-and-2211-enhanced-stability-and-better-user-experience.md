---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: Milvus 2.2.10 &amp; 2.2.11：增強系統穩定性和使用者體驗的小更新
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: 介紹 Milvus 2.2.10 和 2.2.11 的新功能和改進
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您好，Milvus 的粉絲們！我們很高興地宣布，我們剛剛發布了 Milvus 2.2.10 和 2.2.11，這兩個小更新主要集中在錯誤修復和整體性能改進。您可以期待這兩個更新會帶來更穩定的系統和更好的使用者體驗。讓我們快速瞭解這兩個版本的新功能。</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 修正了偶爾發生的系統當機問題、加速載入和索引、降低資料節點的記憶體使用量，並做了許多其他改進。以下是一些值得注意的變更：</p>
<ul>
<li>以純 Go 寫成的新程式取代舊的 CGO payload writer，減少資料節點的記憶體使用量。</li>
<li>新增<code translate="no">go-api/v2</code> 至<code translate="no">milvus-proto</code> 檔案，以避免與不同<code translate="no">milvus-proto</code> 版本混淆。</li>
<li>將 Gin 從 1.9.0 版升級至 1.9.1 版，以修正<code translate="no">Context.FileAttachment</code> 函式中的錯誤。</li>
<li>針對 FlushAll 和資料庫 API 新增了基於角色的存取控制 (RBAC)。</li>
<li>修正 AWS S3 SDK 所導致的隨機當機問題。</li>
<li>改善了載入和索引的速度。</li>
</ul>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10 發行紀錄</a>。</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 解決了多個問題，以提高系統的穩定性。它還改善了監控、日誌、速率限制和截取跨叢集請求的性能。請參閱以下本次更新的重點。</p>
<ul>
<li>為 Milvus GRPC 伺服器新增攔截器，以防止跨叢集 (Cross-Cluster) 路由的任何問題。</li>
<li>新增錯誤代碼到 minio chunk manager，讓診斷和修正錯誤更容易。</li>
<li>使用單一 coroutine 池，以避免浪費 coroutines，並最大限度地利用資源。</li>
<li>啟用 zstd 壓縮功能，將 RocksMq 的磁碟使用量降低到原本的十分之一。</li>
<li>修正了在載入過程中 QueryNode 偶爾出現的恐慌。</li>
<li>修正了讀取請求節流的問題，該問題是由於計算了兩次佇列長度而導致的。</li>
<li>修正了在 MacOS 上 GetObject 返回空值的問題。</li>
<li>修正了錯誤使用 noexcept 修改器所導致的當機問題。</li>
</ul>
<p>如需詳細資訊，請參閱<a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11 發行紀錄</a>。</p>
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
    </button></h2><p>如果您有任何關於 Milvus 的問題或回饋，請隨時透過<a href="https://twitter.com/milvusio">Twitter</a>或<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> 與我們聯繫。也歡迎您加入我們的<a href="https://milvus.io/slack/">Slack 頻道</a>，直接與我們的工程師和社群聊天，或查看我們的<a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">週二辦公時間</a>！</p>
