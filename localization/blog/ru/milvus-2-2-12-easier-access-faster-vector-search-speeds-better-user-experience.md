---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: более легкий доступ, более высокая скорость поиска векторов и
  лучший пользовательский опыт
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы рады сообщить о выходе новой версии Milvus 2.2.12. Это обновление включает в себя множество новых функций, таких как поддержка RESTful API, функция <code translate="no">json_contains</code> и поиск векторов во время ANN-поиска в ответ на отзывы пользователей. Мы также оптимизировали работу пользователей, увеличили скорость поиска векторов и устранили множество проблем. Давайте узнаем, чего можно ожидать от Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Поддержка RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 теперь поддерживает RESTful API, что позволяет пользователям получать доступ к Milvus без установки клиента, делая клиент-серверные операции простыми. Кроме того, развертывание Milvus стало более удобным, поскольку Milvus SDK и RESTful API имеют один и тот же номер порта.</p>
<p><strong>Примечание</strong>: Мы по-прежнему рекомендуем использовать SDK для развертывания Milvus для продвинутых операций или если ваш бизнес чувствителен к задержкам.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Получение векторов при поиске по ANN<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>В ранних версиях Milvus не разрешал получать векторы во время поиска по методу приближенных соседей (ANN), чтобы повысить производительность и уменьшить расход памяти. В результате поиск необработанных векторов приходилось разделять на два этапа: выполнение поиска ANN и последующий запрос необработанных векторов на основе их идентификаторов. Такой подход увеличивал стоимость разработки и затруднял развертывание и внедрение Milvus пользователями.</p>
<p>В Milvus 2.2.12 пользователи могут получать необработанные векторы во время ANN-поиска, задавая поле вектора в качестве выходного поля и запрашивая коллекции, проиндексированные HNSW, DiskANN или IVF-FLAT. Кроме того, пользователи могут рассчитывать на гораздо более высокую скорость поиска векторов.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Поддержка операций над массивами JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Недавно мы добавили поддержку JSON в Milvus 2.2.8. С тех пор пользователи присылали многочисленные запросы на поддержку дополнительных операций с массивами JSON, таких как включение, исключение, пересечение, объединение, разность и другие. В Milvus 2.2.12 мы отдали приоритет поддержке функции <code translate="no">json_contains</code> для включения операции включения. Мы продолжим добавлять поддержку других операторов в будущих версиях.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Улучшения и исправления ошибок<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Помимо новых функций, в Milvus 2.2.12 улучшена производительность векторного поиска, снижены накладные расходы, что облегчает работу с обширным topk-поиском. Кроме того, повышена производительность записи в ситуациях с ключом раздела и несколькими разделами и оптимизировано использование процессора на больших машинах. Это обновление решает различные проблемы: чрезмерное использование диска, застревание компакта, нечастое удаление данных и сбои при массовой вставке. Более подробную информацию вы можете найти в <a href="https://milvus.io/docs/release_notes.md#2212">информации о выпуске Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Давайте поддерживать связь!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Если у вас есть вопросы или отзывы о Milvus, пожалуйста, свяжитесь с нами через <a href="https://twitter.com/milvusio">Twitter</a> или <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Вы также можете присоединиться к нашему <a href="https://milvus.io/slack/">каналу Slack</a>, чтобы пообщаться с нашими инженерами и сообществом напрямую, или посетить наши <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">офисные часы по вторникам</a>!</p>
