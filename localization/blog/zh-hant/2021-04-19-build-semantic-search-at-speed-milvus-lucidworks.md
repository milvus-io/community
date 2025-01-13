---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: 快速建立語意搜尋
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: 進一步瞭解如何使用語意機器學習方法，在組織內提供更相關的搜尋結果。
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>快速建立語意搜尋</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">語義搜尋是</a>幫助您的客戶或員工尋找正確的產品或資訊的絕佳工具。它甚至可以浮現難以索引的資訊，以獲得更好的結果。儘管如此，如果您的語意方法無法快速部署運作，它們也不會為您帶來任何好處。當系統花時間回應客戶或員工的查詢時，客戶或員工是不會坐視不理的，而且在同一時間，可能還有成千上萬的其他查詢正在被擷取。</p>
<p>如何讓語意搜尋變得快速？緩慢的語意搜尋並不能解決問題。</p>
<p>幸運的是，這正是 Lucidworks 喜歡解決的問題。我們最近測試了一個中等規模的叢集 - 詳情請繼續閱讀 - 其結果是對超過 100 萬個文件的集合達到了 1500 RPS（每秒請求量），平均回應時間約為 40 毫秒。這樣的速度真是驚人。</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">實施語意搜尋</h3><p>為了實現快如閃電的機器學習魔力，Lucidworks 使用語意向量搜尋方法實現了語意搜尋。其中有兩個關鍵部分。</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">第一部分：機器學習模型</h4><p>首先，您需要一種方法將文字編碼成數字向量。文字可以是產品說明、使用者搜尋查詢、問題，甚至是問題的答案。訓練語意搜尋模型是為了對文字進行編碼，以便將語義上與其他文字相似的文字編碼成在數字上彼此「接近」的向量。這個編碼步驟需要非常快速，才能支援每秒上千個或更多可能的客戶搜尋或使用者查詢。</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">第二部分：向量搜尋引擎</h4><p>其次，您需要一種方法來快速找到與客戶搜尋或使用者查詢最匹配的內容。模型會將文字編碼成數值向量。從那時開始，您需要將其與目錄或問題與答案清單中的所有數值向量進行比較，以找出最佳匹配點 - 與查詢向量「最接近」的向量。為此，您需要一個向量引擎，能夠有效且以極快的速度處理所有這些資訊。這個引擎可能包含數百萬個向量，而您實際上只想要與您的查詢最匹配的二十個向量。當然，它還需要每秒處理上千個這樣的查詢。</p>
<p>為了解決這些挑戰，我們在<a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">Fusion 5.3 版本</a>中加入了向量搜尋引擎<a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a>。Milvus 是開放原始碼軟體，而且速度很快。Milvus 使用 FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI 類似性搜尋</a>)，這項技術與 Facebook 用於機器學習的技術相同。需要時，它可以在<a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a> 上以更快的速度執行。當 Fusion 5.3 (或更高版本) 安裝了機器學習元件時，Milvus 會自動安裝為該元件的一部分，因此您可以輕鬆開啟所有這些功能。</p>
<p>指定集合中向量的大小（在建立集合時指定）取決於產生這些向量的模型。例如，一個指定的集合可以儲存從編碼（透過模型）產品目錄中所有產品描述所產生的向量。如果沒有像 Milvus 這樣的向量搜尋引擎，就無法在整個向量空間中進行相似性搜尋。因此，相似性搜尋必須限制於向量空間中預先選取的候選向量（例如 500），而且效能較慢、結果品質較低。Milvus 可以在多個向量集合中儲存數以千億計的向量，以確保搜尋的速度和結果的相關性。</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">使用語意搜尋</h3><p>既然我們已經稍微瞭解 Milvus 可能如此重要的原因，現在讓我們回到語意搜尋的工作流程。語意搜尋分為三個階段。在第一階段，機器學習模型被載入和/或訓練。之後，資料會被索引到 Milvus 和 Solr 中。最後一個階段是查詢階段，也就是實際進行搜尋的階段。以下我們將專注於最後兩個階段。</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">索引至 Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>如上圖所示，查詢階段的開始方式與索引階段類似，只是輸入的是查詢而非文件。對於每個查詢：</p>
<ol>
<li>查詢會傳送至<a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>索引管道。</li>
<li>然後將查詢傳送至 ML 模型。</li>
<li>ML 模型會傳回一個數值向量 (由查詢加密而成)。同樣地，模型類型決定向量的大小。</li>
<li>向量會傳送給 Milvus，然後由 Milvus 決定在指定的 Milvus 資料集中，哪些向量最符合所提供的向量。</li>
<li>Milvus 會傳回一個唯一 ID 和距離清單，對應於在步驟四中決定的向量。</li>
<li>包含這些 ID 和距離的查詢會傳送至 Solr。</li>
<li>然後，Solr 會返回與這些 ID 相關的文件的有序清單。</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">規模測試</h3><p>為了證明我們的語意搜尋流程能以客戶所需的效率執行，我們在 Google Cloud Platform 上使用 Gatling 腳本執行了規模測試，使用的是具有八個 ML 模型複本、八個查詢服務複本和一個 Milvus 實例的 Fusion 叢集。測試使用 Milvus FLAT 和 HNSW 索引執行。FLAT 索引具有 100% 的召回率，但效率較低 - 除非資料集很小。HNSW (Hierarchical Small World Graph) 索引仍然有高品質的結果，而且在較大的資料集上有較佳的效能。</p>
<p>讓我們從最近執行的範例中跳到一些數字：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">開始使用</h3><p><a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>管道的設計易於使用。Lucidworks 具有<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">預先訓練</a>好的<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">模型，這些</a>模型<a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">很容易部署</a>，而且一般都有很好的結果 - 雖然在訓練您自己的模型與預先訓練好的模型的同時，也會提供最好的結果。請立即與我們聯絡，瞭解如何在您的搜尋工具中實施這些措施，以提供更有效、更令人愉悅的結果。</p>
<blockquote>
<p>本部落格轉載自: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
