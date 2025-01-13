---
id: dna-sequence-classification-based-on-milvus.md
title: 以 Milvus 為基礎的 DNA 序列分類
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: 使用開放原始碼向量資料庫 Milvus 來辨識 DNA 序列的基因家族。空間更少，但精確度更高。
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>基於 Milvus 的 DNA 序列分類</custom-h1><blockquote>
<p>作者：顧孟佳，Zilliz 的資料工程師，畢業於麥吉爾大學資訊研究碩士。她的興趣包括人工智能應用和向量資料庫的相似性搜索。作為開源專案 Milvus 的社區成員，她提供並改進了多種解決方案，如推薦系統和 DNA 序列分類模型。她喜歡挑戰，從不放棄！</p>
</blockquote>
<custom-h1>簡介</custom-h1><p>DNA 序列在學術研究和實際應用上都是一個很流行的概念，例如基因溯源、物種鑑定和疾病診斷。在各行各業都渴求更智慧、更有效率的研究方法時，人工智慧特別在生物與醫學領域吸引了許多人的注意。越來越多的科學家與研究人員投入生物資訊學中的機器學習與深度學習。為了讓實驗結果更具說服力，一個常見的選擇就是增加樣本量。與基因組學中的大數據合作，也為現實中的使用案例帶來更多可能性。然而，傳統的序列比對有其限制，使其<a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">不適用於大型資料</a>。為了在現實中少做取捨，向量化是大量 DNA 序列資料集的好選擇。</p>
<p>開放原始碼的向量資料庫<a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a>對大量資料很友善。它能夠儲存核酸序列的向量，並執行高效率的檢索。它也能幫助降低生產或研究的成本。以 Milvus 為基礎的 DNA 序列分類系統只需要幾毫秒就能完成基因分類。此外，它比其他常見的機器學習分類器顯示出更高的準確度。</p>
<custom-h1>資料處理</custom-h1><p>編碼遺傳資訊的基因是由一小部份的 DNA 序列所構成，其中包含 4 個核苷酸碱基 [A、C、G、T]。人類基因組中約有 30,000 個基因，近 30 億個 DNA 基對，每個基對有 2 個對應的碱基。為了支援多樣化的用途，DNA 序列可分為不同的類別。為了降低成本並使長 DNA 序列資料更容易使用，<a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">K-mer </a>被引入到資料預處理。同時，它使 DNA 序列資料更接近於純文字。此外，向量化的資料可以加快資料分析或機器學習的計算速度。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>k-mer 方法常用於 DNA 序列預處理。它從原始序列的每個碱基開始，抽取一小段長度為 k 的序列，從而將長度為 s 的長序列轉換為 (s-k+1) 長度為 k 的短序列。調整 k 的值可以改善模型的效能。短序列清單更容易進行資料讀取、特徵抽取和向量化。</p>
<p><strong>向量化</strong></p>
<p>DNA 序列以文字的形式進行向量化。經由 k-mer 轉換的序列會變成短序列清單，看起來就像是句子中的單字清單。因此，大多數的自然語言處理模型也應該適用於 DNA 序列資料。類似的方法可應用於模型訓練、特徵萃取和編碼。由於每個模型都有其優缺點，因此模型的選擇取決於資料的特徵和研究目的。舉例來說，CountVectorizer 是一個字袋模型，透過直接的標記化來實現特徵萃取。它對資料長度沒有限制，但返回的結果在相似性比較方面較不明顯。</p>
<custom-h1>Milvus 演示</custom-h1><p>Milvus 可以輕鬆管理非結構化資料，並在平均數毫秒的延遲時間內，在數以萬億計的向量中找出最相似的結果。它的相似性搜尋是基於近似近鄰 (ANN) 搜尋演算法。這些優點讓 Milvus 成為管理 DNA 序列向量的最佳選擇，進而促進生物資訊學的發展與應用。</p>
<p>以下是一個示範，展示如何使用 Milvus 建立 DNA 序列分類系統。<a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">實驗資料集 </a>包括 3 種生物和 7 個基因家族。所有資料都經由 k-mers 轉換為短序列清單。透過預先訓練的 CountVectorizer 模型，系統再將序列資料編碼成向量。下面的流程圖描述了系統結構以及插入和搜尋的過程。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>在<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvus Bootcamp</a> 試用這個示範。</p>
<p>在 Milvus 中，系統會建立資料庫，並將 DNA 序列的對應向量插入資料庫（如果啟用，則插入分割區）。當接收到查詢請求時，Milvus 會返回輸入 DNA 序列向量與資料庫中最相似結果之間的距離。輸入序列的類別和 DNA 序列之間的相似性可以由結果中的向量距離決定。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>DNA 序列分類</strong>在 Milvus 中搜尋最相似的 DNA 序列，可暗示未知樣本的基因家族，從而瞭解其可能的功能。<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> 如果一個序列被歸類為 GPCRs，那麼它可能對身體功能有影響。 </a>在這個示範中，Milvus 已經成功地讓系統辨識出搜尋到的人類 DNA 序列的基因家族。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>基因相似性</strong></p>
<p>生物之間的平均 DNA 序列相似性說明了他們的基因組之間有多接近。本演示在人類資料中分別搜尋與黑猩猩和狗最相似的 DNA 序列。然後計算和比較平均內積距離 (黑猩猩為 0.97，狗為 0.70)，證明黑猩猩與人類的相似基因比狗多。有了更複雜的資料和系統設計，Milvus 甚至可以支援更高層次的基因研究。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>效能</strong></p>
<p>本演示使用 80% 的人類樣本資料 (共 3629 個) 來訓練分類模型，並使用其餘的資料作為測試資料。它比較了使用 Milvus 的 DNA 序列分類模型與使用 Mysql 和 5 種常用機器學習分類器的模型的效能。以 Milvus 為基礎的模型在準確度上優於同類型的模型。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>進一步探索</custom-h1><p>隨著大數據技術的發展，DNA序列的向量化將在基因研究和實踐中扮演更重要的角色。結合生物資訊學的專業知識，DNA序列向量化的參與可以讓相關研究進一步獲益。因此，Milvus 可以在實踐中呈現更好的結果。根據不同的使用情境和使用者需求，Milvus 驅動的相似性搜尋和距離計算顯示出巨大的潛力和許多可能性。</p>
<ul>
<li><strong>研究未知序列</strong>：<a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">有研究人員指出，向量化可以壓縮 DNA 序列資料。</a>與此同時，研究未知 DNA 序列的結構、功能和演化所需的人力也較少。Milvus 可以儲存及擷取大量的 DNA 序列向量，而不會失去精確度。</li>
<li><strong>適應裝置</strong>：受限於傳統的序列比對演算法，相似性檢索幾乎無法從裝置<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">（CPU/</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">GPU</a>）的改善中獲益。Milvus 同時支援一般 CPU 運算與 GPU 加速，以近似近鄰演算法解決此問題。</li>
<li><strong>偵測病毒並追蹤源頭</strong>：<a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">科學家比較基因組序列後發現，可能源自蝙蝠的 COVID19 病毒屬於 SARS-COV</a>。基於這個結論，研究人員可以擴大樣本數量，以獲得更多證據和模式。</li>
<li><strong>診斷疾病</strong>：在臨床上，醫生可以比較病患與健康族群的 DNA 序列，以找出導致疾病的變異基因。可以使用適當的演算法擷取特徵並編碼這些資料。Milvus 能夠回傳向量之間的距離，這些距離可以與疾病資料相關。除了協助診斷疾病外，此應用程式也能<a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">啟發針對性治療</a>的研究。</li>
</ul>
<custom-h1>進一步瞭解 Milvus</custom-h1><p>Milvus 是一個功能強大的工具，能夠為大量的人工智慧和向量相似性搜尋應用提供動力。若要瞭解更多關於此專案的資訊，請參閱下列資源：</p>
<ul>
<li>閱讀我們的<a href="https://milvus.io/blog">部落格</a>。</li>
<li>在<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a> 上與我們的開放原始碼社群互動。</li>
<li>在<a href="https://github.com/milvus-io/milvus/">GitHub</a> 上使用全球最受歡迎的向量資料庫，或為其做出貢獻。</li>
<li>使用我們新的<a href="https://github.com/milvus-io/bootcamp">bootcamp</a> 快速測試和部署 AI 應用程式。</li>
</ul>
