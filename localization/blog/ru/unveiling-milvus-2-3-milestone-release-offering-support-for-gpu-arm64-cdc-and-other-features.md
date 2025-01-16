---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Представляем Milvus 2.3: знаковый выпуск, предлагающий поддержку GPU, Arm64,
  CDC и многие другие долгожданные функции
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 - это знаковый релиз с множеством долгожданных функций, включая
  поддержку GPU, Arm64, upsert, захват данных об изменениях, индекс ScaNN и
  поиск по диапазону. В нем также улучшена производительность запросов, более
  надежная балансировка нагрузки и планирование, улучшена наблюдаемость и
  работоспособность.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Захватывающие новости! После восьми месяцев согласованных усилий мы рады объявить о выпуске Milvus 2.3, знаковой версии, в которой появилось множество долгожданных функций, включая поддержку GPU, Arm64, upsert, захват данных об изменениях, индекс ScaNN и технологию MMap. Milvus 2.3 также предлагает улучшенную производительность запросов, более надежную балансировку нагрузки и планирование, а также улучшенную наблюдаемость и работоспособность.</p>
<p>Присоединяйтесь ко мне, чтобы рассмотреть эти новые функции и усовершенствования и узнать, как вы можете воспользоваться преимуществами этого выпуска.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Поддержка GPU-индекса, которая позволяет увеличить QPS в 3-10 раз<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU-индекс - это долгожданная функция в сообществе Milvus. Благодаря отличному сотрудничеству с инженерами Nvidia, Milvus 2.3 поддерживает индексацию на GPU с помощью надежного алгоритма RAFT, добавленного в Knowhere, индексный движок Milvus. Благодаря поддержке GPU Milvus 2.3 работает в три раза быстрее в QPS, чем старые версии, использующие индекс CPU HNSW, и почти в десять раз быстрее для определенных наборов данных, требующих тяжелых вычислений.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Поддержка Arm64 для удовлетворения растущего спроса пользователей<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Процессоры Arm становятся все более популярными среди поставщиков облачных услуг и разработчиков. Чтобы удовлетворить этот растущий спрос, Milvus теперь предоставляет образы Docker для архитектуры ARM64. Благодаря новой поддержке процессоров пользователи MacOS смогут создавать свои приложения с помощью Milvus более легко.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Поддержка Upsert для улучшения пользовательского опыта<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.3 появилось значительное усовершенствование - поддержка операции upsert. Эта новая функциональность позволяет пользователям беспрепятственно обновлять или вставлять данные и выполнять обе операции в одном запросе через интерфейс Upsert. Эта функция упрощает управление данными и повышает эффективность работы.</p>
<p><strong>Примечание</strong>:</p>
<ul>
<li>Функция Upsert не применяется к автоинкрементным идентификаторам.</li>
<li>Функция Upsert реализована в виде комбинации <code translate="no">delete</code> и <code translate="no">insert</code>, что может привести к некоторому снижению производительности. Мы рекомендуем использовать <code translate="no">insert</code>, если вы используете Milvus в сценариях с интенсивной записью.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Поиск по диапазону для получения более точных результатов<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 позволяет пользователям указывать расстояние между входным вектором и векторами, хранящимися в Milvus, во время запроса. После этого Milvus возвращает все совпадающие результаты в заданном диапазоне. Ниже приведен пример указания расстояния поиска с использованием функции поиска по диапазону.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>В этом примере пользователь требует, чтобы Milvus возвращал векторы на расстоянии от 10 до 20 единиц от входного вектора.</p>
<p><strong>Примечание</strong>: Различные метрики расстояний отличаются друг от друга способом вычисления расстояний, что приводит к появлению различных диапазонов значений и стратегий сортировки. Поэтому перед использованием функции поиска по диапазону необходимо разобраться в их особенностях.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Индекс ScaNN для повышения скорости запросов<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 теперь поддерживает индекс ScaNN, индекс <a href="https://zilliz.com/glossary/anns">приближенных ближайших соседей (ANN)</a> с открытым исходным кодом, разработанный Google. Индекс ScaNN продемонстрировал превосходную производительность в различных бенчмарках, превосходя HNSW примерно на 20 % и будучи примерно в семь раз быстрее, чем IVFFlat. Благодаря поддержке индекса ScaNN, Milvus достигает гораздо более высокой скорости выполнения запросов по сравнению со старыми версиями.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Растущий индекс для стабильной и лучшей производительности запросов<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus включает в себя две категории данных: индексированные данные и потоковые данные. Milvus может использовать индексы для быстрого поиска индексированных данных, но может только грубо искать потоковые данные строка за строкой, что может повлиять на производительность. В Milvus 2.3 появился растущий индекс, который автоматически создает индексы в реальном времени для потоковых данных, чтобы повысить производительность запросов.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Итератор для пакетного поиска данных<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus 2.3 компания Pymilvus представила интерфейс итератора, который позволяет пользователям извлекать более 16 384 сущностей в процессе поиска или поиска по диапазону. Эта функция удобна, когда пользователям необходимо экспортировать десятки тысяч или даже больше векторов в пакетном режиме.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Поддержка MMap для увеличения емкости<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap - это системный вызов UNIX, используемый для отображения файлов и других объектов в памяти. Milvus 2.3 поддерживает MMap, который позволяет пользователям загружать данные на локальные диски и отображать их в память, тем самым увеличивая пропускную способность одной машины.</p>
<p>Результаты нашего тестирования показали, что с помощью технологии MMap Milvus может удвоить емкость данных, ограничив при этом падение производительности в пределах 20 %. Такой подход значительно снижает общую стоимость, что делает его особенно выгодным для пользователей с ограниченным бюджетом, не желающих жертвовать производительностью.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Поддержка CDC для повышения доступности системы<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Захват данных об изменениях (CDC) - это широко используемая функция в системах баз данных, которая фиксирует и реплицирует изменения данных в назначенное место. С помощью функции CDC Milvus 2.3 позволяет пользователям синхронизировать данные между центрами обработки данных, создавать резервные копии инкрементных данных и легко переносить данные, повышая доступность системы.</p>
<p>В дополнение к вышеперечисленным функциям в Milvus 2.3 появился интерфейс подсчета для точного подсчета количества строк данных, хранящихся в коллекции в режиме реального времени, поддержка метрики Cosine для измерения векторного расстояния и дополнительные операции с массивами JSON. Дополнительные возможности и подробная информация приведены в <a href="https://milvus.io/docs/release_notes.md">примечаниях к выпуску Milvus 2.3</a>.</p>
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
    </button></h2><p>Помимо новых функций, Milvus 2.3 содержит множество улучшений и исправлений ошибок для старых версий.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Улучшена производительность фильтрации данных</h3><p>Milvus выполняет скалярную фильтрацию перед векторным поиском в гибридных скалярных и векторных запросах данных для достижения более точных результатов. Однако производительность индексирования может снизиться, если пользователь отфильтровал слишком много данных после скалярной фильтрации. В Milvus 2.3 мы оптимизировали стратегию фильтрации HNSW для решения этой проблемы, что привело к повышению производительности запросов.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Увеличение использования многоядерных процессоров</h3><p>Приблизительный поиск ближайших объектов (ANN) - это задача с интенсивными вычислениями, требующая больших ресурсов процессора. В предыдущих версиях Milvus мог использовать только около 70 % доступных ресурсов многоядерного процессора. Однако в последней версии Milvus преодолел это ограничение и может полностью использовать все доступные ресурсы многоядерного процессора, что приводит к повышению производительности запросов и снижению потерь ресурсов.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">Переработанный узел QueryNode</h3><p>QueryNode - важнейший компонент Milvus, отвечающий за векторный поиск. Однако в старых версиях QueryNode имел сложные состояния, дублирующиеся очереди сообщений, неорганизованную структуру кода и неинтуитивные сообщения об ошибках.</p>
<p>В Milvus 2.3 мы модернизировали QueryNode, внедрив структуру кода без состояний и удалив очередь сообщений для удаления данных. Эти обновления привели к уменьшению потерь ресурсов и более быстрому и стабильному поиску векторов.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Усовершенствованные очереди сообщений на основе NATS</h3><p>Мы построили Milvus на основе лог-архитектуры, и в предыдущих версиях использовали Pulsar и Kafka в качестве основных лог-брокеров. Однако эта комбинация столкнулась с тремя ключевыми проблемами:</p>
<ul>
<li>Она была нестабильна в ситуациях с множеством тем.</li>
<li>Она потребляла ресурсы, когда простаивала, и с трудом справлялась с дедупликацией сообщений.</li>
<li>Pulsar и Kafka тесно связаны с экосистемой Java, поэтому их сообщество редко поддерживает и обновляет свои Go SDK.</li>
</ul>
<p>Чтобы решить эти проблемы, мы объединили NATS и Bookeeper в качестве нового лог-брокера для Milvus, который лучше соответствует потребностям пользователей.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Оптимизированный балансировщик нагрузки</h3><p>В Milvus 2.3 был применен более гибкий алгоритм балансировки нагрузки, основанный на реальных нагрузках системы. Этот оптимизированный алгоритм позволяет пользователям быстро обнаруживать сбои узлов и несбалансированную нагрузку и соответствующим образом корректировать расписание. Согласно результатам нашего тестирования, Milvus 2.3 может обнаруживать сбои, несбалансированную нагрузку, аномальное состояние узлов и другие события в течение нескольких секунд и оперативно вносить корректировки.</p>
<p>Более подробную информацию о Milvus 2.3 можно найти в <a href="https://milvus.io/docs/release_notes.md">примечаниях к выпуску Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Обновления инструментов<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Вместе с Milvus 2.3 мы также обновили Birdwatcher и Attu, два ценных инструмента для работы и обслуживания Milvus.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Обновление Birdwatcher</h3><p>Мы обновили <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, отладочный инструмент Milvus, представив множество функций и улучшений, включая:</p>
<ul>
<li>RESTful API для беспрепятственной интеграции с другими диагностическими системами.</li>
<li>Поддержка команды PProf для облегчения интеграции с инструментом Go pprof.</li>
<li>Возможности анализа использования хранилища.</li>
<li>Эффективная функциональность анализа журналов.</li>
<li>Поддержка просмотра и изменения конфигураций в etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Обновление Attu</h3><p>Мы запустили совершенно новый интерфейс для <a href="https://zilliz.com/attu">Attu</a>, универсального инструмента администрирования векторных баз данных. Новый интерфейс имеет более простой дизайн и более понятен.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Более подробную информацию можно найти в <a href="https://milvus.io/docs/release_notes.md">примечаниях к выпуску Milvus 2.3</a>.</p>
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
    </button></h2><p>Если у вас есть вопросы или отзывы о Milvus, пожалуйста, свяжитесь с нами через <a href="https://twitter.com/milvusio">Twitter</a> или <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Вы также можете присоединиться к нашему <a href="https://milvus.io/slack/">каналу Slack</a>, чтобы пообщаться с нашими инженерами и сообществом напрямую, или посетить наши <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">офисные часы по вторникам</a>!</p>
