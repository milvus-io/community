---
id: how-to-get-the-right-vector-embeddings.md
title: 如何取得正確的向量嵌入
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: 全面介紹向量嵌入以及如何使用流行的開放原始碼模型產生向量嵌入。
cover: assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Embeddings, Image Embeddings, Text Embeddings
recommend: true
canonicalUrl: 'https://zilliz.com/blog/how-to-get-the-right-vector-embeddings'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_to_Get_the_Right_Vector_Embedding_d9ebcacbbb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>本文最初發表於<a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a>，經授權後在此轉載。</em></p>
<p><strong>全面介紹向量嵌入以及如何使用流行的開放原始碼模型產生向量嵌入。</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>圖片：Денис Марчук 來自 Pixabay</span> </span></p>
<p>向量嵌入在處理<a href="https://zilliz.com/blog/vector-similarity-search">語意相似性</a>時非常重要。不過，向量只是一連串的數字；向量嵌入則是代表輸入資料的一連串數字。使用向量內嵌，我們可以<a href="https://zilliz.com/blog/introduction-to-unstructured-data">將非結構化的資料</a>結構化，或將任何類型的資料轉換成一連串的數字來處理。這種方法讓我們可以對輸入資料執行數學運算，而不是依賴於定性比較。</p>
<p>向量內嵌對許多任務都很有影響力，特別是對於<a href="https://zilliz.com/glossary/semantic-search">語意搜尋</a>。然而，在使用之前，取得適當的向量內嵌是至關重要的。舉例來說，如果您使用圖像模型來向量化文字，或反之亦然，您很可能會得到很差的結果。</p>
<p>在這篇文章中，我們將學習向量嵌入的意義、如何使用不同的模型為您的應用程式產生適當的向量嵌入，以及如何透過向量資料庫 (例如<a href="https://milvus.io/">Milvus</a>和<a href="https://zilliz.com/">Zilliz Cloud</a>) 來善用向量嵌入。</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">向量內嵌是如何產生的？<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_vector_embeddings_are_created_03f9b60c68.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>既然我們瞭解向量內嵌的重要性，讓我們來瞭解它們如何運作。向量嵌入是深度學習模型（也稱為嵌入模型或深度神經網路）中輸入資料的內部表示。那麼，我們如何擷取這些資訊呢？</p>
<p>我們透過移除最後一層，並從倒數第二層的輸出取得向量。神經網路的最後一層通常會輸出模型的預測，因此我們取倒數第二層的輸出。向量嵌入是饋送給神經網路預測層的資料。</p>
<p>向量嵌入的維度等同於模型中倒數第二層的大小，因此可與向量的大小或長度互換。常見的向量維度包括 384 (由 Sentence Transformers Mini-LM 產生)、768 (由 Sentence Transformers MPNet 產生)、1,536 (由 OpenAI 產生) 和 2,048 (由 ResNet-50 產生)。</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">向量嵌入是什麼意思？<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>曾經有人問我向量嵌入中每個維度的意義。簡短的答案是沒什麼。向量內嵌中的單一維度沒有任何意義，因為它太抽象，無法確定其意義。但是，當我們把所有的維度放在一起時，它們就提供了輸入資料的語意。</p>
<p>向量的維度是不同屬性的高層次抽象表示。所代表的屬性取決於訓練資料和模型本身。文字模型和圖像模型會產生不同的內嵌，因為它們是針對根本不同的資料類型所訓練的。即使是不同的文字模型也會產生不同的嵌入。有時它們的大小不同，有時它們代表的屬性也不同。例如，針對法律資料訓練的模型與針對健康照護資料訓練的模型會學到不同的東西。我在<a href="https://zilliz.com/blog/comparing-different-vector-embeddings">比較向量內嵌</a>的文章中探討過這個主題。</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">產生正確的向量內嵌<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>如何獲得正確的向量嵌入？首先要確定您想要嵌入的資料類型。本節涵蓋嵌入五種不同類型的資料：影像、文字、音訊、視訊和多模態資料。我們在此介紹的所有模型都是開放原始碼，來自 Hugging Face 或 PyTorch。</p>
<h3 id="Image-embeddings" class="common-anchor-header">圖像嵌入</h3><p>2012 年，AlexNet 一炮而紅，圖像識別隨之興起。自此之後，電腦視覺領域見證了無數的進步。最新的顯著圖像識別模型是 ResNet-50，這是基於前 ResNet-34 架構的 50 層深度殘差網路。</p>
<p>殘差神經網路 (ResNet) 使用捷徑連接解決了深度卷積神經網路中的梯度消失問題。這些連接允許較早層的輸出直接進入較後層，而不經過所有中間層，從而避免了虛擬梯度問題。這種設計使得 ResNet 的複雜度低於 VGGNet (Visual Geometry Group)，VGGNet 是之前表現最出色的卷繞神經網路。</p>
<p>我推薦兩個 ResNet-50 實作為範例： <a href="https://huggingface.co/microsoft/resnet-50">Hugging Face 上的 ResNet 50</a>和<a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">PyTorch Hub 上的 ResNet 50</a>。雖然網路相同，但獲得嵌入的過程卻不同。</p>
<p>以下的程式碼範例展示了如何使用 PyTorch 取得向量內嵌。首先，我們從 PyTorch Hub 載入模型。接下來，我們移除最後一層，並呼叫<code translate="no">.eval()</code> 來指示模型的行為，就像它正在執行推論一樣。接著，<code translate="no">embed</code> 函式產生向量嵌入。</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace 使用稍微不同的設定。以下程式碼示範如何從 Hugging Face 取得向量內嵌。首先，我們需要<code translate="no">transformers</code> 函式庫中的特徵萃取器和模型。我們會使用特徵萃取器來取得模型的輸入，並使用模型來取得輸出和萃取最後的隱藏狀態。</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, AutoModelForImageClassification


extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)
model = AutoModelForImageClassification.from_pretrained(<span class="hljs-string">&quot;microsoft/resnet-50&quot;</span>)


<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Text-embeddings" class="common-anchor-header">文字嵌入</h3><p>自從人工智能發明以來，工程師和研究人員就一直在實驗自然語言和人工智能。最早的一些實驗包括</p>
<ul>
<li>ELIZA, 第一個 AI 治療師聊天機器人。</li>
<li>John Searle's Chinese Room，一個研究中英文互譯能力是否需要理解語言的思想實驗。</li>
<li>英語與俄語之間基於規則的翻譯。</li>
</ul>
<p>AI 對自然語言的操作已從其基於規則的嵌入顯著演進。從初級神經網路開始，我們透過 RNN 增加遞歸關係來追蹤時間步驟。從此，我們使用轉換器來解決序列轉換問題。</p>
<p>轉換器由編碼器、注意矩陣和解碼器組成，編碼器將輸入編碼為代表狀態的矩陣。解碼器對狀態和注意力矩陣進行解碼，以預測正確的下一個符號來完成輸出序列。GPT-3 是目前最流行的語言模型，包含嚴格的解碼器。它們對輸入進行編碼，並預測正確的下一個符號。</p>
<p>以下是兩個來自 Hugging Face 的<code translate="no">sentence-transformers</code> 函式庫的模型，除了 OpenAI 的 embeddings 之外，您還可以使用這些模型：</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: 一個 384 維的模型</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>：768 維模型</li>
</ul>
<p>您可以以相同的方式存取這兩種模型的嵌入式資料。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">多模態嵌入</h3><p>多模態模型不如圖像或文字模型那麼完善。它們通常將圖像與文字相關聯。</p>
<p>最有用的開放原始碼範例是<a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>，這是一種圖像轉文字模型。您可以像存取圖像模型一樣存取 CLIP VIT 的嵌入，如下所示。</p>
<pre><code translate="no"><span class="hljs-comment"># Load model directly</span>
<span class="hljs-keyword">from</span> transformers <span class="hljs-keyword">import</span> AutoProcessor, AutoModelForZeroShotImageClassification


processor = AutoProcessor.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
model = AutoModelForZeroShotImageClassification.from_pretrained(<span class="hljs-string">&quot;openai/clip-vit-large-patch14&quot;</span>)
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image


image = Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;&lt;image path&gt;&quot;</span>)
<span class="hljs-comment"># image = Resize(size=(256, 256))(image)</span>


inputs = extractor(images=image, return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
<span class="hljs-comment"># print(inputs)</span>


outputs = model(**inputs)
vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Audio-embeddings" class="common-anchor-header">音訊嵌入</h3><p>與文字或圖片的人工智慧相比，音訊的人工智慧受到的關注較少。音訊最常見的使用案例是呼叫中心、醫療技術和無障礙等行業的語音轉文字。<a href="https://huggingface.co/openai/whisper-large-v2">OpenAI 的 Whisper</a> 是一個很受歡迎的語音轉文字開放原始碼模型。以下程式碼顯示如何從語音轉文字模型取得向量嵌入。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
from transformers <span class="hljs-keyword">import</span> AutoFeatureExtractor, WhisperModel
from datasets <span class="hljs-keyword">import</span> <span class="hljs-type">load_dataset</span>


<span class="hljs-variable">model</span> <span class="hljs-operator">=</span> WhisperModel.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
feature_extractor = AutoFeatureExtractor.from_pretrained(<span class="hljs-string">&quot;openai/whisper-base&quot;</span>)
ds = load_dataset(<span class="hljs-string">&quot;hf-internal-testing/librispeech_asr_dummy&quot;</span>, <span class="hljs-string">&quot;clean&quot;</span>, split=<span class="hljs-string">&quot;validation&quot;</span>)
inputs = feature_extractor(ds[<span class="hljs-number">0</span>][<span class="hljs-string">&quot;audio&quot;</span>][<span class="hljs-string">&quot;array&quot;</span>], return_tensors=<span class="hljs-string">&quot;pt&quot;</span>)
input_features = inputs.<span class="hljs-type">input_features</span>
<span class="hljs-variable">decoder_input_ids</span> <span class="hljs-operator">=</span> torch.tensor([[<span class="hljs-number">1</span>, <span class="hljs-number">1</span>]]) * model.config.<span class="hljs-type">decoder_start_token_id</span>
<span class="hljs-variable">vector_embedding</span> <span class="hljs-operator">=</span> model(input_features, decoder_input_ids=decoder_input_ids).last_hidden_state
<button class="copy-code-btn"></button></code></pre>
<h3 id="Video-embeddings" class="common-anchor-header">視訊嵌入</h3><p>視訊嵌入比音訊或影像嵌入更為複雜。由於視訊包含同步的音訊和影像，因此在處理視訊時必須使用多模式方法。其中一個流行的視訊模型是 DeepMind 的<a href="https://huggingface.co/deepmind/multimodal-perceiver">多模態感知器</a>。<a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">本筆記本教學將</a>展示如何使用該模型來對視訊進行分類。</p>
<p>若要取得輸入的 embeddings，請使用<code translate="no">outputs[1][-1].squeeze()</code> 從筆記型電腦中顯示的程式碼，而不是刪除輸出。我在<code translate="no">autoencode</code> 函式中高亮顯示此程式碼片段。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">autoencode_video</span>(<span class="hljs-params">images, audio</span>):
     <span class="hljs-comment"># only create entire video once as inputs</span>
     inputs = {<span class="hljs-string">&#x27;image&#x27;</span>: torch.from_numpy(np.moveaxis(images, -<span class="hljs-number">1</span>, <span class="hljs-number">2</span>)).<span class="hljs-built_in">float</span>().to(device),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.from_numpy(audio).to(device),
               <span class="hljs-string">&#x27;label&#x27;</span>: torch.zeros((images.shape[<span class="hljs-number">0</span>], <span class="hljs-number">700</span>)).to(device)}
     nchunks = <span class="hljs-number">128</span>
     reconstruction = {}
     <span class="hljs-keyword">for</span> chunk_idx <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(nchunks)):
          image_chunk_size = np.prod(images.shape[<span class="hljs-number">1</span>:-<span class="hljs-number">1</span>]) // nchunks
          audio_chunk_size = audio.shape[<span class="hljs-number">1</span>] // SAMPLES_PER_PATCH // nchunks
          subsampling = {
               <span class="hljs-string">&#x27;image&#x27;</span>: torch.arange(
                    image_chunk_size * chunk_idx, image_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;audio&#x27;</span>: torch.arange(
                    audio_chunk_size * chunk_idx, audio_chunk_size * (chunk_idx + <span class="hljs-number">1</span>)),
               <span class="hljs-string">&#x27;label&#x27;</span>: <span class="hljs-literal">None</span>,
          }
     <span class="hljs-comment"># forward pass</span>
          <span class="hljs-keyword">with</span> torch.no_grad():
               outputs = model(inputs=inputs, subsampled_output_points=subsampling)


          output = {k:v.cpu() <span class="hljs-keyword">for</span> k,v <span class="hljs-keyword">in</span> outputs.logits.items()}
          reconstruction[<span class="hljs-string">&#x27;label&#x27;</span>] = output[<span class="hljs-string">&#x27;label&#x27;</span>]
          <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;image&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> reconstruction:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = output[<span class="hljs-string">&#x27;image&#x27;</span>]
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = output[<span class="hljs-string">&#x27;audio&#x27;</span>]
          <span class="hljs-keyword">else</span>:
               reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], output[<span class="hljs-string">&#x27;image&#x27;</span>]], dim=<span class="hljs-number">1</span>)
               reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.cat(
                    [reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], output[<span class="hljs-string">&#x27;audio&#x27;</span>]], dim=<span class="hljs-number">1</span>)
          vector_embeddings = outputs[<span class="hljs-number">1</span>][-<span class="hljs-number">1</span>].squeeze()
<span class="hljs-comment"># finally, reshape image and audio modalities back to original shape</span>
     reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;image&#x27;</span>], images.shape)
     reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>] = torch.reshape(reconstruction[<span class="hljs-string">&#x27;audio&#x27;</span>], audio.shape)
     <span class="hljs-keyword">return</span> reconstruction


     <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">使用向量資料庫儲存、索引和搜尋向量內嵌值<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們瞭解了向量內嵌是什麼，以及如何使用各種強大的內嵌模型來產生它們，接下來的問題就是如何儲存並運用它們。向量資料庫就是答案。</p>
<p>像<a href="https://zilliz.com/what-is-milvus">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>之類的向量資料庫，是專為透過向量嵌入，在大量非結構化資料集上進行儲存、索引和搜尋而建立的。它們也是各種 AI 堆疊最重要的基礎架構之一。</p>
<p>向量資料庫通常使用<a href="https://zilliz.com/glossary/anns">近似最近鄰 (ANN)</a>演算法來計算查詢向量與資料庫中儲存的向量之間的空間距離。兩個向量的位置越接近，相關性就越高。然後，演算法會找出前 k 個最近的鄰居，並將它們提供給使用者。</p>
<p>向量資料庫在使用案例中很受歡迎，例如<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 檢索擴增生成</a>(RAG)、問答系統、推薦系統、語義搜尋，以及圖像、視訊和音訊相似性搜尋。</p>
<p>若要進一步瞭解向量嵌入、非結構化資料和向量資料庫，請考慮從<a href="https://zilliz.com/blog?tag=39&amp;page=1">向量資料庫 101</a>系列開始。</p>
<h2 id="Summary" class="common-anchor-header">摘要<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>向量是處理非結構化資料的強大工具。使用向量，我們可以根據語意相似性，以數學方式比較不同的非結構化資料。選擇正確的向量嵌入模型，對於為任何應用程式建立向量搜尋引擎來說都至關重要。</p>
<p>在這篇文章中，我們了解到向量嵌入是神經網路中輸入資料的內部表示。因此，它們在很大程度上取決於網路架構和用來訓練模型的資料。不同的資料類型（例如圖像、文字和音訊）需要特定的模型。幸運的是，有許多預先訓練好的開放原始碼模型可供使用。在這篇文章中，我們涵蓋了五種最常見資料類型的模型：影像、文字、多模態、音訊和視訊。此外，如果您想要善用向量嵌入，向量資料庫是最常用的工具。</p>
