---
id: 2021-11-10-milvus-hacktoberfest-2021.md
title: 結束了2021 年 Milvus 黑客節
author: Zilliz
date: 2021-11-10T00:00:00.000Z
desc: 感謝所有參與 Milvus Hacktoberfest 2021 的人！
cover: assets.zilliz.com/It_s_a_wrap_9c0b9f0b38.png
tag: Events
---
<custom-h1>結束了 - Milvus 2021 年黑客節</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_cover_a6ce8748d7.jpeg" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>圖片</span> </span></p>
<p>Hacktoberfest 已經結束，但對開源專案的貢獻卻沒有結束！</p>
<p>整個十月，我們的 repos 共收到來自<strong>36 位貢獻者</strong>(不包括我們的核心團隊) 的<strong>44 個 pull request</strong>(PR)。雖然這是 Milvus 社群第一年參加 Hacktoberfest，但我們看到的參與人數超出了我們的預期，這也顯示了大家對開放源碼精神的意識越來越強。</p>
<p>我們希望每個參與這次活動的人，都能在過程中獲得一些關於開放源碼、社群的實踐經驗或知識，以及有用的技術技能。</p>
<p>在這篇文章中，我們想邀請你一起慶祝我們的成就，以及如何在Hacktoberfest之後繼續為Milvus貢獻。</p>
<h2 id="📣-Shout-out-to-our-contributors" class="common-anchor-header"><strong>📣向我們的貢獻者致敬：</strong><button data-href="#📣-Shout-out-to-our-contributors" class="anchor-icon" translate="no">
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
    </button></h2><p>在今年的 Hacktoberfest 期間，Milvus 專案儲存<strong>庫合併了 44 個 pull request</strong>！這對各方來說都是巨大的成就。大家辛苦了！🎉</p>
<p><a href="https://github.com/parthiv11">parthiv11</a>,<a href="https://github.com/joremysh">joremysh</a>,<a href="https://github.com/noviicee">noviicee</a>,<a href="https://github.com/Biki-das">Biki-das</a>,<a href="https://github.com/Nadyamilona">Nadyamilona</a>,<a href="https://github.com/ashish4arora">ashish4arora</a>,<a href="https://github.com/Dhruvacube">Dhruvacube</a>,<a href="https://github.com/iamartyaa">iamartyaa</a>,<a href="https://github.com/RafaelDSS">RafaelDSS</a>,<a href="https://github.com/kartikcho">kartikcho</a>,<a href="https://github.com/GuyKh">GuyKh</a>,<a href="https://github.com/Deep1Shikha">Deep1Shikha</a>,<a href="https://github.com/shreemaan-abhishek">shreemaan-abhishek</a>,<a href="https://github.com/daniel-shuy">daniel-shuy</a>,<a href="https://github.com/Hard-Coder05">Hard-Coder05</a>、<a href="https://github.com/sapora1">sapora1</a>,<a href="https://github.com/Rutam21">Rutam21</a>,<a href="https://github.com/idivyanshbansal">idivyanshbansal</a>,<a href="https://github.com/Mihir501">Mihir501</a>,<a href="https://github.com/Ayushchaudhary-Github">YushChaudhary</a>,<a href="https://github.com/sreyan-ghosh">sreyan-ghosh</a>,<a href="https://github.com/chiaramistro">chiaramistro</a>,<a href="https://github.com/appledora">appledora</a>,<a href="https://github.com/luisAzcuaga">luisAzcuaga</a>,<a href="https://github.com/matteomessmer">matteomessmer</a>,<a href="https://github.com/Nadyamilona">Nadyamilona</a>,<a href="https://github.com/Tititesouris">Tititesouris</a>,<a href="https://github.com/amusfq">amusfq</a>,<a href="https://github.com/matrixji">matrixji</a>&amp;<a href="https://github.com/zamanmub">GeneralZman</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/_80b0d87746.png" alt="image-20211110180357460" class="doc-image" id="image-20211110180357460" />
   </span> <span class="img-wrapper"> <span>image-20211110180357460</span> </span></p>
<h3 id="Here-are-some-extraordinary-Milvus-Hacktoberfest-2021-contributions" class="common-anchor-header">以下是一些非凡的 Milvus Hacktoberfest 2021 貢獻：</h3><p><strong>⚙️ 新功能</strong></p>
<p><a href="https://github.com/milvus-io/milvus/issues/7706">跨平台編譯與執行 Milvus</a>by<a href="https://github.com/matrixji">matrixji</a></p>
<p><strong>(🏆 Top Contributor 🏆 )</strong></p>
<p><strong>說明文件</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">將 Hello Milvus (example_code.md) 翻譯成任何語言</a>by<a href="https://github.com/chiaramistro">chiaramistro</a>,<a href="https://github.com/appledora">appledora</a>,<a href="https://github.com/luisAzcuaga">luisAzcuaga</a>,<a href="https://github.com/matteomessmer">matteomessmer</a>,<a href="https://github.com/Nadyamilona">Nadyamilona</a>,<a href="https://github.com/Tititesouris">Tititesouris</a>&amp;<a href="https://github.com/amusfq">amusfq</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/issues/720">新增 NodeJS 範例至 example_code.md</a>by<a href="https://github.com/GuyKh">GuyKh</a></li>
<li>由<a href="https://github.com/joremysh">joremysh</a><a href="https://github.com/milvus-io/milvus-docs/pull/921/files">翻譯 upgrade.md</a>並<a href="https://github.com/milvus-io/milvus-docs/pull/892">新增和翻譯使用者指南中的參數至 CN</a></li>
<li><a href="https://github.com/milvus-io/milvus-docs/pull/753">將 tutorials/dna_sequence_classification.md 翻譯成 CN</a>&amp;<a href="https://github.com/milvus-io/milvus-docs/pull/753">將</a> <a href="https://github.com/milvus-io/milvus-docs/pull/752">reference/schema/collection_schema.md 翻譯成 CN</a>by<a href="https://github.com/daniel-shuy">daniel-shuy</a></li>
</ul>
<p><strong>🚀 Bootcamp</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/pull/858">增強 Jupyter Notebook 圖像切細值搜尋教學 </a>by<a href="https://github.com/zamanmub">generalZman</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/pull/792">修正 reverse_image_search 的 TOPK bug</a>by<a href="https://github.com/RafaelDSS">RafaelDSS</a></li>
</ul>
<p><strong>🐍 PyMilvus</strong></p>
<ul>
<li><a href="https://github.com/milvus-io/pymilvus/issues/741">更新 GitHub 問題表單 </a>(多個 repos) by<a href="https://github.com/Hard-Coder05">Hard-Coder05</a></li>
</ul>
<h3 id="Share-your-feedback-with-us" class="common-anchor-header">與我們分享您的回饋！</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h3_412b0f649b.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>非常歡迎您與我們分享您在 Milvus Hacktoberfest 2021 的經驗！不論是部落格文章、推特(@milvusio)，或是在我們的<a href="https://discuss.milvus.io/c/hacktoberfest/9">論壇</a>上發表文章，我們都會非常感激！</p>
<h2 id="Whats-Next" class="common-anchor-header">下一步是什麼？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="👩‍💻-Code--Documentation" class="common-anchor-header"><strong>👩‍💻</strong> <strong>程式碼與文件</strong></h3><p>如果您對 Milvus 認識有限，您可以先透過<a href="https://github.com/milvus-io/pymilvus">貢獻到 pymilvus</a>或<a href="https://github.com/milvus-io/milvus-docs">docs</a>repos 來熟悉社群如何運作。您也可以尋找標籤，例如<strong>#goodfirstissue</strong>或<strong>#helpwanted</strong>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h4_f18c9b6c2c.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>圖片</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/h5_a4f90c24a8.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>如果您有任何關於貢獻的問題，您可以隨時在論壇的<strong>貢獻者</strong>類別下詢問社群：https://discuss.milvus.io/t/things-you-need-to-know-before-you-get-started/64。</p>
<h3 id="🏆-Be-a-Milvus-Advocate" class="common-anchor-header">成為 Milvus 的代言人</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/advocate_1052d8249a.jpg" alt="image-20211110180730866" class="doc-image" id="image-20211110180730866" />
   </span> <span class="img-wrapper"> <span>image-20211110180730866</span> </span></p>
<p>與社群分享您的經驗與心得；提出改善的建議；回答問題並幫助 Milvus 論壇上的其他人等等。您有許多方式參與社群，我們在下面列出幾個例子，但我們歡迎任何形式的貢獻：</p>
<ul>
<li><p><strong>演示和解決方案：</strong>向 Milvus 用戶展示如何在特定場合中利用平台（如音樂推薦系統）。<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a> 中提供了許多實例。</p></li>
<li><p><strong>部落格文章、使用者故事或白皮書：</strong>撰寫高品質的內容，清楚、準確地解釋 Milvus 的技術細節。</p></li>
<li><p><strong>技術講座/現場廣播：</strong>提供講座或主持現場廣播，幫助提高 Milvus 的知名度。</p></li>
<li><p><strong>其他：</strong>任何對 Milvus 及其開放原始碼社群的發展有正面作用的內容，都將被視為符合資格。</p></li>
</ul>
<p>如需詳細資訊，請閱讀：https://milvus.io/community/milvus_advocate.md</p>
<p>最後，再次感謝您與我們一起參加今年的 Hacktoberfest，並讓我們成為您的導師與學生。感謝<a href="https://hacktoberfest.digitalocean.com/">Digital Ocean</a>又一次舉辦這個令人驚豔的活動。直到下次！</p>
<p>編碼快樂</p>
<p>Milvus 社群團隊</p>
