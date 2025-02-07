---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus представила MMap для переосмысленного управления данными и расширения
  возможностей хранения
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  Функция Milvus MMap позволяет пользователям обрабатывать больше данных в
  ограниченном объеме памяти, находя тонкий баланс между производительностью,
  стоимостью и системными ограничениями.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> - самое быстрое решение в области <a href="https://zilliz.com/blog/what-is-a-real-vector-database">векторных баз данных</a> с открытым исходным кодом, предназначенное для пользователей с высокими требованиями к производительности. Однако разнообразие потребностей пользователей отражает разнообразие данных, с которыми они работают. Для некоторых из них приоритетны бюджетные решения и обширные хранилища, а не высокая скорость. Понимая этот спектр требований, Milvus представляет функцию MMap, которая пересматривает способы работы с большими объемами данных и обещает экономическую эффективность без ущерба для функциональности.</p>
<h2 id="What-is-MMap" class="common-anchor-header">Что такое MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, сокращение от memory-mapped files, устраняет разрыв между файлами и памятью в операционных системах. Эта технология позволяет Milvus отображать большие файлы непосредственно в пространство памяти системы, превращая файлы в непрерывные блоки памяти. Такая интеграция устраняет необходимость в явных операциях чтения или записи, кардинально меняя способ управления данными в Milvus. Она обеспечивает беспрепятственный доступ и эффективное хранение больших файлов или ситуаций, когда пользователям требуется произвольный доступ к файлам.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Кому полезно использование MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Векторные базы данных требуют значительного объема памяти из-за требований к хранению векторных данных. С помощью функции MMap обработка большего количества данных в ограниченном объеме памяти становится реальностью. Однако за увеличение возможностей приходится платить производительностью. Система интеллектуально управляет памятью, вытесняя некоторые данные в зависимости от нагрузки и использования. Такое вытеснение позволяет Milvus обрабатывать больше данных при том же объеме памяти.</p>
<p>Во время наших тестов мы заметили, что при достаточном объеме памяти все данные остаются в памяти после периода прогрева, что сохраняет производительность системы. Однако с ростом объема данных производительность постепенно снижается. <strong>Поэтому мы рекомендуем использовать функцию MMap пользователям, менее чувствительным к колебаниям производительности.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Включение MMap в Milvus: простая настройка<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Включить MMap в Milvus очень просто. Все, что вам нужно сделать, это изменить файл <code translate="no">milvus.yaml</code>: добавить элемент <code translate="no">mmapDirPath</code> в конфигурацию <code translate="no">queryNode</code> и установить в качестве его значения действительный путь.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Баланс: производительность, хранение и системные ограничения<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Шаблоны доступа к данным существенно влияют на производительность. Функция MMap в Milvus оптимизирует доступ к данным на основе локальности. MMap позволяет Milvus записывать скалярные данные непосредственно на диск для сегментов данных с последовательным доступом. Данные переменной длины, такие как строки, подвергаются сплющиванию и индексируются с помощью массива смещений в памяти. Такой подход обеспечивает локальность доступа к данным и устраняет накладные расходы на хранение каждой переменной длины отдельно. Оптимизация векторных индексов очень тщательна. MMap выборочно используется для векторных данных, сохраняя списки смежности в памяти, что позволяет сэкономить значительный объем памяти без ущерба для производительности.</p>
<p>Кроме того, MMap максимизирует обработку данных, минимизируя использование памяти. В отличие от предыдущих версий Milvus, где QueryNode копировал целые наборы данных, MMap использует оптимизированный процесс потоковой передачи данных без копирования во время разработки. Эта оптимизация значительно снижает затраты памяти.</p>
<p><strong>Результаты наших внутренних тестов показывают, что Milvus может эффективно обрабатывать вдвое больший объем данных при использовании MMap.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">Дальнейший путь: постоянные инновации и ориентированные на пользователя улучшения<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Пока функция MMap находится на стадии бета-тестирования, команда Milvus стремится к постоянному совершенствованию. В будущих обновлениях будет улучшено использование памяти системы, что позволит Milvus поддерживать еще более обширные объемы данных на одном узле. Пользователи могут ожидать более детального контроля над функцией MMap, что позволит динамически изменять коллекции и использовать расширенные режимы загрузки полей. Эти усовершенствования обеспечивают беспрецедентную гибкость, позволяя пользователям адаптировать свои стратегии обработки данных к конкретным требованиям.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Заключение: новое определение совершенства обработки данных с помощью Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Функция MMap в Milvus 2.3 знаменует собой значительный скачок в технологии обработки данных. Благодаря тонкому балансу между производительностью, стоимостью и системными ограничениями Milvus позволяет пользователям эффективно и экономично обрабатывать огромные объемы данных. Продолжая развиваться, Milvus остается в авангарде инновационных решений, определяя границы достижимого в управлении данными.</p>
<p>Следите за новаторскими разработками, поскольку Milvus продолжает свой путь к непревзойденному совершенству обработки данных.</p>
