---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 'Milvus 2.2.9: Долгожданный релиз с оптимальным пользовательским опытом'
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы рады объявить о выходе Milvus 2.2.9 - долгожданного релиза, который знаменует собой важную веху для команды и сообщества. Этот релиз предлагает множество интересных функций, включая долгожданную поддержку типов данных JSON, динамической схемы и ключей разделов, обеспечивая оптимизированный пользовательский опыт и оптимизированный рабочий процесс разработки. Кроме того, в этот выпуск включены многочисленные улучшения и исправления ошибок. Присоединяйтесь к нам, чтобы изучить Milvus 2.2.9 и узнать, почему этот выпуск так интересен.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Оптимизированный пользовательский опыт с поддержкой JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus появилась долгожданная поддержка типа данных JSON, позволяющая беспрепятственно хранить данные JSON вместе с метаданными векторов в коллекциях пользователей. Благодаря этому усовершенствованию пользователи могут эффективно вставлять данные JSON в массовом порядке и выполнять расширенные запросы и фильтрацию на основе содержимого полей JSON. Кроме того, пользователи могут использовать выражения и выполнять операции, адаптированные к JSON-полям своего набора данных, строить запросы и применять фильтры на основе содержимого и структуры JSON-полей, что позволяет извлекать необходимую информацию и лучше манипулировать данными.</p>
<p>В будущем команда Milvus добавит индексы для полей внутри типа JSON, что еще больше оптимизирует производительность смешанных скалярных и векторных запросов. Так что следите за развитием событий!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Дополнительная гибкость благодаря поддержке динамических схем<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Благодаря поддержке данных JSON, Milvus 2.2.9 теперь предоставляет функциональность динамической схемы через упрощенный набор средств разработки программного обеспечения (SDK).</p>
<p>Начиная с Milvus 2.2.9, SDK Milvus включает высокоуровневый API, который автоматически заполняет динамические поля в скрытом поле JSON коллекции, позволяя пользователям сосредоточиться исключительно на своих рабочих полях.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Улучшенное разделение данных и повышенная эффективность поиска с помощью Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 расширяет возможности разделения данных, представляя функцию Partition Key. Она позволяет использовать пользовательские столбцы в качестве первичных ключей для разделения, устраняя необходимость в дополнительных API, таких как <code translate="no">loadPartition</code> и <code translate="no">releasePartition</code>. Эта новая функция также снимает ограничение на количество разделов, что приводит к более эффективному использованию ресурсов.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Поддержка Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 теперь поддерживает Alibaba Cloud Object Storage Service (OSS). Пользователи Alibaba Cloud могут легко настроить <code translate="no">cloudProvider</code> на Alibaba Cloud и воспользоваться преимуществами бесшовной интеграции для эффективного хранения и извлечения векторных данных в облаке.</p>
<p>В дополнение к ранее упомянутым функциям Milvus 2.2.9 предлагает поддержку баз данных в Role-Based Access Control (RBAC), вводит управление соединениями, а также включает множество улучшений и исправлений ошибок. Более подробную информацию можно найти в разделе <a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 Release Notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Давайте поддерживать связь!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Если у вас есть вопросы или отзывы о Milvus, пожалуйста, не стесняйтесь обращаться к нам через <a href="https://twitter.com/milvusio">Twitter</a> или <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Вы также можете присоединиться к нашему <a href="https://milvus.io/slack/">каналу Slack</a>, чтобы пообщаться с нашими инженерами и сообществом напрямую, или посетить наши <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">офисные часы по вторникам</a>!</p>
