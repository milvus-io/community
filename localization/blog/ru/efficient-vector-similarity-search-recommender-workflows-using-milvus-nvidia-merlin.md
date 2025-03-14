---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Эффективный поиск векторного сходства в рекомендательных рабочих процессах с
  помощью Milvus и NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Знакомство с интеграцией NVIDIA Merlin и Milvus в создание рекомендательных
  систем и бенчмаркинг их производительности в различных сценариях.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Это сообщение было впервые опубликовано на <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">канале NVIDIA Merlin в Medium</a>, отредактировано и перепощено здесь с разрешения. Она была написана совместно <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Бурчином Бозкая</a> и <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">Уильямом Хиксом</a> из NVIDIA и <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Филипом Хальтмайером</a> и <a href="https://github.com/liliu-z">Ли Лиу</a> из Zilliz.</em></p>
<h2 id="Introduction" class="common-anchor-header">Введение<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Современные рекомендательные системы (Recsys) состоят из конвейеров обучения/вывода, включающих в себя несколько этапов получения данных, их предварительной обработки, обучения моделей и настройки гиперпараметров для поиска, фильтрации, ранжирования и оценки релевантных элементов. Важнейшим компонентом системы рекомендаций является поиск или обнаружение наиболее релевантных для пользователя объектов, особенно при наличии больших каталогов объектов. Этот шаг обычно включает поиск <a href="https://zilliz.com/glossary/anns">ближайших соседей (ANN)</a> по индексированной базе данных низкоразмерных векторных представлений (т.е. вкраплений) атрибутов продуктов и пользователей, созданных на основе моделей глубокого обучения, которые тренируются на взаимодействии между пользователями и продуктами/услугами.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, фреймворк с открытым исходным кодом, разработанный для обучения сквозных моделей для создания рекомендаций любого масштаба, интегрируется с эффективной системой индексации и поиска по <a href="https://zilliz.com/learn/what-is-vector-database">векторным базам данных</a>. Одним из таких фреймворков, получивших широкое распространение в последнее время, является <a href="https://zilliz.com/what-is-milvus">Milvus</a>, векторная база данных с открытым исходным кодом, созданная компанией <a href="https://zilliz.com/">Zilliz</a>. Она предлагает быстрые возможности индексирования и запросов. Недавно Milvus добавил <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">поддержку GPU-ускорения</a>, которое использует графические процессоры NVIDIA для поддержки рабочих процессов ИИ. Поддержка GPU-ускорения - отличная новость, поскольку ускоренная библиотека векторного поиска делает возможными быстрые одновременные запросы, что положительно сказывается на требованиях к задержкам в современных рекомендательных системах, где разработчики ожидают множество одновременных запросов. Milvus имеет более 5 миллионов докеров, ~23 тысячи звезд на GitHub (по состоянию на сентябрь 2023 года), более 5 тысяч корпоративных клиентов и является основным компонентом многих приложений (см. <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">примеры</a> использования).</p>
<p>В этом блоге демонстрируется работа Milvus с фреймворком Merlin Recsys на этапе обучения и вывода. Мы показываем, как Milvus дополняет Merlin на этапе поиска элементов с помощью высокоэффективного поиска с встраиванием вектора top-k и как он может использоваться с NVIDIA Triton Inference Server (TIS) на этапе вывода (см. рисунок 1). <strong>Результаты наших бенчмарков показывают впечатляющее ускорение от 37x до 91x при использовании Milvus с GPU-ускорением, который использует NVIDIA RAFT с векторными вкраплениями, сгенерированными Merlin Models.</strong> Код, который мы используем для демонстрации интеграции Merlin-Milvus, и подробные результаты бенчмарков, а также <a href="https://github.com/zilliztech/VectorDBBench">библиотека</a>, которая облегчила наше исследование бенчмарков, доступны здесь.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 1. Многоступенчатая рекомендательная система с фреймворком Milvus, вносящим вклад в этап поиска. Источник оригинального рисунка многоступенчатой системы: эта <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">запись в блоге</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Проблемы, с которыми сталкиваются рекомендатели<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Учитывая многоступенчатый характер рекомендательных систем и наличие различных компонентов и библиотек, в которые они интегрированы, значительной проблемой является интеграция всех компонентов в сквозной конвейер. Мы стремимся показать, что интеграция может быть выполнена с меньшими усилиями в наших примерах блокнотов.</p>
<p>Еще одна проблема, связанная с рекомендательными рабочими процессами, - ускорение некоторых частей конвейера. Хотя известно, что GPU играют огромную роль в обучении больших нейронных сетей, они лишь недавно появились в векторных базах данных и поиске ANN. С увеличением размера реестров товаров электронной коммерции или баз данных потокового мультимедиа и количества пользователей, использующих эти сервисы, центральные процессоры должны обеспечивать необходимую производительность для обслуживания миллионов пользователей в эффективных рабочих процессах Recsys. Для решения этой проблемы стало необходимо GPU-ускорение в других частях конвейера. Решение, представленное в этом блоге, решает эту проблему, показывая, что ANN-поиск эффективен при использовании GPU.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Технологические стеки для решения<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте начнем с обзора некоторых основ, необходимых для нашей работы.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: библиотека с открытым исходным кодом и высокоуровневыми API для ускорения рекомендателей на графических процессорах NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: для предварительной обработки входных табличных данных и создания признаков.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: для обучения моделей глубокого обучения, в данном случае для обучения векторов встраивания пользователей и предметов на основе данных о взаимодействии с пользователями.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: для объединения рекомендательной модели на основе TensorFlow с другими элементами (например, хранилищем характеристик, ANN-поиском с Milvus), которые будут обслуживаться с помощью TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: для этапа вывода, на котором передается вектор характеристик пользователя и генерируются рекомендации по продуктам.</p></li>
<li><p>Контейнеризация: все вышеперечисленное доступно через контейнер(ы), которые NVIDIA предоставляет в <a href="https://catalog.ngc.nvidia.com/">каталоге NGC</a>. Мы использовали контейнер Merlin TensorFlow 23.06, доступный <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">здесь</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: для индексации и запроса векторов с GPU-ускорением.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: то же самое, что и выше, но для работы на CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: для подключения к серверу Milvus, создания индексов векторных баз данных и выполнения запросов через интерфейс Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: для сохранения и извлечения атрибутов пользователей и предметов в хранилище характеристик (с открытым исходным кодом) как часть нашего сквозного конвейера RecSys.</p></li>
</ul>
<p>Под капотом также используется несколько базовых библиотек и фреймворков. Например, Merlin опирается на другие библиотеки NVIDIA, такие как cuDF и Dask, доступные под <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. Аналогично, Milvus опирается на <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> для примитивов ускорения GPU и модифицированные библиотеки, такие как <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> и <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, для поиска.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Понимание векторных баз данных и Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">Приближенный ближайший сосед (ANN)</a> - это функциональность, с которой не могут справиться реляционные базы данных. Реляционные базы данных предназначены для работы с табличными данными с предопределенной структурой и непосредственно сравниваемыми значениями. Индексы реляционных баз данных полагаются на это, чтобы сравнивать данные и создавать структуры, которые используют преимущества знания того, что каждое значение меньше или больше другого. Векторы встраивания не могут напрямую сравниваться друг с другом таким образом, поскольку нам нужно знать, что представляет собой каждое значение в векторе. Они не могут сказать, обязательно ли один вектор меньше другого. Единственное, что мы можем сделать, - это вычислить расстояние между двумя векторами. Если расстояние между двумя векторами невелико, можно предположить, что характеристики, которые они представляют, похожи, а если велико, то можно предположить, что данные, которые они представляют, отличаются друг от друга. Однако за эти эффективные индексы приходится платить: вычисление расстояния между двумя векторами требует больших вычислительных затрат, а векторные индексы плохо адаптируются и иногда не поддаются модификации. Из-за этих двух ограничений интеграция таких индексов в реляционные базы данных является более сложной, поэтому необходимы <a href="https://zilliz.com/blog/what-is-a-real-vector-database">специально созданные векторные базы данных</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> была создана для решения проблем, с которыми сталкиваются реляционные базы данных при работе с векторами, и была разработана с нуля для работы с векторами встраивания и их индексами в больших масштабах. Чтобы выполнить значок cloud-native, Milvus разделяет вычисления и хранение, а также различные вычислительные задачи - запросы, обработку данных и индексирование. Пользователи могут масштабировать каждую часть базы данных для решения других задач, будь то вставка данных или поиск. При большом наплыве запросов на вставку данных пользователь может временно масштабировать узлы индексации по горизонтали и вертикали, чтобы справиться со вставкой данных. Аналогичным образом, если данные не поступают, но есть много поисковых запросов, пользователь может уменьшить количество индексных узлов и вместо этого увеличить количество узлов запросов для повышения пропускной способности. Такой дизайн системы (см. рис. 2) потребовал от нас мыслить категориями параллельных вычислений, в результате чего получилась оптимизированная для вычислений система с множеством возможностей для дальнейшей оптимизации.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 2. Дизайн системы Milvus</em></p>
<p>Milvus также использует множество современных библиотек индексирования, чтобы предоставить пользователям как можно больше возможностей для настройки системы. Он улучшает их, добавляя возможность обработки CRUD-операций, потоковых данных и фильтрации. Позже мы обсудим, чем отличаются эти индексы и каковы плюсы и минусы каждого из них.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Пример решения: интеграция Milvus и Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>Представленный здесь пример решения демонстрирует интеграцию Milvus с Merlin на этапе поиска элементов (когда k наиболее релевантных элементов извлекаются с помощью ANN-поиска). Мы используем реальный набор данных из <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">задачи RecSys</a>, описанной ниже. Мы обучаем модель глубокого обучения Two-Tower, которая изучает векторные вкрапления для пользователей и предметов. В этом разделе также приводится схема нашего бенчмаркинга, включая метрики, которые мы собираем, и диапазон параметров, которые мы используем.</p>
<p>Наш подход включает в себя:</p>
<ul>
<li><p>сбор и предварительную обработку данных</p></li>
<li><p>обучение двухбашенной модели глубокого обучения</p></li>
<li><p>построение индекса Milvus</p></li>
<li><p>Поиск сходства по индексу Milvus.</p></li>
</ul>
<p>Мы кратко описываем каждый шаг и отсылаем читателя к нашим <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">блокнотам</a> за подробностями.</p>
<h3 id="Dataset" class="common-anchor-header">Набор данных</h3><p>Компания YOOCHOOSE GmbH предоставила набор данных, который мы используем в этом интеграционном и эталонном исследовании для <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">задачи RecSys 2015</a>, и он доступен на Kaggle. Он содержит события нажатия/покупки пользователем в европейском онлайн-магазине с такими атрибутами, как идентификатор сессии, временная метка, идентификатор товара, связанный с нажатием/покупкой, и категория товара, доступные в файле yoochoose-clicks.dat. Сессии независимы, и нет никаких намеков на возвращение пользователей, поэтому мы рассматриваем каждую сессию как принадлежащую отдельному пользователю. В наборе данных 9 249 729 уникальных сессий (пользователей) и 52 739 уникальных элементов.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Ввод и предварительная обработка данных</h3><p>Для предварительной обработки данных мы используем <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, GPU-ускоренный, масштабируемый компонент Merlin для создания и предварительной обработки признаков. С помощью NVTabular мы считываем данные в память GPU, при необходимости переставляем признаки, экспортируем в файлы parquet и создаем разбиение на тренировку и валидацию для обучения. В результате мы получаем 7 305 761 уникального пользователя и 49 008 уникальных предметов для обучения. Мы также классифицируем каждый столбец и его значения в целочисленные значения. Теперь набор данных готов для обучения модели Two-Tower.</p>
<h3 id="Model-training" class="common-anchor-header">Обучение модели</h3><p>Мы используем модель глубокого обучения <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> для обучения и создания вкраплений пользователей и предметов, которые впоследствии используются в векторной индексации и запросах. После обучения модели мы можем извлечь изученные вкрапления пользователей и элементов.</p>
<p>Следующие два шага необязательны: модель <a href="https://arxiv.org/abs/1906.00091">DLRM</a>, обученная ранжировать найденные предметы для рекомендаций, и хранилище признаков (в данном случае <a href="https://github.com/feast-dev/feast">Feast</a>), используемое для хранения и извлечения признаков пользователя и предмета. Мы включаем их для полноты многоэтапного рабочего процесса.</p>
<p>Наконец, мы экспортируем вложения пользователей и элементов в файлы parquet, которые впоследствии могут быть перезагружены для создания векторного индекса Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Создание и запрос индекса Milvus</h3><p>Milvus облегчает векторное индексирование и поиск по сходству через "сервер", запущенный на машине вывода. В нашем блокноте #2 мы установили сервер Milvus и Pymilvus с помощью pip-инсталляции, а затем запустили сервер с портом прослушивания по умолчанию. Далее мы демонстрируем создание простого индекса (IVF_FLAT) и запрос к нему с помощью функций <code translate="no">setup_milvus</code> и <code translate="no">query_milvus</code>, соответственно.</p>
<h2 id="Benchmarking" class="common-anchor-header">Бенчмаркинг<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы разработали два бенчмарка, чтобы продемонстрировать целесообразность использования быстрой и эффективной библиотеки векторного индексирования/поиска, такой как Milvus.</p>
<ol>
<li><p>Используя Milvus для построения векторных индексов с двумя наборами вкраплений, мы сгенерировали: 1) вкрапления пользователей для 7,3 млн уникальных пользователей, разбитые на 85 % обучающего набора (для индексирования) и 15 % тестового набора (для запроса), и 2) вкрапления товаров для 49 тыс. продуктов (с разделением 50 на 50 обучающего и тестового наборов). Этот тест проводится независимо для каждого набора векторных данных, и результаты представлены отдельно.</p></li>
<li><p>Использование Milvus для создания векторного индекса для набора данных 49K item embeddings и запрос 7,3M уникальных пользователей к этому индексу для поиска сходства.</p></li>
</ol>
<p>В этих бенчмарках мы использовали алгоритмы индексирования IVFPQ и HNSW, выполненные на GPU и CPU, а также различные комбинации параметров. Подробности доступны <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">здесь</a>.</p>
<p>Компромисс между качеством поиска и пропускной способностью является важным фактором производительности, особенно в производственной среде. Milvus позволяет полностью контролировать параметры индексирования, чтобы исследовать этот компромисс для конкретного случая использования и добиться лучших результатов поиска с учетом истины. Это может означать увеличение вычислительных затрат в виде снижения пропускной способности или количества запросов в секунду (QPS). Мы измеряем качество поиска ANN с помощью метрики recall и предоставляем кривые QPS-recall, которые демонстрируют компромисс. Можно принять решение о приемлемом уровне качества поиска с учетом вычислительных ресурсов или требований к задержке/пропускной способности в конкретном случае.</p>
<p>Также обратите внимание на размер пакета запросов (nq), используемый в наших бенчмарках. Это полезно для рабочих процессов, в которых на вывод отправляется несколько одновременных запросов (например, офлайн-рекомендации, запрошенные и отправленные списку получателей электронной почты, или онлайн-рекомендации, созданные путем объединения параллельно поступающих запросов и их одновременной обработки). В зависимости от конкретного случая использования TIS также может помочь обработать эти запросы в пакетном режиме.</p>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p>Теперь мы представим результаты для трех наборов бенчмарков на CPU и GPU, используя типы индексов HNSW (только CPU) и IVF_PQ (CPU и GPU), реализованные в Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Поиск векторного сходства между элементами и элементами</h4><p>В этом наименьшем наборе данных каждый прогон для заданной комбинации параметров берет 50 % векторов элементов в качестве векторов запроса и запрашивает 100 лучших похожих векторов из оставшихся. HNSW и IVF_PQ демонстрируют высокие показатели recall при всех протестированных настройках параметров, в диапазоне 0,958-1,0 и 0,665-0,997, соответственно. Этот результат говорит о том, что HNSW работает лучше в плане запоминания, но IVF_PQ при небольших настройках nlist дает вполне сопоставимое запоминание. Следует также отметить, что значения recall могут сильно варьироваться в зависимости от параметров индексирования и запроса. Приведенные нами значения были получены после предварительных экспериментов с общими диапазонами параметров и последующего углубления в избранное подмножество.</p>
<p>Общее время выполнения всех запросов на CPU при использовании HNSW для заданной комбинации параметров составляет от 5,22 до 5,33 с (быстрее при увеличении m, относительно не меняется при изменении ef), а при использовании IVF_PQ - от 13,67 до 14,67 с (медленнее при увеличении nlist и nprobe). Ускорение GPU дает заметный эффект, как видно на рисунке 3.</p>
<p>На рисунке 3 показан компромисс между запоминанием и пропускной способностью для всех запусков, выполненных на CPU и GPU с этим небольшим набором данных с использованием IVF_PQ. Мы обнаружили, что GPU обеспечивает ускорение от 4x до 15x во всех протестированных комбинациях параметров (ускорение увеличивается при увеличении nprobe). Для расчета этого показателя берется отношение QPS от GPU к QPS от CPU для каждой комбинации параметров. В целом, этот набор представляет собой небольшую проблему для CPU или GPU и показывает перспективы дальнейшего ускорения при использовании более крупных наборов данных, о чем будет сказано ниже.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 3. Ускорение GPU при работе алгоритма Milvus IVF_PQ на NVIDIA A100 GPU (поиск сходства по элементам)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Поиск векторного сходства между пользователями и пользователями</h4><p>При значительно большем втором наборе данных (7,3 М пользователей) мы выделили 85 % (~6,2 М) векторов в качестве "обучающих" (набор векторов для индексирования), а оставшиеся 15 % (~1,1 М) - "тестовые" или набор векторов запроса. HNSW и IVF_PQ показывают исключительно хорошие результаты в этом случае, со значениями recall 0.884-1.0 и 0.922-0.999, соответственно. Однако они гораздо более требовательны к вычислительным ресурсам, особенно IVF_PQ на центральном процессоре. Общее время выполнения всех запросов на CPU при использовании HNSW составляет от 279,89 до 295,56 с, а при использовании IVF_PQ - от 3082,67 до 10932,33 с. Обратите внимание, что время выполнения запросов суммируется для 1,1 миллиона векторов, поэтому можно сказать, что один запрос к индексу по-прежнему выполняется очень быстро.</p>
<p>Однако выполнение запросов на базе CPU может оказаться нецелесообразным, если сервер выводов ожидает много тысяч одновременных запросов на выполнение запросов к инвентарному списку из миллионов элементов.</p>
<p>Графический процессор A100 обеспечивает потрясающее ускорение от 37x до 91x (в среднем 76,1x) для всех комбинаций параметров с IVF_PQ с точки зрения пропускной способности (QPS), как показано на рисунке 4. Это согласуется с тем, что мы наблюдали на небольшом наборе данных, что говорит о том, что производительность GPU достаточно хорошо масштабируется при использовании Milvus с миллионами векторов встраивания.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 4. Ускорение GPU при работе алгоритма Milvus IVF_PQ на NVIDIA A100 GPU (поиск сходства между пользователем и пользователем)</em></p>
<p>На следующем подробном рисунке 5 показано соотношение recall-QPS для всех комбинаций параметров, протестированных на CPU и GPU с IVF_PQ. Каждый набор точек (верхняя - для GPU, нижняя - для CPU) на этом графике показывает компромисс, возникающий при изменении параметров векторного индексирования/запроса в сторону достижения более высокой запоминаемости за счет снижения пропускной способности. Обратите внимание на значительную потерю QPS в случае GPU при попытке достичь более высокого уровня запоминания.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 5. Компромисс между запоминанием и пропускной способностью для всех комбинаций параметров, протестированных на CPU и GPU с IVF_PQ (пользователи против пользователей)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Пользователи против предметов Поиск векторного сходства</h4><p>Наконец, мы рассмотрим еще один реалистичный случай использования, когда векторы пользователей запрашиваются по отношению к векторам элементов (как показано в блокноте 01 выше). В этом случае индексируется 49 тыс. векторов элементов, а 7,3 млн векторов пользователей запрашиваются на 100 наиболее похожих элементов.</p>
<p>Здесь все становится интересным, потому что запрос 7,3M в партиях по 1000 к индексу из 49K элементов кажется трудоемким на CPU как для HNSW, так и для IVF_PQ. GPU, похоже, справляется с этой задачей лучше (см. Рисунок 6). Наивысшие показатели точности IVF_PQ на CPU при nlist = 100 вычисляются в среднем за 86 минут, но значительно меняются при увеличении значения nprobe (51 мин. при nprobe = 5 против 128 мин. при nprobe = 20). Графический процессор NVIDIA A100 значительно ускоряет работу в 4-17 раз (ускорение увеличивается при увеличении nprobe). Помните, что алгоритм IVF_PQ, благодаря своей технике квантования, также уменьшает объем памяти и обеспечивает вычислительную эффективность решения ANN-поиска в сочетании с GPU-ускорением.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 6. Ускорение GPU при использовании алгоритма Milvus IVF_PQ на графическом процессоре NVIDIA A100 (поиск сходства по пользовательским элементам)</em></p>
<p>Как и на рисунке 5, компромисс между отзывом и пропускной способностью показан на рисунке 7 для всех комбинаций параметров, протестированных с помощью IVF_PQ. Здесь все еще видно, как можно немного отказаться от точности поиска ANN в пользу увеличения пропускной способности, хотя различия гораздо менее заметны, особенно в случае работы на GPU. Это говорит о том, что можно ожидать относительно стабильно высоких уровней вычислительной производительности при использовании GPU, но при этом добиваться высокой запоминаемости.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 7. Компромисс между запоминанием и пропускной способностью для всех комбинаций параметров, протестированных на CPU и GPU с IVF_PQ (пользователи против предметов)</em></p>
<h2 id="Conclusion" class="common-anchor-header">Заключение<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы с радостью поделимся с вами несколькими заключительными замечаниями, если вы дошли до этого момента. Мы хотим напомнить вам, что сложность и многоступенчатость современных Recsys требуют производительности и эффективности на каждом этапе. Надеемся, этот блог дал вам убедительные причины рассмотреть возможность использования двух критически важных функций в ваших конвейерах RecSys:</p>
<ul>
<li><p>Библиотека NVIDIA Merlin Systems позволяет легко подключить <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, эффективный векторный поисковый движок с GPU-ускорением.</p></li>
<li><p>Используйте GPU для ускорения вычислений при индексации векторных баз данных и ANN-поиска с помощью таких технологий, как <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Полученные результаты свидетельствуют о том, что представленная интеграция Merlin-Milvus обладает высокой производительностью и гораздо менее сложна, чем другие варианты обучения и вывода. Кроме того, оба фреймворка активно развиваются, и в каждом выпуске добавляется множество новых функций (например, новые индексы векторных баз данных с GPU-ускорением в Milvus). Тот факт, что поиск векторного сходства является важнейшим компонентом в различных рабочих процессах, таких как компьютерное зрение, моделирование больших языков и рекомендательные системы, делает эти усилия еще более оправданными.</p>
<p>В заключение мы хотели бы поблагодарить всех сотрудников Zilliz/Milvus и Merlin, а также команды RAFT, которые внесли свой вклад в подготовку этой работы и этой записи в блоге. С нетерпением ждем ваших отзывов, если у вас появится возможность внедрить Merlin и Milvus в свои recsys или другие рабочие процессы.</p>
