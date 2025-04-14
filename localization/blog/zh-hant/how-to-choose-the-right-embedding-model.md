---
id: how-to-choose-the-right-embedding-model.md
title: 如何選擇正確的嵌入模型？
author: Lumina Wang
date: 2025-04-09T00:00:00.000Z
desc: 探索選擇正確嵌入模型的必要因素和最佳實務，以達到有效的資料表示和改善效能。
cover: assets.zilliz.com/Complete_Workflow_31b4ac825c.gif
tag: Engineering
tags: >-
  Embedding Model, RAG, Model Selection, Machine Learning, Performance
  Optimization
canonicalUrl: 'https://milvus.io/blog/how-to-choose-the-right-embedding-model.md'
---
<p>在建立可理解和處理文字、影像或音訊等<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非結構化資料的</a>系統時，選擇正確的<a href="https://zilliz.com/ai-models">嵌入模型</a>是一項關鍵的決策。這些模型可將原始輸入轉換為固定大小的高維向量，以捕捉語意，從而在相似性搜尋、推薦、分類等領域實現強大的應用。</p>
<p>但並非所有的嵌入模型都是一樣的。面對如此多的選擇，您該如何選擇正確的模型呢？錯誤的選擇可能會導致次佳準確度、效能瓶頸或不必要的成本。本指南提供一個實用的架構，協助您評估和選擇最適合您特定需求的嵌入模型。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Complete_Workflow_31b4ac825c.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="1-Define-Your-Task-and-Business-Requirements" class="common-anchor-header">1.定義您的任務與業務需求<button data-href="#1-Define-Your-Task-and-Business-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>在選擇嵌入模型之前，首先要釐清您的核心目標：</p>
<ul>
<li><strong>任務類型：</strong>首先確定您要建立的核心應用程式 - 語意搜尋、推薦人系統、分類管道，或其他完全不同的應用程式。每個用例對於嵌入式應該如何表示和組織資訊都有不同的需求。舉例來說，如果您正在建置語意搜尋引擎，您需要像 Sentence-BERT 這樣的模型來捕捉查詢與文件之間細微的語意，確保相似的概念在向量空間中很接近。對於分類任務，內嵌必須反映出特定類別的結構，如此一來，相同類別的輸入在向量空間中就會被放置在相近的位置。這可讓下游分類器更容易區分類別。DistilBERT 和 RoBERTa 等模型是常用的模型。在推薦系統中，目標是找到能反映使用者與物品關係或偏好的嵌入。為此，您可能會使用專門針對隱含回饋資料訓練的模型，例如神經協同過濾 (NCF)。</li>
<li><strong>ROI 評估：</strong>根據您的特定業務環境，平衡效能與成本。關鍵任務應用程式 (如醫療診斷) 可能需要使用精確度更高的優質模型，因為這可能關係到生死存亡，而對成本敏感的大量應用程式則需要謹慎的成本效益分析。關鍵在於判斷僅僅 2-3% 的效能提升，在您的特定情況下是否足以證明可能大幅增加的成本是合理的。</li>
<li><strong>其他限制：</strong>在縮小選項的範圍時，請考慮您的技術需求。如果您需要多語言支援，許多一般模型在處理非英文內容時都很吃力，因此可能需要專門的多語言模型。如果您要處理的是專業領域 (醫療/法律)，一般用途的嵌入通常會遺漏特定領域的術語，例如，它們可能無法理解<em>「stat」</em>在醫療情境中是指<em>「立即」，</em>或<em>「consideration」</em>在法律文件中是指在合約中交換的有價值的東西。同樣地，硬體限制和延遲需求也會直接影響哪些模型對您的部署環境是可行的。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/clarify_task_and_business_requirement_b1bce2ccc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="2-Evaluate-Your-Data" class="common-anchor-header">2.評估您的資料<button data-href="#2-Evaluate-Your-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>資料的性質會嚴重影響嵌入模型的選擇。主要考慮因素包括</p>
<ul>
<li><strong>資料模式：</strong>您的資料是文字性、視覺性還是多模態性？將模型與資料類型相匹配。對於文字，請使用<a href="https://zilliz.com/learn/what-is-bert">BERT</a>或<a href="https://zilliz.com/learn/Sentence-Transformers-for-Long-Form-Text">Sentence-BERT</a>等基於轉換器的模型；對於影像，請使用<a href="https://zilliz.com/glossary/convolutional-neural-network">CNN 架構</a>或 Vision Transformers<a href="https://zilliz.com/learn/understanding-vision-transformers-vit">(ViT</a>)；對於音訊，請使用專門的模型；對於多模態應用，請使用<a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>和 MagicLens 等多模態模型。</li>
<li><strong>特定領域：</strong>考慮一般模型是否足夠，或者您是否需要瞭解專門知識的特定領域模型。在不同資料集上訓練的一般模型 (如<a href="https://zilliz.com/ai-models/text-embedding-3-large">OpenAI 文字嵌入模型</a>) 對於一般主題效果很好，但在專業領域中卻常會錯失微妙的區別。然而，在醫療保健或法律服務等領域中，這些模型經常會錯過細微的區別，因此特定領域的嵌入模型 (例如<a href="https://arxiv.org/abs/1901.08746">BioBERT</a>或<a href="https://arxiv.org/abs/2010.02559">LegalBERT</a>) 可能會比較適合。</li>
<li><strong>嵌入類型：</strong> <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">稀疏內嵌</a>擅長於關鍵字匹配，因此非常適合產品目錄或技術文件。密集嵌入則能夠更好地捕捉語義關係，因此適合自然語言查詢和意圖理解。許多生產系統（如電子商務推薦系統）都受益於同時利用這兩種類型的混合方法--例如，使用<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a>（稀疏）進行關鍵字匹配，同時加入 BERT（密集嵌入）來捕捉語義相似性。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_your_data_6caeeb813e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="3-Research-Available-Models" class="common-anchor-header">3.研究可用的模型<button data-href="#3-Research-Available-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>瞭解您的任務和資料之後，就是研究可用嵌入模型的時候了。以下是您可以採用的方法：</p>
<ul>
<li><p><strong>受歡迎程度：</strong>優先考慮具有活躍社區和廣泛採用的模型。這些模型通常受益於更好的文件、更廣泛的社群支援和定期更新。這可以大幅降低實作上的困難。熟悉您領域中的領先模型。舉例來說</p>
<ul>
<li>對於文字：考慮 OpenAI 內嵌、Sentence-BERT 變體或 E5/BGE 模型。</li>
<li>圖像：請參考 ViT 和 ResNet，或 CLIP 和 SigLIP，以進行文字與圖像的對齊。</li>
<li>音訊：查看 PNN、CLAP 或<a href="https://zilliz.com/learn/top-10-most-used-embedding-models-for-audio-data">其他常用模型</a>。</li>
</ul></li>
<li><p><strong>版權與授權</strong>：仔細評估授權的影響，因為它們會直接影響短期和長期的成本。開放原始碼模式 (如 MIT、Apache 2.0 或類似的授權) 提供修改與商業使用的彈性，讓您可以完全控制部署，但需要基礎架構的專業知識。透過 API 存取的專屬模式則提供便利性與簡易性，但也會產生持續成本與潛在的資料隱私疑慮。這一決定對於受管制行業的應用程式尤其重要，因為在這些行業中，儘管初始投資較高，但資料主權或合規性要求可能會使自行託管成為必要。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_research2_b0df75cb55.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="4-Evaluate-Candidate-Models" class="common-anchor-header">4.評估候選模式<button data-href="#4-Evaluate-Candidate-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>當您篩選出幾個模型後，就該用您的樣本資料來測試它們了。以下是您應該考慮的關鍵因素：</p>
<ul>
<li><strong>評估：</strong>評估嵌入品質（尤其是在檢索擴增生成 (RAG) 或搜尋應用程式中）時，重要的是衡量回傳結果的<em>精確度、相關性和完整性</em>。關鍵指標包括忠實度、答案相關性、上下文精確度和召回率。Ragas、DeepEval、Phoenix 和 TruLens-Eval 等框架提供了結構化的方法來評估嵌入品質的不同方面，從而簡化了評估流程。資料集對於有意義的評估同樣重要。這些資料集可以是手工製作以代表真實使用個案，也可以是由 LLM 合成以測試特定功能，或是使用 Ragas 和 FiddleCube 等工具製作以針對特定測試層面。資料集與框架的正確組合，取決於您的特定應用程式，以及您需要的評估粒度等級，才能做出有把握的決策。</li>
<li><strong>基準效能：</strong>在特定任務的基準（例如檢索的 MTEB）上評估模型。請記住，不同的情境 (檢索 vs. 分類)、資料集 (一般 vs. 特定領域，如 BioASQ) 和指標 (準確度、速度) 會造成排名上的顯著差異。雖然基準效能提供了寶貴的洞察力，但它並不總是完美地轉化為實際應用。交叉檢查與您的資料類型和目標相符的優秀表現，但務必使用您自己的自訂測試案例進行驗證，以找出可能過於符合基準，但在實際環境中與您的特定資料模式表現不佳的模型。</li>
<li><strong>負載測試：</strong>對於自行託管的模型，模擬實際的生產負載，以評估在真實世界條件下的效能。測量吞吐量以及推論過程中的 GPU 利用率和記憶體消耗，以找出潛在的瓶頸。單獨執行性能良好的模型在處理並發請求或複雜輸入時可能會出現問題。如果模型太耗用資源，則無論其基準指標的準確性如何，都可能不適合大型或即時應用程式。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/evaluate_candidate_models_3a7edd9cd7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="5-Model-Integration" class="common-anchor-header">5.模型整合<button data-href="#5-Model-Integration" class="anchor-icon" translate="no">
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
    </button></h2><p>選擇模型之後，現在是規劃整合方法的時候了。</p>
<ul>
<li><strong>權重選擇：</strong>決定使用預先訓練的權重以快速部署，或是在特定領域的資料上微調以改善效能。請記住微調可以改善效能，但需要大量資源。請考慮效能增益是否足以證明額外的複雜性是合理的。</li>
<li><strong>自行託管 vs. 第三方推論服務：</strong>根據您的基礎架構能力和需求選擇部署方式。自行託管可讓您完全控制模型和資料流，可能降低規模化的每次要求成本，並確保資料隱私。不過，這需要基礎架構的專業知識與持續維護。協力廠商推論服務提供快速部署，只需最少的設定，但會引入網路延遲、潛在的使用上限，以及在規模擴大時可能變得顯著的持續成本。</li>
<li><strong>整合設計：</strong>規劃您的 API 設計、快取策略、批次處理方式，以及<a href="https://milvus.io/blog/what-is-a-vector-database.md">向量資料庫選擇</a>，以有效率地儲存與查詢嵌入式資料。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/model_integration_8c8f0410c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="6-End-to-End-Testing" class="common-anchor-header">6.端對端測試<button data-href="#6-End-to-End-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>在全面部署之前，請執行端對端測試，以確保模型能如預期般運作：</p>
<ul>
<li><strong>效能</strong>：務必在您自己的資料集上評估模型，以確保它們在您的特定使用個案中表現良好。考慮檢索品質的 MRR、MAP 和 NDCG 等指標，準確度的精確度、召回率和 F1，以及運作效能的吞吐量和延遲百分比。</li>
<li><strong>穩健性</strong>：在不同的條件下測試模型，包括邊緣情況和多樣化的資料輸入，以驗證其執行的一致性和準確性。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/end_to_end_testing_7ae244a73b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>正如我們在本指南中所看到的，選擇正確的嵌入模型需要遵循以下六個關鍵步驟：</p>
<ol>
<li>定義您的業務需求和任務類型</li>
<li>分析您的資料特性和領域特異性</li>
<li>研究可用的模型及其授權條款</li>
<li>根據相關基準和測試資料集嚴格評估候選模型</li>
<li>考慮部署選項，規劃您的整合方法</li>
<li>在生產部署前進行全面的端對端測試</li>
</ol>
<p>透過遵循此架構，您可以針對特定使用個案，在效能、成本和技術限制之間取得平衡，進而做出明智的決策。請記住，「最佳」機型不一定是基準分數最高的機型，而是在您的作業限制下，最能滿足您特定需求的機型。</p>
<p>由於嵌入模型發展迅速，因此值得定期重新評估您的選擇，因為新的選項可能會為您的應用程式提供顯著的改善。</p>
