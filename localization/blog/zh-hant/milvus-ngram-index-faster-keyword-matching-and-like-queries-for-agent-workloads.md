---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: 介紹 Milvus Ngram 索引：更快的關鍵字比對和代理工作量的 LIKE 查詢
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: 瞭解 Milvus 中的 Ngram 索引如何透過將子字串匹配轉換為有效的 n-gram 查詢，來加速 LIKE 查詢，提供快 100 倍的效能。
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>在代理系統中，<strong>情境擷取</strong>是整個管道的基礎建構區塊，為下游推理、規劃和行動提供基礎。矢量搜尋可協助代理系統擷取語意相關的情境，以捕捉大型非結構化資料集的意圖和意義。然而，僅有語意相關性往往是不夠的。代理程式管道也仰賴全文檢索來強制執行精確的關鍵字限制，例如產品名稱、功能呼叫、錯誤代碼或法律上重要的詞彙。此支援層可確保擷取的上下文不僅相關，而且明確地滿足硬性文字需求。</p>
<p>真實的工作負載持續反映出這種需求：</p>
<ul>
<li><p>客戶支援助理必須找到提及特定產品或成份的對話。</p></li>
<li><p>編碼副駕駛尋找包含精確函式名稱、API 呼叫或錯誤字串的片段。</p></li>
<li><p>法律、醫療和學術代理過濾文件中必須逐字出現的條款或引文。</p></li>
</ul>
<p>傳統上，系統會使用 SQL<code translate="no">LIKE</code> 運算符號來處理。像<code translate="no">name LIKE '%rod%'</code> 這樣的查詢很簡單，也受到廣泛的支援，但在高並發和大量資料的情況下，這種簡單性會帶來重大的效能代價。</p>
<ul>
<li><p><strong>如果沒有索引</strong>，<code translate="no">LIKE</code> 查詢會掃描整個上下文儲存區，並逐行套用模式匹配。當記錄數量達到數百萬筆時，即使是單一查詢也可能需要數秒，對於即時代理互動來說，這實在太慢了。</p></li>
<li><p><strong>即使使用傳統的反向索引</strong>，通配符模式 (例如<code translate="no">%rod%</code> ) 仍然難以最佳化，因為引擎仍必須遍歷整個字典，並在每個項目上執行模式匹配。此作業可避免行掃描，但基本上仍是線性的，因此只能帶來微不足道的改善。</p></li>
</ul>
<p>這在混合式檢索系統中造成了明顯的差距：向量搜尋能有效率地處理語意相關性，但精確關鍵字篩選往往成為管道中最慢的步驟。</p>
<p>Milvus 原生支援混合向量與全文檢索，並具備元資料篩選功能。為了解決關鍵字比對的限制，Milvus 引進了<a href="https://milvus.io/docs/ngram.md"><strong>Ngram 索引</strong></a>，透過將文字分割成小的子串並建立索引以進行有效的查詢，從而改善<code translate="no">LIKE</code> 的效能。這可大幅減少查詢執行時所檢視的資料量，在實際代理工作負載中提供<strong>數十倍至數百倍的</strong> <code translate="no">LIKE</code> 查詢<strong>速度</strong>。</p>
<p>本篇文章的其餘部分將介紹 Ngram 索引如何在 Milvus 中運作，並評估其在真實情境中的效能。</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">什麼是 Ngram 索引？<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>在資料庫中，文字篩選通常使用<strong>SQL</strong> 來表達，<strong>SQL</strong> 是用來擷取和管理資料的標準查詢語言。其最廣泛使用的文字運算符之一是<code translate="no">LIKE</code> ，它支援基於模式的字串匹配。</p>
<p>根據通配符的使用方式，LIKE 表達式大致可分為四種常見的模式類型：</p>
<ul>
<li><p><strong>Infix match</strong>(<code translate="no">name LIKE '%rod%'</code>)：匹配子串 rod 在文本中任何位置出現的記錄。</p></li>
<li><p><strong>前綴匹配</strong>(<code translate="no">name LIKE 'rod%'</code>)：匹配文字以 rod 開頭的記錄。</p></li>
<li><p><strong>後綴匹配</strong>(<code translate="no">name LIKE '%rod'</code>)：匹配文字以 rod 結尾的記錄。</p></li>
<li><p><strong>通配符匹配</strong>(<code translate="no">name LIKE '%rod%aab%bc_de'</code>)：將多個子串條件 (<code translate="no">%</code>) 與單字元通配符 (<code translate="no">_</code>) 結合為單一模式。</p></li>
</ul>
<p>雖然這些模式在外觀和表達力上有所不同，但 Milvus 中的<strong>Ngram 索引</strong>使用相同的基本方法加速所有這些模式。</p>
<p>在建立索引之前，Milvus 會將每個文字值分割成固定長度的短小、重疊子串，稱為<em>n-gram</em>。例如，當 n = 3 時，單字<strong>「Milvus」</strong>會被分解成下列 3 個字元：<strong>"Mil"、</strong> <strong>"ilv"、"</strong> <strong>lvu 「</strong>和<strong>」vus"。</strong>然後，每個 n-gram 會儲存在一個反向索引中，該索引會將子串映射到出現該子串的文件 ID 集。在查詢時，<code translate="no">LIKE</code> 條件會轉換成 n-gram 查詢的組合，讓 Milvus 可以快速篩選出大部分不匹配的記錄，並針對小得多的候選集評估模式。這就是將昂貴的字串掃描轉變為高效率的索引式查詢的原因。</p>
<p>兩個參數控制 Ngram 索引的建構方式：<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 。這兩個參數一起定義了 Milvus 產生和索引的子串長度範圍。</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>:要索引的最短子串長度。實際上，這也設定了可以從 Ngram 索引獲益的最小查詢子串長度。</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>:要索引的最長子串長度。在查詢時，它還決定了將較長的查詢字串分割成 n-gram 時所使用的最大視窗大小。</p></li>
</ul>
<p>透過索引所有長度介於<code translate="no">min_gram</code> 與<code translate="no">max_gram</code> 之間的連續子串，Milvus 建立了一致且有效率的基礎，以加速所有支援的<code translate="no">LIKE</code> 模式類型。</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Ngram 索引如何運作？<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 在兩個階段的過程中實現 Ngram 索引：</p>
<ul>
<li><p><strong>建立索引：</strong>在資料擷取過程中，為每個文件產生 n-grams，並建立反向索引。</p></li>
<li><p><strong>加速查詢：</strong>使用索引將搜尋範圍縮小到一個小的候選集，然後在這些候選集上驗證精確的<code translate="no">LIKE</code> 匹配。</p></li>
</ul>
<p>一個具體的例子可以讓您更容易理解這個過程。</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">階段 1：建立索引</h3><p><strong>將文字分解成 n-gram：</strong></p>
<p>假設我們以下列設定為文字<strong>「Apple」</strong>建立索引：</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>在此設定下，Milvus 會產生所有長度為 2 和 3 的連續子串：</p>
<ul>
<li><p>2-grams：<code translate="no">Ap</code>,<code translate="no">pp</code>,<code translate="no">pl</code> 、<code translate="no">le</code></p></li>
<li><p>3-grams：<code translate="no">App</code>,<code translate="no">ppl</code> 、<code translate="no">ple</code></p></li>
</ul>
<p><strong>建立反向索引：</strong></p>
<p>現在考慮一個包含五筆記錄的小型資料集：</p>
<ul>
<li><p><strong>文件 0</strong>：<code translate="no">Apple</code></p></li>
<li><p><strong>文件 1</strong>：<code translate="no">Pineapple</code></p></li>
<li><p><strong>文件 2</strong>：<code translate="no">Maple</code></p></li>
<li><p><strong>文件 3</strong>：<code translate="no">Apply</code></p></li>
<li><p><strong>文件 4</strong>：<code translate="no">Snapple</code></p></li>
</ul>
<p>在擷取過程中，Milvus 會為每條記錄產生 n-grams，並將它們插入一個倒轉索引中。在這個索引中</p>
<ul>
<li><p><strong>鍵</strong>是 n-grams（子串）</p></li>
<li><p><strong>值</strong>是出現 n-gram 的文件 ID 清單。</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>現在索引已完全建立。</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">第二階段：加速查詢</h3><p>當<code translate="no">LIKE</code> 過濾器執行時，Milvus 會使用 Ngram 索引，透過下列步驟加速查詢評估：</p>
<p><strong>1.擷取查詢字詞：</strong>從<code translate="no">LIKE</code> 表達式中萃取沒有通配符的連續子串 (例如，<code translate="no">'%apple%'</code> 變成<code translate="no">apple</code>)。</p>
<p><strong>2.分解查詢詞：</strong>根據查詢詞的長度 (<code translate="no">L</code>) 以及配置的<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> ，將查詢詞分解為 n 個字元。</p>
<p><strong>3.尋找每個gram &amp; intersect：</strong>Milvus 在倒排索引中尋找查詢的 n-gram 並將它們的文件 ID 清單相交，以產生一個小的候選集。</p>
<p><strong>4.驗證並返回結果：</strong>原始的<code translate="no">LIKE</code> 條件僅應用於此候選集，以決定最終結果。</p>
<p>實際上，將查詢分割成 n-gram 的方式取決於模式本身的形狀。為了瞭解其運作方式，我們將集中討論兩種常見的情況：後綴匹配 (infix matches) 和通配符匹配 (wildcard matches)。前綴和後綴匹配的行為與後綴匹配相同，因此我們將不會單獨介紹它們。</p>
<p><strong>次序匹配</strong></p>
<p>對於中位數匹配，執行取決於字面子串 (<code translate="no">L</code>) 相對於<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 的長度。</p>
<p><strong>1.<code translate="no">min_gram ≤ L ≤ max_gram</code></strong>(例如<code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>字面子串<code translate="no">ppl</code> 完全在設定的 n-gram 範圍內。Milvus 直接在倒排索引中查找 n-gram<code translate="no">&quot;ppl&quot;</code> ，產生候選文件 ID<code translate="no">[0, 1, 3, 4]</code> 。</p>
<p>由於字面本身就是索引的 n-gram，因此所有候選文件都已經滿足後綴條件。最後的驗證步驟不會消除任何記錄，結果仍然是<code translate="no">[0, 1, 3, 4]</code> 。</p>
<p><strong>2.<code translate="no">L &gt; max_gram</code></strong>(例如<code translate="no">strField LIKE '%pple%'</code>)</p>
<p>字面子串<code translate="no">pple</code> 比<code translate="no">max_gram</code> 長，因此使用<code translate="no">max_gram</code> 的視窗大小將其分解為重疊的 n-gram。加上<code translate="no">max_gram = 3</code> ，就產生了 n-gram：<code translate="no">&quot;ppl&quot;</code> 和<code translate="no">&quot;ple&quot;</code> 。</p>
<p>Milvus 在倒排索引中查找每個 n-gram：</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>將這些列表相交，得到候選集<code translate="no">[0, 1, 4]</code> 。然後，原始的<code translate="no">LIKE '%pple%'</code> 過濾器會套用在這些候選字上。三者都滿足條件，因此最終結果仍是<code translate="no">[0, 1, 4]</code> 。</p>
<p><strong>3.<code translate="no">L &lt; min_gram</code></strong>(例如<code translate="no">strField LIKE '%pp%'</code>)</p>
<p>字面子串短於<code translate="no">min_gram</code> ，因此無法分解成索引的 n-gram。在這種情況下，無法使用 Ngram 索引，Milvus 會回到預設的執行路徑，透過模式匹配的完整掃描來評估<code translate="no">LIKE</code> 條件。</p>
<p><strong>通配符匹配</strong>(例如<code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>此模式包含多個通配符，因此 Milvus 首先將其分割為連續的字面意義：<code translate="no">&quot;Ap&quot;</code> 和<code translate="no">&quot;pple&quot;</code> 。</p>
<p>然後 Milvus 獨立處理每個字面：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> 長度為 2 且在 n-gram 範圍內。</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> 比<code translate="no">max_gram</code> 長，並分解為<code translate="no">&quot;ppl&quot;</code> 和<code translate="no">&quot;ple&quot;</code> 。</p></li>
</ul>
<p>這將查詢縮小為以下 n 個字元：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> →<code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>將這些列表相交會產生單一的候選字：<code translate="no">[0]</code> 。</p>
<p>最後，原始的<code translate="no">LIKE '%Ap%pple%'</code> 過濾器會套用到第 0 個文件 (<code translate="no">&quot;Apple&quot;</code>)。由於它不滿足完整模式，最終結果集為空。</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Ngram 索引的限制與取捨<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然 Ngram 索引可以顯著改善<code translate="no">LIKE</code> 的查詢效能，但它也引入了在實際部署中應該考慮的權衡。</p>
<ul>
<li><strong>索引大小增加</strong></li>
</ul>
<p>Ngram 索引的主要成本是較高的儲存開銷。由於索引會儲存所有長度介於<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 之間的連續子串，因此當這個範圍擴大時，產生的 n-gram 數量會快速增加。每增加一個 n-gram 長度，就會有效地為每個文字值增加一整套重疊的子串，同時增加索引鍵的數量和它們的發佈清單。實際上，與標準的倒置索引相比，只要將範圍擴大一個字元，索引大小就會增加約一倍。</p>
<ul>
<li><strong>並非對所有工作負載都有效</strong></li>
</ul>
<p>Ngram 索引並不能加速每種工作負載。如果查詢模式非常不規則、包含非常短的字面意義、或在篩選階段未能將資料集縮減為小的候選集，其效能效益可能有限。在這種情況下，即使索引存在，查詢的執行成本仍可能接近完整掃描的成本。</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">評估 Ngram 索引在 LIKE 查詢上的效能<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>本基準的目標是評估 Ngram 索引在實際中如何有效地加速<code translate="no">LIKE</code> 查詢。</p>
<h3 id="Test-Methodology" class="common-anchor-header">測試方法</h3><p>為了讓其效能符合實際情況，我們將其與兩種基線執行模式進行比較：</p>
<ul>
<li><p><strong>主模式</strong>：不使用任何索引的強制執行。</p></li>
<li><p><strong>Master-inverted</strong>：使用傳統反轉索引執行。</p></li>
</ul>
<p>我們設計了兩個測試情境，以涵蓋不同的資料特性：</p>
<ul>
<li><p><strong>Wiki 文字資料集</strong>：100,000 行，每個文字欄位截斷為 1 KB。</p></li>
<li><p><strong>單字資料集</strong>：1,000,000 行，每行包含一個單字。</p></li>
</ul>
<p>在這兩種情況下，都會一致地套用下列設定：</p>
<ul>
<li><p>查詢使用<strong>下位元匹配模式</strong>(<code translate="no">%xxx%</code>)</p></li>
<li><p>Ngram 索引配置為<code translate="no">min_gram = 2</code> 和<code translate="no">max_gram = 4</code></p></li>
<li><p>為了隔離查詢執行成本並避免結果實體化開銷，所有查詢都會傳回<code translate="no">count(*)</code> ，而非完整的結果集。</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>wiki 測試，每行為內容長度截斷為 1000 的 wiki 文字，100K 行</strong></p>
<table>
<thead>
<tr><th></th><th>字面意義</th><th>時間(ms)</th><th>加速</th><th>計數</th></tr>
</thead>
<tbody>
<tr><td>大師</td><td>體育館</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>主-倒置</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Ngram</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大師</td><td>中學</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>碩士轉換</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Ngram</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大師</td><td>是一所男女合校的中學。</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>師資轉換</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>單字測試，1M 行</strong></p>
<table>
<thead>
<tr><th></th><th>字面意義</th><th>時間(毫秒)</th><th>速度提升</th><th>計數</th></tr>
</thead>
<tbody>
<tr><td>主程式</td><td>主</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>主反向</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大師</td><td>寧</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>主-反相</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Ngram</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大師</td><td>寧</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>主-反相</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>大師</td><td>國家</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>主-反相</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>主</td><td>國家</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>主-倒置</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>註：</strong>這些結果是基於五月份進行的基準測試。自此之後，Master 分支進行了額外的效能最佳化，因此在此觀察到的效能差距，預計在目前的版本中會較小。</p>
<p>基準測試結果突顯了一個明顯的模式：Ngram 索引在所有情況下都能顯著加速 LIKE 查詢，而查詢執行速度的快慢在很大程度上取決於底層文字資料的結構和長度。</p>
<ul>
<li><p>對於<strong>長文字欄位</strong>，例如截短至 1,000 位元組的 Wiki 式文件，效能提升尤其明顯。與沒有索引的暴力執行相比，Ngram 索引的速度提升了約<strong>100-200×</strong>。如果與傳統的倒轉式索引比較，改善幅度更大，可達<strong>1,200-1,900 倍</strong>。這是因為對於傳統索引方法來說，長文本的 LIKE 查詢成本特別高，而 N-gram 查詢則可以快速將搜尋空間縮小到很小的候選詞集合。</p></li>
<li><p>在由<strong>單字條目</strong>組成的資料集上，收益較小，但仍然可觀。在這種情況下，N-gram 索引的執行速度約比暴力執行快<strong>80-100 倍</strong>，比傳統的倒序索引快<strong>45-55 倍</strong>。雖然較短的文字本質上掃描成本較低，但基於「n-gram」的方法仍可避免不必要的比較，並持續降低查詢成本。</p></li>
</ul>
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
    </button></h2><p>Ngram 索引透過將文字分割成固定長度的 n-gram，並使用倒置結構為其編制索引，加速<code translate="no">LIKE</code> 查詢。此設計可將昂貴的子串比對轉變為高效率的 n-gram 查詢，然後再進行最少的驗證。因此，可以避免全文掃描，同時保留<code translate="no">LIKE</code> 的精確語意。</p>
<p>實際上，這種方法在各種工作負載中都很有效，尤其在長文字欄位的模糊比對上有很好的效果。因此，Ngram 索引非常適合用於即時情境，例如代碼搜尋、客戶支援代理、法律與醫療文件檢索、企業知識庫以及學術搜尋，在這些情境中，精確的關鍵字比對仍然是不可或缺的。</p>
<p>與此同時，Ngram Index 也能從仔細的配置中獲益。選擇適當的<code translate="no">min_gram</code> 和<code translate="no">max_gram</code> 值對平衡索引大小和查詢效能至關重要。當調整到反映真實查詢模式時，Ngram 索引可為生產系統中的高效能<code translate="no">LIKE</code> 查詢提供實用、可擴充的解決方案。</p>
<p>如需更多關於 Ngram 索引的資訊，請參閱下列說明文件：</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index | Milvus 文件</a></li>
</ul>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">進一步了解 Milvus 2.6 功能<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">介紹嵌入功能：Milvus 2.6 如何簡化矢量化和語意搜尋</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Milvus的JSON粉碎功能：彈性化JSON篩選速度提升88.9倍</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">解鎖真正的實體層級檢索：Milvus 的全新結構陣列與 MAX_SIM 功能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">在 Milvus 2.6 中將地理空間篩選和向量搜尋與幾何字段和 RTREE 結合起來</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">在 Milvus 中引入 AISAQ：十億級向量搜尋在記憶體上的成本降低了 3,200 倍</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">在 Milvus 中優化 NVIDIA CAGRA：GPU-CPU 混合方法可加快索引速度並降低查詢成本</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">將向量壓縮發揮到極致：Milvus 如何利用 RaBitQ 提供多 3 倍的查詢服務</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">基準會說謊 - 向量資料庫應該接受真正的測試 </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">我們為 Milvus 用啄木鳥取代了 Kafka/Pulsar </a></p></li>
</ul>
