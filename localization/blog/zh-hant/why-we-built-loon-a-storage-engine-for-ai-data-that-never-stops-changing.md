---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: |
  為何我們開發了 Loon：一款專為不斷變化的 AI 資料所設計的儲存引擎。
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon 是 Milvus 3.0 和 Zilliz Vector Lakebase 的一款全新儲存引擎，旨在透過 ColumnGroups、列 ID
  對齊以及 Manifests 來管理不斷演變的向量資料集。
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>這篇部落格文章最初發表於 zilliz.com，並經授權後重新發布。</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">重點摘要<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>這是一篇長篇且深入的工程探討，因此在進入細節之前，先來看看重點摘要。</p>
<ul>
<li>AI 資料集並非靜態的表格。隨著團隊更換嵌入模型、新增稀疏向量、修訂圖說、補全標籤、重建索引以及執行離線分析，相同的資料列會不斷變化。</li>
<li>傳統的儲存佈局存在三項缺陷：長向量欄位會使標籤補全成本高昂；單一檔案格式無法同時妥善支援掃描與點讀取；而私有資料庫儲存方式則迫使外部處理管線必須建立「真實資料」的額外副本。</li>
<li>Loon 是 Milvus 和 Zilliz Vector Lakebase 的新儲存引擎。它以混合檔案格式、行 ID 對齊，以及定義資料集版本狀態的「清單（Manifest）」為核心建構而成。</li>
<li>其目標是讓單一向量資料集能夠支援線上搜尋、離線分析、回填、壓縮及外部運算，而無需不斷複製、重寫或重新匯入資料。</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">引言<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>有一段時間，曾有一項針對向量資料庫的反對論點聽起來頗為合理。</p>
<p><em>傳統資料庫已經能儲存整數、字串、JSON、大二進位物件（blobs）和索引。何不直接新增</em> <em>一個 `</em> <code translate="no">_vector_</code> <em>` 類型，在旁邊建立一個人工神經網路（ANN）索引，就此大功告成？</em></p>
<p>對於早期的語義搜尋而言，這種做法確實足夠應付。一個向量欄位加上一個索引，便能支援示範、小型 RAG 應用程式或內部搜尋功能。問題出現在後續階段，當資料集的運作模式逐漸不再像資料表，而更像一個 AI 資料系統時。</p>
<p>生產環境中的向量資料集具有資料列、主鍵、標量欄位以及可查詢的欄位。從這個角度來看，它就像是一張資料庫資料表。 但它同時具備資料湖的規模與工作流程架構。它可能包含數億筆記錄，並會被 Spark、Ray、DuckDB、訓練管線、評估任務以及資料品質系統反覆讀取與重寫。</p>
<p>它同時依賴物件儲存。來源物件通常是影片、圖片、PDF、音訊檔案或網頁文件，這些資料會保留在 S3、GCS、OSS 或其他物件儲存系統中。 資料庫儲存的是參考資訊、元資料、衍生特徵以及索引。接著，它將傳統儲存模型原本無法管理的事物，作為一等物件納入其中：密集嵌入向量、稀疏向量、圖說、向量索引、文字索引、刪除日誌、統計資料、模型版本、解析器版本、外部二進位大物件（blob）參考，以及它們之間的所有版本關聯。</p>
<p><strong>這正是「只需新增一個向量欄位」這種做法開始失效之處。</strong>問題不在於資料庫能否儲存向量位元組——許多系統都能做到。更棘手的問題在於<strong>，儲存模型能否處理向量資料的變動方式、查詢方式，以及在 AI 資料堆疊中的共享方式。</strong></p>
<p><strong>這正是我們開發 Loon 的原因——這是 Milvus 以及</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>（Zilliz Cloud 的下一代演進）</strong><strong>所採用的新儲存引擎</strong> <strong>。</strong></p>
<p>Loon 的設計基於三大理念：</p>
<ol>
<li>針對不同類型的欄位採用不同的物理格式。</li>
<li>透過共享的列 ID 空間來對齊這些欄位。</li>
<li>使用清單（Manifest）來定義資料集的版本化狀態。</li>
</ol>
<p>要了解這些要素為何重要，讓我們先從一個常見的多模態工作流程開始說明。</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">向量資料集其實永遠不會真正完成。<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>試想一個 AI 團隊正在建立用於多模態訓練的影片資料集。</p>
<p>一段長影片被上傳至物件儲存。一條處理管線會根據場景變化、鏡頭邊界或時間區間，將其分割成片段。過長或過短、模糊、重複或畫質不佳的片段會被過濾掉。 剩下的片段會由美學模型進行評分、由另一個模型生成字幕、透過視覺語言模型進行嵌入，並儲存於向量資料庫中，以便進行搜尋、去重及訓練資料篩選。</p>
<p>從高層次來看，這個工作流程看似簡單：</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>但資料集並非一開始就已完整成形。</p>
<ul>
<li>在第一週，資料表中可能僅包含<code translate="no">clip_id</code> 、<code translate="no">video_id</code> 、<code translate="no">start_offset</code> 以及<code translate="no">duration</code> 。</li>
<li>第二週，團隊新增了<code translate="no">aesthetic_score</code> 。</li>
<li>第三週，運行字幕生成模型，每個片段都會獲得一個<code translate="no">caption</code> 。</li>
<li>第四週，第一個嵌入模型上線，每個片段都獲得一個 768 維度的 CLIP 嵌入向量。</li>
<li>一個月後，團隊更換模型並回溯補充<code translate="no">embedding_v2</code> ，此時維度已提升至 1024 維。</li>
<li>兩個月後，由於混合搜尋成為必要條件，團隊因此新增了一欄稀疏向量。</li>
<li>三個月後，字幕需經人工審查，並必須就地修正。</li>
</ul>
<p>這套資料集從未真正完成。它不斷累積著對同一組底層資料列的新詮釋。</p>
<p>這正是向量資料與傳統商業資料之間的關鍵差異之一：同一行資料會被反覆重新處理。而規模的擴大，更將此從一種不便轉變為儲存問題：多模態資料集的規模往往不是數百萬筆記錄，而是數億甚至數十億筆。 LAION-5B 提供了有用的參考範例——數十億組圖像-文字對，每組都包含元資料、圖說和嵌入向量。因此，難點不在於首次插入。真正的難點在於資料集開始演變後所發生的所有事情<strong>。這種演變揭露了三個問題。</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">第一個問題：長欄位導致寫入放大效應的成本高昂<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>像 Parquet 這樣的欄位式格式對於許多分析工作負載而言非常出色。當資料結構相對穩定、讀取頻率高於重寫、掃描僅涉及部分欄位，且壓縮效果顯著時，它們便能發揮良好效能。這正是許多分析格式所針對優化的情境。</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">向量行比分析行寬得多</h3><p>TPC-H<code translate="no">lineitem</code> 是一個很好的基準。它包含 16 個欄位：整數鍵、十進位數值、日期、短字串，以及一個小型註解欄位。 一行未壓縮的資料約為 150 位元組。壓縮後，其大小可能會小得多。以 64 MB 的行群組為例，儲存系統可將數十萬行資料壓縮至一個群組中。</p>
<p><strong>向量資料集的樣貌則截然不同。</strong></p>
<p>LAION 風格的圖像-文字資料集，則更接近當今許多 AI 處理管線所產出的結果。每行仍包含一般的元資料：網址、圖說、寬度、高度、品質分數、標籤等。但一旦加入嵌入向量，該行的物理結構便會發生變化。</p>
<p>一個 768 維的 CLIP 向量在 fp16 格式下約佔 1.5 KB，在 fp32 格式下則約佔 3 KB。僅這一欄的佔用空間，就可能遠大於整個 TPC-H<code translate="no">lineitem</code> 資料表中的一整行。</p>
<p>而且以當今的標準來看，768 維度既不罕見也不算大。在多模態處理流程中，1024 或 2048 維度的嵌入向量十分常見。OpenAI 的<code translate="no">text-embedding-3-large</code> 最高可達 3072 維度，以 fp32 格式計算，每個向量約佔 12 KB。</p>
<p>對比結果十分鮮明：</p>
<table>
<thead>
<tr><th>資料集形狀</th><th>近似行大小</th><th>行中佔主導地位的元素</th></tr>
</thead>
<tbody>
<tr><td>TPC-H 明細項目</td><td>~150 位元組（未壓縮）</td><td>標量與短字串欄位</td></tr>
<tr><td>LAION 風格的資料列，包含 768 維 fp16 向量</td><td>約 1.5 KB+</td><td>嵌入</td></tr>
<tr><td>LAION 風格的行，包含 768 維 fp32 向量</td><td>約 3 KB+</td><td>嵌入</td></tr>
<tr><td>包含 3072 維 fp32 向量的行</td><td>僅向量部分約 12 KB+</td><td>嵌入</td></tr>
</tbody>
</table>
<p>在許多 AI 資料集中，向量欄位不僅僅是另一個欄位。從物理層面來看，它佔據了整行的大部分空間。這會改變資料結構演進的成本。</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">新增一欄向量可能意味著數百吉字節的數據量</h3><p>假設某資料集包含 1 億個影片片段。新增一個 1024 維度的 fp32 嵌入向量欄位，意味著需寫入約 400 GB 的原始向量資料。這還不包括統計資料、索引、元資料更新、物件儲存開銷、驗證，以及服務路徑整合等成本。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>若團隊每月新增一至兩欄向量類欄位（例如<code translate="no">embedding_v2</code> 、<code translate="no">sparse_vector</code> 或重新排序特徵），資料結構演進將成為一項以數百吉字節或太字節為單位的定期資料工程任務。</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">微小的邏輯更新可能觸發大規模的物理重寫</h3><p>更新同樣至關重要。</p>
<p>在列式系統中，舊資料通常不會就地更新。刪除日誌會記錄變更內容，而後續的壓縮作業會將活躍的資料列重寫至新檔案中。當資料列較小時，這種模式尚可管理。</p>
<p>但在向量資料中，一項微小的邏輯更新便可能觸發大規模的物理重寫。</p>
<p>一項人工審核任務可能僅修正圖說中的幾百位元組。但如果圖說、密集向量、稀疏向量及其他衍生特徵共享相同的物理檔案生命週期，系統最終可能會連同向量一併重寫。邏輯變更雖小，但物理 I/O 卻可能極為龐大。</p>
<p>這就是向量儲存中的「寫入放大」問題。其成本高昂之處不僅在於向量體積龐大，更在於大型衍生欄位與小型可變欄位，往往因儲存佈局將其視為單一單位而緊密綁定在一起。</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">對於 AI 資料集而言，後補資料是一項例行工作負載</h3><p>對於傳統分析資料表，資料結構演進可能僅偶爾發生；但對 AI 資料集而言，這卻是常態。標籤模型會升級、嵌入式模型會被替換、稀疏向量會於後續新增、重新排序特徵會出現、人工標籤會被修正、治理標籤會被回填，索引也會被重建。</p>
<p>這些操作並非單純的追加，而是經常會修改或擴展現有資料列。</p>
<p>正因如此，向量儲存系統不僅要優化掃描吞吐量，還必須降低後補與部分更新的成本。</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">第二個問題：同一組資料必須同時支援掃描與點讀取<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>資料寫入後，讀取路徑便會分流。同一組向量資料集通常具有兩種截然不同的存取模式：<strong>分析性掃描與點讀取。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">分析型工作負載需要寬範圍、壓縮的掃描</h3><p>一條處理管線可能會執行以下篩選操作：</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>或者執行離線分析、完整嵌入向量評估、BM25 統計、位圖建構、資料品質檢查、計數以及分組操作。</p>
<p>此模式會讀取大量列，但僅讀取少數欄。它適合序貫 I/O、較大的列群組、壓縮、欄位修剪、批次解碼以及向量化執行。</p>
<p>較大的行群組在此處大有幫助。它們能讓單一 I/O 請求提取大量有用資料，提升壓縮效率，並為執行引擎提供足夠的連續資料以分攤開銷。當同時讀取多欄時，為提升掃描吞吐量而保持欄位組織有序，也有助於減少向量化執行期間的快取未命中。</p>
<p>Parquet 在這方面表現出色。</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">ANN 結果需要狹窄的行級查詢</h3><p>在人工神經網路（ANN）搜尋返回候選行 ID 之後，系統通常需要擷取以下類型的欄位：</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>此模式讀取的資料列較少，通常僅數百或數千筆，但需要透過資料列 ID 進行精確存取。其目標是定位特定的資料列與欄位，僅擷取所需的位元組範圍，並避免為了檢索少量記錄而拉取整個資料列群組。</p>
<p>點查詢（Point lookup）在掃描方面的偏好幾乎與此相反。它需要更小的讀取粒度。理想情況下，儲存層能透過行 ID 找到相關的區段或位元組範圍，僅讀取該範圍，並僅解碼結果所需的数据。</p>
<p>壓縮技術也面臨不同的權衡取捨。對於掃描操作，較高的壓縮率通常是值得的，因為系統會讀取大量資料並節省 I/O 資源；但對於點查詢，若檢索一行資料卻需要解碼遠大於該行的壓縮區塊，壓縮反而可能成為負擔。</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">一種佈局無法同時針對這兩種路徑進行優化</h3><p>這正是核心的矛盾所在。標量篩選與分析需要寬度大、經過壓縮且適合掃描的佈局；向量查詢則需要窄度高、精確且可按列尋址的佈局。</p>
<p>單一檔案格式雖能在某種程度上同時支援這兩種需求，但無法同時對兩者都達到最佳化。</p>
<p>若所有欄位皆存於 Parquet 中，標量掃描將游刃有餘。但回調後的 ANN 查詢則會變得更加困難。系統可能僅需幾百個向量、標題或元資料記錄，而儲存層卻可能必須讀取包含大量無關資料列的大型資料列群組。</p>
<p>在本地 SSD 上，快取和 mmap 可以隱藏部分此類開銷。一旦資料儲存於物件儲存中，此開銷便會更加顯著。每次快取未命中都可能演變成遠端範圍讀取。若候選列分散於多個列群組中，單一查詢便可能觸發多次讀取，每次讀取的資料量都超過查詢實際所需。 在佈局不佳的情況下，檢索 1,000 筆候選資料列很容易導致數十或數百兆位元組的不必要 I/O，極端情況下甚至會更多。</p>
<p>縮小行群組的規模有助於點查詢，但會損害掃描效能。過多的小碎片會降低壓縮效率、增加元資料開銷，並破壞分析引擎所依賴的長序列讀取。</p>
<p><strong>因此，問題不在於尋找單一的「神奇」行群組大小。問題在於，同一個資料集被要求同時像兩種不同的儲存系統那樣運作。</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">混合搜尋將這兩種路徑強行整合到單一查詢中</h3><p>混合搜尋使得這種衝突更難被忽視。單一查詢可能會先套用標量篩選條件：</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>接著執行人工神經網路（ANN）搜尋。</p>
<p>接著根據行 ID 擷取標籤、向量和元資料。</p>
<p>對使用者而言，這是一次搜尋請求；但對儲存層來說，這既是一次分析性掃描，也是一次低延遲的隨機查詢。</p>
<p>正因如此，向量儲存不僅需要更完善的 Parquet 設定，還需要一種能根據各欄位實際讀取方式來配置其位置的方法。</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">第三個問題：資料集並未存於單一引擎之中<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>前兩個問題發生在資料庫內部；第三個問題則發生在系統之間的交界處。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">AI 資料管線橫跨多個系統</h3><p>在影片工作流程中，向量資料庫本身幾乎不執行任何處理。</p>
<p>原始影片存放在物件儲存中。片段生成可能在 Spark 或 Ray 上執行；美學評分可能在 GPU 服務上執行；字幕生成可能在大型語言模型（LLM）推論管道中執行；嵌入向量可能由另一個 GPU 工作產生；稀疏向量則可能來自 SPLADE 服務。 離線評估、訓練資料篩選、人工審查及治理任務，都可能在其他地方執行。</p>
<p>向量資料庫負責提供線上搜尋服務，但資料集的產生、修正、評估與擴充，則由眾多系統共同完成。</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">專有儲存格式會產生多個「真實資料」的副本</h3><p>若資料庫採用僅其自身能讀寫的專屬物理格式，每個外部工作都需經過匯出、轉換、複製及匯入的流程。同一個資料集可能同時存在於資料庫中、Spark 暫存目錄中、評估輸出中，以及本機回填目錄中。此時真正的問題便在於：</p>
<ul>
<li>哪一份副本才是「真相來源」？</li>
<li>哪一份包含上個月的圖說模型？</li>
<li>哪些資料列已經經過人工審查修正？</li>
<li>哪個稀疏向量欄位是由哪個模型生成的？</li>
<li>在回填後，哪個向量索引仍然有效？</li>
<li>這行資料所指的原始影片物件是哪一個？</li>
</ul>
<p>在小規模情況下，團隊有時僅靠命名規範和手動檢查就能應付。但當面對數億筆資料與數太位元的嵌入向量時，這便會演變成一致性問題。</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">向量資料集需要一個共享的版本化狀態</h3><p>Lakehouse 系統已針對結構化資料解決了此問題的某種變體。Iceberg、Delta Lake 和 Hudi 不僅僅是儲存檔案。它們的核心貢獻在於讓多個引擎能圍繞相同的資料表狀態進行協調。</p>
<p>向量資料庫現在也需要類似的能力，但其狀態更加複雜。它不僅必須包含資料表檔案和區隔，還必須包含向量索引、文字索引、稀疏特徵、刪除日誌、統計資料、列 ID 範圍，以及對外部二進位大物件的引用。</p>
<p>問題不僅僅是「Spark 能否讀取 Milvus 檔案？」</p>
<p>問題在於，當 Spark 補全稀疏向量欄位後，Milvus 該如何得知該欄位屬於哪個版本、涵蓋哪些資料列、由哪個模型產生，以及線上查詢何時才能安全地使用它？</p>
<p>答案必須體現在儲存模型之中。</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">為何修補程式並不足夠<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>人們很容易將這些視為三個獨立的工程問題。</p>
<ul>
<li>寫入放大？加入批次處理。</li>
<li>點讀取？加入快取。</li>
<li>外部系統？加入匯出與匯入工具。</li>
</ul>
<p>這些修補方案雖能有所幫助，卻未能解決根本問題：向量資料集在物理層面上是異質的。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在影片範例中，<code translate="no">clip_id</code> 、<code translate="no">video_id</code> 、<code translate="no">duration</code> 以及<code translate="no">aesthetic_score</code> 都是短的標量字段。它們對於篩選和分析很有用。</p>
<ul>
<li><code translate="no">caption</code> 是文字資料。可用於 BM25、審閱、修正及資料補全。</li>
<li><code translate="no">embedding</code> 為長且密集的向量。其用於人工神經網路（ANN）的召回率計算，並於後續進行行級查詢或重新排序。</li>
<li><code translate="no">embedding_v2</code> 為新模型的輸出結果，通常在原始資料插入後很長時間才進行補填。</li>
<li><code translate="no">sparse_vector</code> 支援混合搜尋，並具有其專屬的存取模式。</li>
<li>原始影片應保留在物件儲存中。資料庫應儲存參考連結、校驗和、MIME 類型、解析器版本，以及列級關聯關係。</li>
<li>向量索引、文字索引、統計資料及刪除日誌皆為衍生物件，並具備各自的版本語義。</li>
</ul>
<p>這些物件共用一個邏輯行，但不應全都共用相同的物理佈局或生命週期。</p>
<ul>
<li>若強行將它們置於單一普通資料表佈局中，更新操作的成本將會很高。</li>
<li>如果將它們強行整合到單一的列式檔案格式中，點讀取的開銷將會變大。</li>
<li>若將它們視為互不相關的物件檔案，版本管理便會變得脆弱。</li>
</ul>
<p>因此，儲存模型必須從資料集具有異質性的事實出發。</p>
<p><strong>這衍生出三項設計要求：</strong></p>
<ul>
<li>首先，不同的欄位群組應以不同的實體格式儲存。</li>
<li>其次，這些欄位群組需要共用一個列 ID 空間，以便它們仍能作為單一邏輯資料表運作。</li>
<li>第三，資料集需要一個帶有版本控制的清單（Manifest），用以宣告哪些檔案、索引、日誌、統計資料及物件參照屬於當前檢視。</li>
</ul>
<p><strong>這便是 Loon 的設計理念，它是 Milvus 和 Zilliz Cloud 背後的新型儲存引擎。</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon：專為演進型向量資料集設計，作為 Milvus 和 Zilliz Cloud 背後的儲存引擎<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>為解決上述所有問題，我們開發了<strong>Loon——</strong>這款專為演化向量資料集設計、用於 Milvus 及<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a>（Zilliz Cloud 的下一代演進版本）的新儲存引擎。</p>
<p>其名稱延續了 Zilliz 以鳥類命名的傳統。「Loon」是一種棲息於湖泊的潛水鳥，這與系統的目標高度契合：向量資料庫不應在每次執行查詢、回填欄位或建立索引時，都必須移動、掃描或重寫整個「資料湖」。 系統應首先理解當前資料集的版本，包括其欄位、索引、統計資料、刪除日誌及物件參照，然後僅讀取實際所需的部分。</p>
<p>混合檔案格式、列 ID 對齊以及 Manifest 並非三項獨立的功能。它們源自同一個設計假設：向量資料集本質上是異質的。</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">三部分，一個儲存模型</h3><p>混合檔案格式承認不同欄位具有不同的存取模式。標量欄位適合掃描和篩選；向量欄位則需要高效的列級查詢；而影片、PDF、圖片和音訊檔案等原始物件，應存放於物件儲存中，而非資料庫資料檔案內。</p>
<p>行 ID 對齊承認，這些欄位雖然在物理上可能分開存放，但它們仍描述相同的邏輯行。字幕、嵌入內容、稀疏向量和影片 URI 可能存於不同的檔案和格式中，但仍需整合為單一結果。</p>
<p>Manifest 承認資料集並非寫入一次後便不再變更。它將由多個系統進行修改，歷經多個版本，並用於多種任務。索引、統計資料、刪除日誌、外部物件參照以及欄位群組，都必須出現在同一個版本化的檢視中。</p>
<p><strong>這正是為什麼 Loon 不僅僅是一種更快的向量檔案格式。</strong>更快的格式有助於點查詢，但無法解決模式演進或多引擎協調的問題。行 ID 對齊可讓分割的欄位行為如同單一資料表，但並未指定哪些檔案屬於當前版本。 Manifest 雖能描述資料集的狀態，但若缺乏欄位群組與列 ID 對齊機制，便無法清晰地呈現單一邏輯集合內不同的物理佈局。</p>
<p>儲存模型需要這三者兼備：針對不同欄位群組採用不同格式、用於重建資料列的共用列 ID 空間，以及能告知每個讀取者和寫入者資料集當前狀態的版本化 Manifest。</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon 在 Milvus 和 Zilliz Vector Lakebase 中的定位</h3><p>在 Milvus 中，它以基於 Manifest、ColumnGroup、檔案格式及檔案系統抽象概念所建構的模型，取代了舊有的區段二進位日誌儲存層。 在<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a>（Zilliz Cloud 的下一代演進）<strong>中，</strong>Vector Lakebase 架構也遵循相同方向：在保持向量資料庫服務路徑高速的同時，使底層資料更容易演進、分析，並與外部系統協調。</p>
<p>Milvus 的上層元件仍維持其熟悉的角色：Proxy 負責路由；QueryCoord 與 DataCoord 負責排程；IndexNode 則負責建立索引。針對集合、插入、搜尋及混合搜尋等應用程式的 API，無需暴露 Manifest 檔案或 ColumnGroups。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>變革發生在底層。</p>
<p>DataNode、QueryNode、segcore、壓縮機制以及外部連接器皆可透過相同的儲存抽象層運作。這點至關重要，因為資料集不再僅由資料庫進行讀寫。它既可能被外部運算系統擴展，同時也能被線上搜尋服務所使用。</p>
<p>從高層次來看，各層結構如下：</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Manifest 描述資料集的版本化狀態。ColumnGroups 將邏輯集合映射為實體的欄位群組。檔案格式層允許每個 ColumnGroup 選擇適當的格式。檔案系統抽象層可同時支援物件儲存與本地儲存。</p>
<p>關鍵在於，混合檔案格式、行 ID 對齊以及 Manifest 並非獨立的功能。它們共同定義了儲存模型。</p>
<p>在該模型的基礎上，我們可以逐一探討三項設計選擇：Loon 如何儲存不同的 ColumnGroups、如何將它們重新對齊為行，以及 Manifest 如何將這些檔案轉化為具版本控制的資料集。</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">設計 1：為適當的 ColumnGroup 選用正確的檔案格式<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>不同的欄位具有不同的存取模式，不應強行將它們塞入相同的檔案格式中。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon 將邏輯集合拆分為 ColumnGroups。</h3><ul>
<li>標量欄位、篩選欄位、業務金鑰和統計欄位通常會被掃描、篩選、彙總，或用於查詢規劃。這些欄位能從壓縮、欄位修剪及生態系統相容性中受益。Parquet 非常適合這些欄位。</li>
<li>密集向量、稀疏向量及重新排序特徵，通常在人工神經網路（ANN）根據行 ID 進行回調後才被讀取。它們需要低延遲的隨機存取、精確的位元組範圍讀取以及選擇性解碼。以區段為導向的佈局更為適合。Loon 在此方面採用 Vortex。</li>
<li>影片、PDF、圖片和音訊檔案等原始物件不應嵌入向量資料庫的資料檔案中，而應保留在物件儲存中。資料庫則負責記錄參考資訊、校驗和、MIME 類型、解析器版本以及列級關係。</li>
</ul>
<p>以影片為例，其物理佈局可能如下所示：</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>對應用程式而言，這仍是一個集合。對儲存層而言，該集合的不同部分採用不同的物理格式。這能直接減少不必要的重寫操作。新增<code translate="no">embedding_v2</code> 可轉化為一個新的向量ColumnGroup加上一個Manifest提交，無需重寫字幕欄位、標量元資料或現有的嵌入欄位。</p>
<p>同樣的原理也適用於稀疏向量、重新排序特徵或其他衍生欄位。如果新欄位在物理上能夠獨立，並能透過行 ID 進行對齊，就不必將無關的欄位拖入相同的重寫路徑中。</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon 亦會根據需求調整檔案格式的運用。</h3><p><strong>對於 Parquet，預設設定對向量密集型資料而言未必總是理想。</strong>一個 64 MB 的行群組對於點查詢而言可能過大，因為一次小規模的隨機讀取可能會拉取遠超所需的大量資料。Loon 會在相關路徑中將行群組緊縮至 1 MB，並在編碼（例如向量欄位的字典編碼）對隨機查閱的向量資料無助時，將其停用。</p>
<p><strong>對於 Vortex，更重要的工作在於佈局。</strong>Loon 採用一種能在掃描效率與點查詢之間取得平衡的佈局<strong>。</strong>在同一行群組內，相關欄位的區段可緊鄰放置以支援掃描。在執行操作時，透過子區段讀取，系統僅需擷取相關位元組，而非拉取整個區段。</p>
<p><strong>Loon 亦支援唯讀模式的 Lance 整合</strong>，因此當相容性為考量時，現有的 Lance 資料集可作為 ColumnGroups 掛載。</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">基準測試結果</h3><p>在一項本地測試中，使用單一檔案（含 40,000 行，資料結構為<code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code> ），Vortex 針對採用 1 MB 行群組的 Parquet 展現了以下結果：</p>
<table>
<thead>
<tr><th>操作</th><th>Vortex</th><th>Parquet</th><th>差異</th></tr>
</thead>
<tbody>
<tr><td>取樣，K=1000 筆隨機資料列</td><td>5.8 毫秒</td><td>144 毫秒</td><td>快 25 倍</td></tr>
<tr><td>完整向量-欄位掃描</td><td>21 毫秒</td><td>142 毫秒</td><td>快 6.76 倍</td></tr>
<tr><td>檔案大小，約 21 MB 原始資料</td><td>6.62 MB</td><td>7.16 MB</td><td>小了 7%</td></tr>
</tbody>
</table>
<p><code translate="no">take</code> 的結果源於減少了必須讀取和解碼的無關資料量。掃描結果則源於壓縮技術與實作選擇。</p>
<p>這些數值應與其測試環境綁定：8 個 vCPU 的 Ubuntu 22.04 KVM 環境、本地檔案系統、單一檔案、40,000 行、1 MB 的行群組，以及上述資料結構。 在物件儲存環境中，網路 I/O 可能佔據主導地位，因此降低讀取放大效應的重要性更為顯著。實際結果取決於資料集結構、物件儲存行為、快取狀態以及查詢模式。</p>
<p>更廣泛的重點並非每欄都應使用 Vortex。</p>
<p>重點在於：向量資料集需要在 ColumnGroup 層級選擇合適的檔案格式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">設計 2：透過列 ID 對齊實體檔案<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>混合檔案格式解決了一個問題：不同欄位現在可以存放在最適合它們的格式中。</p>
<p>但這卻衍生出第二個問題。如果標量欄位存放在 Parquet 中、向量存放在 Vortex 中，而原始物件則存放在物件儲存中，系統該如何將它們視為一個集合呢？</p>
<p><strong>Loon 透過列 ID 對齊來解決此問題。</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">列 ID 是儲存層的座標系統</h3><p>每個實體 ColumnGroupFile 都會記錄其檔案路徑以及所涵蓋的列 ID 範圍：</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>即使位於不同的檔案和格式中，不同的 ColumnGroups 仍可能涵蓋相同的行 ID 範圍。</p>
<p>以行 ID<code translate="no">12345</code> 為例，標量元數據可能位於 Parquet ColumnGroup 中，嵌入式資料可能位於 Vortex ColumnGroup 中，而原始影片則可能由物件儲存的參照所表示。從邏輯上來說，它們仍然屬於同一行。這為儲存層提供了一個穩定的座標系統。</p>
<p>列 ID 並非業務層面的主鍵。它是儲存層的座標系統，讓 Loon 能夠在物理上分割資料集，同時不喪失邏輯上重建資料集的能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">新增欄位無需重寫舊欄位</h3><p>新增「<code translate="no">embedding_v2</code> 」時，無需重寫原始的字幕、元資料或「<code translate="no">embedding_v1</code> 」ColumnGroups。Loon 可寫入新的向量 ColumnGroup，記錄其涵蓋的行 ID 範圍，並透過 Manifest 提交該變更。</p>
<p>此原則同樣適用於稀疏向量、重新排序特徵或其他稍後加入的衍生欄位。</p>
<p>只要新的 ColumnGroup 涵蓋正確的列 ID 範圍，它就可以加入相同的邏輯集合，而無需強制移動無關的資料。</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">刪除與壓縮操作可更精準地進行</h3><p>行 ID 對齊也有助於刪除操作。</p>
<p>刪除操作可先透過刪除日誌來表達。該行在邏輯層面上將變得不可見，而實體清理則會延遲至壓縮時才進行。當壓縮最終執行時，它並不總需要重寫與受影響行相關的每個 ColumnGroup，而是可以專注於需要清理的 ColumnGroups。</p>
<p>這點至關重要，因為並非每欄都有相同的運算成本。重寫一個短的標量 ColumnGroup，與重寫數百吉字節的密集向量，兩者差異極大。</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">混合搜尋僅能擷取所需的欄位</h3><p>行 ID 的對齊，也是讓混合搜尋能在混合檔案格式上實際運作的關鍵。</p>
<p>在 ANN 搜尋返回候選列 ID 之後，系統僅需擷取最終結果所需的欄位：標題、元資料、向量、重新排序特徵或物件參照。</p>
<p>舉例來說，某個查詢可能需要：</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>這些欄位可能位於不同的 ColumnGroup 中。Loon 能根據行 ID 範圍定位相關檔案，讀取必要的位元組範圍，並組裝結果。</p>
<p>若無行 ID 對齊機制，混合格式僅會是並列存放的獨立檔案；透過行 ID 對齊，它們便能作為單一邏輯集合運作。</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader 將分割機制隱藏於上層之外</h3><p>使此功能得以實現的執行時元件即是「壓縮讀取器」（Packed Reader）。</p>
<p>上層僅看到統一的 Arrow RecordBatch 資料流。在底層，資料可能來自不同檔案格式的多個 ColumnGroups。「壓縮讀取器」會隱藏這些差異，根據行 ID 範圍對齊資料，並在控制記憶體使用量的情況下調度多檔案 I/O。</p>
<p>它亦支援透過行 ID 進行直接的<code translate="no">take</code> 。給定一組行 ID 後，它會定位相關的 ColumnGroupFiles，發出範圍讀取請求，並返回所要求的欄位。</p>
<p>在影片工作流程中，人工神經網路（ANN）查詢可能需要執行「<code translate="no">caption</code> 」、「<code translate="no">embedding</code> 」以及「<code translate="no">video_uri</code> 」。Packed Reader 能夠擷取標量 ColumnGroup 和向量 ColumnGroup，同時不觸及無關的欄位。</p>
<p>這就是「獨立檔案」與「具有多種物理佈局的資料表」之間的差異。</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">設計 3：將清單（Manifest）設為權威來源<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>混合檔案格式定義了資料的物理儲存方式。行 ID 對齊則決定了分散的 ColumnGroup 如何仍能構成單一邏輯資料表。但系統仍需解答一個更宏觀的問題：<strong>哪些檔案、日誌、統計資料、索引及物件參照屬於資料集的當前版本？這正是 Manifest 的職責所在。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">僅靠物件儲存目錄是不夠的</h3><p>物件儲存並非資料庫目錄。一個目錄可能包含舊檔案、新檔案、失敗工作任務的輸出、臨時檔案、刪除日誌、仍被舊快照引用的檔案，以及等待清理的檔案。檔案的存在並不代表它屬於當前資料集版本。</p>
<p>一個 Loon 資料集可能會組織成如下目錄結構：</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>但目錄結構並非「真相來源」，「清單（Manifest）」才是。使用者不應列出目錄，並根據其中恰好存在的檔案來推斷狀態。他們應讀取當前的「清單」，並遵循其中宣告的版本化視圖。</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">《清單》（Manifest）定義了資料集的一個版本化視圖</h3><p>《清單》定義了特定版本中的資料集。它記錄：</p>
<ul>
<li>哪些 ColumnGroups 存在</li>
<li>它們涵蓋哪些列 ID 範圍</li>
<li>每個 ColumnGroup 使用何種物理格式</li>
<li>檔案的儲存位置</li>
<li>哪些刪除日誌處於活躍狀態</li>
<li>有哪些統計資料可用</li>
<li>存在哪些索引</li>
<li>哪些外部 BLOB 被引用</li>
<li>這些統計資料或索引涵蓋哪些欄位與列範圍</li>
</ul>
<p>每次更新都會寫入一個新的 Manifest 版本。開啟版本 N 的讀取者將看到版本 N 時資料集的穩定視圖。寫入者可以準備版本 N+1，而不會干擾仍在使用版本 N 的讀取者。</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">Manifest 追蹤的內容不僅限於資料表檔案</h3><p>在 Loon 中，Manifest 主體採用 Apache Avro 編碼，並圍繞四大主要區段進行組織。</p>
<ul>
<li>ColumnGroups 描述欄位、格式、檔案及列 ID 範圍。</li>
<li>DeltaLogs 描述刪除操作。不同的刪除類型涵蓋不同的變更來源，例如來自客戶端的主鍵刪除、來自內部壓縮的定位刪除，或是來自外部引擎的等值刪除。</li>
<li>Stats 包含規劃元資料，例如布隆濾波器、BM25 統計資料以及最小/最大值。</li>
<li>Indexes 描述索引類型、參數、涵蓋的欄位以及列 ID 範圍。這可能包括向量索引（如 HNSW 或 IVF）、文字索引、倒排索引、位圖索引以及相關結構。</li>
</ul>
<p>這正是 Loon 與傳統資料表清單的不同之處。</p>
<p>向量資料集不僅需要追蹤資料檔案和分區，還需追蹤向量索引、文字索引、稀疏特徵、刪除日誌、統計資料、外部物件參照，以及連接這些元素的列 ID 範圍。</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">清單必須允許除資料庫以外的其他主體進行寫入</h3><p>最關鍵的並非僅在於清單的內容，而在於誰能對其進行寫入。</p>
<ul>
<li>若僅有資料庫能寫入清單，它便仍屬內部元資料。雖然元資料更簡潔，但仍僅限於單一引擎內部使用。</li>
<li>若外部引擎能夠生成新的 ColumnGroups、統計資料及 Manifest 條目，則 Manifest 便會成為一個協調介面。</li>
<li>舉例來說，一個 Spark 工作可對稀疏向量欄位進行回填。它會寫入新的 ColumnGroup、記錄列覆蓋範圍與統計資料，並提交新的 Manifest。在工作執行期間，線上查詢仍可繼續讀取舊版本。一旦提交成功，新版本便會顯示出來。</li>
</ul>
<p>這在精神上類似於 Iceberg 和 Delta Lake，但物件模型的涵蓋範圍更廣。向量資料集需要追蹤向量索引、文字索引、稀疏特徵、刪除日誌、統計資料、二進位大物件 (blob) 參考以及列 ID 範圍，而不僅僅是資料表檔案和分區。</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">樂觀提交使版本更新更為簡便</h3><p>每次提交都會寫入一個新的 Manifest 版本。寫入者可以基於版本 N 建立新內容，然後嘗試寫入<code translate="no">manifest-{N+1}.avro</code> 。若該版本已存在，物件儲存的條件寫入或世代匹配語義會導致提交失敗。寫入者隨後可針對較新版本重新嘗試。</p>
<p>這使 Loon 具備樂觀並發能力，同時無需強制每項更新都經過繁重且強一致性的協調路徑。若無 Manifest，多格式與多引擎儲存最終將演變為命名規範與手動對帳。這或許適用於小型資料集，但對於 TB 級別的向量資料則行不通。</p>
<p>正是「清單（Manifest）」，將異質檔案轉化為多個系統都能安全讀取與更新的資料集。</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">當儲存系統採用版本控制時，對使用者而言會有什麼變化<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>對應用程式開發者而言，Loon 不應成為新的 API 負擔。</p>
<p>使用者仍應能運用熟悉的 Milvus 概念：集合、插入、搜尋及混合搜尋。在正常的應用程式開發過程中，他們不應需要考慮 Manifest 檔案、ColumnGroups、列 ID 範圍或檔案佈局等細節。</p>
<p>變化發生在底層。儲存系統將更精準地掌握 AI 資料集的實際演變方式。</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">新增嵌入向量時不應移動舊資料</h3><p>過去，若要在現有集合中新增「<code translate="no">embedding_v2</code> 」，通常需要先匯出資料、訓練新模型、產生向量，然後透過 SDK 將資料重新匯入或批量更新集合。此流程會產生大量運維工作：版本追蹤、任務失敗重試、索引重建、服務影響以及一致性檢查。</p>
<p><strong>透過 Loon，這可以轉化為資料結構演進加上一個新的 ColumnGroup 提交。</strong>新的嵌入向量欄位可寫入為獨立的實體 ColumnGroup，依據列 ID 對齊，並透過 Manifest 使其可見。舊的標籤欄位、標量元數據欄位以及原始的嵌入向量欄位皆無需移動。</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">資料回填不應需要客戶端更新迴圈</h3><p>許多 AI 資料更新屬於回填操作。當混合搜尋變得重要時，團隊可能會新增稀疏向量；當新模型訓練完成後，可能會新增重新排序特徵；經人工審查後，可能會修正標籤；政策更新後，可能會新增治理標籤。</p>
<p>在傳統架構中，即使資料是由 Spark、Ray 或其他外部引擎產出，這些變更通常仍需透過客戶端 SDK 更新或僅限資料庫的寫入路徑來實現。</p>
<p>透過 Loon，外部運算系統可產生新的 ColumnGroups，並透過 Manifest 提交。資料庫不再是每次重寫的唯一入口點。</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">離線分析不應需要另一份「真實資料」的副本</h3><p>過去，團隊常將線上資料集轉存至 Parquet 格式，以便進行離線評估或分析。這會產生同一資料集的兩個版本：線上資料集與分析副本。一旦標籤被修正、嵌入向量被重新生成、刪除日誌被套用，或是索引被重建，團隊就必須確認哪個副本是最新版本。</p>
<p>透過基於 Manifest 的儲存模型，分析引擎可讀取與服務系統相同的版本化資料集視圖。它們僅需投影所需的欄位、掃描相關的列範圍，並針對宣告的資料集版本進行處理，而非手動匯出的快照。</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">刪除與修正應僅針對已變更的部分</h3><p>刪除、標題修正、標籤修正及治理更新在 AI 資料集中屬常態操作。這些操作不應強迫每個長向量欄位都經過相同的重寫路徑。</p>
<p>透過 Loon，刪除記錄可先被視為邏輯刪除。後續的壓縮操作可清理受影響的 ColumnGroups，而無需重寫無關的資料。若短文字欄位發生變更，儲存層不應僅因它們共享同一邏輯列，就必須重寫數百吉字節的密集向量。</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">外部引擎成為工作流程的一部分，而非「逃生通道」</h3><p>更重大的轉變在於，外部引擎不再被視為向量資料庫之外的系統。</p>
<p>Spark、Ray、評估工作、標籤系統以及治理管道，早已產生並修改了大量資料。儲存層應讓它們能圍繞單一可信資料源進行協作，而非不斷進行匯出、複製和重新匯入。</p>
<p>這正是 Manifest 某個版本所能實現的。它讓線上服務、離線分析、資料補全任務以及壓縮作業，都能對資料集擁有共同的視圖。</p>
<p>這些聽起來或許像是內部儲存的細節，但它們影響著團隊能多快地針對 AI 資料集進行迭代。每次模型變更、特徵回填、標籤修正、品質過濾以及索引重建，都取決於同一個問題：「<strong>系統能否在不移動非必要資料的情況下更新資料集？」</strong></p>
<p>這正是該儲存模型的實際價值所在。</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon 現已於 Milvus 3.0 測試版及 Zilliz Vector Lakebase 中推出<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon 現已於<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 測試版中</a>推出，同時也是<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz</a> Cloud 下一代演進<a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">版本——Zilliz Vector Lakebase</a> 儲存層的一部分。本次發布聚焦於三個核心領域：</p>
<ul>
<li><strong>Manifest。其</strong>目標是讓寫入、回填、刪除、統計資料及索引更新等操作，產生具有版本控制的資料集檢視，使讀取者能一致地開啟這些檢視。 對讀取端而言，這意味著查詢可開啟特定版本的 Manifest，並檢視資料集的穩定視圖；對寫入端而言，則表示可先準備新的資料檔案、刪除日誌、統計資料或索引檔案，再透過版本化提交使其可見。</li>
<li><strong>ColumnGroup 與格式支援。</strong>Parquet 支援標量欄位及相容於生態系統的欄位。Vortex 支援以向量為主的存取模式。Lance 可透過唯讀模式進行整合，以確保與現有 Lance 資料集的相容性。</li>
<li><strong>Lake 上的索引。</strong>標量統計資料、篩選索引及文字倒排索引均可參與基於 Manifest 的行範圍規劃。Lake 原生向量索引則涉及更複雜的機制。 HNSW 與 IVF 在物件儲存上的行為各異，其中 HNSW 特別容易受隨機存取與快取局部性影響。它無法單純重複使用為本地 SSD 設計的佈局，並期待獲得相同結果。</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">仍有待改進之處</h3><ul>
<li><strong>外部寫入路徑</strong>至關重要，因為 Spark 和 Ray 應能產生 ColumnGroups 和 Manifest 提交，而無需強制將每個回填操作都通過客戶端 SDK 迴圈處理。</li>
<li><strong>Lakehouse 互通性</strong>至關重要，因為許多團隊已經使用<strong>Iceberg、Delta Lake、Trino、DuckDB 和 Athena</strong>等目錄與查詢引擎<strong>。</strong>向量資料應能融入該生態系統，同時不犧牲向量搜尋效能。</li>
<li><strong>索引佈局</strong>至關重要，因為圖形索引和倒排結構在物件儲存上的存取模式各不相同。</li>
<li><strong>大物件語義</strong>至關重要，因為原始影片、PDF、圖片和音訊檔案需要與衍生向量資料集相符的參考管理、版本控制及刪除行為。</li>
</ul>
<p>具體的發布行為、預設設定及遷移路徑應遵循相關的 Milvus 和<a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud 發布說明</a>。然而，儲存方向已十分明確：向量資料庫需要在服務層之下，具備一個具有版本控制且原生支援資料湖的基礎架構。</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">在 Zilliz Vector Lakebase 上試用 Loon<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>若您目前的技術堆疊將線上服務、離線分析、資料回填及外部資料湖工作流程分隔在不同系統中，Zilliz Vector Lakebase 值得一試。您可在<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> 中體驗此服務。新註冊工作用電子郵件帳號即可獲得 100 美元免費信用額度。也歡迎您<a href="https://zilliz.com/contact-sales">與我們討論</a>您的應用案例。</p>
<p>您亦可關注<a href="https://milvus.io/docs/release_notes.md">Milvus 3.0 的發布動態</a>，了解 Loon 在開源引擎中的演進。</p>
<p><strong>Zilliz Vector Lakebase 整合了以下功能：</strong></p>
<ul>
<li>針對不同即時效能與成本權衡的分層服務</li>
<li>針對大規模或探索性工作負載的隨需搜尋，無需持續運算資源</li>
<li>外部資料湖搜尋，讓您能直接對現有資料湖資料進行索引與搜尋</li>
<li>橫跨向量、文字、JSON 及地理空間資料的全域搜尋，具備混合檢索與重新排序功能</li>
<li>基於 Vortex 打造的統一資料湖原生儲存系統，Vortex 是一種開放格式，專為在向量密集型資料上實現更快、成本更低的隨機讀取而設計</li>
</ul>
