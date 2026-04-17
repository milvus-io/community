---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Быстрое тестирование и развертывание решений для векторного поиска с помощью
  Milvus 2.0 Bootcamp
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Создавайте, тестируйте и настраивайте решения для поиска сходства векторов с
  помощью Milvus, базы данных векторов с открытым исходным кодом.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Быстрое тестирование и развертывание решений для векторного поиска с помощью загрузочного лагеря Milvus 2.0</custom-h1><p>С выходом Milvus 2.0 команда переработала <a href="https://github.com/milvus-io/bootcamp">загрузочный лагерь</a> Milvus. Новый и улучшенный буткемп предлагает обновленные руководства и более простые в исполнении примеры кода для различных вариантов использования и развертывания. Кроме того, новая версия обновлена для <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, переосмысленной версии самой передовой в мире векторной базы данных.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Стресс-тестирование системы с использованием эталонных наборов данных объемом 1 и 100 млн.</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">Каталог эталонов</a> содержит эталонные тесты на 1 и 100 миллионов векторов, которые показывают, как ваша система будет реагировать на наборы данных разного размера.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Изучайте и создавайте популярные решения для поиска векторного сходства</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">Каталог решений</a> содержит наиболее популярные примеры использования поиска векторного сходства. Каждый пример содержит решение для ноутбука и решение для развертывания в докере. Примеры использования включают:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">поиск сходства изображений</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Поиск сходства видео</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Поиск сходства аудиофайлов</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Система рекомендаций</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Молекулярный поиск</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Система ответов на вопросы</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Быстрое развертывание полностью собранного приложения на любой системе</h3><p>Решения для быстрого развертывания - это докеризованные решения, которые позволяют пользователям развернуть полностью собранные приложения на любой системе. Эти решения идеально подходят для коротких демонстраций, но требуют дополнительной работы по настройке и пониманию по сравнению с блокнотами.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Используйте блокноты для конкретных сценариев, чтобы легко развернуть предварительно сконфигурированные приложения.</h3><p>Блокноты содержат простой пример развертывания Milvus для решения проблемы в конкретном сценарии использования. Каждый из примеров можно запустить от начала до конца без необходимости управлять файлами или конфигурациями. Кроме того, каждый блокнот легко повторяется и поддается изменению, что делает их идеальными базовыми файлами для других проектов.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Пример блокнота для поиска сходства изображений</h3><p>Поиск сходства изображений - одна из основных идей, лежащих в основе множества различных технологий, включая распознавание объектов автономными автомобилями. Этот пример объясняет, как легко создавать программы компьютерного зрения с помощью Milvus.</p>
<p>Этот блокнот состоит из трех частей:</p>
<ul>
<li>сервер Milvus</li>
<li>Сервер Redis (для хранения метаданных)</li>
<li>Предварительно обученная модель Resnet-18.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Шаг 1: Скачайте необходимые пакеты</h4><p>Начните с загрузки всех необходимых пакетов для этого проекта. В этом блокноте есть таблица с перечнем пакетов, которые необходимо использовать.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Шаг 2: Запуск сервера</h4><p>После установки пакетов запустите серверы и убедитесь, что они работают правильно. Обязательно следуйте правильным инструкциям по запуску серверов <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> и <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Шаг 3: Загрузка данных проекта</h4><p>По умолчанию этот блокнот извлекает фрагмент данных VOCImage для использования в качестве примера, но любая директория с изображениями должна работать, если она соответствует файловой структуре, которую можно увидеть в верхней части блокнота.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Шаг 4: Подключение к серверам</h4><p>В этом примере серверы работают на портах по умолчанию на localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Шаг 5: Создайте коллекцию</h4><p>После запуска серверов создайте в Milvus коллекцию для хранения всех векторов. В этом примере размерность установлена на 512, что соответствует размеру вывода resnet-18, а метрика сходства установлена на евклидово расстояние (L2). Milvus поддерживает множество различных <a href="https://milvus.io/docs/v2.0.x/metric.md">метрик сходства</a>.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Шаг 6: Создание индекса для коллекции</h4><p>После того как коллекция создана, создайте для нее индекс. В данном случае используется индекс IVF_SQ8. Этот индекс требует параметра 'nlist', который указывает Milvus, сколько кластеров создавать в каждом файле данных (сегменте). Для разных <a href="https://milvus.io/docs/v2.0.x/index.md">индексов</a> требуются разные параметры.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Шаг 7: Настройка модели и загрузчика данных</h4><p>После того как индекс IVF_SQ8 построен, настройте нейронную сеть и загрузчик данных. Предварительно обученная pytorch resnet-18, используемая в этом примере, лишена последнего слоя, который сжимает векторы для классификации и может потерять ценную информацию.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Набор данных и загрузчик данных необходимо изменить таким образом, чтобы они могли выполнять предварительную обработку и пакетную обработку изображений, а также предоставлять пути к файлам изображений. Это можно сделать с помощью слегка модифицированного загрузчика данных torchvision. Для предварительной обработки изображения необходимо обрезать и нормализовать, поскольку модель resnet-18 была обучена на определенном диапазоне размеров и значений.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Шаг 8: Вставка векторов в коллекцию</h4><p>Когда коллекция настроена, изображения можно обрабатывать и загружать в созданную коллекцию. Сначала изображения извлекаются загрузчиком данных и прогоняются через модель resnet-18. Полученные векторные вкрапления затем вставляются в Milvus, который возвращает уникальный идентификатор для каждого вектора. Идентификаторы векторов и пути к файлам изображений вставляются в сервер Redis в виде пар ключ-значение.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Шаг 9: Проведите поиск сходства векторов</h4><p>После того как все данные вставлены в Milvus и Redis, можно приступать к поиску векторного сходства. В данном примере для поиска векторного сходства из сервера Redis извлекаются три случайно выбранных изображения.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Эти изображения сначала проходят ту же предварительную обработку, что и на шаге 7, а затем проталкиваются через модель resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>Затем полученные векторные вкрапления используются для поиска. Сначала задайте параметры поиска, включая имя коллекции для поиска, nprobe (количество кластеров для поиска) и top_k (количество возвращаемых векторов). В данном примере поиск должен быть очень быстрым.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Шаг 10: Результаты поиска изображений</h4><p>Идентификаторы векторов, полученные в результате запросов, используются для поиска соответствующих изображений. Затем Matplotlib используется для отображения результатов поиска изображений.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Узнайте, как развернуть Milvus в различных средах</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">Раздел "Развертывание"</a> нового bootcamp содержит всю информацию об использовании Milvus в различных средах и настройках. Он включает в себя развертывание Mishards, использование Kubernetes с Milvus, балансировку нагрузки и многое другое. Для каждой среды есть подробное пошаговое руководство, объясняющее, как заставить Milvus работать в ней.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Не будьте незнакомцем</h3><ul>
<li>Читайте наш <a href="https://zilliz.com/blog">блог</a>.</li>
<li>Общайтесь с нашим сообществом разработчиков открытого кода в <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Используйте Milvus, самую популярную в мире векторную базу данных, на <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
