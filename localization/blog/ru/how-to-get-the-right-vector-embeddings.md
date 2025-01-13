---
id: how-to-get-the-right-vector-embeddings.md
title: Как получить правильные векторные вкрапления
author: Yujian Tang
date: 2023-12-08T00:00:00.000Z
desc: >-
  Всестороннее введение в векторные вкрапления и способы их генерации с помощью
  популярных моделей с открытым исходным кодом.
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
<p><em>Эта статья была первоначально опубликована в <a href="https://thenewstack.io/how-to-get-the-right-vector-embeddings/">The New Stack</a> и перепощена здесь с разрешения.</em></p>
<p><strong>Исчерпывающее введение в векторные вкрапления и способы их генерации с помощью популярных моделей с открытым исходным кодом.</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_to_get_right_vector_embeddings_e0838623b7.png" alt="Image by Денис Марчук from Pixabay" class="doc-image" id="image-by-денис-марчук-from-pixabay" />
   </span> <span class="img-wrapper"> <span>Изображение Денис Марчук с Pixabay</span> </span></p>
<p>Векторные вкрапления очень важны при работе с <a href="https://zilliz.com/blog/vector-similarity-search">семантическим сходством</a>. Однако вектор - это просто ряд чисел, а векторное вкрапление - это ряд чисел, представляющих входные данные. Используя векторные вкрапления, мы можем структурировать <a href="https://zilliz.com/blog/introduction-to-unstructured-data">неструктурированные данные</a> или работать с любым типом данных, преобразуя их в ряд чисел. Такой подход позволяет нам выполнять математические операции над входными данными, а не полагаться на качественные сравнения.</p>
<p>Векторные вкрапления важны для многих задач, в частности для <a href="https://zilliz.com/glossary/semantic-search">семантического поиска</a>. Однако перед их использованием крайне важно получить соответствующие векторные вкрапления. Например, если вы используете модель изображения для векторизации текста или наоборот, вы, скорее всего, получите плохие результаты.</p>
<p>В этом посте мы узнаем, что означают векторные вкрапления, как генерировать правильные векторные вкрапления для ваших приложений с помощью различных моделей и как наилучшим образом использовать векторные вкрапления с помощью векторных баз данных, таких как <a href="https://milvus.io/">Milvus</a> и <a href="https://zilliz.com/">Zilliz Cloud</a>.</p>
<h2 id="How-are-vector-embeddings-created" class="common-anchor-header">Как создаются векторные вкрапления?<button data-href="#How-are-vector-embeddings-created" class="anchor-icon" translate="no">
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
<p>Теперь, когда мы понимаем важность векторных вкраплений, давайте узнаем, как они работают. Векторное вкрапление - это внутреннее представление входных данных в модели глубокого обучения, также известной как вкрапление моделей или глубокая нейронная сеть. Как же извлечь эту информацию?</p>
<p>Мы получаем векторы, удаляя последний слой и беря выход предпоследнего слоя. Последний слой нейронной сети обычно выдает предсказание модели, поэтому мы берем выход предпоследнего слоя. Векторное вложение - это данные, подаваемые на предсказательный слой нейронной сети.</p>
<p>Размерность векторного вложения эквивалентна размеру предпоследнего слоя в модели и, таким образом, взаимозаменяема с размером или длиной вектора. Обычная размерность вектора - 384 (генерируется Sentence Transformers Mini-LM), 768 (Sentence Transformers MPNet), 1 536 (OpenAI) и 2 048 (ResNet-50).</p>
<h2 id="What-does-a-vector-embedding-mean" class="common-anchor-header">Что означает векторное вложение?<button data-href="#What-does-a-vector-embedding-mean" class="anchor-icon" translate="no">
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
    </button></h2><p>Кто-то однажды спросил меня о значении каждого измерения в векторном вкраплении. Короткий ответ - ничего. Отдельное измерение в векторном вкраплении ничего не значит, поскольку оно слишком абстрактно, чтобы определить его значение. Однако, если взять все измерения вместе, они обеспечивают семантическое значение входных данных.</p>
<p>Размеры вектора - это высокоуровневые, абстрактные представления различных атрибутов. Представленные атрибуты зависят от обучающих данных и самой модели. Модели текста и изображений генерируют разные вложения, потому что они обучаются на принципиально разных типах данных. Даже разные текстовые модели генерируют разные вложения. Иногда они отличаются по размеру, иногда - по атрибутам, которые они представляют. Например, модель, обученная на юридических данных, будет учиться совсем не так, как модель, обученная на данных о здравоохранении. Эту тему я раскрыл в статье <a href="https://zilliz.com/blog/comparing-different-vector-embeddings">Сравнение векторных вложений</a>.</p>
<h2 id="Generate-the-right-vector-embeddings" class="common-anchor-header">Генерация правильных векторных вкраплений<button data-href="#Generate-the-right-vector-embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Как получить правильные векторные вкрапления? Все начинается с определения типа данных, которые вы хотите внедрить. В этом разделе мы рассмотрим встраивание пяти различных типов данных: изображений, текста, аудио, видео и мультимодальных данных. Все модели, которые мы здесь представляем, имеют открытый исходный код и взяты из Hugging Face или PyTorch.</p>
<h3 id="Image-embeddings" class="common-anchor-header">Встраивание изображений</h3><p>Распознавание изображений стало популярным в 2012 году после появления AlexNet. С тех пор в области компьютерного зрения произошло множество достижений. Последняя заметная модель распознавания изображений - ResNet-50, 50-слойная глубокая остаточная сеть, основанная на прежней архитектуре ResNet-34.</p>
<p>Остаточные нейронные сети (ResNet) решают проблему исчезающего градиента в глубоких конволюционных нейронных сетях с помощью коротких связей. Эти соединения позволяют выходу с более ранних слоев поступать на более поздние слои напрямую, минуя все промежуточные слои, что позволяет избежать проблемы исчезающего градиента. Такая конструкция делает ResNet менее сложной, чем VGGNet (Visual Geometry Group), конволюционная нейронная сеть с высочайшей производительностью.</p>
<p>В качестве примера я рекомендую две реализации ResNet-50: <a href="https://huggingface.co/microsoft/resnet-50">ResNet 50 на Hugging Face</a> и <a href="https://pytorch.org/vision/main/models/generated/torchvision.models.resnet50.html">ResNet 50 на PyTorch Hub</a>. Хотя сети одинаковы, процесс получения вкраплений различается.</p>
<p>Приведенный ниже пример кода демонстрирует, как использовать PyTorch для получения векторных вкраплений. Сначала мы загружаем модель из PyTorch Hub. Затем мы удаляем последний слой и вызываем <code translate="no">.eval()</code>, чтобы проинструктировать модель вести себя так, как будто она запущена на вывод. Затем функция <code translate="no">embed</code> генерирует векторное вложение.</p>
<pre><code translate="no"><span class="hljs-comment"># Load the embedding model with the last layer removed</span>
model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.10.0&#x27;</span>, <span class="hljs-string">&#x27;resnet50&#x27;</span>, pretrained=<span class="hljs-literal">True</span>) model = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
model.<span class="hljs-built_in">eval</span>()


<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">data</span>):
<span class="hljs-keyword">with</span> torch.no_grad():
output = model(torch.stack(data[<span class="hljs-number">0</span>])).squeeze()
<span class="hljs-keyword">return</span> output
<button class="copy-code-btn"></button></code></pre>
<p>В HuggingFace используется немного другая настройка. Приведенный ниже код демонстрирует, как получить векторное вкрапление из Hugging Face. Сначала нам понадобится экстрактор признаков и модель из библиотеки <code translate="no">transformers</code>. Мы будем использовать экстрактор признаков для получения входных данных для модели и использовать модель для получения выходных данных и извлечения последнего скрытого состояния.</p>
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
<h3 id="Text-embeddings" class="common-anchor-header">Встраивание текста</h3><p>Инженеры и исследователи экспериментируют с естественным языком и искусственным интеллектом с момента его изобретения. К числу самых ранних экспериментов относятся:</p>
<ul>
<li>ELIZA, первый чатбот с ИИ-терапевтом.</li>
<li>Китайская комната" Джона Серла - мысленный эксперимент, в котором изучается, требует ли способность переводить с китайского на английский понимание языка.</li>
<li>Перевод с английского на русский на основе правил.</li>
</ul>
<p>Работа ИИ с естественным языком значительно эволюционировала по сравнению с его вложениями, основанными на правилах. Начав с первичных нейронных сетей, мы добавили рекуррентные отношения через RNN, чтобы отслеживать шаги во времени. Затем мы использовали трансформаторы для решения проблемы трансдукции последовательности.</p>
<p>Трансформаторы состоят из кодера, который кодирует входной сигнал в матрицу, представляющую состояние, матрицу внимания и декодер. Декодер декодирует состояние и матрицу внимания, чтобы предсказать правильный следующий токен для завершения выходной последовательности. GPT-3, самая популярная на сегодняшний день языковая модель, состоит из строгих декодеров. Они кодируют входные данные и предсказывают правильную следующую лексему (лексемы).</p>
<p>Вот две модели из библиотеки <code translate="no">sentence-transformers</code> от Hugging Face, которые вы можете использовать в дополнение к вкраплениям OpenAI:</p>
<ul>
<li><a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">MiniLM-L6-v2</a>: 384-мерная модель</li>
<li><a href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2">MPNet-Base-V2</a>: 768-мерная модель</li>
</ul>
<p>Вы можете получить доступ к вкраплениям из обеих моделей одинаковым образом.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer


model = SentenceTransformer(<span class="hljs-string">&quot;&lt;model-name&gt;&quot;</span>)
vector_embeddings = model.encode(“&lt;<span class="hljs-built_in">input</span>&gt;”)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Multimodal-embeddings" class="common-anchor-header">Мультимодальные вкрапления</h3><p>Мультимодальные модели менее развиты, чем модели изображений и текстов. Они часто связывают изображения с текстом.</p>
<p>Наиболее полезным примером с открытым исходным кодом является <a href="https://huggingface.co/openai/clip-vit-large-patch14">CLIP VIT</a>, модель преобразования изображения в текст. Вы можете получить доступ к вкраплениям CLIP VIT так же, как и к модели изображений, как показано в коде ниже.</p>
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
<h3 id="Audio-embeddings" class="common-anchor-header">Вкрапления для аудио</h3><p>ИИ для аудио уделяется меньше внимания, чем ИИ для текста или изображений. Наиболее распространенным вариантом использования аудио является преобразование речи в текст для таких отраслей, как колл-центры, медицинские технологии и доступность. Одной из популярных моделей с открытым исходным кодом для преобразования речи в текст является <a href="https://huggingface.co/openai/whisper-large-v2">Whisper от OpenAI</a>. В приведенном ниже коде показано, как получить векторные вкрапления из модели преобразования речи в текст.</p>
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
<h3 id="Video-embeddings" class="common-anchor-header">Встраивания в видео</h3><p>Встраивание видео является более сложной задачей, чем встраивание аудио или изображений. При работе с видео необходим мультимодальный подход, поскольку они включают в себя синхронизированные аудио и изображения. Одной из популярных видеомоделей является <a href="https://huggingface.co/deepmind/multimodal-perceiver">мультимодальный восприниматель</a> от DeepMind. В этом <a href="https://github.com/NielsRogge/Transformers-Tutorials/blob/master/Perceiver/Perceiver_for_Multimodal_Autoencoding.ipynb">руководстве для ноутбука</a> показано, как использовать эту модель для классификации видео.</p>
<p>Чтобы получить вкрапления входных данных, используйте <code translate="no">outputs[1][-1].squeeze()</code> из кода, показанного в блокноте, вместо удаления выходных данных. Я выделяю этот фрагмент кода в функции <code translate="no">autoencode</code>.</p>
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
<h2 id="Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="common-anchor-header">Хранение, индексация и поиск векторных вкраплений с помощью векторных баз данных<button data-href="#Storing-indexing-and-searching-vector-embeddings-with-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы поняли, что такое векторные вкрапления и как их генерировать с помощью различных мощных моделей вкраплений, следующий вопрос - как их хранить и использовать в своих интересах. Векторные базы данных - вот ответ.</p>
<p>Векторные базы данных, такие как <a href="https://zilliz.com/what-is-milvus">Milvus</a> и <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, специально созданы для хранения, индексации и поиска в огромных массивах неструктурированных данных с помощью векторных вкраплений. Они также являются одной из наиболее важных инфраструктур для различных стеков ИИ.</p>
<p>Векторные базы данных обычно используют алгоритм <a href="https://zilliz.com/glossary/anns">приближенного ближайшего соседа (ANN)</a> для расчета пространственного расстояния между вектором запроса и векторами, хранящимися в базе данных. Чем ближе расположены два вектора, тем более релевантными они являются. Затем алгоритм находит k ближайших соседей и предоставляет их пользователю.</p>
<p>Векторные базы данных популярны в таких областях применения, как <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">расширенный поиск LLM</a> (RAG), системы вопросов и ответов, рекомендательные системы, семантический поиск, поиск по сходству изображений, видео и аудио.</p>
<p>Чтобы узнать больше о векторных вкраплениях, неструктурированных данных и векторных базах данных, начните с серии " <a href="https://zilliz.com/blog?tag=39&amp;page=1">Векторная база данных 101"</a>.</p>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Векторы - мощный инструмент для работы с неструктурированными данными. Используя векторы, мы можем математически сравнивать различные фрагменты неструктурированных данных на основе семантического сходства. Выбор правильной модели векторного вложения очень важен для создания векторной поисковой системы для любого приложения.</p>
<p>В этом посте мы узнали, что векторные вкрапления - это внутреннее представление входных данных в нейронной сети. В результате они сильно зависят от архитектуры сети и данных, используемых для обучения модели. Для разных типов данных (например, изображений, текста и аудио) требуются особые модели. К счастью, многие предварительно обученные модели с открытым исходным кодом доступны для использования. В этом посте мы рассмотрели модели для пяти наиболее распространенных типов данных: изображений, текста, мультимодальных данных, аудио и видео. Кроме того, если вы хотите максимально эффективно использовать векторные вкрапления, наиболее популярным инструментом являются векторные базы данных.</p>
