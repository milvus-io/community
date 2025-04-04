---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Масштабируемый и молниеносный поиск сходства с помощью векторной базы данных
  Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Храните, индексируйте, управляйте и ищите триллионы векторов документов за
  миллисекунды!
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>изображение обложки</span> </span></p>
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
    </button></h2><p>В этой статье мы рассмотрим некоторые интересные аспекты, связанные с векторными базами данных и поиском сходства в масштабе. В современном быстро развивающемся мире мы видим новые технологии, новые бизнесы, новые источники данных, и, следовательно, нам нужно постоянно использовать новые способы хранения, управления и использования этих данных для получения глубоких знаний. Структурированные табличные данные десятилетиями хранились в реляционных базах данных, и бизнес-аналитика процветала благодаря анализу и извлечению информации из таких данных. Однако, учитывая современный ландшафт данных, "более 80-90 % данных - это неструктурированная информация, такая как текст, видео, аудио, журналы веб-серверов, социальные сети и многое другое". Организации используют возможности машинного обучения и глубокого обучения, чтобы попытаться извлечь информацию из таких данных, поскольку традиционных методов, основанных на запросах, может быть недостаточно или даже невозможно. Существует огромный, неиспользованный потенциал для извлечения ценной информации из таких данных, и мы только начинаем!</p>
<blockquote>
<p>"Поскольку большая часть данных в мире неструктурирована, возможность анализировать их и действовать на их основе открывает широкие возможности". - Майки Шульман, руководитель отдела ML, Kensho</p>
</blockquote>
<p>Неструктурированные данные, как следует из названия, не имеют неявной структуры, подобно таблице со строками и столбцами (поэтому их называют табличными или структурированными данными). В отличие от структурированных данных, не существует простого способа хранить содержимое неструктурированных данных в реляционной базе данных. Существуют три основные проблемы, связанные с использованием неструктурированных данных для получения глубоких результатов:</p>
<ul>
<li><strong>Хранение:</strong> Обычные реляционные базы данных хорошо подходят для хранения структурированных данных. Хотя для хранения таких данных можно использовать базы данных NoSQL, обработка таких данных для извлечения нужных представлений, необходимых для работы приложений искусственного интеллекта в масштабе, становится дополнительной накладной задачей.</li>
<li><strong>Представление:</strong> Компьютеры не понимают текст или изображения так, как мы. Они понимают только числа, и нам нужно преобразовать неструктурированные данные в какое-либо полезное числовое представление, обычно векторы или вкрапления.</li>
<li><strong>Запрос:</strong> Вы не можете напрямую запрашивать неструктурированные данные на основе определенных условных операторов, как это делает SQL для структурированных данных. Представьте себе простой пример: вы пытаетесь найти похожие туфли, получив фотографию вашей любимой пары обуви! Вы не можете использовать для поиска необработанные значения пикселей, а также представить структурированные характеристики, такие как форма, размер, стиль, цвет обуви и многое другое. А теперь представьте, что это нужно сделать для миллионов туфель!</li>
</ul>
<p>Поэтому, чтобы компьютеры могли понимать, обрабатывать и представлять неструктурированные данные, мы обычно преобразуем их в плотные векторы, которые часто называют эмбеддингами.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>рисунок 1</span> </span></p>
<p>Существует множество методик, особенно с использованием глубокого обучения, включая конволюционные нейронные сети (CNN) для визуальных данных, таких как изображения, и трансформеры для текстовых данных, которые можно использовать для преобразования таких неструктурированных данных в эмбеддинги. В <a href="https://zilliz.com/">Zilliz</a> есть <a href="https://zilliz.com/learn/embedding-generation">отличная статья, рассказывающая о различных техниках встраивания</a>!</p>
<p>Теперь хранить эти векторы встраивания недостаточно. Необходимо также иметь возможность запрашивать и находить похожие векторы. Почему вы спрашиваете? Большинство реальных приложений используют поиск сходства векторов для решений на основе искусственного интеллекта. Это и визуальный поиск (по изображениям) в Google, и системы рекомендаций в Netflix или Amazon, и текстовые поисковые системы в Google, и мультимодальный поиск, и дедупликация данных, и многое другое!</p>
<p>Хранение, управление и запрос векторов в масштабе - непростая задача. Для этого нужны специализированные инструменты, и векторные базы данных - самый эффективный инструмент для этой работы! В этой статье мы рассмотрим следующие аспекты:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Векторы и поиск векторного сходства</a></li>
<li><a href="#What-is-a-Vector-Database">Что такое векторная база данных?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - самая передовая в мире база данных векторов</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Выполнение визуального поиска изображений с помощью Milvus - пример использования</a></li>
</ul>
<p>Давайте начнем!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Векторы и поиск векторного сходства<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Ранее мы установили необходимость представления неструктурированных данных, таких как изображения и текст, в виде векторов, поскольку компьютеры могут понимать только числа. Обычно мы используем модели искусственного интеллекта, а точнее модели глубокого обучения, для преобразования неструктурированных данных в числовые векторы, которые могут быть считаны машинами. Как правило, эти векторы представляют собой список чисел с плавающей точкой, которые в совокупности отображают основной элемент (изображение, текст и т. д.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Понимание векторов</h3><p>В области обработки естественного языка (NLP) существует множество моделей встраивания слов, таких как <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe и FastText</a>, которые помогают представить слова в виде числовых векторов. С течением времени появились модели <a href="https://arxiv.org/abs/1706.03762">трансформации</a>, такие как <a href="https://jalammar.github.io/illustrated-bert/">BERT</a>, которые можно использовать для изучения контекстных векторов встраивания и лучшего представления целых предложений и абзацев.</p>
<p>Аналогичным образом в области компьютерного зрения существуют такие модели, как <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">конволюционные нейронные сети (CNN)</a>, которые могут помочь в обучении представлений на основе визуальных данных, таких как изображения и видео. С развитием трансформаторов у нас также появились <a href="https://arxiv.org/abs/2010.11929">трансформаторы зрения</a>, которые могут работать лучше, чем обычные CNN.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>рисунок 2</span> </span></p>
<p>Преимущество таких векторов в том, что мы можем использовать их для решения реальных задач, таких как визуальный поиск, где вы обычно загружаете фотографию и получаете результаты поиска, включающие визуально похожие изображения. У Google это очень популярная функция в поисковой системе, как показано на следующем примере.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>рисунок 3</span> </span></p>
<p>Такие приложения работают с векторами данных и поиском векторного сходства. Если рассмотреть две точки в картезианском пространстве координат X-Y. Расстояние между двумя точками может быть вычислено как простое евклидово расстояние, представленное следующим уравнением.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>рисунок 4</span> </span></p>
<p>Если представить, что каждая точка данных - это вектор с D-мерностью, то для определения того, насколько близки друг к другу две точки данных, можно использовать евклидово расстояние или даже другие метрики расстояния, например расстояние Хэмминга или косинусоидальное расстояние. Это поможет составить представление о близости или сходстве, которое можно использовать в качестве количественной метрики для поиска похожих элементов, заданных эталонным элементом, используя их векторы.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Понятие векторного поиска сходства</h3><p>Векторный поиск сходства, часто известный как поиск ближайших соседей (NN), - это процесс вычисления парного сходства (или расстояния) между эталонным элементом (для которого мы хотим найти похожие элементы) и коллекцией существующих элементов (обычно в базе данных) и возвращения лучших "k" ближайших соседей, которые являются лучшими "k" наиболее похожими элементами. Ключевым компонентом для вычисления этого сходства является метрика сходства, которая может представлять собой евклидово расстояние, внутреннее произведение, косинусное расстояние, расстояние Хэмминга и т. д. Чем меньше расстояние, тем более похожи векторы.</p>
<p>Проблема точного поиска ближайших соседей (NN) заключается в масштабируемости. Вам нужно вычислять N расстояний (при условии N существующих элементов) каждый раз, чтобы получить похожие элементы. Это может быть очень медленно, особенно если вы не храните и не индексируете данные где-нибудь (например, в базе данных векторов!). Чтобы ускорить вычисления, мы обычно используем приближенный поиск ближайших соседей, который часто называют ANN-поиском, в результате чего векторы сохраняются в индексе. Индекс помогает хранить эти векторы в интеллектуальном виде, что позволяет быстро находить "приблизительно" похожих соседей для элемента запроса. Типичные методологии индексирования ANN включают:</p>
<ul>
<li><strong>Преобразование векторов:</strong> Включает в себя добавление дополнительных преобразований к векторам, таких как уменьшение размерности (например, PCA \ t-SNE), поворот и т. д.</li>
<li><strong>Кодирование векторов:</strong> Включает применение методов, основанных на структурах данных, таких как локально-чувствительное хеширование (LSH), квантование, деревья и т. д., которые помогают быстрее находить похожие элементы.</li>
<li><strong>Неисчерпывающие методы поиска:</strong> В основном используются для предотвращения исчерпывающего поиска и включают такие методы, как графы окрестностей, инвертированные индексы и т. д.</li>
</ul>
<p>Таким образом, для создания любого приложения для поиска векторного сходства необходима база данных, которая поможет вам эффективно хранить, индексировать и запрашивать (искать) в масштабе. Векторные базы данных!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">Что такое векторная база данных?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Учитывая, что теперь мы понимаем, как векторы могут использоваться для представления неструктурированных данных и как работает векторный поиск, мы можем объединить эти две концепции вместе, чтобы создать векторную базу данных.</p>
<p>Векторные базы данных - это масштабируемые платформы данных для хранения, индексирования и запроса по векторам встраивания, которые генерируются из неструктурированных данных (изображений, текста и т. д.) с помощью моделей глубокого обучения.</p>
<p>Обработка огромного количества векторов для поиска сходства (даже с использованием индексов) может быть очень дорогой. Несмотря на это, лучшие и наиболее продвинутые векторные базы данных должны позволять вам вставлять, индексировать и искать по миллионам или миллиардам целевых векторов, а также задавать алгоритм индексирования и метрику сходства по вашему выбору.</p>
<p>Векторные базы данных в основном должны удовлетворять следующим ключевым требованиям, предъявляемым к надежной системе управления базами данных для использования на предприятии:</p>
<ol>
<li><strong>Масштабируемость:</strong> Векторные базы данных должны быть способны индексировать и выполнять приблизительный поиск ближайших соседей для миллиардов векторов встраивания.</li>
<li><strong>Надежность:</strong> Векторные базы данных должны быть способны справляться с внутренними сбоями без потери данных и с минимальным операционным воздействием, т.е. быть отказоустойчивыми.</li>
<li><strong>Быстродействие:</strong> Для векторных баз данных важны скорость запросов и записи. Для таких платформ, как Snapchat и Instagram, где в секунду могут загружаться сотни или тысячи новых изображений, скорость становится невероятно важным фактором.</li>
</ol>
<p>Векторные базы данных не просто хранят векторы данных. Они также отвечают за использование эффективных структур данных для индексации этих векторов для быстрого поиска и поддержки операций CRUD (создание, чтение, обновление и удаление). Векторные базы данных также должны в идеале поддерживать фильтрацию по атрибутам, то есть фильтрацию на основе полей метаданных, которые обычно являются скалярными полями. Простым примером может быть поиск похожей обуви на основе векторов изображений для определенного бренда. Здесь бренд будет атрибутом, на основе которого будет производиться фильтрация.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>рисунок 5</span> </span></p>
<p>На рисунке выше показано, как в <a href="https://milvus.io/">Milvus</a>, векторной базе данных, о которой мы поговорим в ближайшее время, используется фильтрация по атрибутам. <a href="https://milvus.io/">Milvus</a> вводит понятие битовой маски в механизм фильтрации, чтобы сохранять похожие векторы с битовой маской 1 на основе удовлетворения определенных фильтров атрибутов. Подробнее об этом <a href="https://zilliz.com/learn/attribute-filtering">здесь</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - самая продвинутая в мире база данных векторов<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> - это платформа управления векторными базами данных с открытым исходным кодом, созданная специально для работы с векторными данными огромного объема и оптимизации операций машинного обучения (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>рисунок 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a>- организация, создавшая <a href="https://milvus.io/">Milvus</a>, самую передовую в мире векторную базу данных, для ускорения разработки фабрик данных следующего поколения. В настоящее время Milvus является дипломным проектом <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> и специализируется на управлении массивными неструктурированными массивами данных для хранения и поиска. Эффективность и надежность платформы упрощает процесс развертывания ИИ-моделей и MLOps в масштабе. Milvus находит широкое применение в таких областях, как открытие лекарств, компьютерное зрение, рекомендательные системы, чат-боты и многое другое.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Ключевые особенности Milvus</h3><p>Milvus обладает множеством полезных функций и возможностей, таких как:</p>
<ul>
<li><strong>Высочайшая скорость поиска в триллионе векторных наборов данных:</strong> Средняя задержка векторного поиска и извлечения измеряется в миллисекундах на триллионе векторных наборов данных.</li>
<li><strong>Упрощенное управление неструктурированными данными:</strong> Milvus имеет богатые API, разработанные для рабочих процессов в области науки о данных.</li>
<li><strong>Надежная, всегда включенная векторная база данных:</strong> Встроенные в Milvus функции репликации и отказоустойчивости/возврата обеспечивают постоянную непрерывность данных и приложений.</li>
<li><strong>Высокая масштабируемость и эластичность:</strong> Масштабируемость на уровне компонентов позволяет увеличивать и уменьшать масштаб по требованию.</li>
<li><strong>Гибридный поиск:</strong> Помимо векторов, Milvus поддерживает такие типы данных, как Boolean, String, целые числа, числа с плавающей точкой и другие. Milvus сочетает скалярную фильтрацию с мощным векторным поиском сходства (как показано в примере сходства обуви ранее).</li>
<li><strong>Унифицированная лямбда-структура:</strong> Milvus сочетает потоковую и пакетную обработку для хранения данных, чтобы сбалансировать своевременность и эффективность.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Путешествие во времени</a>:</strong> Milvus поддерживает временную шкалу для всех операций вставки и удаления данных. Это позволяет пользователям указывать временные метки в поиске, чтобы получить представление данных в определенный момент времени.</li>
<li><strong>Поддержка сообщества и признание в отрасли:</strong> Более 1 000 корпоративных пользователей, 10,5 тыс. с лишним звезд на <a href="https://github.com/milvus-io/milvus">GitHub</a> и активное сообщество разработчиков с открытым исходным кодом - вы не одиноки, когда используете Milvus. Будучи проектом для выпускников <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus имеет институциональную поддержку.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Существующие подходы к управлению и поиску векторных данных</h3><p>Обычный способ создания системы ИИ на основе поиска векторного сходства заключается в использовании алгоритмов типа Approximate Nearest Neighbor Search (ANNS) в паре с библиотеками с открытым исходным кодом, такими как:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Этот фреймворк обеспечивает эффективный поиск сходства и кластеризацию плотных векторов. Он содержит алгоритмы поиска в наборах векторов любого размера, вплоть до таких, которые, возможно, не поместятся в оперативной памяти. Поддерживаются такие возможности индексирования, как инвертированный мультииндекс и квантование по произведению</li>
<li><strong><a href="https://github.com/spotify/annoy">Spotify's Annoy (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Этот фреймворк использует <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">случайные проекции</a> и строит дерево, чтобы обеспечить ANNS в масштабе для плотных векторов</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) от Google</a>:</strong> Этот фреймворк выполняет эффективный поиск векторного сходства в масштабе. Состоит из реализаций, включающих обрезку пространства поиска и квантование для поиска по максимальному внутреннему продукту (MIPS).</li>
</ul>
<p>Хотя каждая из этих библиотек по-своему полезна, из-за ряда ограничений эти комбинации алгоритмов и библиотек не являются эквивалентом полноценной системы управления векторными данными, такой как Milvus. Сейчас мы обсудим некоторые из этих ограничений.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Ограничения существующих подходов</h3><p>Существующие подходы, используемые для управления векторными данными, как обсуждалось в предыдущем разделе, имеют следующие ограничения:</p>
<ol>
<li><strong>Гибкость:</strong> Существующие системы обычно хранят все данные в основной памяти, поэтому их нельзя легко запустить в распределенном режиме на нескольких машинах, и они плохо подходят для работы с массивными наборами данных.</li>
<li><strong>Динамическая обработка данных:</strong> Данные часто считаются статичными, когда поступают в существующие системы, что усложняет обработку динамических данных и делает невозможным поиск в режиме, близком к реальному времени.</li>
<li><strong>Расширенная обработка запросов:</strong> Большинство инструментов не поддерживают расширенную обработку запросов (например, фильтрацию атрибутов, гибридный поиск и многовекторные запросы), что очень важно для создания реальных поисковых систем, поддерживающих расширенную фильтрацию.</li>
<li><strong>Оптимизация гетерогенных вычислений:</strong> Немногие платформы предлагают оптимизации для гетерогенных системных архитектур как на CPU, так и на GPU (за исключением FAISS), что приводит к снижению эффективности.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> пытается преодолеть все эти ограничения, и мы подробно обсудим это в следующем разделе.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Преимущество Milvus - понимание Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> пытается преодолеть и успешно решить ограничения существующих систем, построенных на основе неэффективных алгоритмов управления векторными данными и поиска сходства, следующими способами:</p>
<ul>
<li>Повышает гибкость, предлагая поддержку различных интерфейсов приложений (включая SDK на Python, Java, Go, C++ и RESTful API).</li>
<li>Поддерживает несколько типов векторных индексов (например, индексы на основе квантования и индексы на основе графов), а также расширенную обработку запросов.</li>
<li>Milvus обрабатывает динамические векторные данные с помощью лог-структурированного дерева слияния (LSM-дерево), обеспечивая эффективную вставку и удаление данных, а также поиск в режиме реального времени.</li>
<li>Milvus также обеспечивает оптимизацию для гетерогенных вычислительных архитектур на современных CPU и GPU, позволяя разработчикам адаптировать системы к конкретным сценариям, наборам данных и средам приложений.</li>
</ul>
<p>Knowhere, движок векторного исполнения Milvus, представляет собой операционный интерфейс для доступа к сервисам на верхних уровнях системы и библиотекам поиска векторного сходства, таким как Faiss, Hnswlib, Annoy, на нижних уровнях системы. Кроме того, Knowhere отвечает за гетерогенные вычисления. Knowhere контролирует, на каком оборудовании (например, CPU или GPU) выполнять запросы на построение индексов и поиск. Именно так Knowhere получила свое название - знание того, где выполнять операции. В будущих версиях будет поддерживаться больше типов оборудования, включая DPU и TPU.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>рисунок 7</span> </span></p>
<p>Вычисления в Milvus в основном включают векторные и скалярные операции. Knowhere обрабатывает только операции над векторами в Milvus. На рисунке выше показана архитектура Knowhere в Milvus. Самый нижний слой - это системное оборудование. Поверх аппаратного обеспечения располагаются сторонние индексные библиотеки. Затем Knowhere взаимодействует с узлом индекса и узлом запроса на верхнем уровне через CGO. Knowhere не только расширяет функции Faiss, но и оптимизирует производительность, а также имеет ряд преимуществ, включая поддержку BitsetView, поддержку большего количества метрик сходства, поддержку набора инструкций AVX512, автоматический выбор SIMD-инструкций и другие оптимизации производительности. Подробности можно найти <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">здесь</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Архитектура Milvus</h3><p>На следующем рисунке показана общая архитектура платформы Milvus. Milvus отделяет поток данных от потока управления и разделена на четыре уровня, которые являются независимыми с точки зрения масштабируемости и аварийного восстановления.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>рисунок 8</span> </span></p>
<ul>
<li><strong>Уровень доступа:</strong> Уровень доступа состоит из группы нестационарных прокси-серверов и служит в качестве переднего уровня системы и конечной точки для пользователей.</li>
<li><strong>Служба координатора:</strong> Служба координатора отвечает за управление узлами топологии кластера, балансировку нагрузки, генерацию временных меток, объявление данных и управление данными.</li>
<li><strong>Рабочие узлы:</strong> Рабочий узел, или узел исполнения, выполняет инструкции, выданные службой координатора, и команды языка манипулирования данными (DML), инициированные прокси. Рабочий узел в Milvus аналогичен узлу данных в <a href="https://hadoop.apache.org/">Hadoop</a> или региональному серверу в HBase.</li>
<li><strong>Хранение данных:</strong> Это краеугольный камень Milvus, отвечающий за сохранение данных. Слой хранения состоит из <strong>метахранилища</strong>, <strong>брокера журналов</strong> и <strong>хранилища объектов</strong>.</li>
</ul>
<p>Более подробную информацию об архитектуре можно найти <a href="https://milvus.io/docs/v2.0.x/four_layers.md">здесь</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Выполнение визуального поиска изображений с помощью Milvus - пример использования<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Векторные базы данных с открытым исходным кодом, такие как Milvus, позволяют любому предприятию создать свою собственную систему визуального поиска изображений с минимальным количеством шагов. Разработчики могут использовать предварительно обученные модели искусственного интеллекта для преобразования собственных наборов данных изображений в векторы, а затем использовать Milvus для поиска похожих продуктов по изображениям. Давайте рассмотрим следующий пример разработки и создания такой системы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>рисунок 9</span> </span></p>
<p>В этом рабочем процессе мы можем использовать фреймворк с открытым исходным кодом, например <a href="https://github.com/towhee-io/towhee">towhee</a>, для использования предварительно обученной модели ResNet-50 и извлечения векторов из изображений, хранения и индексации этих векторов в Milvus, а также хранения отображения идентификаторов изображений на реальные изображения в базе данных MySQL. Как только данные будут проиндексированы, мы сможем с легкостью загружать любые новые изображения и выполнять поиск изображений в масштабе с помощью Milvus. На следующем рисунке показан пример визуального поиска изображений.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>рисунок 10</span> </span></p>
<p>Ознакомьтесь с подробным <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">руководством</a>, которое было размещено на GitHub благодаря Milvus.</p>
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
    </button></h2><p>В этой статье мы рассмотрели достаточно много вопросов. Мы начали с проблем представления неструктурированных данных, использования векторов и поиска векторного сходства в масштабе с помощью Milvus, векторной базы данных с открытым исходным кодом. Мы подробно рассказали о структуре Milvus и ключевых компонентах, на которых она основана, а также о том, как решить реальную задачу - визуальный поиск изображений с помощью Milvus. Попробуйте и начните решать свои собственные реальные проблемы с помощью <a href="https://milvus.io/">Milvus</a>!</p>
<p>Понравилась статья? <a href="https://www.linkedin.com/in/dipanzan/">Свяжитесь со мной</a>, чтобы обсудить ее подробнее или оставить отзыв!</p>
<h2 id="About-the-author" class="common-anchor-header">Об авторе<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Дипанджан (DJ) Саркар - ведущий специалист по науке о данных, эксперт Google Developer - Machine Learning, автор, консультант и советник по искусственному интеллекту. Связь: http://bit.ly/djs_linkedin</p>
