---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: Извлечение основных моментов событий с помощью спортивного приложения iYUNDONG
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Создание с Milvus Интеллектуальная система поиска изображений для спорта App
  iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Извлечение основных моментов событий с помощью спортивного приложения iYUNDONG</custom-h1><p>iYUNDONG - это интернет-компания, цель которой - привлечь больше любителей спорта и участников таких мероприятий, как марафонские забеги. Она создает инструменты <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">искусственного интеллекта (ИИ)</a>, которые могут анализировать медиа, снятые во время спортивных событий, и автоматически генерировать основные моменты. Например, загрузив селфи, пользователь спортивного приложения iYUNDONG, участвовавший в спортивном мероприятии, может мгновенно получить свои собственные фотографии или видеоклипы из огромного массива медиаданных об этом событии.</p>
<p>Одна из ключевых функций приложения iYUNDONG называется "Найди меня в движении".  Фотографы обычно делают огромное количество фотографий или видео во время спортивного события, например марафонского забега, и в режиме реального времени загружают фотографии и видео в медиабазу iYUNDONG. Марафонцы, которые хотят увидеть свои самые яркие моменты, могут получить фотографии, включая себя, просто загрузив одно из своих селфи. Это экономит им много времени, поскольку система поиска изображений в приложении iYUNDONG выполняет все действия по сопоставлению изображений. Для работы этой системы iYUNDONG выбрал <a href="https://milvus.io/">Milvus</a>, поскольку Milvus может значительно ускорить процесс поиска и выдать высокоточные результаты.</p>
<p><br/></p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Извлечение основных моментов событий с помощью приложения iYUNDONG Sports App</a><ul>
<li><a href="#difficulties-and-solutions">Трудности и решения</a></li>
<li><a href="#what-is-milvus">Что такое Milvus</a>- <a href="#an-overview-of-milvus"><em>обзор Milvus.</em></a></li>
<li><a href="#why-milvus">Почему Milvus</a></li>
<li><a href="#system-and-workflow">Система и рабочий процесс</a></li>
<li><a href="#iyundong-app-interface">Интерфейс приложения iYUNDONG</a>- <a href="#iyundong-app-interface-1"><em>Интерфейс приложения iYUNDONG.</em></a></li>
<li><a href="#conclusion">Заключение</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Трудности и решения</h3><p>При создании системы поиска изображений iYUNDONG столкнулась со следующими проблемами и успешно нашла соответствующие решения.</p>
<ul>
<li>Фотографии с мероприятий должны быть немедленно доступны для поиска.</li>
</ul>
<p>iYUNDONG разработал функцию InstantUpload, чтобы фотографии с мероприятий были доступны для поиска сразу после их загрузки.</p>
<ul>
<li>Хранение массивных наборов данных</li>
</ul>
<p>Массивные данные, такие как фотографии и видео, загружаются в бэкэнд iYUNDONG каждую миллисекунду. Поэтому iYUNDONG решил перейти на облачные системы хранения данных, включая <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> и <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a>, чтобы безопасно, быстро и надежно обрабатывать гигантские объемы неструктурированных данных.</p>
<ul>
<li>Мгновенное чтение</li>
</ul>
<p>Чтобы добиться мгновенного чтения, iYUNDONG разработал собственное промежуточное ПО для шардинга, которое позволяет легко достичь горизонтальной масштабируемости и снизить воздействие на систему от чтения с диска. Кроме того, <a href="https://redis.io/">Redis</a> используется в качестве кэширующего слоя для обеспечения стабильной производительности в условиях высокого параллелизма.</p>
<ul>
<li>Мгновенное извлечение черт лица</li>
</ul>
<p>Для точного и эффективного извлечения черт лица из загруженных пользователем фотографий iYUNDONG разработал собственный алгоритм преобразования изображений, который конвертирует их в 128-мерные векторы признаков. Другая проблема заключалась в том, что часто многие пользователи и фотографы загружали изображения или видео одновременно. Поэтому при развертывании системы инженерам необходимо было учесть динамическую масштабируемость. В частности, для динамического масштабирования iYUNDONG в полной мере использовала облачный сервис эластичных вычислений (ECS).</p>
<ul>
<li>Быстрый и масштабный векторный поиск</li>
</ul>
<p>Компании iYUNDONG требовалась база данных векторов для хранения большого количества векторов признаков, полученных с помощью моделей искусственного интеллекта. В соответствии со своим уникальным сценарием применения iYUNDONG ожидала, что база данных векторов сможет:</p>
<ol>
<li>Выполнять молниеносный поиск векторов в сверхбольших массивах данных.</li>
<li>Обеспечить массовое хранение данных при меньших затратах.</li>
</ol>
<p>Изначально ежегодно обрабатывалось в среднем 1 миллион изображений, поэтому iYUNDONG хранила все данные для поиска в оперативной памяти. Однако за последние два года бизнес компании бурно развивался и наблюдался экспоненциальный рост неструктурированных данных - в 2019 году количество изображений в базе данных iYUNDONG превысило 60 миллионов, что означало необходимость хранения более 1 миллиарда векторов признаков. Огромный объем данных неизбежно приводил к тому, что система iYUNDONG требовала больших затрат ресурсов. Поэтому ей приходилось постоянно инвестировать в аппаратные средства для обеспечения высокой производительности. В частности, iYUNDONG установила больше поисковых серверов, больше оперативной памяти и более производительный процессор, чтобы добиться большей эффективности и горизонтальной масштабируемости. Однако одним из недостатков этого решения было то, что оно приводило к непомерно высоким эксплуатационным расходам. Поэтому компания iYUNDONG начала искать лучшее решение этой проблемы и задумалась об использовании библиотек векторных индексов, таких как Faiss, чтобы сэкономить расходы и лучше управлять своим бизнесом. В итоге iYUNDONG выбрал векторную базу данных Milvus с открытым исходным кодом.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Что такое Milvus</h3><p>Milvus - это векторная база данных с открытым исходным кодом, простая в использовании, очень гибкая, надежная и молниеносная. В сочетании с различными моделями глубокого обучения, такими как распознавание фотографий и голоса, обработка видео, обработка естественного языка, Milvus может обрабатывать и анализировать неструктурированные данные, которые преобразуются в векторы с помощью различных алгоритмов ИИ. Ниже приведен рабочий процесс обработки Milvus всех неструктурированных данных:</p>
<p>● Неструктурированные данные преобразуются в векторы встраивания с помощью моделей глубокого обучения или других алгоритмов искусственного интеллекта.</p>
<p>Затем векторы встраивания вставляются в Milvus для хранения. Milvus также создает индексы для этих векторов.</p>
<p>● Milvus выполняет поиск по сходству и возвращает точные результаты поиска в соответствии с различными потребностями бизнеса.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>Блог iYUNDONG 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Почему Milvus</h3><p>С конца 2019 года компания iYUNDONG провела серию тестов на использование Milvus в своей системе поиска изображений. Результаты тестирования показали, что Milvus превосходит другие основные векторные базы данных, поскольку поддерживает множество индексов и может эффективно сокращать использование оперативной памяти, значительно сокращая временные рамки поиска векторного сходства.</p>
<p>Кроме того, регулярно выпускаются новые версии Milvus. За время тестирования Milvus пережил множество обновлений, начиная с v0.6.0 и заканчивая v0.10.1.</p>
<p>Кроме того, благодаря активному сообществу разработчиков с открытым исходным кодом и мощным встроенным функциям Milvus позволяет iYUNDONG работать в условиях ограниченного бюджета на разработку.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Система и рабочий процесс</h3><p>Система iYUNDONG извлекает черты лица, обнаруживая их сначала на фотографиях с мероприятий, загруженных фотографами. Затем эти черты лица преобразуются в 128-мерные векторы и сохраняются в библиотеке Milvus. Milvus создает индексы для этих векторов и может мгновенно возвращать высокоточные результаты.</p>
<p>Другая дополнительная информация, такая как идентификаторы фотографий и координаты, указывающие на положение лица на фотографии, хранится в базе данных сторонних разработчиков.</p>
<p>Каждый вектор признаков имеет свой уникальный идентификатор в библиотеке Milvus. iYUNDONG использует <a href="https://github.com/Meituan-Dianping/Leaf">алгоритм Leaf</a>, распределенный сервис генерации идентификаторов, разработанный базовой научно-исследовательской платформой <a href="https://about.meituan.com/en">Meituan</a>, чтобы связать идентификатор вектора в Milvus с соответствующей дополнительной информацией, хранящейся в другой базе данных. Объединяя вектор признаков и дополнительную информацию, система iYUNDONG может возвращать схожие результаты при поиске пользователя.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Интерфейс приложения iYUNDONG</h3><p>На главной странице отображается ряд последних спортивных событий. Нажав на одно из событий, пользователь может увидеть его полную информацию.</p>
<p>Нажав кнопку в верхней части страницы фотогалереи, пользователь может загрузить свою фотографию, чтобы получить изображения своих ярких моментов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interface.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Заключение</h3><p>В этой статье рассказывается о том, как приложение iYUNDONG создает интеллектуальную систему поиска изображений, которая может возвращать точные результаты поиска по загруженным пользователем фотографиям, различающимся по разрешению, размеру, четкости, ракурсу и другим параметрам, усложняющим поиск сходства. С помощью Milvus приложение iYUNDONG App может успешно выполнять запросы миллисекундного уровня по базе данных из 60 с лишним миллионов изображений. А точность поиска фотографий постоянно превышает 92 %. Milvus облегчает iYUNDONG создание мощной системы поиска изображений корпоративного уровня за короткое время при ограниченных ресурсах.</p>
<p>Читайте другие <a href="https://zilliz.com/user-stories">истории пользователей</a>, чтобы узнать больше о создании вещей с помощью Milvus.</p>
