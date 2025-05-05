---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: 實作教學：使用 Dify 和 Milvus 在 10 分鐘內建立由 RAG 驅動的文件助理
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  在這個快速、實際的開發人員教學中，學習如何使用 Dify 和 Milvus 的 Retrieval Augmented Generation (RAG)
  建立 AI Powered 的文件助理。
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如果您能將整個文件庫 - 數千頁的技術規格、內部 wiki 和程式碼文件 - 轉換成可立即回答特定問題的智慧型 AI 助理呢？</p>
<p>更棒的是，如果您可以在比修復合併衝突更短的時間內建立它，那會如何？</p>
<p>如果以正確的方式實作，這就是<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation</a>(RAG) 的承諾。</p>
<p>雖然 ChatGPT 和其他 LLM 令人印象深刻，但當被問及您公司的特定文件、程式碼庫或知識庫時，它們很快就達到極限。RAG 可將您的專屬資料整合至對話中，提供您與工作直接相關的 AI 功能，從而彌補這方面的不足。</p>
<p>問題何在？傳統的 RAG 實作是這樣的</p>
<ul>
<li><p>撰寫自訂嵌入生成管道</p></li>
<li><p>設定與部署向量資料庫</p></li>
<li><p>設計複雜的提示範本</p></li>
<li><p>建立檢索邏輯和相似性臨界值</p></li>
<li><p>建立可用的介面</p></li>
</ul>
<p>但如果您可以直接跳到結果呢？</p>
<p>在本教程中，我們將使用兩種開發人員專用的工具建立一個簡單的 RAG 應用程式：</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>：一個開放原始碼平台，以最少的設定處理 RAG 協調</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: 速度極快的開放原始碼向量資料庫，專門用於相似性搜尋和人工智慧搜尋。</p></li>
</ul>
<p>在這份 10 分鐘的指南完結時，您將可以擁有一個可用的 AI 助理，它可以回答您提出的任何文件集的詳細問題，而且不需要任何機器學習學位。</p>
<h2 id="What-Youll-Build" class="common-anchor-header">您將會建立<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>只要花幾分鐘的時間，您就可以建立</p>
<ul>
<li><p>將任何 PDF 轉換為可查詢知識的文件處理管道</p></li>
<li><p>一個向量搜尋系統，可以準確找到正確的資訊</p></li>
<li><p>能精確回答技術問題的聊天機介面</p></li>
<li><p>可與現有工具整合的可部署解決方案</p></li>
</ul>
<p>最棒的是什麼？大部分都是透過簡單的使用者介面 (UI) 而非自訂程式碼來設定。</p>
<h2 id="What-Youll-Need" class="common-anchor-header">您將需要<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>基本的 Docker 知識 (僅限<code translate="no">docker-compose up -d</code> 級別)</p></li>
<li><p>OpenAI API 密鑰</p></li>
<li><p>一份要做實驗的 PDF 文件 (我們會使用一篇研究論文)</p></li>
</ul>
<p>準備好在最短的時間內建立實際有用的東西了嗎？讓我們開始吧！</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">使用 Milvus 和 Dify 建立您的 RAG 應用程式<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>在本節中，我們將使用 Dify 建立一個簡單的 RAG 應用程式，我們可以針對研究論文中的資訊提出問題。對於研究論文，您可以使用任何您想要的論文；然而，在本例中，我們將使用介紹我們使用 Transformer 架構的著名論文 &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;。</p>
<p>我們會使用 Milvus 作為向量儲存，在這裡我們會儲存所有必要的上下文。至於嵌入模型和 LLM，我們會使用 OpenAI 的模型。因此，我們需要先設定 OpenAI API 金鑰。您可以<a href="https://platform.openai.com/docs/quickstart"> 在此</a>瞭解更多設定資訊。</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">步驟 1：啟動 Dify 和 Milvus Containers</h3><p>在這個範例中，我們會使用 Docker Compose 自行託管 Dify。因此，在我們開始之前，請確認本機上已安裝 Docker。如果尚未安裝，請參考 Docker 的<a href="https://docs.docker.com/desktop/"> 安裝頁面安裝</a> Docker。</p>
<p>安裝好 Docker 後，我們需要使用下列指令將 Dify 原始碼複製到本機：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>接下來，到您剛克隆的原始碼內的<code translate="no">docker</code> 目錄。在那裡，您需要使用下列指令複製<code translate="no">.env</code> 檔案：</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>一言以蔽之，<code translate="no">.env</code> 檔案包含設定 Dify 應用程式所需的配置，例如向量資料庫的選擇、存取向量資料庫所需的憑證、Dify 應用程式的位址等。</p>
<p>既然我們要使用 Milvus 作為向量資料庫，那麼我們需要將<code translate="no">.env</code> 檔案內的<code translate="no">VECTOR_STORE</code> 變數值改為<code translate="no">milvus</code> 。此外，我們也需要將<code translate="no">MILVUS_URI</code> 變數改成<code translate="no">http://host.docker.internal:19530</code> ，以確保 Docker 容器之間在部署之後，不會有通訊上的問題。</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>現在我們準備啟動 Docker containers。為此，我們只需執行<code translate="no">docker compose up -d</code> 指令。完成後，您會在終端機中看到類似的輸出，如下所示：</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我們可以使用<code translate="no">docker compose ps</code> 指令檢查所有容器的狀態，看看它們是否健康地運作。如果它們都健康，您會看到如下輸出：</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最後，如果我們前往<a href="http://localhost/install"> </a>http://localhost/install，您會看到一個 Dify 登陸頁面，在這裡我們可以註冊並立即開始建立我們的 RAG 應用程式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>註冊完成後，您就可以使用憑證登入 Dify。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">步驟 2：設定 OpenAI API 金鑰</h3><p>註冊 Dify 之後，我們需要做的第一件事就是設定 API 金鑰，用來呼叫嵌入模型以及 LLM。由於我們要使用 OpenAI 的模型，因此我們需要在設定檔中插入 OpenAI API 金鑰。要這樣做，請將滑鼠游標放在 UI 右上方的設定檔上，進入「設定」，如下圖所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接下來，移至「模型提供者」，將游標停留在 OpenAI 上，然後按一下「設定」。接下來，您會看到一個彈出畫面，提示您輸入 OpenAI API 金鑰。完成後，我們就可以使用 OpenAI 的模型作為我們的嵌入模型和 LLM。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">步驟 3：將文件插入知識庫</h3><p>現在讓我們為 RAG 應用程式儲存知識庫。知識庫包含內部文件或文字的集合，這些文件或文字可作為相關上下文，協助 LLM 產生更精確的回應。</p>
<p>在我們的使用個案中，我們的知識庫基本上就是「注意就是你所需要的一切」文件。但是，由於多種原因，我們無法原封不動地儲存這份文件。首先，這篇論文太長了，給 LLM 過長的上下文也沒有幫助，因為上下文太廣泛了。其次，如果輸入的是原始文字，我們就無法執行相似性搜尋來取得最相關的上下文。</p>
<p>因此，在將論文儲存到知識庫之前，我們至少需要採取兩個步驟。首先，我們需要將論文分為文字區塊，然後透過嵌入模型將每個區塊轉換為嵌入。最後，我們可以將這些 embeddings 儲存到 Milvus 中，作為我們的向量資料庫。</p>
<p>Dify 可讓我們輕鬆地將論文中的文字分割成文本區塊，並將它們轉換成嵌入式資料。我們只需上傳論文的 PDF 檔案、設定chunk 長度、透過滑桿選擇嵌入模型。要完成所有這些步驟，請前往「知識」，然後按一下「建立知識」。接下來，系統會提示您從本機電腦上傳 PDF 檔案。因此，您最好先從 ArXiv 下載論文，並儲存在電腦上。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上傳檔案後，我們就可以設定分塊長度、索引方法、要使用的嵌入模型，以及擷取設定。</p>
<p>在「Chunk Setting」區域，您可以選擇任何數字作為最大的 chunk 長度（在我們的使用案例中，我們將設定為 100）。接下來，在「索引方法」中，我們需要選擇「高品質」選項，因為它可以讓我們執行相似性搜尋來找到相關的上下文。至於「嵌入模型」，您可以選擇 OpenAI 的任何嵌入模型，但在本範例中，我們要使用 text-embedding-3-small 模型。最後，在「Retrieval Setting」中，我們需要選擇「Vector Search」，因為我們要執行相似性搜尋，找出最相關的上下文。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在，如果您點選「Save &amp; Process」（儲存與處理），一切順利，您會看到一個綠色的勾出現，如下圖的截圖所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">步驟 4：建立 RAG App</h3><p>到此為止，我們已經成功地創建了一個知識庫，並將其存儲到我們的 Milvus 資料庫中。現在我們準備建立 RAG 應用程式。</p>
<p>使用 Dify 創建 RAG 應用程式非常簡單直接。我們需要進入 "Studio「 而不是像之前的 」Knowledge「，然後點選 」Create from Blank"。接下來，選擇「聊天機」作為應用程式類型，並在提供的欄位中為您的應用程式命名。完成後，按一下「建立」。現在您會看到以下頁面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在 「指令 」欄位下，我們可以寫一個系統提示，例如 「簡明地回答使用者的詢問」。接下來，作為 "Context「，我們需要點擊 」Add "符號，然後將剛剛建立的知識庫加入其中。這樣，我們的 RAG 應用程式就可以從這個知識庫中取得可能的上下文，以回答使用者的查詢。</p>
<p>現在我們已將知識庫加入 RAG 應用程式，最後要做的就是從 OpenAI 選擇 LLM。您可以點選右上角的模型清單，如下圖所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在我們可以發佈我們的 RAG 應用程式了！在右上角，點選「發佈」，您可以找到許多發佈 RAG 應用程式的方法：我們可以簡單地在瀏覽器中執行、嵌入到我們的網站上，或透過 API 存取應用程式。在這個範例中，我們只需在瀏覽器中執行應用程式，因此可以點選「執行應用程式」。</p>
<p>就這樣！現在您可以向 LLM 查詢任何與「Attention is All You Need」論文或我們知識庫中包含的任何文件相關的問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>現在您已經使用 Dify 和 Milvus 建立了一個可用的 RAG 應用程式，只需最少的程式碼和設定。這個方法讓開發人員可以使用複雜的 RAG 架構，而不需要向量資料庫或 LLM 整合方面的深厚專業知識。 主要心得：</p>
<ol>
<li><strong>低設定開銷</strong>：使用 Docker Compose 簡化部署</li>
<li><strong>無程式碼/低程式碼協調</strong>：Dify 可處理大部分的 RAG 管線</li>
<li><strong>生產就緒的向量資料庫</strong>：Milvus 提供高效率的嵌入儲存與檢索</li>
<li><strong>可擴充的架構</strong>：易於新增文件或調整參數 對於生產部署，請考慮</li>
</ol>
<ul>
<li>為您的應用程式設定認證</li>
<li>為 Milvus 配置適當的擴充（特別是針對較大的文件集）</li>
<li>為您的 Dify 和 Milvus 實例實施監控</li>
<li>微調擷取參數以獲得最佳效能 Dify 與 Milvus 的結合可快速開發 RAG 應用程式，有效利用您組織的內部知識與現代大型語言模型 (LLM)。 祝您建置愉快！</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">其他資源<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dify 文件</a></li>
<li><a href="https://milvus.io/docs">Milvus 文件</a></li>
<li><a href="https://zilliz.com/learn/vector-database">向量資料庫基礎</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 實作模式</a></li>
</ul>
