---
id: >-
  2021-11-26-accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle.md
title: 使用 Milvus 搭配 PaddlePaddle 加速推薦系統中候選人的產生
author: Yunmei
date: 2021-11-26T00:00:00.000Z
desc: 推薦人系統的最小工作流程
cover: assets.zilliz.com/Candidate_generation_9baf7beb86.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/accelerating-candidate-generation-in-recommender-systems-using-milvus-paired-with-paddlepaddle
---
<p>如果您有開發推薦器系統的經驗，您很可能至少已經成為下列其中一種情況的受害者：</p>
<ul>
<li>由於資料集數量龐大，系統在傳回結果時非常緩慢。</li>
<li>無法即時處理新插入的資料以進行搜尋或查詢。</li>
<li>推薦系統的部署令人望而生畏。</li>
</ul>
<p>本文旨在針對上述問題，介紹一個使用開源向量資料庫 Milvus 搭配深度學習平台 PaddlePaddle 的產品推薦器系統專案，為您提供一些啟發。</p>
<p>本文將簡單介紹推薦系統最基本的工作流程。接下來將介紹本專案的主要元件與實作細節。</p>
<h2 id="The-basic-workflow-of-a-recommender-system" class="common-anchor-header">推薦系統的基本工作流程<button data-href="#The-basic-workflow-of-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>在深入探討專案本身之前，讓我們先來看看推薦系統的基本工作流程。推薦系統可以根據使用者獨特的興趣和需求返回個人化的結果。要進行這樣的個人化推薦，系統需要經過候選人生成和排序兩個階段。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_29e27eb9b1.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>第一階段為候選生成，此階段會返回最相關或最相似的資料，例如符合使用者個人資料的產品或影片。在產生候選人的過程中，系統會將用戶特徵與其資料庫中儲存的資料進行比較，並擷取那些相似的資料。然後在排序過程中，系統會對擷取的資料進行評分和重新排序。最後，清單頂端的結果會顯示給使用者。</p>
<p>以我們的產品推薦系統為例，它首先會比較使用者個人資料與庫存產品的特性，篩選出符合使用者需求的產品清單。然後，系統會根據產品與使用者個人資料的相似度來評分、排序，最後將前 10 名的產品回傳給使用者。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_5850ba2c46.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<h2 id="System-architecture" class="common-anchor-header">系統架構<button data-href="#System-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>本專案的商品推薦系統使用三個元件：MIND、PaddleRec 和 Milvus。</p>
<h3 id="MIND" class="common-anchor-header">MIND</h3><p><a href="https://arxiv.org/pdf/1904.08030">MIND</a> 是 &quot;Multi-Interest Network with Dynamic Routing for Recommendation at Tmall &quot;的縮寫，是阿里巴巴集團開發的一種算法。在 MIND 提出之前，用於推薦的人工智能模型大多使用單一向量來表示用戶的各種興趣。然而，單一向量遠不足以代表用戶的確切興趣。因此，MIND 演算法被提出來將使用者的多種興趣轉換成多個向量。</p>
<p>具體來說，MIND 在候選人產生階段採用動態路由的多重興趣<a href="https://arxiv.org/pdf/2005.09347">網路</a>來處理一個使用者的多重興趣。多重興趣網路是建構在膠囊路由機制上的多重興趣萃取層。它可以用來結合使用者過去的行為與他或她的多重興趣，以提供精確的使用者個人資料。</p>
<p>下圖說明 MIND 的網路結構。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9e6f284ea2.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>為了表達使用者的特質，MIND 將使用者行為和使用者興趣作為輸入，然後送入嵌入層產生使用者向量，包括使用者興趣向量和使用者行為向量。再將使用者行為向量送入多重興趣萃取層，產生使用者興趣囊。將使用者興趣脈數與使用者行為嵌入脈數串連，並使用數個 ReLU 層進行轉換後，MIND 輸出數個使用者表示脈數。本專案定義 MIND 最終會輸出四個使用者表徵向量。</p>
<p>另一方面，產品特徵會經過嵌入層，並轉換為稀疏的項目向量。然後，每個項目向量再經過匯集層，成為密集向量。</p>
<p>當所有資料都轉換成向量時，就會引進一個額外的標籤感知注意層來引導訓練過程。</p>
<h3 id="PaddleRec" class="common-anchor-header">PaddleRec</h3><p><a href="https://github.com/PaddlePaddle/PaddleRec/blob/release/2.2.0/README_EN.md">PaddleRec</a>是一個用於推薦的大型搜尋模型庫。它是百度<a href="https://github.com/PaddlePaddle/Paddle">PaddlePaddle</a>生態系統的一部分。PaddleRec 旨在為開發人員提供一個整合的解決方案，以簡單快速的方式建立推薦系統。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_35f7526ea7.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>正如開篇所述，工程師在開發推薦系統時，往往要面對系統可用性差、部署複雜等挑戰。然而，PaddleRec 可以在以下幾方面幫助開發人員：</p>
<ul>
<li><p>易用性：PaddleRec 是一個開放原始碼的函式庫，它封裝了業界各種流行的模型，包括候選人生成、排序、重排序、多任務等模型。使用 PaddleRec，您可以即時測試模型的有效性，並透過迭代改善其效率。PaddleRec 為您提供了一種簡單的方法，讓您以優異的效能為分散式系統訓練模型。它針對稀疏向量的大規模資料處理進行了最佳化。您可以輕鬆地水平擴展 PaddleRec，並加快其運算速度。因此，您可以使用 PaddleRec 在 Kubernetes 上快速建立訓練環境。</p></li>
<li><p>支援部署：PaddleRec 為其模型提供線上部署解決方案。模型在訓練完成後可立即使用，具有彈性和高可用性的特點。</p></li>
</ul>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a>是一個向量資料庫，採用雲原生架構。它在<a href="https://github.com/milvus-io">GitHub</a>上開放原始碼，可用於儲存、索引和管理由深度神經網路和其他機器學習 (ML) 模型產生的大量嵌入向量。Milvus 封裝了數個一流的近似近鄰 (ANN) 搜尋程式庫，包括 Faiss、NMSLIB 和 Annoy。您也可以根據需要擴充 Milvus。Milvus 服務具有高可用性，並支援統一的批次與串流處理。Milvus 致力於簡化管理非結構化資料的流程，並在不同的部署環境中提供一致的使用者體驗。它具有以下特點：</p>
<ul>
<li><p>在海量資料集上進行向量搜尋時的高效能。</p></li>
<li><p>以開發人員為先的社群，提供多語言支援和工具鏈。</p></li>
<li><p>雲端可擴充性及高可靠性，即使在系統中斷的情況下亦然。</p></li>
<li><p>將標量篩選與向量類似性搜尋結合，達成混合搜尋。</p></li>
</ul>
<p>本專案使用 Milvus 來進行向量相似性搜尋與向量管理，因為 Milvus 可以解決資料頻繁更新的問題，同時維持系統的穩定性。</p>
<h2 id="System-implementation" class="common-anchor-header">系統實作<button data-href="#System-implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>要建立本專案中的商品推薦系統，需要經過以下步驟：</p>
<ol>
<li>資料處理</li>
<li>模型訓練</li>
<li>模型測試</li>
<li>產生產品項目候選<ol>
<li>資料儲存：透過訓練的模型得到項目向量，並儲存在 Milvus 中。</li>
<li>資料搜尋：將 MIND 產生的四個使用者向量輸入 Milvus 進行向量相似度搜尋。</li>
<li>資料排序：四個向量各有其<code translate="no">top_k</code> 相似的項目向量，並對四組<code translate="no">top_k</code> 向量進行排序，最後傳回<code translate="no">top_k</code> 最相似向量的清單。</li>
</ol></li>
</ol>
<p>本專案的原始碼託管於<a href="https://aistudio.baidu.com/aistudio/projectdetail/2250360?contributionType=1&amp;shared=1">百度 AI Studio</a>平台。以下將詳細說明本專案的原始碼。</p>
<h3 id="Step-1-Data-processing" class="common-anchor-header">步驟 1.資料處理</h3><p>原始資料集來自<a href="https://github.com/THUDM/ComiRec">ComiRec</a> 提供的 Amazon 書籍資料集。然而，本專案使用的是由 PaddleRec 下載並處理的資料。詳情請參考 PaddleRec 專案中的<a href="https://github.com/PaddlePaddle/PaddleRec/tree/release/2.1.0/datasets/AmazonBook">AmazonBook 資料集</a>。</p>
<p>用於訓練的資料集預計會以下列格式出現，每列代表：</p>
<ul>
<li><code translate="no">Uid</code>:使用者 ID。</li>
<li><code translate="no">item_id</code>:使用者點選的產品項目的 ID。</li>
<li><code translate="no">Time</code>:點選的時間戳記或順序。</li>
</ul>
<p>用於測試的資料集預期會以下列格式出現，每一列代表：</p>
<ul>
<li><p><code translate="no">Uid</code>:使用者 ID。</p></li>
<li><p><code translate="no">hist_item</code>:歷史使用者點選行為中產品項目的 ID。當有多個<code translate="no">hist_item</code> 時，會根據時間戳排序。</p></li>
<li><p><code translate="no">eval_item</code>:使用者點選產品的實際順序。</p></li>
</ul>
<h3 id="Step-2-Model-training" class="common-anchor-header">步驟 2.模型訓練</h3><p>模型訓練使用上一步處理過的資料，並採用建立在 PaddleRec 上的候選生成模型 MIND。</p>
<h4 id="1-Model-input" class="common-anchor-header">1.<strong>模型</strong> <strong>輸入</strong></h4><p>在<code translate="no">dygraph_model.py</code> 中，執行下列程式碼來處理資料，並將其轉換成模型輸入。此過程將原始資料中同一使用者點選的項目依時間戳排序，並將其合併形成序列。然後，從序列中隨機抽取一個<code translate="no">item``_``id</code> 作為<code translate="no">target_item</code> ，並抽取<code translate="no">target_item</code> 之前的 10 個項目，作為<code translate="no">hist_item</code> 作為模型輸入。如果序列不夠長，可以設定為 0。<code translate="no">seq_len</code> 應該是<code translate="no">hist_item</code> 序列的實際長度。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_feeds_train</span>(<span class="hljs-params">self, batch_data</span>):
    hist_item = paddle.to_tensor(batch_data[<span class="hljs-number">0</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    target_item = paddle.to_tensor(batch_data[<span class="hljs-number">1</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    seq_len = paddle.to_tensor(batch_data[<span class="hljs-number">2</span>], dtype=<span class="hljs-string">&quot;int64&quot;</span>)
    <span class="hljs-keyword">return</span> [hist_item, target_item, seq_len]
<button class="copy-code-btn"></button></code></pre>
<p>讀取原始資料集的程式碼請參考<code translate="no">/home/aistudio/recommend/model/mind/mind_reader.py</code> 。</p>
<h4 id="2-Model-networking" class="common-anchor-header">2.<strong>模型網路</strong></h4><p>以下程式碼是<code translate="no">net.py</code> 的摘錄。<code translate="no">class Mind_Capsual_Layer</code> 定義了建立在興趣囊路由機制上的多重興趣萃取層。函數<code translate="no">label_aware_attention()</code> 實作 MIND 演算法中的標籤感知注意力技術。<code translate="no">class MindLayer</code> 中的<code translate="no">forward()</code> 函式對使用者特徵進行建模，並產生相應的權重向量。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">class</span> <span class="hljs-title class_">Mind_Capsual_Layer</span>(nn.Layer):
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>(Mind_Capsual_Layer, <span class="hljs-variable language_">self</span>).__init__()
        <span class="hljs-variable language_">self</span>.iters = iters
        <span class="hljs-variable language_">self</span>.input_units = input_units
        <span class="hljs-variable language_">self</span>.output_units = output_units
        <span class="hljs-variable language_">self</span>.maxlen = maxlen
        <span class="hljs-variable language_">self</span>.init_std = init_std
        <span class="hljs-variable language_">self</span>.k_max = k_max
        <span class="hljs-variable language_">self</span>.batch_size = batch_size
        <span class="hljs-comment"># B2I routing</span>
        <span class="hljs-variable language_">self</span>.routing_logits = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-number">1</span>, <span class="hljs-variable language_">self</span>.k_max, <span class="hljs-variable language_">self</span>.maxlen],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;routing_logits&quot;</span>, trainable=<span class="hljs-literal">False</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
        <span class="hljs-comment"># bilinear mapping</span>
        <span class="hljs-variable language_">self</span>.bilinear_mapping_matrix = <span class="hljs-variable language_">self</span>.create_parameter(
            shape=[<span class="hljs-variable language_">self</span>.input_units, <span class="hljs-variable language_">self</span>.output_units],
            attr=paddle.ParamAttr(
                name=<span class="hljs-string">&quot;bilinear_mapping_matrix&quot;</span>, trainable=<span class="hljs-literal">True</span>),
            default_initializer=nn.initializer.Normal(
                mean=<span class="hljs-number">0.0</span>, std=<span class="hljs-variable language_">self</span>.init_std))
                
<span class="hljs-keyword">class</span> <span class="hljs-title class_">MindLayer</span>(nn.Layer):

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">label_aware_attention</span>(<span class="hljs-params">self, keys, query</span>):
        weight = paddle.<span class="hljs-built_in">sum</span>(keys * query, axis=-<span class="hljs-number">1</span>, keepdim=<span class="hljs-literal">True</span>)
        weight = paddle.<span class="hljs-built_in">pow</span>(weight, <span class="hljs-variable language_">self</span>.pow_p)  <span class="hljs-comment"># [x,k_max,1]</span>
        weight = F.softmax(weight, axis=<span class="hljs-number">1</span>)
        output = paddle.<span class="hljs-built_in">sum</span>(keys * weight, axis=<span class="hljs-number">1</span>)
        <span class="hljs-keyword">return</span> output, weight

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">forward</span>(<span class="hljs-params">self, hist_item, seqlen, labels=<span class="hljs-literal">None</span></span>):
        hit_item_emb = <span class="hljs-variable language_">self</span>.item_emb(hist_item)  <span class="hljs-comment"># [B, seqlen, embed_dim]</span>
        user_cap, cap_weights, cap_mask = <span class="hljs-variable language_">self</span>.capsual_layer(hit_item_emb, seqlen)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> <span class="hljs-variable language_">self</span>.training:
            <span class="hljs-keyword">return</span> user_cap, cap_weights
        target_emb = <span class="hljs-variable language_">self</span>.item_emb(labels)
        user_emb, W = <span class="hljs-variable language_">self</span>.label_aware_attention(user_cap, target_emb)

        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.sampled_softmax(
            user_emb, labels, <span class="hljs-variable language_">self</span>.item_emb.weight,
            <span class="hljs-variable language_">self</span>.embedding_bias), W, user_cap, cap_weights, cap_mask
<button class="copy-code-btn"></button></code></pre>
<p>MIND 的具體網路結構請參考腳本<code translate="no">/home/aistudio/recommend/model/mind/net.py</code> 。</p>
<h4 id="3-Model-optimization" class="common-anchor-header">3.<strong>模型優化</strong></h4><p>本專案使用<a href="https://arxiv.org/pdf/1412.6980">Adam 演算法</a>作為模型最佳化。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_optimizer</span>(<span class="hljs-params">self, dy_model, config</span>):
    lr = config.get(<span class="hljs-string">&quot;hyper_parameters.optimizer.learning_rate&quot;</span>, <span class="hljs-number">0.001</span>)
    optimizer = paddle.optimizer.Adam(
        learning_rate=lr, parameters=dy_model.parameters())
    <span class="hljs-keyword">return</span> optimizer
<button class="copy-code-btn"></button></code></pre>
<p>此外，PaddleRec 會將 hyperparameters 寫入<code translate="no">config.yaml</code> ，因此只要修改這個檔案，就可以清楚看到兩個模型的效果比較，以提高模型效率。在訓練模型時，模型效果不佳可能是由於模型未完全擬合或過度擬合所造成。因此，您可以透過修改訓練的回合數來改善。在本專案中，您只需要修改<code translate="no">config.yaml</code> 中的參數 epoch，就可以找到最完美的訓練輪數。此外，您也可以變更模型最佳化器、<code translate="no">optimizer.class</code> 或<code translate="no">learning_rate</code> 來進行除錯。以下顯示<code translate="no">config.yaml</code> 中的部分參數。</p>
<pre><code translate="no" class="language-YAML">runner:
  use_gpu: <span class="hljs-literal">True</span>
  use_auc: <span class="hljs-literal">False</span>
  train_batch_size: <span class="hljs-number">128</span>
  epochs: <span class="hljs-number">20</span>
  print_interval: <span class="hljs-number">10</span>
  model_save_path: <span class="hljs-string">&quot;output_model_mind&quot;</span>

<span class="hljs-comment"># hyper parameters of user-defined network</span>
hyper_parameters:
  <span class="hljs-comment"># optimizer config</span>
  optimizer:
    <span class="hljs-keyword">class</span>: Adam
    learning_rate: <span class="hljs-number">0.005</span>
<button class="copy-code-btn"></button></code></pre>
<p>詳細執行請參考腳本<code translate="no">/home/aistudio/recommend/model/mind/dygraph_model.py</code> 。</p>
<h4 id="4-Model-training" class="common-anchor-header">4.<strong>模型訓練</strong></h4><p>執行下列指令開始模型訓練。</p>
<pre><code translate="no" class="language-Bash">python -u trainer.py -m mind/config.yaml
<button class="copy-code-btn"></button></code></pre>
<p>模型訓練專案請參考<code translate="no">/home/aistudio/recommend/model/trainer.py</code> 。</p>
<h3 id="Step-3-Model-testing" class="common-anchor-header">步驟 3.模型測試</h3><p>此步驟使用測試資料集來驗證效能，例如訓練模型的召回率。</p>
<p>在模型測試期間，所有的項目向量都會從模型載入，然後匯入開源向量資料庫 Milvus。透過腳本<code translate="no">/home/aistudio/recommend/model/mind/mind_infer_reader.py</code> 讀取測試資料集。載入上一步的模型，並將測試資料集輸入模型，得到使用者的四個興趣向量。在 Milvus 中搜尋與這四個興趣向量最相似的 50 個項目向量。您可以將返回的結果推薦給使用者。</p>
<p>執行下列指令測試模型。</p>
<pre><code translate="no" class="language-Bash">python -u infer.py -m mind/config.yaml -top_n 50
<button class="copy-code-btn"></button></code></pre>
<p>在模型測試過程中，系統會提供幾個評估模型有效性的指標，例如 Recall@50、NDCG@50 和 HitRate@50。本文只介紹修改一個參數。然而，在您自己的應用情境中，您需要訓練更多的 epoch 次數，以獲得更好的模型效果。  您也可以透過使用不同的最佳化器、設定不同的學習率，以及增加測試的回合數來改善模型效果。建議您先儲存幾個不同效果的模型，然後選擇效能最好、最符合您應用的模型。</p>
<h3 id="Step-4-Generating-product-item-candidates" class="common-anchor-header">步驟 4.產生產品項目候選</h3><p>為了建立產品候選項產生服務，本專案使用前述步驟中訓練好的模型，搭配 Milvus。在候選項生成過程中，FASTAPI 用來提供介面。當服務啟動時，您可以直接在終端透過<code translate="no">curl</code> 執行指令。</p>
<p>執行下列命令以產生初步候選體。</p>
<pre><code translate="no" class="language-Bash">uvicorn main:app
<button class="copy-code-btn"></button></code></pre>
<p>服務提供四種介面</p>
<ul>
<li><strong>插入</strong>：執行以下指令，從您的模型讀取項目向量，並插入到 Milvus 的一個集合中。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/insert_data&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>產生初步候選產品</strong>：輸入使用者點選產品的順序，找出使用者可能點選的下一個產品。您也可以一次為多個使用者分批產生產品項目候選。以下指令中的<code translate="no">hist_item</code> 是一個二維向量，每一行代表使用者過去點選的產品序列。您可以定義序列的長度。傳回的結果也是二維向量集，每一行代表使用者傳回的<code translate="no">item id</code>s。</li>
</ul>
<pre><code translate="no" class="language-Ada">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/recall&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -H <span class="hljs-string">&#x27;Content-Type: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;{
  &quot;top_k&quot;: 50,
  &quot;hist_item&quot;: [[43,23,65,675,3456,8654,123454,54367,234561],[675,3456,8654,123454,76543,1234,9769,5670,65443,123098,34219,234098]]
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>查詢</strong> <strong>產品項目</strong><strong>總數</strong>：執行以下指令，可傳回儲存在 Milvus 資料庫中的商品向量總數。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/rec/count&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>刪除</strong>：執行下列命令，刪除儲存於 Milvus 資料庫的所有資料。</li>
</ul>
<pre><code translate="no" class="language-Nginx">curl -X <span class="hljs-string">&#x27;POST&#x27;</span> \
  <span class="hljs-string">&#x27;http://127.0.0.1:8000/qa/drop&#x27;</span> \
  -H <span class="hljs-string">&#x27;accept: application/json&#x27;</span> \
  -d <span class="hljs-string">&#x27;&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果您在本機伺服器上執行候選人產生服務，您也可以在<code translate="no">127.0.0.1:8000/docs</code> 存取上述介面。您可以點選四個介面並輸入參數值來玩玩。然後點選 "Try it out "得到推薦結果。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_43e41086f8.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_f016a3221d.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h2 id="Recap" class="common-anchor-header">小結<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>本文主要針對建立推薦系統的第一階段候選人產生。它也提供了一個解決方案，藉由結合 Milvus 與 MIND 演算法和 PaddleRec 來加速這個過程，因此也解決了開頭段落所提出的問題。</p>
<p>由於資料集數量極大，系統在傳回結果時會非常緩慢，該怎麼辦？Milvus 這個開放原始碼的向量資料庫，是為了在包含數百萬、數十億甚至數萬億向量的密集向量資料集上進行極速相似性搜尋而設計的。</p>
<p>如果新插入的資料無法即時處理以進行搜尋或查詢，該怎麼辦？您可以使用 Milvus，因為它支援統一的批次和串流處理，讓您可以即時搜尋和查詢新插入的資料。同時，MIND 模型能夠即時轉換新的使用者行為，並將使用者向量即時插入 Milvus。</p>
<p>如果複雜的部署太嚇人怎麼辦？PaddleRec 是屬於 PaddlePaddle 生態系統的強大函式庫，可以提供您整合式的解決方案，讓您輕鬆快速地部署推薦系統或其他應用程式。</p>
<h2 id="About-the-author" class="common-anchor-header">關於作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>李雲梅，Zilliz 數據工程師，畢業於華中科技大學計算機科學專業。自加入 Zilliz 以來，她一直致力於探索開源專案 Milvus 的解決方案，並幫助使用者將 Milvus 應用於實際情境中。她的主要研究方向是 NLP 和推薦系統，她希望在這兩個領域進一步深化。她喜歡獨處和閱讀。</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">尋找更多資源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li>更多建立推薦系統的使用者案例：<ul>
<li><a href="https://milvus.io/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md">使用唯品會與 Milvus 建立個人化商品推薦系統</a></li>
<li><a href="https://milvus.io/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus.md">使用 Milvus 建立衣櫃與服裝規劃應用程式</a></li>
<li><a href="https://milvus.io/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md">在搜狐新聞應用程式中建立智慧型新聞推薦系統</a></li>
<li><a href="https://milvus.io/blog/music-recommender-system-item-based-collaborative-filtering-milvus.md">以項目為基礎的協同過濾音樂推薦系統</a></li>
<li><a href="https://milvus.io/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md">與Milvus一起製作：小米手機瀏覽器內的AI驅動新聞推薦系統</a></li>
</ul></li>
<li>更多 Milvus 與其他社群合作的專案：<ul>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">使用 ONNX 和 Milvus 結合圖片搜索的 AI 模型</a></li>
<li><a href="https://milvus.io/blog/graph-based-recommendation-system-with-milvus.md">使用 Milvus、PinSage、DGL 和 Movielens 數據集建立基於圖表的推薦系統</a></li>
<li><a href="https://milvus.io/blog/building-a-milvus-cluster-based-on-juicefs.md">以 JuiceFS 為基礎建立 Milvus 叢集</a></li>
</ul></li>
<li>參與我們的開放原始碼社群：<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a>上尋找或貢獻 Milvus</li>
<li>透過<a href="https://bit.ly/3qiyTEk">論壇</a>與社群互動</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a>上與我們聯繫</li>
</ul></li>
</ul>
