---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 и 2.2.11: незначительные обновления для повышения стабильности
  системы и улучшения пользовательского опыта
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: представление новых возможностей и улучшений Milvus 2.2.10 и 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Приветствуем вас, поклонники Milvus! Мы рады сообщить, что только что выпустили Milvus 2.2.10 и 2.2.11 - два незначительных обновления, в основном направленных на исправление ошибок и общее улучшение производительности. С этими двумя обновлениями вы можете ожидать более стабильной работы системы и лучшего пользовательского опыта. Давайте вкратце рассмотрим, что нового появилось в этих двух релизах.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.2.10 исправлены периодические сбои системы, ускорена загрузка и индексирование, уменьшено использование памяти в узлах данных и сделано множество других улучшений. Ниже приведены некоторые заметные изменения:</p>
<ul>
<li>Заменена старая программа записи полезной нагрузки CGO на новую, написанную на чистом Go, что позволило сократить использование памяти в узлах данных.</li>
<li>Добавлен <code translate="no">go-api/v2</code> в файл <code translate="no">milvus-proto</code>, чтобы избежать путаницы с различными версиями <code translate="no">milvus-proto</code>.</li>
<li>Обновлен Gin с версии 1.9.0 до 1.9.1, чтобы исправить ошибку в функции <code translate="no">Context.FileAttachment</code>.</li>
<li>Добавлен контроль доступа на основе ролей (RBAC) для API FlushAll и Database.</li>
<li>Исправлено случайное падение, вызванное AWS S3 SDK.</li>
<li>Улучшена скорость загрузки и индексирования.</li>
</ul>
<p>Более подробную информацию можно найти в <a href="https://milvus.io/docs/release_notes.md#2210">информации о выпуске Milvus 2.2.10</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.2.11 были решены различные проблемы для повышения стабильности системы. Также была улучшена производительность в области мониторинга, ведения журналов, ограничения скорости и перехвата кросс-кластерных запросов. Ниже представлены основные моменты этого обновления.</p>
<ul>
<li>Добавлен перехватчик на сервер Milvus GRPC для предотвращения проблем с кросс-кластерной маршрутизацией.</li>
<li>Добавлены коды ошибок в менеджер чанков minio, чтобы облегчить диагностику и исправление ошибок.</li>
<li>Использование синглтонного пула корутинов позволяет избежать лишних корутинов и максимально эффективно использовать ресурсы.</li>
<li>Снижение использования диска для RocksMq до одной десятой от первоначального уровня за счет включения сжатия zstd.</li>
<li>Исправлена случайная паника QueryNode при загрузке.</li>
<li>Устранена проблема с дросселированием запросов на чтение, вызванная тем, что дважды неправильно вычислялась длина очереди.</li>
<li>Исправлены проблемы с GetObject, возвращающим нулевые значения на MacOS.</li>
<li>Исправлен сбой, вызванный неправильным использованием модификатора noexcept.</li>
</ul>
<p>Более подробную информацию можно найти в <a href="https://milvus.io/docs/release_notes.md#2211">информации о выпуске Milvus 2.2.11</a>.</p>
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
