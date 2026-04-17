---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Представляем инструмент Milvus Sizing Tool: Расчет и оптимизация ресурсов
  развертывания Milvus
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Максимально повысьте производительность Milvus с помощью нашего удобного
  инструмента определения размеров! Узнайте, как настроить развертывание для
  оптимального использования ресурсов и экономии средств.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
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
    </button></h2><p>Выбор оптимальной конфигурации для развертывания Milvus очень важен для оптимизации производительности, эффективного использования ресурсов и управления затратами. Независимо от того, создаете ли вы прототип или планируете производственное развертывание, правильный выбор размера экземпляра Milvus может означать разницу между бесперебойно работающей векторной базой данных и той, которая испытывает трудности с производительностью или несет ненужные расходы.</p>
<p>Чтобы упростить этот процесс, мы переработали наш <a href="https://milvus.io/tools/sizing">инструмент Milvus Sizing Tool</a>- удобный калькулятор, который генерирует рекомендуемые оценки ресурсов на основе ваших конкретных требований. В этом руководстве мы расскажем вам о том, как пользоваться этим инструментом, и предоставим более подробную информацию о факторах, влияющих на производительность Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Как использовать инструмент определения размеров Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Пользоваться этим инструментом очень просто. Просто выполните следующие действия.</p>
<ol>
<li><p>Перейдите на страницу<a href="https://milvus.io/tools/sizing/"> Milvus Sizing Tool</a>.</p></li>
<li><p>Введите ключевые параметры:</p>
<ul>
<li><p>Количество векторов и размеры одного вектора</p></li>
<li><p>Тип индекса</p></li>
<li><p>Размер данных скалярного поля</p></li>
<li><p>Размер сегмента</p></li>
<li><p>Предпочтительный режим развертывания</p></li>
</ul></li>
<li><p>Просмотрите сгенерированные рекомендации по ресурсам</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>инструмент определения размеров milvus</span> </span></p>
<p>Давайте рассмотрим, как каждый из этих параметров влияет на развертывание Milvus.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Выбор индекса: Баланс между хранением, стоимостью, точностью и скоростью<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus предлагает различные алгоритмы индексов, включая <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> и другие, каждый из которых имеет свои компромиссы в использовании памяти, требованиях к дисковому пространству, скорости запросов и точности поиска.</p>
<p>Вот что вам нужно знать о наиболее распространенных вариантах:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>индекс</span> </span></p>
<p>HNSW (Hierarchical Navigable Small World)</p>
<ul>
<li><p><strong>Архитектура</strong>: Сочетает списки пропусков с графами Navigable Small Worlds (NSWs) в иерархической структуре.</p></li>
<li><p><strong>Производительность</strong>: Очень быстрые запросы с отличными показателями запоминания</p></li>
<li><p><strong>Использование ресурсов</strong>: Требует больше всего памяти на вектор (самая высокая стоимость)</p></li>
<li><p><strong>Лучше всего подходит для</strong>: Приложения, для которых важны скорость и точность, а ограничение памяти не так важно.</p></li>
<li><p><strong>Техническое примечание</strong>: Поиск начинается с самого верхнего слоя с наименьшим количеством узлов и идет вниз через все более плотные слои.</p></li>
</ul>
<p>ПЛОСКИЙ</p>
<ul>
<li><p><strong>Архитектура</strong>: Простой исчерпывающий поиск без аппроксимации</p></li>
<li><p><strong>Производительность</strong>: 100% отзыв, но очень медленное время выполнения запроса (<code translate="no">O(n)</code> для размера данных <code translate="no">n</code>).</p></li>
<li><p><strong>Использование ресурсов</strong>: Размер индекса равен размеру исходных векторных данных</p></li>
<li><p><strong>Лучше всего подходит для</strong>: Небольшие наборы данных или приложения, требующие идеального отзыва.</p></li>
<li><p><strong>Техническое примечание</strong>: Выполняет полный расчет расстояния между вектором запроса и каждым вектором в базе данных</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Архитектура</strong>: Разделяет пространство векторов на кластеры для более эффективного поиска</p></li>
<li><p><strong>Производительность</strong>: Средне-высокий отзыв при умеренной скорости запроса (медленнее, чем HNSW, но быстрее, чем FLAT)</p></li>
<li><p><strong>Использование ресурсов</strong>: Требует меньше памяти, чем FLAT, но больше, чем HNSW.</p></li>
<li><p><strong>Лучше всего подходит для</strong>: Сбалансированные приложения, в которых некоторое количество отзывов можно обменять на лучшую производительность.</p></li>
<li><p><strong>Техническое примечание</strong>: Во время поиска рассматриваются только кластеры <code translate="no">nlist</code>, что значительно сокращает вычисления.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Архитектура</strong>: Применяет скалярное квантование к IVF_FLAT, сжимая векторные данные.</p></li>
<li><p><strong>Производительность</strong>: Средний отзыв при средне-высокой скорости запроса</p></li>
<li><p><strong>Использование ресурсов</strong>: Сокращение потребления диска, вычислений и памяти на 70-75 % по сравнению с IVF_FLAT.</p></li>
<li><p><strong>Лучше всего подходит для</strong>: Среды с ограниченными ресурсами, где точность может быть немного снижена.</p></li>
<li><p><strong>Техническое примечание</strong>: Сжимает 32-битные значения с плавающей точкой до 8-битных целых значений.</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Дополнительные параметры индекса: ScaNN, DiskANN, CAGRA и др.</h3><p>Для разработчиков со специальными требованиями Milvus также предлагает:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: на 20% быстрее на CPU, чем HNSW, с аналогичными показателями запоминания.</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: гибридный индекс на основе диска и памяти, который идеально подходит для поддержки большого количества векторов с высокой скоростью запоминания и может работать с немного большей задержкой (~100 мс). Он балансирует между использованием памяти и производительностью, сохраняя только часть индекса в памяти, в то время как остальная часть остается на диске.</p></li>
<li><p><strong>Индексы на базе GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: это самый быстрый из GPU-индексов, но для него требуется карта обработки выводов с памятью GDDR, а не с памятью HBM.</p></li>
<li><p>GPU_BRUTE_FORCE: Исчерпывающий поиск, реализованный на GPU</p></li>
<li><p>GPU_IVF_FLAT: Ускоренная на GPU версия IVF_FLAT</p></li>
<li><p>GPU_IVF_PQ: ускоренная на GPU версия IVF с <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">квантованием по продукту</a></p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: Очень высокоскоростной запрос, ограниченные ресурсы памяти; допускает незначительный компромисс в скорости отзыва.</p></li>
<li><p><strong>HNSW_PQ</strong>: среднескоростной запрос; очень ограниченные ресурсы памяти; допускает незначительный компромисс в скорости запоминания.</p></li>
<li><p><strong>HNSW_PRQ</strong>: среднескоростной запрос; очень ограниченные ресурсы памяти; допускает незначительный компромисс в скорости запоминания.</p></li>
<li><p><strong>AUTOINDEX</strong>: По умолчанию HNSW в Milvus с открытым исходным кодом (или использует более производительные собственные индексы в <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, управляемом Milvus).</p></li>
</ul></li>
<li><p><strong>Двоичные, разреженные и другие специализированные индексы</strong>: Для конкретных типов данных и случаев использования. Дополнительные сведения см. на <a href="https://milvus.io/docs/index.md">этой странице документации по индексам</a>.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Размер сегмента и конфигурация развертывания<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Сегменты - это фундаментальные строительные блоки внутренней организации данных Milvus. Они функционируют как фрагменты данных, которые обеспечивают распределенный поиск и балансировку нагрузки в вашем развертывании. Инструмент определения размера сегментов Milvus предлагает три варианта размера сегментов (512 МБ, 1024 МБ, 2048 МБ), при этом по умолчанию используется 1024 МБ.</p>
<p>Понимание сегментов очень важно для оптимизации производительности. В качестве общего руководства:</p>
<ul>
<li><p>512 МБ сегментов: лучше всего подходят для узлов запросов с 4-8 ГБ памяти.</p></li>
<li><p>Сегменты по 1 ГБ: Оптимально для узлов запросов с 8-16 ГБ памяти</p></li>
<li><p>Сегменты по 2 ГБ: Рекомендуется для узлов запросов с памятью &gt;16 ГБ.</p></li>
</ul>
<p>Обзор для разработчиков: Меньшее количество сегментов большого размера обычно обеспечивает более высокую производительность поиска. Для крупномасштабных развертываний сегменты по 2 ГБ часто обеспечивают оптимальный баланс между эффективностью использования памяти и скоростью выполнения запросов.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Выбор системы очереди сообщений<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>Выбор между Pulsar и Kafka в качестве системы обмена сообщениями:</p>
<ul>
<li><p><strong>Pulsar</strong>: Рекомендуется для новых проектов из-за меньших накладных расходов на тему и лучшей масштабируемости.</p></li>
<li><p><strong>Kafka</strong>: Может быть предпочтительнее, если у вас уже есть опыт работы с Kafka или инфраструктура в вашей организации.</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Оптимизации для предприятий в Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Для производственных развертываний с жесткими требованиями к производительности Zilliz Cloud (полностью управляемая и корпоративная версия Milvus в облаке) предлагает дополнительные оптимизации в индексировании и квантовании:</p>
<ul>
<li><p><strong>Предотвращение выхода из памяти (OOM):</strong> Продуманное управление памятью для предотвращения аварийных ситуаций, связанных с выходом за пределы памяти.</p></li>
<li><p><strong>Оптимизация уплотнения</strong>: Повышает производительность поиска и эффективность использования ресурсов</p></li>
<li><p><strong>Многоуровневое хранение</strong>: Эффективное управление "горячими" и "холодными" данными с помощью соответствующих вычислительных блоков</p>
<ul>
<li><p>Стандартные вычислительные блоки (CU) для часто используемых данных</p></li>
<li><p>Многоуровневые модули хранения данных для экономичного хранения редко используемых данных.</p></li>
</ul></li>
</ul>
<p>Для получения подробной информации о размерах корпоративных систем ознакомьтесь с<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> документацией по планам обслуживания Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Советы по расширенной конфигурации для разработчиков<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>Несколько типов индексов</strong>: Инструмент определения размера ориентирован на один индекс. Для сложных приложений, требующих различных алгоритмов индексации для разных коллекций, создайте отдельные коллекции с пользовательскими конфигурациями.</p></li>
<li><p><strong>Распределение памяти</strong>: При планировании развертывания учитывайте требования к памяти как векторных данных, так и индексов. HNSW обычно требует в 2-3 раза больше памяти, чем необработанные векторные данные.</p></li>
<li><p><strong>Тестирование производительности</strong>: Перед окончательной настройкой конфигурации проведите сравнительный анализ конкретных шаблонов запросов на репрезентативном наборе данных.</p></li>
<li><p><strong>Учет масштаба</strong>: Учитывайте будущий рост. Проще начать с чуть больших ресурсов, чем потом перестраивать конфигурацию.</p></li>
</ol>
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Инструмент Milvus Sizing Tool</a> является отличной отправной точкой для планирования ресурсов, но помните, что каждое приложение имеет уникальные требования. Для достижения оптимальной производительности вам потребуется точная настройка конфигурации с учетом особенностей рабочей нагрузки, шаблонов запросов и потребностей в масштабировании.</p>
<p>Мы постоянно совершенствуем наши инструменты и документацию на основе отзывов пользователей. Если у вас есть вопросы или вам нужна дополнительная помощь в определении размера развертывания Milvus, обращайтесь к нашему сообществу на<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> или<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
<h2 id="References" class="common-anchor-header">Ссылки<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Выбор правильного векторного индекса для вашего проекта</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Индекс в памяти | Документация Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Unveil Milvus CAGRA: повышение эффективности векторного поиска с помощью индексирования на GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Калькулятор цен на облачные вычисления Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Как начать работу с Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud Resource Planning | Cloud | Zilliz Cloud Developer Hub</a></p></li>
</ul>
