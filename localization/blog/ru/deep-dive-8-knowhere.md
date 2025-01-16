---
id: deep-dive-8-knowhere.md
title: Что дает поиск сходства в векторной базе данных Milvus?
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: 'И нет, это не Фейсс.'
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>изображение обложки</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/cydrain">Юдоном Цаем</a> и переведена <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>Knowhere, как основной движок векторного исполнения, для Milvus - это как двигатель для спортивного автомобиля. В этой статье мы расскажем о том, что такое Knowhere, чем она отличается от Faiss и как устроен код Knowhere.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Концепция Knowhere</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">Knowhere в архитектуре Milvus</a></li>
<li><a href="#Knowhere-Vs-Faiss">Knowhere и Faiss</a></li>
<li><a href="#Understanding-the-Knowhere-code">Понимание кода Knowhere</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Добавление индексов в Knowhere</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Концепция Knowhere<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Говоря узко, Knowhere - это операционный интерфейс для доступа к сервисам на верхних уровнях системы и библиотекам векторного поиска сходства, таким как <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">Hnswlib</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, на нижних уровнях системы. Кроме того, Knowhere отвечает за гетерогенные вычисления. Точнее, Knowhere контролирует, на каком оборудовании (например, CPU или GPU) выполнять запросы на построение индексов и поиск. Именно так Knowhere и получила свое название - знание того, где выполнять операции. В будущих релизах будут поддерживаться другие типы оборудования, включая DPU и TPU.</p>
<p>В более широком смысле Knowhere также включает в себя другие сторонние библиотеки индексов, такие как Faiss. Таким образом, в целом Knowhere признана основным движком векторных вычислений в векторной базе данных Milvus.</p>
<p>Из концепции Knowhere видно, что она обрабатывает только задачи по вычислению данных, а такие задачи, как шардинг, балансировка нагрузки, аварийное восстановление, выходят за рамки работы Knowhere.</p>
<p>Начиная с версии Milvus 2.0.1, <a href="https://github.com/milvus-io/knowhere">Knowhere</a> (в широком смысле) становится независимой от проекта Milvus.</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">Knowhere в архитектуре Milvus<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>архитектура knowhere</span> </span></p>
<p>Вычисления в Milvus в основном включают в себя векторные и скалярные операции. Knowhere обрабатывает только операции над векторами в Milvus. На рисунке выше показана архитектура Knowhere в Milvus.</p>
<p>Самый нижний слой - это системное оборудование. Поверх аппаратного обеспечения располагаются сторонние индексные библиотеки. Затем Knowhere взаимодействует с узлом индекса и узлом запроса на верхнем уровне через CGO.</p>
<p>В этой статье речь идет о Knowhere в более широком смысле, как отмечено в синей рамке на иллюстрации архитектуры.</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">Knowhere vs Faiss<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere не только расширяет функции Faiss, но и оптимизирует производительность. Более конкретно, Knowhere обладает следующими преимуществами.</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1. Поддержка BitsetView</h3><p>Изначально биты были введены в Milvus для целей &quot;мягкого удаления&quot;. Мягко удаленный вектор все еще существует в базе данных, но не будет вычисляться при поиске или запросе векторного подобия. Каждый бит в наборе битов соответствует индексированному вектору. Если вектор отмечен в битовом наборе как "1", это означает, что данный вектор мягко удален и не будет задействован в векторном поиске.</p>
<p>Параметры bitset добавляются во все открытые API запросов индекса Фейса в Knowhere, включая индексы CPU и GPU.</p>
<p>Узнайте больше о <a href="https://milvus.io/blog/2022-2-14-bitset.md">том, как bitset обеспечивает универсальность векторного поиска</a>.</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2. Поддержка большего количества метрик сходства для индексирования бинарных векторов</h3><p>Помимо <a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">Хэмминга</a>, Knowhere также поддерживает <a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Жаккарда</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Танимото</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Суперструктуру</a>, <a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Субструктуру</a>. Жаккард и Танимото могут использоваться для измерения сходства между двумя наборами образцов, а Superstructure и Substructure - для измерения сходства химических структур.</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3. Поддержка набора инструкций AVX512</h3><p>Сам Faiss поддерживает множество наборов инструкций, включая <a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>, <a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>, <a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX2</a>. Knowhere расширяет поддерживаемые наборы инструкций, добавляя <a href="https://en.wikipedia.org/wiki/AVX-512">AVX512</a>, который может <a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">повысить производительность построения индексов и запросов на 20-30 %</a> по сравнению с AVX2.</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4. Автоматический выбор SIMD-инструкций</h3><p>Knowhere рассчитана на работу с широким спектром процессоров (как локальных, так и облачных платформ) с различными SIMD-инструкциями (например, SIMD SSE, AVX, AVX2 и AVX512). Таким образом, проблема заключается в том, что, имея один бинарный файл (т. е. Milvus), как заставить его автоматически вызывать подходящие SIMD-инструкции на любом процессоре? Faiss не поддерживает автоматический выбор SIMD-инструкций, и пользователям приходится вручную указывать флаг SIMD (например, "-msse4") во время компиляции. Однако Knowhere создается путем рефакторинга кодовой базы Faiss. Общие функции (например, вычисление подобия), которые зависят от ускорения SIMD, вырезаются. Затем для каждой функции реализуются четыре версии (т. е. SSE, AVX, AVX2, AVX512), каждая из которых помещается в отдельный исходный файл. Затем исходные файлы компилируются по отдельности с соответствующим флагом SIMD. Таким образом, во время выполнения Knowhere может автоматически выбирать наиболее подходящие SIMD-инструкции, основываясь на текущих флагах процессора, а затем связывать нужные указатели функций с помощью хуков.</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5. Другие оптимизации производительности</h3><p>Подробнее об оптимизации производительности Knowhere читайте в статье <a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management System</a>.</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Понимание кода Knowhere<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>Как уже говорилось в первом разделе, Knowhere обрабатывает только операции поиска векторов. Поэтому Knowhere обрабатывает только векторное поле сущности (в настоящее время поддерживается только одно векторное поле для сущностей в коллекции). Построение индексов и поиск векторного сходства также нацелены на векторное поле сегмента. Чтобы лучше понять модель данных, читайте блог <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">здесь</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>поля сущностей</span> </span></p>
<h3 id="Index" class="common-anchor-header">Индекс</h3><p>Индекс - это тип независимой структуры данных от исходных векторных данных. Индексирование требует четырех шагов: создание индекса, обучение данных, вставка данных и построение индекса.</p>
<p>Для некоторых приложений искусственного интеллекта обучение набора данных является отдельным процессом от поиска векторов. В таких приложениях данные из наборов сначала обучаются, а затем вставляются в векторную базу данных, например Milvus, для поиска сходства. Открытые наборы данных, такие как sift1M и sift1B, предоставляют данные для обучения и тестирования. Однако в Knowhere данные для обучения и поиска смешиваются. Иными словами, Knowhere обучает все данные в сегменте, а затем вставляет все обученные данные и строит для них индекс.</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Структура кода Knowhere</h3><p>DataObj - базовый класс всех структур данных в Knowhere. <code translate="no">Size()</code> - единственный виртуальный метод в DataObj. Класс Index наследуется от DataObj с полем &quot;size_&quot;. Класс Index также имеет два виртуальных метода - <code translate="no">Serialize()</code> и <code translate="no">Load()</code>. Класс VecIndex, производный от Index, является виртуальным базовым классом для всех векторных индексов. VecIndex предоставляет такие методы, как <code translate="no">Train()</code>, <code translate="no">Query()</code>, <code translate="no">GetStatistics()</code> и <code translate="no">ClearStatistics()</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>базовый класс</span> </span></p>
<p>Другие типы индексов перечислены справа на рисунке выше.</p>
<ul>
<li>Индекс Faiss имеет два подкласса: FaissBaseIndex для всех индексов на векторах с плавающей точкой и FaissBaseBinaryIndex для всех индексов на двоичных векторах.</li>
<li>GPUIndex - базовый класс для всех GPU-индексов Faiss.</li>
<li>OffsetBaseIndex - базовый класс для всех индексов собственной разработки. В индексном файле хранится только идентификатор вектора. В результате размер индексного файла для 128-мерных векторов может быть уменьшен на 2 порядка. При использовании данного типа индекса для поиска векторного сходства рекомендуется учитывать и исходные векторы.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>Технически говоря, <a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAP</a> не является индексом, а скорее используется для поиска методом грубой силы. При вводе векторов в базу данных векторов не требуется обучение данных и создание индекса. Поиск будет осуществляться непосредственно по вставленным векторным данным.</p>
<p>Однако для обеспечения согласованности кода IDMAP также наследует от класса VecIndex со всеми его виртуальными интерфейсами. Использование IDMAP такое же, как и других индексов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>Наиболее часто используются индексы IVF (inverted file). Класс IVF является производным от VecIndex и FaissBaseIndex и далее расширяется до IVFSQ и IVFPQ. GPUIVF является производным от GPUIndex и IVF. Затем GPUIVF расширяется до GPUIVFSQ и GPUIVFPQ.</p>
<p>IVFSQHybrid - это класс для саморазвивающегося гибридного индекса, который выполняется с помощью грубого квантования на GPU. А поиск в ведре выполняется на CPU. Этот тип индекса позволяет уменьшить количество копий памяти между CPU и GPU за счет использования вычислительной мощности GPU. IVFSQHybrid имеет тот же показатель запоминания, что и GPUIVFSQ, но обладает более высокой производительностью.</p>
<p>Структура базового класса для бинарных индексов относительно проще. BinaryIDMAP и BinaryIVF являются производными от FaissBaseBinaryIndex и VecIndex.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>сторонний индекс</span> </span></p>
<p>В настоящее время кроме Faiss поддерживаются только два типа сторонних индексов: древовидный индекс Annoy и графовый индекс HNSW. Эти два распространенных и часто используемых сторонних индекса являются производными от VecIndex.</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Добавление индексов в Knowhere<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы хотите добавить новые индексы в Knowhere, вы можете сначала обратиться к существующим индексам:</p>
<ul>
<li>Чтобы добавить индекс на основе квантования, обратитесь к IVF_FLAT.</li>
<li>Чтобы добавить индекс на основе графов, обратитесь к HNSW.</li>
<li>Чтобы добавить индекс на основе дерева, обратитесь к Annoy.</li>
</ul>
<p>После обращения к существующим индексам вы можете выполнить следующие шаги, чтобы добавить новый индекс в Knowhere.</p>
<ol>
<li>Добавьте имя нового индекса в поле <code translate="no">IndexEnum</code>. Тип данных - строка.</li>
<li>Добавьте проверку достоверности данных для нового индекса в файл <code translate="no">ConfAdapter.cpp</code>. Проверка валидности нужна в основном для проверки параметров подготовки данных и запроса.</li>
<li>Создайте новый файл для нового индекса. Базовый класс нового индекса должен включать <code translate="no">VecIndex</code>, а также необходимый виртуальный интерфейс <code translate="no">VecIndex</code>.</li>
<li>Добавьте логику построения индекса для нового индекса в <code translate="no">VecIndexFactory::CreateVecIndex()</code>.</li>
<li>Добавьте модульный тест в каталог <code translate="no">unittest</code>.</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">О серии "Глубокое погружение<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>После <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">официального объявления об общей доступности</a> Milvus 2.0 мы организовали эту серию блогов Milvus Deep Dive, чтобы предоставить углубленную интерпретацию архитектуры и исходного кода Milvus. В этой серии блогов рассматриваются следующие темы:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Обзор архитектуры Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API и Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Обработка данных</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Управление данными</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Запрос в реальном времени</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Скалярный механизм выполнения</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Система контроля качества</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Векторный механизм выполнения</a></li>
</ul>
