---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: >-
  Gemini 3 Pro + Milvus: создание более надежного RAG с расширенными
  возможностями рассуждений и мультимодального управления
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Узнайте об основных обновлениях в Gemini 3 Pro, посмотрите, как он работает в
  ключевых бенчмарках, и следуйте руководству по построению
  высокопроизводительного конвейера RAG с помощью Milvus.
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Релиз Gemini 3 Pro от Google - это тот редкий случай, когда ожидания разработчиков действительно меняются: не просто шумиха, а возможности, которые существенно расширяют возможности естественно-языковых интерфейсов. Он превращает "опишите приложение, которое вы хотите" в исполняемый рабочий процесс: динамическая маршрутизация инструментов, многоэтапное планирование, оркестровка API и интерактивная генерация UX - все эти функции бесшовно сшиты вместе. Это самая близкая модель к тому, чтобы сделать vibe-кодинг жизнеспособным на производстве.</p>
<p>И цифры подтверждают сказанное. Gemini 3 Pro демонстрирует выдающиеся результаты практически по всем основным показателям:</p>
<ul>
<li><p><strong>Последний экзамен человечества:</strong> 37,5% без инструментов, 45,8% с инструментами - ближайший конкурент находится на уровне 26,5%.</p></li>
<li><p><strong>MathArena Apex:</strong> 23,4 %, в то время как большинство моделей не преодолевают отметку в 2 %.</p></li>
<li><p><strong>ScreenSpot-Pro:</strong> 72,7 % точности, почти вдвое выше, чем у ближайшего конкурента - 36,2 %.</p></li>
<li><p><strong>Vending-Bench 2:</strong> средняя чистая стоимость <strong>$5 478,16</strong>, что примерно <strong>на 1,4</strong> больше, чем у второго места.</p></li>
</ul>
<p>Другие результаты бенчмарков приведены в таблице ниже.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Сочетание глубоких рассуждений, активного использования инструментов и мультимодальной беглости делает Gemini 3 Pro естественным инструментом для генерации с расширенным поиском (RAG). В паре с <a href="https://milvus.io/"><strong>Milvus</strong></a>, высокопроизводительной векторной базой данных с открытым исходным кодом, созданной для семантического поиска миллиардного масштаба, вы получаете поисковый слой, который обосновывает ответы, чисто масштабируется и остается надежным в производстве даже при больших нагрузках.</p>
<p>В этом посте мы расскажем о том, что нового появилось в Gemini 3 Pro, почему он повышает эффективность рабочих процессов RAG и как построить чистый и эффективный конвейер RAG, используя Milvus в качестве основы для поиска.</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Основные обновления в Gemini 3 Pro<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro представляет ряд существенных обновлений, которые меняют способы обоснования, создания, выполнения задач и взаимодействия с пользователями. Эти улучшения делятся на четыре основные области возможностей:</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">Мультимодальное понимание и рассуждения</h3><p>Gemini 3 Pro устанавливает новые рекорды в важных мультимодальных тестах, включая ARC-AGI-2 для визуальных рассуждений, MMMU-Pro для кросс-модального понимания и Video-MMMU для понимания видео и получения знаний. Модель также представляет Deep Think, расширенный режим рассуждений, который позволяет выполнять структурированную, многоступенчатую логическую обработку. Это позволяет значительно повысить точность решения сложных задач, в которых традиционные модели цепочки мыслей обычно не справляются.</p>
<h3 id="Code-Generation" class="common-anchor-header">Генерация кода</h3><p>Модель выводит генеративное кодирование на новый уровень. Gemini 3 Pro может создавать интерактивные SVG, полноценные веб-приложения, 3D-сцены и даже функциональные игры, включая Minecraft-подобные среды и браузерный бильярд - и все это из одного запроса на естественном языке. Особенно выигрывает фронтальная разработка: модель может воссоздать существующие дизайны пользовательского интерфейса с высокой точностью или перевести скриншот непосредственно в готовый к производству код, что значительно ускоряет итеративную работу над пользовательским интерфейсом.</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">Агенты ИИ и использование инструментов</h3><p>С разрешения пользователя Gemini 3 Pro может получать доступ к данным с его устройства Google для выполнения долгосрочных и многоэтапных задач, таких как планирование поездок или бронирование автомобилей напрокат. Эта агентская способность отражена в высоких результатах <strong>Vending-Bench 2</strong>, бенчмарка, специально разработанного для стресс-тестирования использования инструментов с большим горизонтом. Модель также поддерживает рабочие процессы агентов профессионального уровня, включая выполнение команд терминала и взаимодействие с внешними инструментами через четко определенные API.</p>
<h3 id="Generative-UI" class="common-anchor-header">Генеративный пользовательский интерфейс</h3><p>Gemini 3 Pro выходит за рамки традиционной модели "один вопрос - один ответ" и представляет <strong>генеративный пользовательский интерфейс</strong>, в котором модель может динамически создавать целые интерактивные впечатления. Вместо того чтобы возвращать статичный текст, она может генерировать полностью настраиваемые интерфейсы - например, богатый, настраиваемый планировщик путешествий - непосредственно в ответ на инструкции пользователя. Таким образом, LLM превращаются из пассивных респондентов в активных генераторов интерфейсов.</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Испытания Gemini 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Помимо эталонных результатов, мы провели серию практических тестов, чтобы понять, как Gemini 3 Pro ведет себя в реальных рабочих процессах. Результаты показывают, как его мультимодальное понимание, генеративные возможности и долгосрочное планирование превращаются в практическую ценность для разработчиков.</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">Мультимодальное понимание</h3><p>Gemini 3 Pro демонстрирует впечатляющую универсальность при работе с текстом, изображениями, видео и кодом. В нашем тесте мы загрузили видеоролик Zilliz прямо с YouTube. Модель обработала весь ролик - включая повествование, переходы и экранный текст - примерно <strong>за 40 секунд</strong>, что необычайно быстро для мультимодального контента большой формы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Внутренние оценки Google показывают аналогичное поведение: Gemini 3 Pro обрабатывал рукописные рецепты на нескольких языках, транскрибировал и переводил каждый из них и собирал их в семейную книгу рецептов, которой можно поделиться.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">Задачи с нулевым результатом</h3><p>Gemini 3 Pro может генерировать полностью интерактивные веб-интерфейсы без предварительных примеров и подмостков. Когда Gemini 3 Pro попросили создать полированную ретрофутуристическую <strong>3D-игру про космический корабль</strong>, модель создала полную интерактивную сцену: неоново-фиолетовая сетка, корабли в стиле киберпанк, эффекты светящихся частиц и плавное управление камерой - и все это за один нулевой кадр.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">Планирование сложных задач</h3><p>Модель также демонстрирует более эффективное долгосрочное планирование задач, чем многие ее аналоги. В нашем тесте на организацию входящих сообщений Gemini 3 Pro вела себя как административный помощник с искусственным интеллектом: распределяла беспорядочные письма по группам проектов, составляла предложения к действию (ответ, продолжение, архив) и представляла чистую, структурированную сводку. Если в модели был заложен план, то все входящие письма можно было очистить одним щелчком подтверждения.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Как построить систему RAG с помощью Gemini 3 Pro и Milvus<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Усовершенствованная система рассуждений Gemini 3 Pro, мультимодальное понимание и широкие возможности использования инструментов делают ее отличной основой для высокопроизводительных систем RAG.</p>
<p>В паре с <a href="https://milvus.io/"><strong>Milvus</strong></a>, высокопроизводительной векторной базой данных с открытым исходным кодом, созданной для крупномасштабного семантического поиска, вы получаете четкое разделение обязанностей: Gemini 3 Pro занимается <strong>интерпретацией, рассуждениями и генерацией</strong>, а Milvus обеспечивает <strong>быстрый, масштабируемый уровень поиска</strong>, который поддерживает ответы на основе корпоративных данных. Эта пара хорошо подходит для производственных приложений, таких как внутренние базы знаний, помощники по работе с документами, вспомогательные системы поддержки клиентов и экспертные системы для конкретных областей.</p>
<h3 id="Prerequisites" class="common-anchor-header">Предварительные условия</h3><p>Перед созданием конвейера RAG убедитесь, что эти основные библиотеки Python установлены или обновлены до последних версий:</p>
<ul>
<li><p><strong>pymilvus</strong> - официальный Milvus Python SDK</p></li>
<li><p><strong>google-generativeai</strong> - клиентская библиотека Gemini 3 Pro</p></li>
<li><p><strong>requests</strong> - для обработки HTTP-вызовов, где это необходимо</p></li>
<li><p><strong>tqdm</strong> - для отображения прогресс-баров во время приема наборов данных.</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>Далее войдите в <a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a>, чтобы получить ключ API.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">Подготовка набора данных</h3><p>В этом руководстве мы будем использовать раздел FAQ из документации Milvus 2.4.x в качестве частной базы знаний для нашей системы RAG.</p>
<p>Скачайте архив документации и распакуйте его в папку с именем <code translate="no">milvus_docs</code>.</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Загрузите все файлы Markdown по пути <code translate="no">milvus_docs/en/faq</code>. Для каждого документа мы применяем простое разбиение на основе заголовков <code translate="no">#</code> для грубого разделения основных разделов в каждом файле Markdown.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">Настройка LLM и модели встраивания</h3><p>В этом руководстве мы будем использовать <code translate="no">gemini-3-pro-preview</code> в качестве LLM и <code translate="no">text-embedding-004</code> в качестве модели встраивания.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Ответ модели: Я - Gemini, большая языковая модель, созданная Google.</p>
<p>Вы можете провести быструю проверку, сгенерировав тестовый эмбеддинг и выведя его размерность вместе с первыми несколькими значениями:</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Выход тестового вектора:</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Загрузка данных в Milvus</h3><p><strong>Создание коллекции</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>При создании коллекции <code translate="no">MilvusClient</code> вы можете выбрать один из трех вариантов конфигурации, в зависимости от масштаба и окружения:</p>
<ul>
<li><p><strong>Локальный режим (Milvus Lite):</strong> Установите URI на путь к локальному файлу (например, <code translate="no">./milvus.db</code>). Это самый простой способ начать работу - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> будет автоматически сохранять все данные в этом файле.</p></li>
<li><p><strong>Самостоятельное размещение Milvus (Docker или Kubernetes):</strong> Для больших наборов данных или производственных рабочих нагрузок запустите Milvus на Docker или Kubernetes. Установите URI на конечную точку вашего сервера Milvus, например <code translate="no">http://localhost:19530</code>.</p></li>
<li><p><strong>Zilliz Cloud (полностью управляемый сервис Milvus):</strong> Если вы предпочитаете управляемое решение, используйте Zilliz Cloud. Установите URI на вашу публичную конечную точку и укажите свой ключ API в качестве маркера аутентификации.</p></li>
</ul>
<p>Перед созданием новой коллекции сначала проверьте, существует ли она уже. Если она существует, удалите ее и создайте заново, чтобы обеспечить чистую настройку.</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>Создайте новую коллекцию с указанными параметрами.</p>
<p>Если схема не указана, Milvus автоматически генерирует поле ID по умолчанию в качестве первичного ключа и векторное поле для хранения вкраплений. Он также предоставляет зарезервированное динамическое поле JSON, в котором хранятся любые дополнительные поля, не определенные в схеме.</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Вставка данных</strong></p>
<p>Пройдитесь по каждой текстовой записи, сгенерируйте ее вектор встраивания и вставьте данные в Milvus. В этом примере мы включили дополнительное поле <code translate="no">text</code>. Поскольку оно не предопределено в схеме, Milvus автоматически сохраняет его с помощью динамического JSON-поля под капотом - никаких дополнительных настроек не требуется.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Пример вывода:</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">Построение рабочего процесса RAG</h3><p><strong>Получение релевантных данных</strong></p>
<p>Чтобы протестировать извлечение данных, мы зададим распространенный вопрос о Milvus.</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Выполните поиск в коллекции по этому запросу и верните 3 наиболее релевантных результата.</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Результаты возвращаются в порядке сходства, от наиболее близких к наименее похожим.</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>Генерирование ответа RAG с помощью LLM</strong></p>
<p>После получения документов преобразуйте их в строковый формат.</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Предоставьте LLM системный запрос и пользовательский запрос, созданные на основе документов, полученных из Milvus.</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Используйте модель <code translate="no">gemini-3-pro-preview</code> вместе с этими подсказками для создания окончательного ответа.</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>Из результатов видно, что Gemini 3 Pro создает четкий, хорошо структурированный ответ на основе полученной информации.</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>Примечание</strong>: Gemini 3 Pro в настоящее время недоступен для пользователей бесплатного уровня. Нажмите <a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">здесь</a> для получения более подробной информации.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Вы можете получить доступ к нему через <a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">Еще кое-что: Vibe Coding с Google Antigravity<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Вместе с Gemini 3 Pro компания Google представила <a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>, платформу для виброкодинга, которая автономно взаимодействует с редактором, терминалом и браузером. В отличие от более ранних инструментов с искусственным интеллектом, которые обрабатывали разовые инструкции, Antigravity работает на уровне задач, позволяя разработчикам указывать <em>, что</em> они хотят создать, а система управляет тем <em>, как</em>, организуя весь рабочий процесс из конца в конец.</p>
<p>Традиционные рабочие процессы кодирования ИИ обычно генерировали изолированные фрагменты, которые разработчикам приходилось просматривать, интегрировать, отлаживать и запускать вручную. Antigravity меняет эту динамику. Вы можете просто описать задачу - например, <em>"Создать простую игру для взаимодействия с домашними животными</em> " - и система разложит запрос, сгенерирует код, выполнит команды терминала, откроет браузер для проверки результата и будет повторять действия до тех пор, пока все не заработает. Это превращает ИИ из пассивного автозаполнителя в активного партнера по разработке - такого, который узнает ваши предпочтения и со временем адаптируется к вашему личному стилю разработки.</p>
<p>Заглядывая вперед, можно сказать, что идея агента, координирующего свою работу непосредственно с базой данных, не так уж и далека от реальности. С помощью вызова инструментов через MCP ИИ сможет в конечном итоге считывать информацию из базы данных Milvus, собирать базу знаний и даже автономно поддерживать собственный конвейер поиска. Во многих отношениях этот сдвиг даже более значителен, чем само обновление модели: когда ИИ может взять описание продукта на уровне продукта и преобразовать его в последовательность исполняемых задач, усилия человека естественным образом смещаются в сторону определения целей, ограничений и того, как выглядит "правильность", то есть в сторону высокоуровневого мышления, которое действительно стимулирует разработку продукта.</p>
<h2 id="Ready-to-Build" class="common-anchor-header">Готовы к созданию?<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы готовы попробовать, следуйте нашему пошаговому руководству и создайте систему RAG с помощью <strong>Gemini 3 Pro + Milvus</strong> уже сегодня.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы через<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
