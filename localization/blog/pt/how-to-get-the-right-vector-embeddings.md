---
id: how-to-get-the-right-vector-embeddings.md
title: Como obter os Embeddings Vectoriais corretos
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Uma introdução abrangente aos embeddings vectoriais e à forma de os gerar com
  modelos populares de código aberto.
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
<p><em>Este artigo foi publicado originalmente no <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> e é republicado aqui com permissão.</em></p>
<p><strong>Uma introdução abrangente aos embeddings vetoriais e como gerá-los com modelos populares de código aberto.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Imagem por Денис Марчук do Pixabay</span> </span></p>
<p>Os embeddings vetoriais são críticos quando se trabalha com <a href="https://zilliz.com/blog/vector-similarity-search">similaridade semântica</a>. No entanto, um vetor é simplesmente uma série de números; uma incorporação de vetor é uma série de números que representam dados de entrada. Com a utilização de vetor embeddings, podemos estruturar <a href="https://zilliz.com/blog/introduction-to-unstructured-data">dados não estruturados</a> ou trabalhar com qualquer tipo de dados, convertendo-os numa série de números. Esta abordagem permite-nos efetuar operações matemáticas sobre os dados de entrada, em vez de nos basearmos em comparações qualitativas.</p>
<p>Os embeddings vectoriais são influentes em muitas tarefas, nomeadamente na <a href="https://zilliz.com/glossary/semantic-search">pesquisa semântica</a>. No entanto, é crucial obter as incorporações vectoriais adequadas antes de as utilizar. Por exemplo, se utilizar um modelo de imagem para vetorizar texto, ou vice-versa, provavelmente obterá maus resultados.</p>
<p>Nesta publicação, vamos aprender o que significam as incorporações vectoriais, como gerar as incorporações vectoriais corretas para as suas aplicações utilizando diferentes modelos e como tirar o melhor partido das incorporações vectoriais com bases de dados vectoriais como <a href="https://milvus.io/">Milvus</a> e <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Como são criados os embeddings vectoriais?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>Agora que compreendemos a importância dos embeddings vectoriais, vamos aprender como funcionam. Uma incorporação de vetor é a representação interna dos dados de entrada num modelo de aprendizagem profunda, também conhecido como modelos de incorporação ou uma rede neural profunda. Então, como é que extraímos esta informação?</p>
<p>Obtemos vectores removendo a última camada e obtendo a saída da penúltima camada. A última camada de uma rede neural produz normalmente a previsão do modelo, pelo que utilizamos a saída da penúltima camada. A incorporação do vetor é o dado que alimenta a camada de previsão de uma rede neuronal.</p>
<p>A dimensionalidade de uma incorporação vetorial é equivalente ao tamanho da penúltima camada do modelo e, por conseguinte, permutável com o tamanho ou comprimento do vetor. As dimensionalidades comuns dos vectores incluem 384 (geradas por Sentence Transformers Mini-LM), 768 (por Sentence Transformers MPNet), 1.536 (por OpenAI) e 2.048 (por ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">O que significa uma incorporação vetorial?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma vez perguntaram-me qual o significado de cada dimensão numa integração vetorial. A resposta curta é "nada". Uma única dimensão de uma integração vetorial não significa nada, pois é demasiado abstrata para determinar o seu significado. No entanto, quando consideramos todas as dimensões em conjunto, estas fornecem o significado semântico dos dados de entrada.</p>
<p>As dimensões do vetor são representações abstractas de alto nível de diferentes atributos. Os atributos representados dependem dos dados de treino e do próprio modelo. Os modelos de texto e de imagem geram diferentes embeddings porque são treinados para tipos de dados fundamentalmente diferentes. Até mesmo modelos de texto diferentes geram embeddings diferentes. Por vezes, diferem no tamanho; outras vezes, diferem nos atributos que representam. Por exemplo, um modelo treinado em dados jurídicos aprenderá coisas diferentes de um modelo treinado em dados de cuidados de saúde. Explorei este tópico no meu post <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">comparando embeddings vetoriais</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Gerar as incorporações vectoriais corretas<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Como é que se obtêm as incorporações vectoriais adequadas? Tudo começa com a identificação do tipo de dados que deseja incorporar. Esta secção aborda a incorporação de cinco tipos diferentes de dados: imagens, texto, áudio, vídeos e dados multimodais. Todos os modelos que apresentamos aqui são de código aberto e provêm do Hugging Face ou do PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Incorporação de imagens</h3><p>O reconhecimento de imagens arrancou em 2012, quando o AlexNet entrou em cena. Desde então, o campo da visão computacional tem testemunhado inúmeros avanços. O último modelo de reconhecimento de imagem notável é o ResNet-50, uma rede residual profunda de 50 camadas baseada na antiga arquitetura ResNet-34.</p>
<p>As redes neurais residuais (ResNet) resolvem o problema do gradiente de desaparecimento nas redes neurais convolucionais profundas utilizando ligações de atalho. Estas ligações permitem que a saída das camadas anteriores vá diretamente para as camadas posteriores sem passar por todas as camadas intermédias, evitando assim o problema do gradiente de fuga. Esta conceção torna a ResNet menos complexa do que a VGGNet (Visual Geometry Group), uma rede neural convolucional com um desempenho anteriormente superior.</p>
<p>Recomendo duas implementações da ResNet-50 como exemplos: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 em Hugging Face</a> e <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 em PyTorch Hub</a>. Embora as redes sejam as mesmas, o processo de obtenção de embeddings é diferente.</p>
<p>O exemplo de código abaixo demonstra como usar o PyTorch para obter embeddings de vetor. Primeiro, carregamos o modelo do PyTorch Hub. Em seguida, removemos a última camada e chamamos <code translate="no">.eval()</code> para instruir o modelo a comportar-se como se estivesse a ser executado para inferência. Depois, a função <code translate="no">embed</code> gera a incorporação do vetor.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>HuggingFace usa uma configuração ligeiramente diferente. O código abaixo demonstra como obter uma incorporação de vetor da Hugging Face. Primeiro, precisamos de um extrator de caraterísticas e de um modelo da biblioteca <code translate="no">transformers</code>. Utilizaremos o extrator de caraterísticas para obter entradas para o modelo e utilizaremos o modelo para obter saídas e extrair o último estado oculto.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">Incorporação de texto</h3><p>Os engenheiros e investigadores têm vindo a fazer experiências com a linguagem natural e a IA desde a invenção da IA. Algumas das primeiras experiências incluem:</p>
<ul>
<li>ELIZA, o primeiro chatbot terapeuta de IA.</li>
<li>O Quarto Chinês de John Searle, uma experiência de pensamento que examina se a capacidade de traduzir entre chinês e inglês requer uma compreensão da língua.</li>
<li>Traduções baseadas em regras entre inglês e russo.</li>
</ul>
<p>O funcionamento da IA na linguagem natural evoluiu significativamente a partir das suas incorporações baseadas em regras. Começando com as redes neuronais primárias, acrescentámos relações de recorrência através de RNNs para manter o registo dos passos no tempo. A partir daí, utilizámos transformadores para resolver o problema da transdução de sequências.</p>
<p>Os transformadores são compostos por um codificador, que codifica uma entrada numa matriz que representa o estado, uma matriz de atenção e um descodificador. O descodificador descodifica o estado e a matriz de atenção para prever o próximo token correto para terminar a sequência de saída. O GPT-3, o modelo linguístico mais popular até à data, inclui descodificadores estritos. Codificam a entrada e prevêem a(s) frase(s) seguinte(s) correta(s).</p>
<p>Aqui estão dois modelos da biblioteca <code translate="no">sentence-transformers</code> da Hugging Face que pode utilizar para além dos embeddings da OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: um modelo de 384 dimensões</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: um modelo de 768 dimensões</li>
</ul>
<p>Pode aceder aos embeddings de ambos os modelos da mesma forma.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Embeddings multimodais</h3><p>Os modelos multimodais estão menos desenvolvidos do que os modelos de imagem ou de texto. Relacionam frequentemente imagens com texto.</p>
<p>O exemplo de código aberto mais útil é o <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, um modelo de imagem para texto. Pode aceder aos embeddings do CLIP VIT da mesma forma que acederia a um modelo de imagem, como mostra o código abaixo.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">Embeddings de áudio</h3><p>A IA para áudio tem recebido menos atenção do que a IA para texto ou imagens. O caso de utilização mais comum para o áudio é a conversão de voz em texto para sectores como os centros de atendimento telefónico, a tecnologia médica e a acessibilidade. Um modelo de código aberto popular para a conversão de voz em texto é o <a href="https://huggingface.co/openai/whisper-large-v2">Whisper da OpenAI</a>. O código abaixo mostra como obter embeddings vetoriais do modelo de fala para texto.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">Encaixes de vídeo</h3><p>As incrustações de vídeo são mais complexas do que as incrustações de áudio ou imagem. É necessária uma abordagem multimodal quando se trabalha com vídeos, uma vez que estes incluem áudio e imagens sincronizados. Um modelo de vídeo popular é o <a href="https://huggingface.co/deepmind/multimodal-perceiver">percebedor multimodal</a> da DeepMind. Este <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">tutorial do notebook</a> mostra como usar o modelo para classificar um vídeo.</p>
<p>Para obter os embeddings da entrada, use <code translate="no">outputs[1][-1].squeeze()</code> do código mostrado no notebook em vez de excluir as saídas. Eu destaco esse trecho de código na função <code translate="no">autoencode</code>.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Armazenamento, indexação e pesquisa de embeddings vectoriais com bases de dados vectoriais<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que compreendemos o que são embeddings vectoriais e como gerá-los utilizando vários modelos de embedding poderosos, a próxima questão é como armazená-los e tirar partido deles. As bases de dados vectoriais são a resposta.</p>
<p>As bases de dados vectoriais, como <a href="https://zilliz.com/what-is-milvus">a Milvus</a> e <a href="https://zilliz.com/cloud">a Zilliz Cloud</a>, foram criadas propositadamente para armazenar, indexar e pesquisar em conjuntos de dados maciços de dados não estruturados através de embeddings vectoriais. São também uma das infra-estruturas mais críticas para várias pilhas de IA.</p>
<p>As bases de dados vectoriais utilizam normalmente o algoritmo <a href="https://zilliz.com/glossary/anns">ANN (Approximate Nearest Neighbor)</a> para calcular a distância espacial entre o vetor de consulta e os vectores armazenados na base de dados. Quanto mais próximos estiverem os dois vectores, mais relevantes são. Em seguida, o algoritmo encontra os k melhores vizinhos mais próximos e apresenta-os ao utilizador.</p>
<p>As bases de dados vectoriais são populares em casos de utilização como a <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">geração aumentada de recuperação LLM</a> (RAG), sistemas de perguntas e respostas, sistemas de recomendação, pesquisas semânticas e pesquisas de semelhança de imagem, vídeo e áudio.</p>
<p>Para saber mais sobre embeddings vetoriais, dados não estruturados e bancos de dados vetoriais, considere começar com a série <a href="https://zilliz.com/blog?tag=39&amp;page=1">Banco de dados vetoriais 101</a>.</p>
<h2 id="Summary" class="common-anchor-header">Resumo<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Os vetores são uma ferramenta poderosa para trabalhar com dados não estruturados. Usando vetores, podemos comparar matematicamente diferentes partes de dados não estruturados com base na similaridade semântica. A escolha do modelo correto de incorporação de vetores é fundamental para a criação de um mecanismo de pesquisa de vetores para qualquer aplicativo.</p>
<p>Neste post, aprendemos que as incorporações de vetores são a representação interna dos dados de entrada em uma rede neural. Como resultado, eles dependem muito da arquitetura da rede e dos dados usados para treinar o modelo. Diferentes tipos de dados (como imagens, texto e áudio) exigem modelos específicos. Felizmente, muitos modelos de código aberto pré-treinados estão disponíveis para uso. Neste post, abordámos modelos para os cinco tipos de dados mais comuns: imagens, texto, multimodal, áudio e vídeo. Além disso, se quiser utilizar da melhor forma os embeddings vectoriais, as bases de dados vectoriais são a ferramenta mais popular.</p>
