---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: 基於關鍵字的搜尋
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: Tokopedia使用Milvus建立了一個10倍智能的搜索系統，大大提升了用戶體驗。
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>我們如何利用語意搜尋讓我們的搜尋更聰明10倍</custom-h1><p>在 Tokopedia，我們了解只有當買家能夠找到與他們相關的產品時，我們的產品資料庫才能發揮其價值，因此我們致力於改善搜尋結果的相關性。</p>
<p>為了進一步提升<strong>搜尋結果</strong>的<strong>相關性</strong>，我們在 Tokopedia 上推出<strong>相似性搜尋</strong>。如果您在行動裝置上進入搜尋結果頁面，您會發現一個「...」按鈕，它會顯示一個選單，讓您選擇搜尋與該產品相似的產品。</p>
<h2 id="Keyword-based-search" class="common-anchor-header">基於關鍵字的搜尋<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia 搜尋使用<strong>Elasticsearch</strong>來進行產品搜尋與排序。對於每個搜尋請求，我們先查詢 Elasticsearch，Elasticsearch 會根據搜尋查詢對商品進行排序。ElasticSearch 會將每個單字儲存為一連串數字，代表每個字母的<a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a>(或 UTF) 碼。它會建立一個<a href="https://en.wikipedia.org/wiki/Inverted_index">反向索引</a>，以快速找出哪些文件包含使用者查詢的字詞，然後運用各種評分演算法找出其中最匹配的文件。這些評分演算法幾乎不注意字詞的意思，而只注意它們在文件中出現的頻率、彼此的接近程度等。ASCII 表示法顯然包含足夠的資訊來傳達語意 (畢竟我們人類可以理解)。不幸的是，電腦沒有一個很好的演算法來比較 ASCII 編碼字詞的意義。</p>
<h2 id="Vector-representation" class="common-anchor-header">向量表示法<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>其中一個解決方案是想出另一種表示方法，它不僅能告訴我們單字所包含的字母，還能告訴我們一些有關它的意義。舉例來說，我們可以編碼<em>我們的單字經常與哪些其他單字一起使用</em>(以可能的上下文來表示)。然後，我們會假設相似的上下文代表相似的事物，並嘗試使用數學方法來比較它們。我們甚至可以找到一種方法，將整個句子按照其意義進行編碼。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>部落格_我們如何使用語意搜尋讓我們的搜尋聰明十倍_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">選擇嵌入相似性搜尋引擎<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>現在我們有了特徵向量，剩下的問題就是如何從大量向量中檢索出與目標向量相似的向量。說到嵌入式搜尋引擎，我們在 Github 上的幾個引擎上進行了 POC 嘗試，其中包括 FAISS、Vearch、Milvus。</p>
<p>根據負載測試的結果，我們比其他引擎更偏好 Milvus。一方面，我們之前在其他團隊中使用過 FAISS，因此想嘗試一些新的東西。相較於 Milvus，FAISS 更像是一個底層函式庫，因此使用上不太方便。當我們對 Milvus 有了更多了解之後，我們最終決定採用 Milvus，因為它有兩個主要特點：</p>
<ul>
<li><p>Milvus 非常容易使用。您只需要拉取其 Docker 映像檔，並根據自己的使用情境更新參數即可。</p></li>
<li><p>它支援更多索引，並有詳細的支援說明文件。</p></li>
</ul>
<p>一言以蔽之，Milvus 對使用者非常友善，說明文件也相當詳盡。如果您遇到任何問題，通常可以在說明文件中找到解決方案；否則，您可以隨時從 Milvus 社群獲得支援。</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvus 集群服務<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>在決定使用 Milvus 作為功能向量搜尋引擎之後，我們決定使用 Milvus 來處理其中一個廣告服務用例，我們希望<a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">將低填充率的</a>關鍵字與高填充率的關鍵字進行匹配。我們在開發 (DEV) 環境中配置了一個獨立節點，並開始提供服務，它已經運行了好幾天，並為我們提供了改進的 CTR/CVR 指標。如果獨立節點在生產中當機，整個服務將無法使用。因此，我們需要部署高可用性的搜尋服務。</p>
<p>Milvus 提供集群分片中介軟體 Mishards 和用於設定的 Milvus-Helm。在 Tokopedia 中，我們使用 Ansible playbook 來設定基礎架構，因此我們建立了一個 playbook 來進行基礎架構的協調。下圖來自 Milvus 的說明文件，顯示 Mishards 如何運作：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_3.png</span> </span></p>
<p>Mishards 將上游的請求逐級下傳到其子模組，分割上游的請求，然後將子服務的結果收集並傳回給上游。基於 Mishards 的叢集解決方案的整體架構如下所示：<span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_我們如何使用語意搜尋讓我們的搜尋更聰明 10 倍_4.jpeg</span> </span></p>
<p>官方文件對 Mishards 有清楚的介紹。如果您有興趣，可以參考<a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>。</p>
<p>在我們的 keyword-to-keyword 服務中，我們使用 Milvus ansible 在 GCP 部署了一個可寫節點、兩個唯讀節點和一個 Mishards 中介軟體實例。到目前為止都很穩定。類似性搜尋引擎所依賴的百萬、十億甚至萬億向量資料集之所以能夠有效率地進行查詢，其中一個重要的組成部分就是<a href="https://milvus.io/docs/v0.10.5/index.md">索引</a>，這是一個組織資料的過程，可大幅加快大資料搜尋的速度。</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">向量索引如何加速相似性搜尋？<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>相似性搜索引擎的工作原理是將輸入內容與資料庫進行比較，找出與輸入內容最相似的物件。索引是有效組織資料的過程，它透過大幅加速大型資料集上耗時的查詢，在使相似性搜尋有用方面扮演重要角色。在對大量向量資料集建立索引之後，可以將查詢路由到最有可能包含與輸入查詢相似的向量的叢集或資料子集。實際上，這意味著要犧牲某種程度的精確度，以加快真正大型向量資料的查詢速度。</p>
<p>我們可以拿字典來做類比，字典中的單字是依字母順序排序的。在查詢單字時，可以快速導覽到只包含首字母相同的單字的部分 - 大幅加快搜尋輸入單字的定義。</p>
<h2 id="What-next-you-ask" class="common-anchor-header">您會問，接下來怎麼辦？<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>部落格_我們如何使用語意搜尋使我們的搜尋聰明 10 倍_5.jpeg</span> </span></p>
<p>如上所示，沒有適合所有人的解決方案，我們總是想改善用來取得嵌入資料的模型效能。</p>
<p>此外，從技術角度來看，我們希望同時執行多個學習模型，並比較不同實驗的結果。請密切注意我們的實驗，例如圖片搜尋、影片搜尋。</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">參考資料：<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards 文件：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>本部落格文章轉載自：https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>閱讀其他<a href="https://zilliz.com/user-stories">使用者故事</a>，瞭解更多關於使用 Milvus 製作的事項。</p>
