---
id: >-
  no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
title: >-
  Нет Python, нет проблем: вывод моделей с помощью ONNX на Java или любом другом
  языке
author: Stefan Webb
date: 2025-05-30T00:00:00.000Z
desc: >-
  ONNX (Open Neural Network Exchange) - это экосистема инструментов для вывода
  моделей нейронных сетей, не зависящая от платформы.
cover: assets.zilliz.com/No_Python_No_Problem_7fe97dad46.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  build AI apps with Python, ONNX (Open Neural Network Exchange), Model
  inference, vector databases, Milvus
meta_title: >
  No Python, No Problem: Model Inference with ONNX in Java, or Any Other
  Language
origin: >-
  https://milvus.io/blog/no-python-no-problem-model-inference-with-onnx-in-java-or-any-other-language.md
---
<p>Создавать приложения генеративного ИИ еще никогда не было так просто. Богатая экосистема инструментов, моделей ИИ и наборов данных позволяет даже неспециализированным инженерам-программистам создавать впечатляющие чат-боты, генераторы изображений и многое другое. Эти инструменты, по большей части, созданы для Python и построены на основе PyTorch. Но как быть, если у вас нет доступа к Python в производстве и вам нужно использовать Java, Golang, Rust, C++ или другой язык?</p>
<p>Мы ограничимся выводом модели, включая модели встраивания и модели основания; другие задачи, такие как обучение и тонкая настройка модели, обычно не выполняются во время развертывания. Какие у нас есть возможности для вывода модели без Python? Наиболее очевидным решением является использование онлайн-сервисов от таких провайдеров, как Anthropic или Mistral. Они обычно предоставляют SDK для языков, отличных от Python, а если и не предоставляют, то требуют лишь простых вызовов REST API. Но что делать, если наше решение должно быть полностью локальным, например, по соображениям соответствия или конфиденциальности?</p>
<p>Другое решение - запустить Python-сервер локально. Изначально проблема была сформулирована как невозможность запуска Python в производстве, поэтому использование локального сервера Python исключено. Другие локальные решения, скорее всего, будут иметь схожие юридические и технические ограничения, а также ограничения, связанные с безопасностью. <em>Нам нужно полностью автономное решение, которое позволит нам вызывать модель непосредственно из Java или другого языка, не относящегося к Python.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_Python_metamorphoses_into_an_Onyx_butterfly_a65c340c47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 1: Python превращается в бабочку Onyx.</em></p>
<h2 id="What-is-ONNX-Open-Neural-Network-Exchange" class="common-anchor-header">Что такое ONNX (Open Neural Network Exchange)?<button data-href="#What-is-ONNX-Open-Neural-Network-Exchange" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/onnx/onnx">ONNX</a> (Open Neural Network Exchange) - это экосистема инструментов для вывода моделей нейронных сетей, не зависящая от платформы. Изначально она была разработана командой PyTorch в Meta (затем Facebook), а затем в нее внесли свой вклад Microsoft, IBM, Huawei, Intel, AMD, Arm и Qualcomm. В настоящее время это проект с открытым исходным кодом, принадлежащий Linux Foundation for AI and Data. ONNX является де-факто методом распространения моделей нейронных сетей, не зависящих от платформы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/A_partial_ONNX_computational_graph_for_a_NN_transformer_11deebefe0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 2: (частичный) вычислительный граф ONNX для NN-трансформатора</em></p>
<p><strong>Мы обычно используем термин "ONNX" в более узком смысле для обозначения формата файлов.</strong> Файл модели ONNX представляет собой вычислительный граф, часто включающий значения весов математической функции, и стандарт определяет общие операции для нейронных сетей. Вы можете думать о нем так же, как о вычислительном графе, созданном при использовании autodiff в PyTorch. С другой точки зрения, формат файлов ONNX служит <em>промежуточным представлением</em> (IR) для нейронных сетей, подобно компиляции нативного кода, которая также включает в себя шаг IR. На рисунке выше показан вычислительный граф ONNX.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/An_IR_allows_many_combinations_of_front_ends_and_back_ends_a05e259849.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 3. Промежуточное представление допускает множество комбинаций фронт- и бэк-эндов.</em></p>
<p>Формат файлов ONNX - это лишь одна часть экосистемы ONNX, которая также включает библиотеки для манипулирования вычислительными графами и библиотеки для загрузки и запуска файлов моделей ONNX. Эти библиотеки работают на разных языках и платформах. Поскольку ONNX - это всего лишь IR (Intermediate Representation Language - промежуточный язык представления), перед его запуском с нативным кодом можно применить оптимизацию, характерную для конкретной аппаратной платформы. На рисунке выше показаны комбинации фронтендов и бэкендов.</p>
<h2 id="ONNX-Workflow" class="common-anchor-header">Рабочий процесс ONNX<button data-href="#ONNX-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>В целях обсуждения мы рассмотрим вызов модели встраивания текста из Java, например, для подготовки к вводу данных в векторную базу данных <a href="https://milvus.io/">Milvus</a> с открытым исходным кодом. Итак, если мы хотим вызвать нашу модель встраивания или основы из Java, так ли это просто, как использовать библиотеку ONNX для соответствующего файла модели? Да, но нам придется получить файлы как для модели, так и для кодировщика токенизатора (и декодировщика для базовых моделей). Мы можем создать их самостоятельно, используя Python в автономном режиме, то есть до производства, о чем мы сейчас расскажем.</p>
<h2 id="Exporting-NN-Models-from-Python" class="common-anchor-header">Экспорт NN-моделей из Python<button data-href="#Exporting-NN-Models-from-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте откроем обычную модель встраивания текста, <code translate="no">all-MiniLM-L6-v2</code>, из Python с помощью библиотеки HuggingFace's sentence-transformers. Мы будем использовать библиотеку HF косвенно, через библиотеку util в .txtai, поскольку нам нужна обертка вокруг sentence-transformers, которая также экспортирует слои объединения и нормализации после функции трансформации. (Эти слои берут контекстно-зависимые вкрапления лексем, то есть выход трансформатора, и преобразуют их в одно текстовое вкрапление).</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> txtai.pipeline <span class="hljs-keyword">import</span> HFOnnx

path = <span class="hljs-string">&quot;sentence-transformers/all-MiniLM-L6-v2&quot;</span>
onnx_model = HFOnnx()
model = onnx_model(path, <span class="hljs-string">&quot;pooling&quot;</span>, <span class="hljs-string">&quot;model.onnx&quot;</span>, <span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Мы поручаем библиотеке экспортировать <code translate="no">sentence-transformers/all-MiniLM-L6-v2</code> из концентратора моделей HuggingFace в виде ONNX, указывая задачу как встраивание текста и включая квантование модели. Вызов <code translate="no">onnx_model()</code> загрузит модель из концентратора моделей, если она еще не существует локально, преобразует три слоя в ONNX и объединит их вычислительные графы.</p>
<p>Готовы ли мы теперь делать выводы на Java? Не совсем так быстро. На вход модели подается список лексем (или список списков для более чем одного образца), соответствующий лексемам текста, который мы хотим внедрить. Поэтому, если мы не сможем выполнить всю токенизацию до начала производства, нам придется запускать токенизатор из Java.</p>
<p>Для этого есть несколько вариантов. Один из них предполагает реализацию или поиск реализации токенизатора для рассматриваемой модели на Java или другом языке и вызов его из Java в виде статической или динамически подключаемой библиотеки. Более простое решение - преобразовать токенизатор в ONNX-файл и использовать его из Java, так же как мы используем ONNX-файл модели.</p>
<p>Однако простой ONNX не содержит необходимых операций для реализации вычислительного графа токенизатора. По этой причине Microsoft создала библиотеку для дополнения ONNX под названием ONNXRuntime-Extensions. Она определяет полезные операции для всех видов предварительной и последующей обработки данных, а не только для текстовых токенизаторов.</p>
<p>Вот как мы экспортируем наш токенизатор в файл ONNX:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> onnxruntime_extensions <span class="hljs-keyword">import</span> gen_processing_models
<span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer

embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
tok_encode, _ = gen_processing_models(embedding_model.tokenizer, pre_kwargs={})

onnx_tokenizer_path = <span class="hljs-string">&quot;tokenizer.onnx&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(tokenizer_path, <span class="hljs-string">&quot;wb&quot;</span>) <span class="hljs-keyword">as</span> f:
  f.write(tok_encode.SerializeToString())
<button class="copy-code-btn"></button></code></pre>
<p>Мы отбросили декодер токенизатора, поскольку для встраивания предложений он не нужен. Теперь у нас есть два файла: <code translate="no">tokenizer.onnx</code> для токенизации текста и <code translate="no">model.onnx</code> для встраивания строк токенов.</p>
<h2 id="Model-Inference-in-Java" class="common-anchor-header">Вывод модели в Java<button data-href="#Model-Inference-in-Java" class="anchor-icon" translate="no">
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
    </button></h2><p>Запуск нашей модели из Java теперь тривиален. Вот несколько важных строк кода из полного примера:</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Imports required for Java/ONNX integration</span>
<span class="hljs-keyword">import</span> ai.onnxruntime.*;
<span class="hljs-keyword">import</span> ai.onnxruntime.extensions.*;

…

<span class="hljs-comment">// Set up inference sessions for tokenizer and model</span>
<span class="hljs-type">var</span> <span class="hljs-variable">env</span> <span class="hljs-operator">=</span> OrtEnvironment.getEnvironment();

<span class="hljs-type">var</span> <span class="hljs-variable">sess_opt</span> <span class="hljs-operator">=</span> <span class="hljs-keyword">new</span> <span class="hljs-title class_">OrtSession</span>.SessionOptions();
sess_opt.registerCustomOpLibrary(OrtxPackage.getLibraryPath());

<span class="hljs-type">var</span> <span class="hljs-variable">tokenizer</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/tokenizer.onnx&quot;</span>, sess_opt);
<span class="hljs-type">var</span> <span class="hljs-variable">model</span> <span class="hljs-operator">=</span> env.createSession(<span class="hljs-string">&quot;app/model.onnx&quot;</span>, sess_opt);

…

<span class="hljs-comment">// Perform inference and extract text embeddings into native Java</span>
<span class="hljs-type">var</span> <span class="hljs-variable">results</span> <span class="hljs-operator">=</span> session.run(inputs).get(<span class="hljs-string">&quot;embeddings&quot;</span>);
<span class="hljs-type">float</span>[][] embeddings = (<span class="hljs-type">float</span>[][]) results.get().getValue();
<button class="copy-code-btn"></button></code></pre>
<p>Полный рабочий пример можно найти в разделе ресурсов.</p>
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
    </button></h2><p>В этом посте мы рассмотрели, как можно экспортировать модели с открытым исходным кодом из хаба моделей HuggingFace и использовать их непосредственно из языков, отличных от Python. Однако следует отметить некоторые предостережения:</p>
<p>Во-первых, библиотеки и расширения времени выполнения ONNX имеют разный уровень поддержки функций. Использование всех моделей на всех языках может оказаться невозможным до выхода будущего обновления SDK. Библиотеки времени выполнения ONNX для Python, C++, Java и JavaScript являются наиболее полными.</p>
<p>Во-вторых, хаб HuggingFace содержит предварительно экспортированные ONNX, но эти модели не включают финальные слои пулинга и нормализации. Вам следует знать, как работает <code translate="no">sentence-transformers</code>, если вы собираетесь использовать <code translate="no">torch.onnx</code> напрямую.</p>
<p>Тем не менее, ONNX пользуется поддержкой основных лидеров индустрии и имеет все шансы стать средством кросс-платформенного генеративного искусственного интеллекта, не требующим особых усилий.</p>
<h2 id="Resources" class="common-anchor-header">Ресурсы<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master/tutorials/quickstart/onnx_example">Пример кода onnx на Python и Java</a></p></li>
<li><p><a href="https://onnx.ai/">https://onnx.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/">https://onnxruntime.ai/</a></p></li>
<li><p><a href="https://onnxruntime.ai/docs/extensions/">https://onnxruntime.ai/docs/extensions/</a></p></li>
<li><p><a href="https://milvus.io/blog">https://milvus.io/blog</a></p></li>
<li><p><a href="https://github.com/milvus-io/bootcamp/tree/master">https://github.com/milvus-io/bootcamp/tree/master</a></p></li>
</ul>
