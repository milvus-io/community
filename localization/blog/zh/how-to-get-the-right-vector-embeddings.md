---
id: how-to-get-the-right-vector-embeddings.md
title: 如何获得正确的向量嵌入
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: 全面介绍向量嵌入以及如何使用流行的开源模型生成向量嵌入。
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
<p><em>本文最初发表于<a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">《The New Stack</a>》，经授权在此转发。</em></p>
<p><strong>全面介绍向量嵌入以及如何使用流行的开源模型生成向量嵌入。</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>图片作者：Денис Марчук 来自 Pixabay</span> </span></p>
<p>在处理<a href="https://zilliz.com/blog/vector-similarity-search">语义相似性</a>时，向量嵌入至关重要。然而，向量只是一系列数字；向量嵌入则是代表输入数据的一系列数字。使用向量嵌入，我们可以通过将<a href="https://zilliz.com/blog/introduction-to-unstructured-data">非结构化数据</a>转换成一系列数字，来构建<a href="https://zilliz.com/blog/introduction-to-unstructured-data">非结构化数据</a>或处理任何类型的数据。这种方法允许我们对输入数据进行数学操作，而不是依赖定性比较。</p>
<p>向量嵌入对很多任务都有影响，尤其是<a href="https://zilliz.com/glossary/semantic-search">语义搜索</a>。不过，在使用之前，获得适当的向量嵌入至关重要。例如，如果使用图像模型对文本进行向量嵌入，或者反之亦然，很可能会得到很差的结果。</p>
<p>在本篇文章中，我们将了解矢量嵌入的含义，如何使用不同的模型为您的应用生成合适的矢量嵌入，以及如何通过<a href="https://milvus.io/">Milvus</a>和 Zilliz<a href="https://zilliz.com/">Cloud</a> 等矢量数据库充分利用矢量嵌入<a href="https://zilliz.com/">。</a></p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">如何创建向量嵌入？<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>既然了解了向量嵌入的重要性，我们就来了解一下向量嵌入是如何工作的。向量嵌入是深度学习模型中输入数据的内部表示，也称为嵌入模型或深度神经网络。那么，我们如何提取这些信息呢？</p>
<p>我们通过去掉最后一层，取倒数第二层的输出来获得向量。神经网络的最后一层通常会输出模型的预测结果，因此我们取倒数第二层的输出。向量嵌入是馈送给神经网络预测层的数据。</p>
<p>向量嵌入的维度相当于模型中倒数第二层的大小，因此，可以与向量的大小或长度互换。常见的向量维度包括 384（由 Sentence Transformers Mini-LM 生成）、768（由 Sentence Transformers MPNet 生成）、1536（由 OpenAI 生成）和 2048（由 ResNet-50 生成）。</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">向量嵌入是什么意思？<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>曾经有人问我向量嵌入中每个维度的含义。简而言之，没什么意义。向量嵌入中的单个维度没有任何意义，因为它太抽象，无法确定其含义。但是，当我们把所有维度放在一起时，它们就提供了输入数据的语义。</p>
<p>向量的维度是不同属性的高层次抽象表示。所代表的属性取决于训练数据和模型本身。文本模型和图像模型会生成不同的嵌入，因为它们是针对根本不同的数据类型进行训练的。即使是不同的文本模型也会生成不同的 Embeddings。有时，它们的大小不同；其他时候，它们所代表的属性也不同。例如，针对法律数据训练的模型与针对医疗数据训练的模型会学习到不同的东西。我曾在<a href="https://zilliz.com/blog/comparing-different-vector-embeddings">比较向量嵌入的</a>文章中探讨过这个话题。</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">生成正确的向量嵌入<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>如何获得正确的向量嵌入？首先要确定要嵌入的数据类型。本节涵盖嵌入五种不同类型的数据：图像、文本、音频、视频和多模态数据。我们在此介绍的所有模型都是开源的，来自 Hugging Face 或 PyTorch。</p>
<h3 id="Image-embeddings" class="common-anchor-header">图像嵌入</h3><p>2012 年，AlexNet 问世后，图像识别技术迅猛发展。从那时起，计算机视觉领域取得了无数进步。最新的著名图像识别模型是 ResNet-50，它是基于前 ResNet-34 架构的 50 层深度残差网络。</p>
<p>残差神经网络（ResNet）利用快捷连接解决了深度卷积神经网络中的梯度消失问题。这些连接允许前层的输出直接进入后层，而不经过所有中间层，从而避免了梯度消失问题。这种设计使得 ResNet 的复杂度低于 VGGNet（视觉几何组），后者是以前性能最好的卷积神经网络。</p>
<p>我推荐两个 ResNet-50 的实现作为示例： <a href="https://huggingface.co/microsoft/resnet-50">Hugging Face 上的 ResNet 50</a>和<a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">PyTorch Hub 上的 ResNet 50</a>。虽然网络相同，但获取 Embeddings 的过程不同。</p>
<p>下面的代码示例演示了如何使用 PyTorch 获取向量嵌入。首先，我们从 PyTorch Hub 加载模型。接下来，我们移除最后一层，并调用<code translate="no">.eval()</code> 来指示模型的行为，就像它正在运行推理一样。然后，<code translate="no">embed</code> 函数生成向量嵌入。</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace 使用的设置略有不同。下面的代码演示了如何从 Hugging Face 获取向量嵌入。首先，我们需要<code translate="no">transformers</code> 库中的特征提取器和模型。我们将使用特征提取器为模型获取输入，并使用模型获取输出和提取最后的隐藏状态。</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">文本嵌入</h3><p>自人工智能发明以来，工程师和研究人员一直在进行自然语言和人工智能方面的实验。最早的一些实验包括</p>
<ul>
<li>第一个人工智能治疗师聊天机器人 ELIZA。</li>
<li>约翰-塞尔的 "中文房间"（Chinese Room），这是一个思想实验，研究中英文之间的翻译能力是否需要对语言的理解。</li>
<li>英语和俄语之间基于规则的翻译。</li>
</ul>
<p>人工智能对自然语言的操作已经从基于规则的 Embeddings 有了很大的发展。从初级神经网络开始，我们通过 RNN 增加了递归关系，以跟踪时间步骤。在此基础上，我们使用变换器来解决序列转换问题。</p>
<p>变换器由编码器、注意矩阵和解码器组成，编码器将输入编码为代表状态的矩阵。解码器对状态和注意力矩阵进行解码，以预测正确的下一个标记，从而完成输出序列。GPT-3 是迄今为止最流行的语言模型，由严格的解码器组成。它们对输入进行编码，并预测正确的下一个（多个）标记。</p>
<p>下面是 Hugging Face 从<code translate="no">sentence-transformers</code> 库中提供的两个模型，除了 OpenAI 的 Embeddings 之外，你还可以使用它们：</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>：一个 384 维模型</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>：768 维模型</li>
</ul>
<p>您可以以相同的方式访问这两种模型的嵌入式数据。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">多模态嵌入模型</h3><p>多模态模型不如图像或文本模型完善。它们通常将图像与文本联系起来。</p>
<p>最有用的开源模型是<a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>，它是一种图像到文本模型。您可以像访问图像模型一样访问 CLIP VIT 的嵌入模型，如下代码所示。</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">音频嵌入</h3><p>与文本或图像人工智能相比，音频人工智能受到的关注较少。音频最常见的使用案例是呼叫中心、医疗技术和无障碍等行业的语音转文本。一种流行的语音转文本开源模型是<a href="https://huggingface.co/openai/whisper-large-v2">OpenAI 的 Whisper</a>。下面的代码展示了如何从语音到文本模型中获取向量嵌入。</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">视频嵌入</h3><p>视频嵌入比音频或图像嵌入更为复杂。在处理视频时，必须采用多模态方法，因为视频包括同步音频和图像。DeepMind 的<a href="https://huggingface.co/deepmind/multimodal-perceiver">多模态感知器</a>就是一种流行的视频模型。本<a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">笔记本教程</a>展示了如何使用该模型对视频进行分类。</p>
<p>要获取输入的 Embeddings，请使用<code translate="no">outputs[1][-1].squeeze()</code> 从笔记本中显示的代码中获取，而不是删除输出。我在<code translate="no">autoencode</code> 函数中突出显示了这一代码片段。</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">使用向量数据库存储、索引和搜索向量 embeddings<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我们已经了解了什么是向量嵌入，以及如何使用各种功能强大的嵌入模型生成向量嵌入，下一个问题就是如何存储并利用它们。向量数据库就是答案。</p>
<p>像<a href="https://zilliz.com/what-is-milvus">Milvus</a>和<a href="https://zilliz.com/cloud">Zilliz Cloud</a>这样的矢量数据库就是专门为通过向量嵌入在海量非结构化数据集上进行存储、索引和搜索而构建的。它们也是各种人工智能堆栈最关键的基础设施之一。</p>
<p>向量数据库通常使用<a href="https://zilliz.com/glossary/anns">近似近邻（ANN）</a>算法来计算查询向量与数据库中存储的向量之间的空间距离。两个向量的位置越近，相关性就越高。然后，该算法会找出前 k 个近邻，并将它们提供给用户。</p>
<p>向量数据库在<a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM 检索增强生成</a>（RAG）、问答系统、推荐系统、语义搜索以及图像、视频和音频相似性搜索等用例中很受欢迎。</p>
<p>要了解有关向量嵌入、非结构化数据和向量数据库的更多信息，请从向量<a href="https://zilliz.com/blog?tag=39&amp;page=1">数据库 101</a>系列开始。</p>
<h2 id="Summary" class="common-anchor-header">总结<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>向量是处理非结构化数据的强大工具。使用向量，我们可以根据语义相似性对不同的非结构化数据进行数学比较。选择正确的向量嵌入模型对于为任何应用构建向量搜索引擎都至关重要。</p>
<p>在本篇文章中，我们了解到向量嵌入是神经网络中输入数据的内部表示。因此，它们高度依赖于网络架构和用于训练模型的数据。不同的数据类型（如图像、文本和音频）需要特定的模型。幸运的是，许多预训练的开源模型可供使用。在本篇文章中，我们介绍了五种最常见数据类型的模型：图像、文本、多模态、音频和视频。此外，如果你想充分利用向量 Embeddings，向量数据库是最受欢迎的工具。</p>
