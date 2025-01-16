---
id: select-index-parameters-ivf-index.md
title: 1. index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: Лучшие практики для индекса ЭКО
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>Как выбрать параметры индекса для индекса ЭКО</custom-h1><p>В статье <a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Best Practices for Milvus Configuration</a> были представлены некоторые лучшие практики для конфигурации Milvus 0.6.0. В этой статье мы также расскажем о некоторых лучших практиках настройки ключевых параметров в клиентах Milvus для таких операций, как создание таблицы, создание индексов и поиск. Эти параметры могут влиять на производительность поиска.</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1. <code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>При создании таблицы параметр index_file_size используется для указания размера (в МБ) отдельного файла для хранения данных. По умолчанию используется значение 1024. При импорте векторных данных Milvus инкрементально объединяет данные в файлы. Когда размер файла достигает размера index_file_size, этот файл не принимает новые данные, и Milvus сохраняет новые данные в другой файл. Это все файлы необработанных данных. Когда создается индекс, Milvus генерирует индексный файл для каждого файла необработанных данных. Для индекса типа IVFLAT размер индексного файла приблизительно равен размеру соответствующего файла необработанных данных. Для индекса SQ8 размер индексного файла составляет примерно 30 процентов от размера соответствующего файла исходных данных.</p>
<p>Во время поиска Milvus просматривает каждый индексный файл по очереди. По нашему опыту, при изменении размера index_file_size с 1024 на 2048 производительность поиска повышается на 30-50 %. Однако если значение слишком велико, большие файлы могут не загружаться в память GPU (или даже в память CPU). Например, если память GPU составляет 2 ГБ, а index_file_size - 3 ГБ, индексный файл не сможет быть загружен в память GPU. Обычно мы устанавливаем размер index_file_size равным 1024 МБ или 2048 МБ.</p>
<p>В следующей таблице показан тест с использованием sift50m для index_file_size. Тип индекса - SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-test-results-milvus.png</span> </span></p>
<p>Видно, что в режиме CPU и GPU, когда index_file_size равен 2048 МБ, а не 1024 МБ, производительность поиска значительно улучшается.</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2. <code translate="no">nlist</code> <strong>и</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p>Параметр <code translate="no">nlist</code> используется для создания индекса, а параметр <code translate="no">nprobe</code> - для поиска. IVFLAT и SQ8 используют алгоритмы кластеризации для разделения большого количества векторов на кластеры, или ведра. <code translate="no">nlist</code> - это количество ведер при кластеризации.</p>
<p>При поиске с использованием индексов первым шагом является нахождение определенного количества бакетов, ближайших к целевому вектору, а вторым шагом - нахождение наиболее похожих k векторов из бакетов по векторному расстоянию. <code translate="no">nprobe</code> - количество бакетов на первом шаге.</p>
<p>Как правило, увеличение <code translate="no">nlist</code> приводит к увеличению количества ведер и уменьшению количества векторов в одном ведре в процессе кластеризации. В результате снижается вычислительная нагрузка и повышается производительность поиска. Однако при меньшем количестве векторов для сравнения сходства правильный результат может быть пропущен.</p>
<p>Увеличение <code translate="no">nprobe</code> приводит к увеличению количества ведер для поиска. В результате увеличивается вычислительная нагрузка и ухудшается производительность поиска, но точность поиска повышается. Ситуация может отличаться для наборов данных с различным распределением. При установке значений <code translate="no">nlist</code> и <code translate="no">nprobe</code> следует также учитывать размер набора данных. Как правило, рекомендуется, чтобы <code translate="no">nlist</code> был равен <code translate="no">4 * sqrt(n)</code>, где n - общее количество векторов. Что касается <code translate="no">nprobe</code>, то необходимо найти компромисс между точностью и эффективностью, и лучше всего определить это значение методом проб и ошибок.</p>
<p>В следующей таблице показан тест с использованием sift50m для <code translate="no">nlist</code> и <code translate="no">nprobe</code>. Тип индекса - SQ8.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>В таблице сравнивается производительность и точность поиска при использовании различных значений <code translate="no">nlist</code>/<code translate="no">nprobe</code>. Отображаются только результаты GPU, поскольку тесты CPU и GPU дают схожие результаты. В этом тесте при увеличении значений <code translate="no">nlist</code>/<code translate="no">nprobe</code> на один и тот же процент точность поиска также увеличивается. Когда <code translate="no">nlist</code> = 4096 и <code translate="no">nprobe</code> = 128, Milvus имеет наилучшую производительность поиска. В заключение следует отметить, что при определении значений <code translate="no">nlist</code> и <code translate="no">nprobe</code> необходимо находить компромисс между производительностью и точностью с учетом различных наборов данных и требований.</p>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>: Если размер данных больше, чем <code translate="no">index_file_size</code>, то чем больше значение <code translate="no">index_file_size</code>, тем выше производительность поиска.<code translate="no">nlist</code> и <code translate="no">nprobe</code>：Вы должны найти компромисс между производительностью и точностью.</p>
