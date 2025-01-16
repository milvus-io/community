---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: 第二代逐圖搜尋系統
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: 利用 Milvus 建立真實商業世界圖像相似性搜尋系統的使用者案例。
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>億萬級圖片搜尋優化之旅 (2/2)</custom-h1><p>本文是<strong>UPYUN 撰寫的 The Journey to Optimizing Billion-scale Image Search 的</strong>第二部分。如果您錯過了第一篇，請點選<a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">這裡</a>。</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">第二代逐圖搜尋系統<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第二代逐圖搜尋系統在技術上選擇 CNN + Milvus 解決方案。該系統基於特徵向量，並提供更好的技術支援。</p>
<h2 id="Feature-extraction" class="common-anchor-header">特徵萃取<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>在電腦視覺領域，人工智慧的運用已成為主流。同樣地，第二代逐圖搜尋系統的特徵萃取也使用卷積神經網路 (CNN) 作為底層技術</p>
<p>CNN 這個詞很難理解。在此，我們集中回答兩個問題：</p>
<ul>
<li>CNN 能做什麼？</li>
<li>為什麼可以使用 CNN 進行影像搜尋？</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>AI 領域有許多競賽，而影像分類是其中最重要的一項。圖像分類的工作是判斷圖片內容是關於一隻貓、一隻狗、一個蘋果、一個梨或其他類型的物件。</p>
<p>CNN 能做什麼？它可以提取特徵並識別物件。它能從多個維度擷取特徵，並衡量圖片的特徵與貓或狗的特徵有多接近。我們可以選擇最接近的作為我們的識別結果，這表明特定圖像的內容是關於貓、狗還是其他東西。</p>
<p>CNN 的物件識別功能與圖像搜尋有何關聯？我們要的不是最終的識別結果，而是從多個維度抽取出來的特徵向量。內容相似的兩張圖片的特徵向量必須接近。</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">我應該使用哪種 CNN 模型？</h3><p>答案是 VGG16。為什麼選擇它？首先，VGG16 具備良好的泛化能力，也就是說，它的用途非常廣泛。第二，VGG16 擷取的特徵向量有 512 個維度。如果維度太少，可能會影響精確度。如果維度太多，則儲存和計算這些特徵向量的成本相對較高。</p>
<p>使用 CNN 來擷取影像特徵是一個主流的解決方案。我們可以使用 VGG16 作為模型，Keras + TensorFlow 作為技術實作。以下是 Keras 的官方範例：</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>這裡萃取的特徵是特徵向量。</p>
<h3 id="1-Normalization" class="common-anchor-header">1.歸一化</h3><p>為了方便後續操作，我們通常會將特徵歸一化：</p>
<p>後續使用的也是規範化後的<code translate="no">norm_feat</code> 。</p>
<h3 id="2-Image-description" class="common-anchor-header">2.影像描述</h3><p>圖像使用<code translate="no">image.load_img</code> 方法載入<code translate="no">keras.preprocessing</code> ：</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>事實上，這是 Keras 所呼叫的 TensorFlow 方法。詳情請參閱 TensorFlow 文件。最終的圖像物件實際上是 PIL 圖像實例（TensorFlow 使用的 PIL）。</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3.位元組轉換</h3><p>在實際應用中，圖像內容通常會透過網路傳輸。因此，與其從路徑載入圖像，我們更喜歡直接將 bytes 資料轉換為圖像物件，也就是 PIL Images：</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>上面的 img 與 image.load_img 方法得到的結果相同。有兩點要注意</p>
<ul>
<li>您必須進行 RGB 轉換。</li>
<li>必須調整大小 (resize 是<code translate="no">load_img method</code> 的第二個參數 )。</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4.黑邊處理</h3><p>圖片（例如螢幕截圖）偶爾會有不少黑邊。這些黑邊沒有實用價值，而且會造成許多干擾。因此，移除黑邊也是一種常見的做法。</p>
<p>黑色邊框基本上是指所有像素都是（0，0，0）（RGB 圖像）的一行或一列像素。移除黑邊就是找出這些行或列並刪除它們。這其實是 NumPy 中的三維矩陣乘法。</p>
<p>移除水平黑邊的範例：</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>這幾乎就是我想談的使用 CNN 來擷取影像特徵並實作其他影像處理。現在讓我們來看看向量搜尋引擎。</p>
<h2 id="Vector-search-engine" class="common-anchor-header">向量搜尋引擎<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>從影像擷取特徵向量的問題已經解決。那麼剩下的問題就是</p>
<ul>
<li>如何儲存特徵向量？</li>
<li>如何計算特徵向量的相似度，也就是如何搜尋？ 開源向量搜尋引擎 Milvus 可以解決這兩個問題。到目前為止，它在我們的生產環境中運行良好。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">向量搜尋引擎 Milvus<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>從影像中萃取特徵向量是遠遠不夠的。我們還需要動態管理這些特徵向量 (新增、刪除和更新)、計算向量的相似度，以及回傳最近鄰範圍內的向量資料。開放原始碼向量搜尋引擎 Milvus 能夠很好地執行這些任務。</p>
<p>本文其餘部分將介紹具體的作法及注意事項。</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1.對 CPU 的要求</h3><p>要使用 Milvus，您的 CPU 必須支援 avx2 指令集。對於 Linux 系統，使用下列指令檢查您的 CPU 支援哪些指令集：</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>然後就會得到類似的結果：</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>接下來的 flags 就是您的 CPU 所支援的指令集。當然，這些遠遠超過我的需要。我只想看看是否支援特定的指令集，例如 avx2。只要加上 grep 篩選就可以了：</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>如果沒有返回結果，就表示不支援這個特定的指令集。那您需要更換您的機器。</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2.容量規劃</h3><p>容量規劃是我們設計系統時首先要考慮的問題。我們需要儲存多少資料？資料需要多少記憶體和磁碟空間？</p>
<p>讓我們來做一些快速的計算。向量的每個維度都是 float32。一個 float32 類型佔 4 Bytes。那麼一個 512 維的向量需要 2 KB 的儲存空間。同理：</p>
<ul>
<li>一千個 512 維向量需要 2 MB 的儲存空間。</li>
<li>一百萬個 512 維向量需要 2 GB 的儲存空間。</li>
<li>一千萬個 512 維向量需要 20 GB 儲存空間。</li>
<li>一億個 512 維向量需要 200 GB 儲存空間。</li>
<li>十億個 512 維向量需要 2 TB 的儲存空間。</li>
</ul>
<p>如果我們要將所有資料儲存在記憶體中，那麼系統至少需要相應的記憶體容量。</p>
<p>建議您使用官方的大小計算工具：Milvus 大小計算工具。</p>
<p>事實上我們的記憶體可能沒有那麼大。（記憶體不夠大也沒有什麼關係。Milvus 會自動將資料刷新到磁碟上)。除了原始向量資料之外，我們還要考慮其他資料的儲存，例如日誌。</p>
<h3 id="3-System-configuration" class="common-anchor-header">3.系統組態</h3><p>關於系統配置的詳細資訊，請參閱 Milvus 文件：</p>
<ul>
<li>Milvus 伺服器配置：https://milvus.io/docs/v0.10.1/milvus_config.md</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4.資料庫設計</h3><p><strong>集合與分區</strong></p>
<ul>
<li>Collection 也稱為 table。</li>
<li>分區指的是集合內的分區。</li>
</ul>
<p>分區的基本實作與集合的實作其實是一樣的，只是分區在集合之下。但是有了分區，資料的組織變得更有彈性。我們也可以查詢集合中的特定分區，以獲得更好的查詢結果。</p>
<p>我們可以有多少個集合和分區？集合和分區的基本資訊在 Metadata 中。Milvus 使用 SQLite (Milvus 內部整合) 或 MySQL (需要外部連線) 來管理內部元資料。如果預設使用 SQLite 來管理 Metadata，當集合和分割區的數量過大時，會造成嚴重的效能損失。因此，集合和分區的總數不應超過 50,000 個（Milvus 0.8.0 會將此數限制為 4,096 個）。如果您需要設定更大的數目，建議您透過外部連線使用 MySQL。</p>
<p>Milvus 的 collection 和 partition 所支援的資料結構非常簡單，就是<code translate="no">ID + vector</code> 。換句話說，表中只有兩列：ID 和向量資料。</p>
<p><strong>請注意</strong></p>
<ul>
<li>ID 應該是整數。</li>
<li>我們需要確保 ID 在集合中是唯一的，而不是在分割區中。</li>
</ul>
<p><strong>條件過濾</strong></p>
<p>當我們使用傳統資料庫時，我們可以指定欄位值作為過濾條件。雖然 Milvus 的過濾方式不完全相同，但我們可以使用集合和分區實現簡單的條件過濾。例如，我們有大量的圖像資料，而這些資料屬於特定的使用者。那麼我們就可以將資料依使用者分成不同的分區。因此，使用使用者作為篩選條件，其實就是指定分割區。</p>
<p><strong>結構化資料與向量映射</strong></p>
<p>Milvus 只支援 ID + 向量的資料結構。但在業務場景中，我們需要的是有業務意義的結構化資料。換句話說，我們需要透過向量找到結構化的資料。因此，我們需要透過 ID 來維護結構化資料與向量之間的映射關係。</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>選擇索引</strong></p>
<p>您可以參考以下文章：</p>
<ul>
<li>索引的種類: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>如何選擇索引：https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5.處理搜尋結果</h3><p>Milvus 的搜尋結果是 ID + 距離的集合：</p>
<ul>
<li>ID：集合中的 ID。</li>
<li>距離：距離值 0 ~ 1 表示相似程度，值越小，表示兩個向量越相似。</li>
</ul>
<p><strong>篩選 ID 為 -1 的資料</strong></p>
<p>當集合數量太少時，搜尋結果可能會包含 ID 為 -1 的資料。我們需要自行過濾掉。</p>
<p><strong>分頁</strong></p>
<p>向量的搜尋方式相當不同。查詢結果會以相似度降序排序，並選取最相似 (topK) 的結果 (topK 由使用者在查詢時指定)。</p>
<p>Milvus 不支援分頁。如果我們有業務上的需要，我們需要自行實作分頁功能。舉例來說，如果我們每頁有十個結果，但只想顯示第三頁，我們就需要指定 topK = 30，並只傳回最後的十個結果。</p>
<p><strong>業務的相似性臨界值</strong></p>
<p>兩張圖片向量之間的距離介乎 0 和 1 之間，如果我們要在特定的商業情境中判斷兩張圖片是否相似，就需要在這個範圍內指定一個臨界值。如果距離小於臨界值，則兩個影像相似；如果距離大於臨界值，則兩個影像差異很大。您需要根據自己的業務需求調整臨界值。</p>
<blockquote>
<p>本文作者 rifewang，Milvus 用戶，UPYUN 軟體工程師。如果您喜歡這篇文章，歡迎來 @ https://github.com/rifewang 打個招呼。</p>
</blockquote>
