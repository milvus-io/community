---
id: data-addressing-storage-systems.md
title: 深入探討儲存系統中的資料定址：從 HashMap 到 HDFS、Kafka、Milvus 和 Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: 從 HashMap 到 HDFS、Kafka、Milvus 和 Iceberg，追蹤資料定址的運作方式 - 以及為什麼在各種規模下，計算位置都能勝過搜尋。
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>如果您在後端系統或分散式儲存設備上工作，您可能已經見過這種情況：網路並未飽和，機器也未超載，但一個簡單的查詢卻會引發數以千計的磁碟 I/O 或物件儲存 API 呼叫 - 而且查詢仍需花費數秒時間。</p>
<p>瓶頸很少是頻寬或計算。瓶頸在於<em>尋址</em>- 系統在讀取資料之前，先要找出資料的位置。<strong>資料</strong>編址是將邏輯識別碼（鍵、檔案路徑、偏移量、查詢謂語）轉換為儲存資料實體位置的過程。在規模上，這個過程 (而非實際的資料傳輸) 會主導延遲。</p>
<p>儲存效能可簡化為一個簡單的模型：</p>
<blockquote>
<p><strong>總尋址成本 = 元資料存取 + 資料存取</strong></p>
</blockquote>
<p>幾乎所有的儲存優化 - 從散列表到湖泊元資料層 - 都以這個等式為目標。技術各有不同，但目標始終如一：以盡可能少的高延遲作業找出資料。</p>
<p>這篇文章將追蹤規模越來越大的系統中的這個想法 - 從 HashMap 之類的記憶體資料結構，到 HDFS 和 Apache Kafka 之類的分散式系統，最後到<a href="https://milvus.io/">Milvus</a>（<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a>）和 Apache Iceberg 之類在物件儲存上運作的現代引擎。儘管它們有差異，但它們都在優化相同的方程式。</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">三種核心定址技術<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>在所有的儲存系統和分散式引擎中，大多數的定址最佳化都分為三種技術：</p>
<ul>
<li><strong>計算</strong>- 直接從公式推導出資料的位置，而不是掃描或遍歷結構來尋找資料。</li>
<li><strong>快取</strong>- 將經常存取的元資料或索引保留在記憶體中，以避免重複從磁碟或遠端儲存進行高延遲讀取。</li>
<li><strong>剪枝</strong>- 使用範圍資訊或分割邊界來排除無法包含結果的檔案、分片或節點。</li>
</ul>
<p>在本文中，<em>存取</em>是指任何具有實際系統層級成本的作業：磁碟讀取、網路呼叫或物件儲存 API 請求。納秒級的 CPU 運算不算在內。重要的是減少 I/O 作業的次數，或將昂貴的隨機 I/O 轉換為較便宜的連續讀取。</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">編址如何運作：二和問題<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>為了讓定址具體化，請考慮一個經典的演算法問題。給定一個整數陣列<code translate="no">nums</code> 和一個目標值<code translate="no">target</code> ，返回兩個數字的索引，其總和為<code translate="no">target</code> 。</p>
<p>例如<code translate="no">nums = [2, 7, 11, 15]</code>,<code translate="no">target = 9</code> → 結果<code translate="no">[0, 1]</code> 。</p>
<p>這個問題清楚說明搜尋資料與計算資料所在位置的差異。</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">解決方案 1：暴力搜尋</h3><p>暴力搜尋法會檢查每一對元素。對於每個元素，它會掃描陣列的其餘部分，尋找匹配的元素。簡單，但是 O(n²)。</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>我們不知道答案可能在哪裡。每次查找都是從頭開始，盲目地遍歷陣列。瓶頸並不是運算，而是重複掃描。</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">解決方案 2：透過計算直接尋址</h3><p>優化的解決方案以 HashMap 取代掃描。它不需要搜尋匹配的值，而是計算所需的值，並直接查詢。時間複雜度降至 O(n)。</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>轉換：您不需要掃描陣列尋找匹配值，而是計算所需的值，並直接前往其位置。一旦可以得出位置，遍歷就會消失。</p>
<p>這就是我們要研究的每個高效能儲存系統背後的相同理念：以運算取代掃描，以直接尋址取代間接搜尋路徑。</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap：計算位址如何取代掃描<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap 儲存鍵-值對，並透過計算鍵的位址來定位值 - 而不是透過搜尋項目來定位。如果給定一個鍵值，它會套用雜湊函數、計算陣列索引，並直接跳到該位置。不需要掃描。</p>
<p>這是驅動本文所有系統的原則的最簡單形式：透過計算導出位置，避免掃描。從分散式元資料查詢到<a href="https://zilliz.com/learn/vector-index">向量索引</a>，每個規模都有相同的想法。</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">核心資料結構</h3><p>HashMap 的核心是圍繞單一結構建立的：陣列。散列函數會將鍵映射到陣列索引。由於鍵空間遠大於陣列，碰撞是不可避免的 - 不同的鍵可能會切細到相同的索引。這些問題會在每個槽中使用連結清單或紅黑樹局部處理。</p>
<p>陣列提供按索引的固定時間存取。此特性 - 直接、可預測的定址 - 是 HashMap 效能的基礎，也是大型儲存系統中有效資料存取的相同原則。</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">HashMap 如何定位資料？</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>分步 HashMap 寻址：散列键、计算数组索引、直接跳转到数据桶并在本地解析 - 无需遍历即可实现 O(1) 查找。</span> </span></p>
<p>以<code translate="no">put(&quot;apple&quot;, 100)</code> 為例。整個查詢只需要四個步驟 - 不需要全表掃描：</p>
<ol>
<li><strong>對金鑰進行散列：</strong>透過散列函數傳送關鍵值 →<code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>映射到陣列索引：</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → 例如<code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>跳轉到資料桶：</strong>直接存取<code translate="no">table[10]</code> - 單次存取記憶體，而非遍歷</li>
<li><strong>在本機解決：</strong>如果沒有碰撞，立即讀取或寫入。如果有碰撞，則檢查該資料桶內的小型鏈結清單或紅黑樹。</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">為什麼 HashMap 尋找是 O(1)？</h3><p>陣列存取之所以是 O(1)，是因為一個簡單的編址公式：</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>只要給定一個索引，就可以用一個乘法和一個加法計算出記憶體位址。不論陣列大小，成本都是固定的 - 一次計算、一次記憶體讀取。相比之下，鏈結列表則必須逐個節點遍歷，按照指針通過不同的記憶體位置：最壞的情況是 O(n)。</p>
<p>HashMap 將鍵散列為陣列索引，將原本的遍歷變為計算地址。它不需要搜尋資料，而是計算資料的確切位置，然後跳到那裡。</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">在分散式系統中，編址方式有何改變？<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap 解決了單一機器內的編址問題，在單一機器內，資料存放在記憶體中，存取成本微不足道。在較大的規模下，限制條件會大幅改變：</p>
<table>
<thead>
<tr><th>規模因素</th><th>影響</th></tr>
</thead>
<tbody>
<tr><td>資料大小</td><td>兆位元組 → TB 或 PB 跨叢集</td></tr>
<tr><td>儲存媒體</td><td>記憶體 → 磁碟 → 網路 → 物件儲存</td></tr>
<tr><td>存取延遲</td><td>記憶體：~100 ns / 磁碟：10-20 ms / 同直流網路：~0.5 ms / 跨區域：~150 ms</td></tr>
</tbody>
</table>
<p>編址問題沒有改變 - 只是變得更昂貴。每次查詢都可能涉及網路跳躍和磁碟 I/O，因此減少存取次數的重要性遠高於記憶體。</p>
<p>為了瞭解真實的系統如何處理這個問題，我們來看看兩個經典的範例。HDFS 將基於計算的定址方式應用於大型、以區塊為基礎的檔案。Kafka 將其應用於僅附加的訊息流。兩者都遵循相同的原則：運算資料所在的位置，而不是搜尋資料。</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS：使用內存元資料為大型檔案尋址<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS 是一個<a href="https://milvus.io/docs/architecture_overview.md">分散式儲存</a>系統，專為跨集群機器的超大檔案而設計。給定一個檔案路徑和位元組偏移量，它需要找到正確的資料區塊和儲存該資料的資料節點。</p>
<p>HDFS 透過刻意的設計選擇來解決這個問題：將所有檔案系統元資料保留在記憶體中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>HDFS 資料組織顯示一個 300MB 檔案的邏輯視圖，映射到實體儲存空間的三個區塊分佈在具有複製功能的資料節點上</span> </span></p>
<p>位於中心的是 NameNode。它將整個檔案系統樹（目錄結構、檔案到區塊的映射，以及區塊到資料節點的映射）載入記憶體。由於元資料在讀取過程中從未接觸磁碟，因此 HDFS 僅透過記憶體內的查詢來解決所有位址問題。</p>
<p>從概念上來看，這就是集群規模的 HashMap：使用記憶體內的資料結構，將緩慢搜尋變成快速、經計算的查詢。不同之處在於 HDFS 將相同的原則應用於分散在數千台機器上的資料集。</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">HDFS 如何定位資料？</h3><p>考慮在<code translate="no">/user/data/bigfile.txt</code> 的 200 MB 偏移量讀取資料，預設的區塊大小為 128 MB：</p>
<ol>
<li>用戶端向 NameNode 發送單個 RPC</li>
<li>NameNode 解析檔案路徑，並計算出偏移量 200 MB 位於第二區塊 (128-256 MB 範圍內) - 完全在記憶體中</li>
<li>NameNode 返回儲存該區塊的資料節點 (例如 DN2 和 DN3)</li>
<li>用戶端直接從最近的資料節點 (DN2) 讀取</li>
</ol>
<p>總成本：一次 RPC、幾次記憶體內查詢、一次資料讀取。在此過程中，元資料從未觸及磁碟，且每次查詢都是固定時間。即使資料在大型集群中擴充，HDFS 也能避免昂貴的元資料掃描。</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka：稀疏索引如何避免隨機 I/O<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka 專為高吞吐量的訊息流而設計。給定一個訊息偏移量，它需要在磁碟上找到精確的位元組位置 - 而不會將讀取變成隨機 I/O。</p>
<p>Kafka 結合了序列儲存與稀疏的記憶體索引。它不需要搜尋資料，而是計算近似位置，並執行小規模、有邊界的掃描。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>Kafka 資料組織顯示邏輯檢視，主題和分區映射到實體儲存，成為包含 .log、.index 和 .timeindex 區段檔案的分區目錄</span> </span></p>
<p>訊息以主題 → 區塊 → 片段的方式組織。每個分割區都是只可追加的日誌，分割成不同的區段，每個區段包含</p>
<ul>
<li>在磁碟上依序儲存訊息的<code translate="no">.log</code> 檔案</li>
<li>一個<code translate="no">.index</code> 檔案作為日誌的稀疏索引</li>
</ul>
<p><code translate="no">.index</code> 檔案是記憶體映射 (mmap)，因此索引查詢可直接從記憶體進行，無需磁碟 I/O。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Kafka 稀疏索引設計顯示每 4KB 資料有一個索引項目，與記憶體的比較：800MB 的密集索引與僅 2MB 駐留在記憶體中的稀疏索引。</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Kafka 如何定位資料？</h3><p>假設消費者讀取偏移量 500,000 處的訊息。Kafka 分三個步驟解決這個問題：</p>
<p><strong>1.定位區段</strong>(TreeMap lookup)</p>
<ul>
<li>區段基本偏移量：<code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> →<code translate="no">baseOffset = 367834</code></li>
<li>目標檔案：<code translate="no">00000000000000367834.log</code></li>
<li>時間複雜度：O(log S)，其中 S 是區段的數量 (通常 &lt; 100)</li>
</ul>
<p><strong>2.查詢稀疏索引</strong>(.index)<strong>中的位置</strong></p>
<ul>
<li>相對偏移量：<code translate="no">500000 − 367834 = 132166</code></li>
<li>在<code translate="no">.index</code> 中進行二進位搜尋：找出最大的項目 ≤ 132166 → 3.<code translate="no">[132100 → position 20500000]</code></li>
<li>時間複雜度：O(log N)，其中 N 是索引項的數量</li>
</ul>
<p><strong>3.從日誌</strong>(.log)<strong>順序讀取</strong></p>
<ul>
<li>從位置 20,500,000 開始讀取</li>
<li>繼續讀取，直到讀到偏移量 500,000</li>
<li>最多掃描一個索引區間 (~4 KB)</li>
</ul>
<p>總計：一個記憶體區段查詢、一個索引查詢、一個短序列讀取。無隨機磁碟存取。</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>尺寸</th><th>HDFS</th><th>卡夫卡</th></tr>
</thead>
<tbody>
<tr><td>設計目標</td><td>高效儲存及讀取大量檔案</td><td>訊息流的高吞吐量連續讀/寫</td></tr>
<tr><td>定址模型</td><td>路徑 → 區塊 → 資料節點 (透過記憶體內的 HashMaps)</td><td>透過稀疏索引 + 連續掃描的偏移量 → 區段 → 位置</td></tr>
<tr><td>元資料儲存</td><td>集中在 NameNode 記憶體中</td><td>本地檔案，透過 mmap 進行記憶體映射</td></tr>
<tr><td>每次查詢的存取成本</td><td>1 次 RPC + N 次區塊讀取</td><td>1 次索引查詢 + 1 次資料讀取</td></tr>
<tr><td>關鍵優化</td><td>所有元資料都在記憶體中 - 查詢路徑中沒有磁碟</td><td>稀疏索引 + 連續佈局避免隨機 I/O</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">物件儲存為何會改變位址問題<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>從 HashMap 到 HDFS 和 Kafka，我們已經看到在記憶體和經典分散式儲存中的定址問題。隨著工作負載的演進，要求也不斷提高：</p>
<ul>
<li><strong>更豐富的查詢。</strong>現代系統能處理多欄位篩選、<a href="https://zilliz.com/glossary/similarity-search">相似性搜尋和</a>複雜的謂語 - 而不只是簡單的鍵和偏移量。</li>
<li><strong>預設物件儲存。</strong>資料越來越多地存放在與 S3 相容的儲存空間中。檔案分散在不同的儲存桶中，每次存取都需要呼叫 API，其固定延遲時間約為數十毫秒，即使是數位元組也不例外。</li>
</ul>
<p>此時，延遲 - 而非頻寬 - 才是瓶頸。無論傳回多少資料，單個 S3 GET 請求的成本為 ~50 毫秒。如果一個查詢會觸發數以千計的此類請求，總延遲時間就會飆長。盡量減少 API 的扇出成為設計的核心限制。</p>
<p>我們將參考兩個現代系統，一個是<a href="https://zilliz.com/learn/what-is-a-vector-database">向量資料庫</a> <a href="https://milvus.io/">Milvus</a>，另一個是湖泊表格式 Apache Iceberg，看看它們如何解決這些挑戰。儘管兩者有所差異，但兩者都運用相同的核心思想：盡量減少高延遲存取、提早減少扇出 (fan-out)、重視運算而非遍歷 (traversal)。</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1：當場層儲存創造太多檔案時<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是一個廣泛使用的向量資料庫，專為<a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入的</a> <a href="https://zilliz.com/glossary/similarity-search">相似性搜尋而</a>設計。它早期的儲存設計反映了建立物件儲存的第一個常見方法：分開儲存每個欄位。</p>
<p>在 V1 中，<a href="https://milvus.io/docs/manage-collections.md">集合</a>中的每個欄位都是<a href="https://milvus.io/docs/glossary.md">分段</a>儲存於獨立的 binlog 檔案中。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V1 儲存配置顯示一個集合被分割成區段，每個區段在獨立的 binlog 檔案中儲存 id、向量、標量資料等欄位，另外還有獨立的 stats_log 檔案用於檔案統計。</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Milvus V1 如何定位資料？</h3><p>考慮一個簡單的查詢：<code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>元資料查詢</strong>- 查詢 etcd/MySQL 的區段清單 → 讀取各區段的 id 欄位。<code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>讀取各區段的 id 欄位</strong>- 對於每個區段，讀取 id binlog 檔案</li>
<li><strong>找出目標行</strong>- 掃描已載入的 id 資料，找出<code translate="no">id = 123</code></li>
<li><strong>讀取向量欄位</strong>- 讀取匹配區段的對應向量 binlog 檔案</li>
</ol>
<p>檔案存取總數：<strong>N × (F₁ + F₂ + ...)</strong>，其中 N = 段數，F = 每個欄位的 binlog 檔案。</p>
<p>計算結果很快就變得很難看。對於有 100 個欄位、1,000 個區段、且每個欄位有 5 個 binlog 檔案的資料集而言：</p>
<blockquote>
<p><strong>1,000 × 100 × 5 = 500,000 個檔案</strong></p>
</blockquote>
<p>即使一個查詢只觸及三個欄位，也要調用 15,000 次物件儲存 API。以每個 S3 請求 50<strong>毫秒</strong>計算，序列化延遲達<strong>750 秒</strong>，單一查詢就超過 12 分鐘。</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2：段級 Parquet 如何將 API 呼叫減少 10 倍<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>為了解決 V1 的擴充性限制，Milvus V2 做出了根本性的改變：以區<a href="https://milvus.io/docs/glossary.md">段</a>而非欄位來組織資料。V2 將資料整合為以區段為基礎的 Parquet 檔案，而不是許多小型 binlog 檔案。</p>
<p>檔案數量從<code translate="no">N × fields × binlogs</code> 降到大約<code translate="no">N</code> (每個區段一個檔案群組)。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V2 儲存配置顯示以 Parquet 檔案儲存的區段，行群包含 ID、向量和時間戳記的欄位區塊，加上包含模式和欄位統計資料的頁尾。</span> </span></p>
<p>但 V2 並未將所有欄位儲存在單一檔案中。它會依欄位大小來分組：</p>
<ul>
<li><strong> <a href="https://milvus.io/docs/scalar_index.md">小標量欄位</a></strong>（如 id、時間戳記）儲存在一起</li>
<li><strong>大型欄位</strong>(如<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密集向量</a>) 會分割成專用檔案</li>
</ul>
<p>所有檔案都屬於相同的區段，行在檔案間以索引對齊。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Parquet 檔案結構顯示列群和壓縮資料頁的行群，加上包含檔案元資料、行群元資料和列統計資料（如最小值/最大值）的頁腳</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Milvus V2 如何定位資料？</h3><p>對於相同的查詢 -<code translate="no">SELECT id, vector FROM collection WHERE id = 123</code> ：</p>
<ol>
<li><strong>元資料查詢</strong>- 擷取區段清單 → 讀取 Parquet 頁腳<code translate="no">[12345, 12346, …]</code></li>
<li><strong>讀取 Parquet footers</strong>- 擷取行群組統計資料。檢查每個行群 id 列的最小/最大值。<code translate="no">id = 123</code> 屬於第 0 行群 (min=1，max=1000)。</li>
<li><strong>只讀取需要的內容</strong>- Parquet 的列剪枝只從小字段檔案讀取 id 列，只從大字段檔案讀取<a href="https://milvus.io/docs/index-vector-fields.md">向量</a>列。只有匹配的行群會被存取。</li>
</ol>
<p>將大型欄位分割出來可帶來兩個主要好處：</p>
<ul>
<li><strong>讀取效率更高。</strong> <a href="https://zilliz.com/glossary/vector-embeddings">向量嵌入</a>佔據了儲存大小。與小欄位混合後，它們會限制行群中可容納的行數，增加檔案存取次數。將它們分離，可讓小欄位的行群容納更多行，而大型欄位則使用針對其大小最佳化的佈局。</li>
<li><strong>靈活的<a href="https://milvus.io/docs/schema.md">模式</a>演進。</strong>新增一列意味著建立一個新檔案。移除一列意味著在讀取時跳過它。不需要重寫歷史資料。</li>
</ul>
<p>結果：檔案數量減少 10 倍以上，API 呼叫減少 10 倍以上，查詢延遲從幾分鐘降至幾秒鐘。</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs. V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>外觀</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>檔案組織</td><td>依欄位分割</td><td>依區段整合</td></tr>
<tr><td>每個集合的檔案</td><td>N × 欄位 × binlogs</td><td>~N × 列群</td></tr>
<tr><td>儲存格式</td><td>自訂 binlog</td><td>Parquet (也支援 Lance 和 Vortex)</td></tr>
<tr><td>列剪枝</td><td>自然（欄位層級檔案）</td><td>Parquet 列剪枝</td></tr>
<tr><td>統計資料</td><td>獨立的 stats_log 檔案</td><td>嵌入 Parquet 頁腳</td></tr>
<tr><td>每次查詢的 S3 API 调用</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>查詢延遲</td><td>分鐘</td><td>秒</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg：元資料驅動的檔案剪枝<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg 管理湖泊系統中大量資料集的分析表。當表格跨越數以千計的資料檔案時，難題是如何縮小查詢的範圍，只查詢相關的檔案 - 而不需要掃描所有檔案。</p>
<p>Iceberg 的答案是：使用分層的元資料，<em>在</em>任何資料 I/O 發生<em>之前</em>決定要讀取哪些檔案。這與向量資料<a href="https://zilliz.com/learn/metadata-filtering-with-milvus">庫元資料過濾</a>的原理相同 - 使用預先計算的統計跳過不相關的資料。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Iceberg 數據組織顯示了一個包含 metadata.json、manifest 清單和 manifest 檔案的 metadata 目錄，以及一個包含日期分區 Parquet 檔案的數據目錄。</span> </span></p>
<p>Iceberg 使用分層的 metadata 結構。每層都會先過濾掉不相關的資料，然後再參考下一層 - 這與<a href="https://milvus.io/docs/architecture_overview.md">分散式資料庫</a>如何將元資料與資料分開以提高存取效率的精神類似。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Iceberg 四層架構：metadata.json 指向清單，清單參考包含檔案層級統計資料的清單檔案，清單檔案指向實際的 Parquet 資料檔案。</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Iceberg 如何定位資料？</h3><p>考慮：<code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>讀取 metadata.json</strong>(1 I/O) - 載入目前的快照及其清單</li>
<li><strong>讀取艙單清單</strong>(1 I/O) - 套用<a href="https://milvus.io/docs/use-partition-key.md">磁碟分割層級的</a>篩選條件以跳過整個磁碟分割 (例如，剔除所有 2023 資料)</li>
<li><strong>讀取艙單檔案</strong>(2 I/O) - 使用檔案層級的統計資料 (最小/最大日期、最小/最大數量) 來剔除無法符合查詢的檔案</li>
<li><strong>讀取資料檔案</strong>(3 I/O) - 只保留三個檔案並進行實際讀取</li>
</ol>
<p>Iceberg 不需要掃描所有 1,000 個資料檔案，只需<strong>7 次 I/O 操作</strong>即可完成查詢 - 避免 94% 以上的不必要讀取。</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">不同系統如何處理資料<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>系統</th><th>資料組織</th><th>核心定址機制</th><th>存取成本</th></tr>
</thead>
<tbody>
<tr><td>哈希表</td><td>鍵 → 陣列槽</td><td>散列函數 → 直接索引</td><td>O(1) 記憶體存取</td></tr>
<tr><td>HDFS</td><td>路徑 → 區塊 → 資料節點</td><td>記憶體內 HashMaps + 區塊計算</td><td>1 個 RPC + N 個區塊讀取</td></tr>
<tr><td>卡夫卡</td><td>主題 → 區塊 → 區段</td><td>樹狀圖 + 稀疏索引 + 連續掃描</td><td>1 次索引查詢 + 1 次資料讀取</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a>V2</td><td><a href="https://milvus.io/docs/manage-collections.md">集合</a>→ 區段 → Parquet 列</td><td>元資料查詢 + 列剪枝</td><td>N 次讀取 (N = 區段)</td></tr>
<tr><td>冰山</td><td>表 → 快照 → 摘要 → 資料檔案</td><td>分層元資料 + 統計修剪</td><td>3 次元資料讀取 + M 次資料讀取</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">高效資料定址背後的三個原則<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1.計算永遠勝於搜索</h3><p>在我們檢視過的每個系統中，最有效的最佳化都遵循相同的規則：計算資料的位置，而不是搜尋資料。</p>
<ul>
<li>HashMap 從<code translate="no">hash(key)</code> 計算陣列索引，而不是掃描</li>
<li>HDFS 從檔案偏移量計算目標區塊，而不是遍歷檔案系統元資料</li>
<li>Kafka 計算相關的區段和索引位置，而不是掃描日誌</li>
<li>Iceberg 使用謂語和檔案層級的統計資料來計算哪些檔案值得讀取</li>
</ul>
<p>計算是有固定成本的算術運算。搜尋是遍歷 - 比較、追尋指針或 I/O - 其成本會隨著資料大小而增加。當系統可以直接得出位置時，就不需要掃描。</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2.盡量減少高延遲存取</h3><p>這讓我們回到核心公式：<strong>總尋址成本 = 元資料存取 + 資料存取。</strong>每項最佳化的最終目標都是減少這些高延遲的作業。</p>
<table>
<thead>
<tr><th>模式</th><th>範例</th></tr>
</thead>
<tbody>
<tr><td>減少檔案數量以限制 API 扇出</td><td>Milvus V2 區段整合</td></tr>
<tr><td>使用統計資料提早排除資料</td><td>冰山清單修剪</td></tr>
<tr><td>在記憶體中快取元資料</td><td>HDFS NameNode、Kafka mmap 索引</td></tr>
<tr><td>以較少的隨機讀取換取較小的連續掃描</td><td>Kafka 稀疏索引</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3.統計資料可讓您及早做出決策</h3><p>在寫入時記錄簡單的資訊 - 最小值/最大值、分割邊界、行數 - 可讓系統在讀取時決定哪些檔案值得讀取，哪些可以完全跳過。</p>
<p>這是一項小投資，卻有大回報。統計資料可將檔案存取從盲目讀取轉變為深思熟慮的選擇。不論是 Iceberg 的 list-level pruning 或 Milvus V2 的 Parquet footer statistics，原理都是一樣的：寫入時的幾個位元組元資料，可以在讀取時省去數以千計的 I/O 作業。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>從 Two Sum 到 HashMap，從 HDFS 和 Kafka 到 Milvus 和 Apache Iceberg，有一種模式不斷重複：效能取決於系統如何有效率地定位資料。</p>
<p>隨著資料的成長，儲存空間也從記憶體轉移到磁碟，再轉移到物件儲存，力學會改變，但核心思想不會改變。最好的系統是計算位置而非搜尋、保持元資料接近，並使用統計資料來避免接觸不重要的資料。我們檢視過的所有效能優勢，都來自於減少高延遲存取，並盡可能縮小搜尋空間。</p>
<p>無論您是設計<a href="https://zilliz.com/learn/what-is-vector-search">向量搜尋</a>管道、建置<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料</a>的系統，或是最佳化湖泊查詢引擎，相同的等式都適用。了解您的系統如何處理資料，是讓系統變得更快的第一步。</p>
<hr>
<p>如果您正在使用 Milvus 並想要優化儲存或查詢效能，我們很樂意提供協助：</p>
<ul>
<li>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>，提出問題、分享您的架構，並向其他正在處理類似問題的工程師學習。</li>
<li><a href="https://milvus.io/office-hours">預約 20 分鐘的免費 Milvus Office Hours 課程</a>，以瞭解您的使用個案 - 無論是儲存配置、查詢調整或擴充至生產。</li>
<li>如果您想跳過基礎架構的設定，<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(Milvus管理) 提供免費的層級讓您開始使用。</li>
</ul>
<hr>
<p>當工程師開始思考資料定址和儲存設計時，會出現的幾個問題：</p>
<p><strong>問：為什麼 Milvus 要從欄位層級轉換成區段層級儲存？</strong></p>
<p>在 Milvus V1 中，每個欄位都儲存在跨區段的獨立 binlog 檔案中。對於有 100 個欄位和 1,000 個區段的資料集而言，這樣會產生數十萬個小檔案 - 每個檔案都需要自己的 S3 API 呼叫。V2 將資料整合為以區段為基礎的 Parquet 檔案，將檔案數量減少 10 倍以上，並將查詢延遲時間從幾分鐘縮短到幾秒鐘。核心洞察力：在物件儲存上，API 調用的次數比資料總量更重要。</p>
<p><strong>問：Milvus 如何有效率地處理向量搜尋和標量篩選？</strong></p>
<p>Milvus V2<a href="https://milvus.io/docs/scalar_index.md">將標量欄位</a>和<a href="https://milvus.io/docs/index-vector-fields.md">向量欄位</a>儲存在同一區段內的不同檔案群組中。標量查詢使用 Parquet 列剪枝和行群統計來跳過不相關的資料。<a href="https://zilliz.com/learn/what-is-vector-search">向量搜尋則</a>使用專用的<a href="https://zilliz.com/learn/vector-index">向量索引</a>。兩者共用相同的區段結構，因此<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">混合查詢</a>- 結合標量值篩選器與向量相似性 - 可以在相同資料上操作而不會重複。</p>
<p><strong>問：「運算重於搜尋」的原則適用於向量資料庫嗎？</strong></p>
<p>是的。<a href="https://zilliz.com/learn/vector-index">向量索引（</a>如 HNSW 和 IVF）也是基於相同的想法而建立的。它們使用圖形結構或群集中心點來計算近似鄰域，並直接跳到向量空間的相關區域，而不是將查詢向量與每個儲存向量進行比較（暴力搜尋）。這樣的折衷方式 - 以較少的精確度損失換取數量級的距離計算 - 與應用於高維<a href="https://zilliz.com/glossary/vector-embeddings">嵌入</a>資料的「運算重於搜尋」模式相同。</p>
<p><strong>問：對於物件儲存，團隊在效能上犯的最大錯誤是什麼？</strong></p>
<p>建立太多小檔案。每個 S3 GET 請求都有固定的延遲底限 (~50 ms)，不論它傳回多少資料。一個讀取 10,000 個小檔案的系統，會序列化 500 秒的延遲 - 即使總資料量不大。解決方法是整合：將小檔案合併為大檔案，使用 Parquet 等列式格式進行選擇性讀取，並維護可讓您完全跳過檔案的元資料。</p>
