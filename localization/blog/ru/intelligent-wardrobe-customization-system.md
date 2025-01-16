---
id: intelligent-wardrobe-customization-system.md
title: >-
  Создание интеллектуальной системы персонализации гардероба на базе векторной
  базы данных Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Использование технологии поиска по сходству позволяет раскрыть потенциал
  неструктурированных данных, даже таких, как шкафы и их компоненты!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>изображение обложки</span> </span></p>
<p>Если вы ищете шкаф-купе, который идеально впишется в вашу спальню или примерочную, наверняка большинство людей подумают о шкафах, изготовленных по индивидуальному заказу. Однако не все могут позволить себе такой бюджет. Тогда как насчет готовых? Проблема с такими шкафами в том, что они, скорее всего, не оправдают ваших ожиданий, так как не являются достаточно гибкими, чтобы удовлетворить ваши уникальные потребности в хранении. Кроме того, при поиске в Интернете довольно сложно сформулировать ключевые слова для конкретного типа гардероба, который вы ищете. Скорее всего, ключевое слово, которое вы набираете в поисковой строке (например, шкаф с лотком для украшений), может сильно отличаться от того, как оно определяется в поисковой системе (например, шкаф с <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">выдвижным лотком со вставкой</a>).</p>
<p>Но благодаря развивающимся технологиям решение есть! IKEA, мебельный конгломерат, предлагает популярный инструмент для проектирования <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX wardrobe</a>, который позволяет пользователям выбирать из множества готовых шкафов и настраивать их цвет, размер и дизайн интерьера. Нужно ли вам место для вешалок, несколько полок или внутренние ящики - эта интеллектуальная система настройки гардероба всегда сможет удовлетворить ваши потребности.</p>
<p>Чтобы найти или создать свой идеальный шкаф с помощью этой интеллектуальной системы проектирования шкафов, вам необходимо:</p>
<ol>
<li>Указать основные требования - форму (обычная, L-образная или U-образная), длину и глубину шкафа.</li>
<li>Указать потребности в хранении и внутренней организации гардероба (например, необходимо место для вешалок, выдвижная полка для брюк и т.д.).</li>
<li>Добавьте или уберите такие элементы гардероба, как ящики или полки.</li>
</ol>
<p>После этого ваш дизайн будет завершен. Просто и легко!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>система pax</span> </span></p>
<p>Очень важным компонентом, который делает возможной такую систему проектирования гардероба, является <a href="https://zilliz.com/learn/what-is-vector-database">векторная база данных</a>. Поэтому в этой статье мы рассмотрим рабочий процесс и решения по поиску сходства, используемые для создания интеллектуальной системы настройки гардероба на основе векторного поиска сходства.</p>
<p>Перейти к:</p>
<ul>
<li><a href="#System-overview">Обзор системы</a></li>
<li><a href="#Data-flow">Поток данных</a></li>
<li><a href="#System-demo">Демонстрация системы</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">Обзор системы<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы создать такой умный инструмент для настройки гардероба, нам нужно сначала определить бизнес-логику, понять атрибуты предметов и путь пользователя. Шкафы и их компоненты, такие как ящики, лотки, стойки, представляют собой неструктурированные данные. Поэтому на втором этапе необходимо использовать алгоритмы и правила искусственного интеллекта, предварительные знания, описание предметов и многое другое, чтобы преобразовать эти неструктурированные данные в тип данных, который может быть понят компьютером, - векторы!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Обзор инструмента настройки</span> </span></p>
<p>Для обработки сгенерированных векторов нам понадобятся мощные векторные базы данных и поисковые системы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>Архитектура инструмента</span> </span></p>
<p>Инструмент настройки использует некоторые из самых популярных поисковых систем и баз данных: Elasticsearch, <a href="https://milvus.io/">Milvus</a> и PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Почему именно Milvus?</h3><p>Компонент гардероба содержит очень сложную информацию, такую как цвет, форма, внутренняя организация и т. д. Однако традиционного способа хранения данных о гардеробе в реляционной базе данных далеко не достаточно. Популярным способом является использование методов встраивания для преобразования гардеробов в векторы. Поэтому необходимо искать новый тип базы данных, специально предназначенный для хранения векторов и поиска сходств. После изучения нескольких популярных решений за отличную производительность, стабильность, совместимость и простоту использования была выбрана векторная база данных <a href="https://github.com/milvus-io/milvus">Milvus</a>. В таблице ниже представлено сравнение нескольких популярных решений для поиска векторов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>сравнение решений</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Рабочий процесс системы</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Рабочий процесс системы</span> </span></p>
<p>Elasticsearch используется для грубой фильтрации по размеру гардероба, цвету и т. д. Затем отфильтрованные результаты проходят через векторную базу данных Milvus для поиска по сходству, и результаты ранжируются на основе их расстояния/сходства с вектором запроса. Наконец, результаты консолидируются и уточняются на основе бизнес-интуиции.</p>
<h2 id="Data-flow" class="common-anchor-header">Поток данных<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Система настройки гардероба очень похожа на традиционные поисковые системы и системы рекомендаций. Она состоит из трех частей:</p>
<ul>
<li>Оффлайн-подготовка данных, включая определение и генерацию данных.</li>
<li>Онлайн-сервисы, включая поиск и ранжирование.</li>
<li>Постобработка данных на основе бизнес-логики.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Поток данных</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Поток данных в автономном режиме</h3><ol>
<li>Определите данные с помощью бизнес-логики.</li>
<li>Используйте предыдущие знания, чтобы определить, как объединить различные компоненты и сформировать их в гардероб.</li>
<li>Распознайте метки характеристик шкафов и закодируйте их в данные Elasticsearch в файле <code translate="no">.json</code>.</li>
<li>Подготовьте данные для отзыва, закодировав неструктурированные данные в векторы.</li>
<li>Используйте векторную базу данных Milvus для ранжирования отозванных результатов, полученных на предыдущем этапе.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>автономный поток данных</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Онлайн-поток данных</h3><ol>
<li>Получение запросов от пользователей и сбор профилей пользователей.</li>
<li>Понять запрос пользователя, определив его требования к гардеробу.</li>
<li>Грубый поиск с помощью Elasticsearch.</li>
<li>Оценка и ранжирование результатов, полученных в результате грубого поиска, на основе расчета векторного сходства в Milvus.</li>
<li>Постобработка и систематизация результатов на внутренней платформе для получения окончательных результатов.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>поток данных онлайн</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Постобработка данных</h3><p>Бизнес-логика в каждой компании разная. Вы можете добавить последний штрих к результатам, применив бизнес-логику вашей компании.</p>
<h2 id="System-demo" class="common-anchor-header">Демонстрация работы системы<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь давайте посмотрим, как на самом деле работает созданная нами система.</p>
<p>Пользовательский интерфейс (UI) отображает возможность различных комбинаций компонентов гардероба.</p>
<p>Каждый компонент маркируется по его характеристикам (размер, цвет и т. д.) и хранится в Elasticsearch (ES). При хранении меток в ES необходимо заполнить четыре основных поля данных: ID, метки, путь хранения и другие вспомогательные поля. ES и данные с метками используются для гранулярного отзыва и фильтрации по атрибутам.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>Затем различные алгоритмы ИИ используются для кодирования гардероба в набор векторов. Наборы векторов хранятся в Milvus для поиска и ранжирования по сходству. Этот этап позволяет получить более точные и четкие результаты.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus и другие компоненты системы в совокупности образуют платформу для проектирования персонализации. В качестве примера можно привести доменно-специфический язык (DSL) в Elasticsearch и Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>DSL</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Ищете дополнительные ресурсы?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Узнайте, как векторная база данных Milvus может обеспечить работу большего количества приложений искусственного интеллекта:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Как платформа коротких видеороликов Likee удаляет дубликаты видео с помощью Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - детектор фотомошенничества на основе Milvus</a></li>
</ul>
