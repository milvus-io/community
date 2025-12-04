---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: Milvus 的 JSON 切碎：靈活的 JSON 過濾速度快 88.9 倍
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: 探索 Milvus JSON Shredding 如何使用最佳化的列式儲存，在保留完整模式彈性的同時，將 JSON 查詢速度提升高達 89 倍。
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>現代人工智能系統產生的半結構化 JSON 資料比以往任何時候都多。客戶和產品資訊被壓縮為 JSON 物件，微服務會在每次請求時發出 JSON 日誌，IoT 裝置會在輕量級 JSON 有效負載中串流感測器讀數，而今日的 AI 應用程式也越來越多地標準化 JSON 作為結構化的輸出。結果就是大量類似 JSON 的資料流入向量資料庫。</p>
<p>傳統上，有兩種方式可以處理 JSON 文件：</p>
<ul>
<li><p><strong>將 JSON 的每個欄位預先定義為固定的模式，並建立索引：</strong>此方法可提供穩定的查詢效能，但很僵化。一旦資料格式改變，每個新欄位或修改過的欄位都會引發另一輪痛苦的資料定義語言 (DDL) 更新和模式轉換。</p></li>
<li><p><strong>將整個 JSON 物件儲存為單一列（Milvus 的 JSON 類型和動態模式都使用這種方法）：</strong>此選項提供極佳的靈活性，但以查詢效能為代價。每次請求都需要執行 JSON 解析，並經常需要進行完整的資料表掃描，導致延遲會隨著資料集的成長而激增。</p></li>
</ul>
<p>這曾經是靈活性和效能的兩難選擇。</p>
<p>有了<a href="https://milvus.io/">Milvus</a> 新推出的 JSON Shredding 功能，就不會再出現這種情況了。</p>
<p>隨著<a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a> 功能的推出，Milvus 現在能夠以列式儲存的效能達到無模式的靈活性，最終使大型半結構化資料變得既靈活又方便查詢。</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">JSON Shredding 如何運作<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON 切碎可將以行為基礎的 JSON 文件轉換為高度最佳化的列式儲存，從而加快 JSON 查詢速度。Milvus 保留 JSON 用於資料建模的彈性，同時自動最佳化列式儲存 - 大幅改善資料存取與查詢效能。</p>
<p>為了有效率地處理稀疏或罕見的 JSON 欄位，Milvus 還為共用鍵提供了反向索引。所有這些對使用者來說都是透明的：您可以像往常一樣插入 JSON 文件，並交由 Milvus 在內部管理最佳的儲存和索引策略。</p>
<p>當 Milvus 接收到具有不同形狀和結構的原始 JSON 記錄時，它會分析每個 JSON 關鍵的出現比率和類型穩定性（其資料類型在各文件中是否一致）。基於這項分析，每個關鍵詞會被歸類為三個類別之一：</p>
<ul>
<li><p><strong>類型鍵：</strong>出現在大多數文件中，且總是具有相同資料類型的關鍵（例如，所有整數或所有字串）。</p></li>
<li><p><strong>動態鍵</strong>：經常出現但具有混合資料類型的關鍵 (例如：有時是字串，有時是整數)。</p></li>
<li><p><strong>共用鍵：</strong>不常出現、稀疏或巢狀的鍵，低於可設定的頻率臨界值。</p></li>
</ul>
<p>Milvus 以不同方式處理每個類別，以達到最高效率：</p>
<ul>
<li><p><strong>類型鍵儲</strong>存在專用的強類型列中。</p></li>
<li><p><strong>動態鍵則</strong>根據執行時觀察到的實際值類型，放置在動態列中。</p></li>
<li><p>類型欄和動態欄都以 Arrow/Parquet 欄格式儲存，以便快速掃描和高度最佳化的查詢執行。</p></li>
<li><p><strong>共用</strong>鍵被整合到一個精簡的二進位 JSON 欄中，並隨附一個共用鍵反向索引。此索引可加速低頻欄位的查詢，方法是及早剪除不相關的行，並將搜尋範圍限制為僅包含查詢關鍵字的文件。</p></li>
</ul>
<p>這種自適應列式儲存與倒轉式索引的結合，形成了 Milvus JSON 切碎機制的核心，可同時實現彈性與高效能的規模。</p>
<p>整體工作流程如下圖所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>既然我們已經介紹了 JSON Shredding 的基本運作方式，現在讓我們仔細看看讓此方法兼具彈性與高效能的關鍵功能。</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">切碎和列化</h3><p>當寫入一個新的 JSON 文件時，Milvus 會將其分解並重組成最佳化的列式儲存：</p>
<ul>
<li><p>類型和動態鍵會被自動識別並儲存在專門的列中。</p></li>
<li><p>如果 JSON 包含巢狀物件，Milvus 會自動產生基於路徑的列名。例如，<code translate="no">user</code> 物件內的<code translate="no">name</code> 欄位可以用列名<code translate="no">/user/name</code> 來儲存。</p></li>
<li><p>共用鍵會儲存在單一、精簡的二進制 JSON 欄中。由於這些鍵出現的頻率不高，Milvus 會為它們建立反向索引，以實現快速篩選，並允許系統快速找到包含指定鍵的資料列。</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">智慧型欄位管理</h3><p>除了將 JSON 切碎成列之外，Milvus 還透過動態列管理增加了一層智能，確保 JSON 切碎能夠隨著資料的演變而保持靈活性。</p>
<ul>
<li><p><strong>根據需要建立欄：</strong>當新的鍵出現在傳入的 JSON 文件中時，Milvus 會自動將具有相同鍵的值組合到專用列中。這可保留列式儲存的效能優勢，而不需要使用者事先設計模式。Milvus 也會推斷新欄位的資料類型 (例如 INTEGER、DOUBLE、VARCHAR)，並為它們選擇有效率的列格式。</p></li>
<li><p><strong>每個 key 都會自動處理：</strong>Milvus 會分析並處理 JSON 文件中的每個關鍵字。這可確保廣泛的查詢涵蓋範圍，而不會強迫使用者事先定義欄位或建立索引。</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">查詢最佳化</h3><p>一旦資料被重新組織到正確的欄位，Milvus 會為每個查詢選擇最有效的執行路徑：</p>
<ul>
<li><p><strong>直接列掃描鍵入和動態鍵：</strong>如果查詢的目標欄位已經被分割成自己的欄位，Milvus 可以直接掃描該欄位。這可減少需要處理的資料總量，並利用 SIMD 加速列運算，使執行速度更快。</p></li>
<li><p><strong>共用鍵的索引查詢：</strong>如果查詢所涉及的欄位沒有升級為自己的欄位，通常是罕見的key，Milvus 會針對共用key 的欄位來評估查詢。在此列上建立的反向索引可讓 Milvus 快速識別哪些行包含指定的關鍵，並跳過其他行，大幅提升低頻欄位的效能。</p></li>
<li><p><strong>自動元資料管理：</strong>Milvus 持續維護全局元資料和字典，即使傳入的 JSON 文件結構隨時間演變，查詢仍能保持精確和高效。</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">效能基準<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>我們設計了一個基準，比較將整個 JSON 文件儲存為單一原始欄位與使用新發佈的 JSON Shredding 功能的查詢效能。</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">測試環境與方法</h3><ul>
<li><p>硬體：1 核/8GB 集群</p></li>
<li><p>資料集：來自<a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a>的 100 萬個文件</p></li>
<li><p>方法：測量不同查詢模式的 QPS 和延遲</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">結果：鍵入</h3><p>此測試測量查詢大多數文件中存在的關鍵時的效能。</p>
<table>
<thead>
<tr><th>查詢表達</th><th>QPS (未粉碎)</th><th>QPS (有切碎)</th><th>效能提升</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">結果：共用鍵</h3><p>此測試的重點是查詢屬於 「共用」 類的稀疏嵌套鍵。</p>
<table>
<thead>
<tr><th>查詢表達</th><th>QPS (不粉碎)</th><th>QPS (有切碎)</th><th>效能提升</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Shared-key 查詢顯示出最顯著的改進 (快達 89 倍)，而 typeed-key 查詢則持續提供 15-30 倍的速度提升。總體而言，每種查詢類型都能從 JSON Shredding 中獲益，整體效能提升十分明顯。</p>
<h2 id="Try-It-Now" class="common-anchor-header">立即試用<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>無論您處理的是 API 日誌、物聯網感測器資料，或是快速演進的應用程式有效負載，JSON Shredding 都能讓您同時擁有難得的彈性與高效能。</p>
<p>此功能現已推出，歡迎立即試用。您也可以查看<a href="https://milvus.io/docs/json-shredding.md">此文件</a>以瞭解更多詳細資訊。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
<p>如果您想要探索更多，請密切注意 Milvus Week 系列的深入探討。</p>
