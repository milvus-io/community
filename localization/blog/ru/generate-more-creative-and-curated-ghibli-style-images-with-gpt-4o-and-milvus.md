---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: >-
  Создание более креативных и курируемых изображений в стиле Гибли с помощью
  GPT-4o и Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Подключение личных данных к GPT-4o Использование Milvus для получения более
  подробных изображений
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">С GPT-4o каждый стал художником в одночасье<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Хотите верьте, хотите нет, но картинка, которую вы только что видели, была сгенерирована искусственным интеллектом, а точнее, недавно выпущенным GPT-4o!</em></p>
<p>Когда 26 марта OpenAI запустил встроенную в GPT-4o функцию генерации изображений, никто не мог предположить, какое творческое цунами последует за этим. В одночасье интернет взорвался портретами в стиле Гибли, созданными ИИ: знаменитости, политики, домашние животные и даже сами пользователи превращались в очаровательных персонажей Studio Ghibli с помощью всего нескольких простых подсказок. Спрос был настолько ошеломляющим, что самому Сэму Альтману пришлось "умолять" пользователей сбавить обороты, написав в твиттере, что "графические процессоры OpenAI плавятся".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Пример изображений, сгенерированных GPT-4o (авторство X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Почему GPT-4o меняет все.<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Для творческих индустрий это означает смену парадигмы. Задачи, которые раньше требовали от целой команды дизайнеров целого дня, теперь могут быть решены за считанные минуты. От предыдущих генераторов изображений GPT-4o отличает <strong>удивительная визуальная согласованность и интуитивно понятный интерфейс</strong>. Он поддерживает многооборотные диалоги, позволяющие дорабатывать изображения, добавляя элементы, корректируя пропорции, меняя стили и даже преобразуя 2D в 3D - по сути, профессиональный дизайнер у вас в кармане.</p>
<p>Секрет превосходной производительности GPT-4o? Это архитектура авторегрессии. В отличие от диффузионных моделей (например, Stable Diffusion), которые превращают изображения в шум перед их восстановлением, GPT-4o генерирует изображения последовательно - по одному маркеру за раз, сохраняя контекстную осведомленность на протяжении всего процесса. Это фундаментальное архитектурное различие объясняет, почему GPT-4o выдает более последовательные результаты с более простыми и естественными подсказками.</p>
<p>Но вот тут-то разработчикам и становится интересно: <strong>Все больше признаков указывают на важную тенденцию - модели ИИ сами становятся продуктами. Проще говоря, большинство продуктов, которые просто оборачивают большие модели ИИ вокруг данных, находящихся в открытом доступе, рискуют остаться позади.</strong></p>
<p>Истинная сила этих достижений заключается в сочетании больших моделей общего назначения с <strong>частными данными, относящимися к конкретной области</strong>. Такое сочетание вполне может стать оптимальной стратегией выживания для большинства компаний в эпоху больших языковых моделей. Поскольку базовые модели продолжают развиваться, долгосрочное конкурентное преимущество будет принадлежать тем, кто сможет эффективно интегрировать свои собственные наборы данных с этими мощными системами ИИ.</p>
<p>Давайте рассмотрим, как соединить ваши частные данные с GPT-4o с помощью Milvus, высокопроизводительной векторной базы данных с открытым исходным кодом.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Подключение частных данных к GPT-4o с помощью Milvus для получения более качественных изображений<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>Векторные базы данных - это ключевая технология, соединяющая ваши частные данные с моделями искусственного интеллекта. Они преобразуют контент - изображения, текст или аудио - в математические представления (векторы), которые отражают их смысл и характеристики. Это позволяет осуществлять семантический поиск, основанный на сходстве, а не только на ключевых словах.</p>
<p>Milvus, как ведущая база данных векторов с открытым исходным кодом, особенно хорошо подходит для взаимодействия с инструментами генеративного ИИ, такими как GPT-4o. Вот как я использовал ее для решения личной задачи.</p>
<h3 id="Background" class="common-anchor-header">Предыстория</h3><p>Однажды мне пришла в голову блестящая идея - превратить все проделки моей собаки Колы в комикс. Но тут возникла загвоздка: Как мне просеять десятки тысяч фотографий с работы, из путешествий и кулинарных приключений, чтобы найти озорные моменты Колы?</p>
<p>Ответ? Импортировать все мои фотографии в Milvus и выполнить поиск по изображениям.</p>
<p>Давайте разберемся с реализацией шаг за шагом.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Зависимости и окружение</h4><p>Для начала вам нужно подготовить окружение с нужными пакетами:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Подготовьте данные</h4><p>В качестве набора данных в этом руководстве я буду использовать свою фототеку, в которой около 30 000 фотографий. Если у вас под рукой нет никакого набора данных, скачайте примерный набор данных с сайта Milvus и распакуйте его:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Определите экстрактор характеристик</h4><p>Для извлечения векторов встраивания из изображений мы будем использовать модель ResNet-50 из библиотеки <code translate="no">timm</code>. Эта модель была обучена на миллионах изображений и может извлекать значимые признаки, представляющие визуальный контент.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Создание коллекции Milvus</h4><p>Далее мы создадим коллекцию Milvus для хранения вкраплений наших изображений. Считайте, что это специализированная база данных, явно предназначенная для поиска векторного сходства:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Заметки о параметрах MilvusClient:</strong></p>
<ul>
<li><p><strong>Локальная настройка:</strong> Использование локального файла (например, <code translate="no">./milvus.db</code>) является самым простым способом начать работу - Milvus Lite будет обрабатывать все ваши данные.</p></li>
<li><p><strong>Масштабирование:</strong> для больших наборов данных установите надежный сервер Milvus с помощью Docker или Kubernetes и используйте его URI (например, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Облачный вариант:</strong> Если вы используете Zilliz Cloud (полностью управляемый сервис Milvus), настройте URI и токен так, чтобы они соответствовали публичной конечной точке и ключу API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Вставка встраиваемых изображений в Milvus</h4><p>Теперь наступает процесс анализа каждого изображения и сохранения его векторного представления. Этот шаг может занять некоторое время в зависимости от размера вашего набора данных, но это одноразовый процесс:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Поиск изображений</h4><p>Теперь, когда наша база данных заполнена, мы можем искать похожие изображения. Именно здесь происходит волшебство - мы можем найти визуально похожие фотографии, используя векторное сходство:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Полученные изображения показаны ниже:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Комбинируйте векторный поиск с GPT-4o: Генерация изображений в стиле Гибли с помощью изображений, полученных Milvus</h3><p>Теперь наступает самое интересное: использование результатов поиска изображений в качестве входных данных для GPT-4o для создания креативного контента. В моем случае я хотел создать комиксы с участием моей собаки Колы на основе сделанных мною фотографий.</p>
<p>Процесс работы прост, но эффективен:</p>
<ol>
<li><p>Используйте векторный поиск, чтобы найти подходящие изображения Колы из моей коллекции.</p></li>
<li><p>Отправьте эти изображения в GPT-4o с творческими подсказками</p></li>
<li><p>Создание уникальных комиксов на основе визуального вдохновения.</p></li>
</ol>
<p>Вот несколько примеров того, что может получиться из этой комбинации:</p>
<p><strong>Подсказки, которые я использую:</strong></p>
<ul>
<li><p><em>"Создайте четырехпанельный, полноцветный, уморительный комикс о бордер-колли, пойманном за грызением мыши, с неловким моментом, когда хозяин узнает об этом".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Нарисуйте комикс, в котором эта собака демонстрирует милый наряд".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Используя эту собаку в качестве модели, нарисуйте комикс о том, как она посещает школу чародейства и волшебства Хогвартс".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Несколько советов из моего опыта создания изображений:</h3><ol>
<li><p><strong>Будьте проще</strong>: В отличие от тех привередливых диффузионных моделей, GPT-4o лучше всего работает с простыми подсказками. По мере работы я писал все более короткие подсказки и получал лучшие результаты.</p></li>
<li><p><strong>Лучше всего работает английский язык</strong>: Я пробовал писать подсказки на китайском языке для некоторых комиксов, но результаты были не очень хорошими. В итоге я стал писать подсказки на английском, а затем переводить готовые комиксы, когда это было необходимо.</p></li>
<li><p><strong>Не подходит для "Поколения видео"</strong>: Пока не возлагайте больших надежд на Сору - видеороликам, сгенерированным искусственным интеллектом, еще предстоит пройти долгий путь, когда дело дойдет до плавных движений и связных сюжетных линий.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">Что дальше? Моя точка зрения и возможность обсуждения<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Учитывая, что изображения, созданные искусственным интеллектом, занимают лидирующие позиции, беглый взгляд на основные релизы OpenAI за последние шесть месяцев показывает четкую закономерность: будь то GPT для маркетплейсов приложений, DeepResearch для создания отчетов, GPT-4o для создания разговорных изображений или Sora для видеомагии - крупные модели искусственного интеллекта выходят из-за занавеса на первый план. То, что раньше было экспериментальной технологией, теперь превращается в реальные, пригодные для использования продукты.</p>
<p>По мере того как GPT-4o и подобные модели становятся общепринятыми, большинство рабочих процессов и интеллектуальных агентов, основанных на стабильной диффузии, начинают устаревать. Однако незаменимая ценность частных данных и человеческой проницательности по-прежнему велика. Например, хотя ИИ не сможет полностью заменить креативные агентства, интеграция векторной базы данных Milvus с моделями GPT позволяет агентствам быстро генерировать свежие креативные идеи, вдохновленные их прошлыми успехами. Платформы электронной коммерции могут разрабатывать персонализированную одежду на основе тенденций покупок, а академические институты - мгновенно создавать визуальные материалы для научных работ.</p>
<p>Эра продуктов, созданных на основе моделей ИИ, наступила, и гонка за добычей золотой жилы данных только начинается. И разработчикам, и компаниям ясно: объединяйте свои уникальные данные с этими мощными моделями или рискуйте остаться позади.</p>
