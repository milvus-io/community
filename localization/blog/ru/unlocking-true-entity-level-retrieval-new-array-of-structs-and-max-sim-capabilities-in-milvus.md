---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Разблокирование истинного поиска на уровне сущностей: Новые возможности
  Array-of-Structs и MAX_SIM в Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/Array_of_Structs_new_cover_1_d742c413ab.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Узнайте, как Array of Structs и MAX_SIM в Milvus обеспечивают истинный поиск
  на уровне сущностей в многовекторных данных, устраняя дедупликацию и повышая
  точность поиска.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Если вы создавали приложения для искусственного интеллекта на основе векторных баз данных, то, вероятно, сталкивались с одной и той же проблемой: база данных извлекает вкрапления отдельных фрагментов, а ваше приложение заботится о <strong><em>сущностях</em>.</strong> Это несоответствие усложняет весь рабочий процесс извлечения.</p>
<p>Скорее всего, вы видели, как это происходит снова и снова:</p>
<ul>
<li><p><strong>Базы знаний RAG:</strong> Статьи разбиты на вкрапления абзацев, поэтому поисковая система возвращает разрозненные фрагменты вместо полного документа.</p></li>
<li><p><strong>Рекомендации по электронной коммерции:</strong> Товар имеет несколько вложений изображений, и ваша система возвращает пять ракурсов одного и того же товара, а не пять уникальных продуктов.</p></li>
<li><p><strong>Видеоплатформы:</strong> Видео разбито на вкрапления клипов, но в результатах поиска появляются фрагменты одного и того же видео, а не одна объединенная запись.</p></li>
<li><p><strong>Поиск в стиле ColBERT / ColPali:</strong> Документы разбиваются на сотни вкраплений на уровне токенов или патчей, а результаты поиска выдаются в виде крошечных кусочков, которые все еще требуют объединения.</p></li>
</ul>
<p>Все эти проблемы обусловлены одним и тем <em>же архитектурным недостатком</em>: большинство векторных баз данных рассматривают каждое вкрапление как отдельную строку, в то время как реальные приложения оперируют сущностями более высокого уровня - документами, продуктами, видео, предметами, сценами. В результате инженерные команды вынуждены реконструировать сущности вручную, используя логику дедупликации, группировки, группировки и ранжирования. Это работает, но хрупко, медленно и раздувает слой приложения логикой, которая не должна была там находиться.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> устраняет этот недостаток с помощью новой функции: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Массив структур</strong></a> с метрическим типом <strong>MAX_SIM</strong>. Вместе они позволяют хранить все вкрапления для одной сущности в одной записи и дают возможность Milvus оценивать и возвращать сущность в целостном виде. Больше никаких дублирующихся наборов результатов. Никакой сложной постобработки, такой как повторное ранжирование и объединение.</p>
<p>В этой статье мы расскажем, как работают Array of Structs и MAX_SIM, и продемонстрируем их на двух реальных примерах: Поиск документов в Википедии и поиск документов по изображениям в ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">Что такое массив структур?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>В Milvus поле <strong>Array of Structs</strong> позволяет одной записи содержать <em>упорядоченный список</em> элементов Struct, каждый из которых следует одной и той же предопределенной схеме. Структура может содержать несколько векторов, а также скалярные поля, строки или любые другие поддерживаемые типы. Другими словами, он позволяет объединить все части, принадлежащие одной сущности - вкрапления абзацев, представления изображений, векторы токенов, метаданные - непосредственно в одной строке.</p>
<p>Вот пример сущности из коллекции, содержащей поле Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>В приведенном примере поле <code translate="no">chunks</code> является полем Array of Structs, а каждый элемент Struct содержит свои собственные поля, а именно <code translate="no">text</code>, <code translate="no">text_vector</code> и <code translate="no">chapter</code>.</p>
<p>Этот подход решает давнюю проблему моделирования в векторных базах данных. Традиционно каждое вложение или атрибут должны быть отдельной строкой, что вынуждает разбивать <strong>многовекторные сущности (документы, продукты, видео)</strong> на десятки, сотни или даже тысячи записей. С помощью Array of Structs Milvus позволяет хранить всю многовекторную сущность в одном поле, что делает его естественным для списков абзацев, вкраплений токенов, последовательностей клипов, многоракурсных изображений или любого сценария, в котором один логический элемент состоит из многих векторов.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">Как массив структур работает с MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Поверх этой новой структуры массива структур лежит <strong>MAX_SIM</strong>, новая стратегия оценки, которая делает семантический поиск ориентированным на сущность. Когда поступает запрос, Milvus сравнивает его с <em>каждым</em> вектором внутри каждого массива структур и берет <strong>максимальное сходство</strong> в качестве итоговой оценки сущности. Затем сущность ранжируется и возвращается на основе этой единственной оценки. Это позволяет избежать классической проблемы базы данных векторов, связанной с поиском разрозненных фрагментов, и переложить бремя группировки, дедупирования и повторного ранжирования на прикладной уровень. С MAX_SIM поиск на уровне сущностей становится встроенным, последовательным и эффективным.</p>
<p>Чтобы понять, как MAX_SIM работает на практике, давайте рассмотрим конкретный пример.</p>
<p><strong>Примечание:</strong> все векторы в этом примере сгенерированы одной и той же моделью встраивания, а сходство измеряется косинусным сходством в диапазоне [0,1].</p>
<p>Предположим, пользователь ищет <strong>"курс машинного обучения для начинающих".</strong></p>
<p>Запрос разбивается на три <strong>лексемы</strong>:</p>
<ul>
<li><p><em>Машинное обучение</em></p></li>
<li><p><em>начинающий</em></p></li>
<li><p><em>курс</em></p></li>
</ul>
<p>Каждый из этих лексем затем <strong>преобразуется в вектор встраивания</strong> с помощью той же модели встраивания, которая использовалась для документов.</p>
<p>Теперь представьте, что база векторов содержит два документа:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>An Introduction Guide to Deep Neural Networks with Python</em>.</p></li>
<li><p><strong>doc_2:</strong> <em>Продвинутое руководство по чтению LLM-документов.</em></p></li>
</ul>
<p>Оба документа были вложены в векторы и сохранены в массиве структур.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Шаг 1: Вычислить MAX_SIM для doc_1</strong></h3><p>Для каждого вектора запроса Milvus вычисляет его косинусное сходство с каждым вектором в doc_1:</p>
<table>
<thead>
<tr><th></th><th>Введение</th><th>руководство</th><th>глубокие нейронные сети</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>машинное обучение</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>начинающий</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>курс</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Для каждого вектора запроса MAX_SIM выбирает <strong>наибольшее</strong> сходство из его ряда:</p>
<ul>
<li><p>машинное обучение → глубокие нейронные сети (0,9)</p></li>
<li><p>новичок → введение (0,8)</p></li>
<li><p>курс → руководство (0,7)</p></li>
</ul>
<p>Суммирование лучших совпадений дает doc_1 <strong>оценку MAX_SIM, равную 2,4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Шаг 2: Вычислите MAX_SIM для doc_2</h3><p>Теперь мы повторим процесс для doc_2:</p>
<table>
<thead>
<tr><th></th><th>advanced</th><th>руководство</th><th>LLM</th><th>статья</th><th>чтение</th></tr>
</thead>
<tbody>
<tr><td>машинное обучение</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>новичок</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>курс</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Лучшими совпадениями для doc_2 являются:</p>
<ul>
<li><p>"машинное обучение" → "LLM" (0.9)</p></li>
<li><p>"начинающий" → "руководство" (0,6)</p></li>
<li><p>"курс" → "руководство" (0,8)</p></li>
</ul>
<p>Их суммирование дает документу doc_2 <strong>оценку MAX_SIM, равную 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Шаг 3: Сравните баллы</h3><p>Поскольку <strong>2,4 &gt; 2,3</strong>, <strong>doc_1 занимает более высокое место, чем doc_2</strong>, что имеет интуитивный смысл, поскольку doc_1 ближе к вводному руководству по машинному обучению.</p>
<p>Из этого примера мы можем выделить три основные характеристики MAX_SIM:</p>
<ul>
<li><p><strong>Семантический подход, а не основанный на ключевых словах:</strong> MAX_SIM сравнивает вкрапления, а не текстовые литералы. Несмотря на то, что слова <em>"машинное обучение"</em> и <em>"глубокие нейронные сети"</em> не совпадают друг с другом, их семантическое сходство составляет 0,9. Это делает MAX_SIM устойчивым к синонимам, парафразам, концептуальному дублированию и современным рабочим нагрузкам с большим количеством вкраплений.</p></li>
<li><p><strong>Нечувствительность к длине и порядку:</strong> MAX_SIM не требует, чтобы запрос и документ имели одинаковое количество векторов (например, doc_1 имеет 4 вектора, а doc_2 - 5, и оба работают нормально). Он также игнорирует порядок векторов - "новичок", появившийся раньше в запросе, и "введение", появившееся позже в документе, не влияют на оценку.</p></li>
<li><p><strong>Каждый вектор запроса имеет значение:</strong> MAX_SIM берет лучшее совпадение для каждого вектора запроса и суммирует эти лучшие оценки. Это предотвращает искажение результата за счет несовпадающих векторов и гарантирует, что каждая важная лексема запроса внесет свой вклад в итоговый результат. Например, менее качественное совпадение для слова "beginner" в doc_2 напрямую снижает его общий балл.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Почему MAX_SIM + массив структур имеют значение в векторной базе данных<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> - это высокопроизводительная векторная база данных с открытым исходным кодом, и теперь она полностью поддерживает MAX_SIM вместе с Array of Structs, что позволяет осуществлять многовекторный поиск на уровне сущностей:</p>
<ul>
<li><p><strong>Храните многовекторные сущности в естественном виде:</strong> Array of Structs позволяет хранить группы связанных векторов в одном поле, не разбивая их на отдельные строки или вспомогательные таблицы.</p></li>
<li><p><strong>Эффективное вычисление наилучшего соответствия:</strong> В сочетании с векторными индексами, такими как IVF и HNSW, MAX_SIM может вычислять наилучшие соответствия без сканирования каждого вектора, поддерживая высокую производительность даже при работе с большими документами.</p></li>
<li><p><strong>Предназначен для тяжелых семантических нагрузок:</strong> Этот подход отлично подходит для поиска длинных текстов, многогранного семантического сопоставления, выравнивания документов и резюме, запросов с несколькими ключевыми словами и других сценариев ИИ, требующих гибких и тонких семантических рассуждений.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Когда использовать массив структур<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>Ценность <strong>Array of Structs</strong> становится очевидной, когда вы посмотрите, что она позволяет. По своей сути эта функция обеспечивает три основополагающие возможности:</p>
<ul>
<li><p><strong>Она объединяет разнородные данные - векторы</strong>, скаляры, строки, метаданные - в единый структурированный объект.</p></li>
<li><p><strong>Она приводит хранилище в соответствие с реальными сущностями</strong>, так что каждая строка базы данных четко соответствует реальному объекту, такому как статья, продукт или видео.</p></li>
<li><p><strong>В сочетании с агрегатными функциями, такими как MAX_SIM</strong>, это позволяет осуществлять истинный многовекторный поиск на уровне сущностей непосредственно из базы данных, исключая дедупликацию, группировку или повторное ранжирование на прикладном уровне.</p></li>
</ul>
<p>Благодаря этим свойствам Array of Structs является естественным решением в тех случаях, когда <em>одна логическая сущность представлена несколькими векторами</em>. Обычные примеры - статьи, разбитые на абзацы, документы, разложенные на вкрапления токенов, или продукты, представленные несколькими изображениями. Если результаты поиска страдают от дубликатов, разрозненных фрагментов или одного и того же объекта, появляющегося несколько раз в верхних результатах, Array of Structs решает эти проблемы на уровне хранения и поиска, а не путем внесения исправлений в код приложения "постфактум".</p>
<p>Этот паттерн особенно силен для современных систем искусственного интеллекта, которые полагаются на <strong>многовекторный поиск</strong>. Например:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> представляет один документ в виде 100-500 вкраплений токенов для тонкого семантического сопоставления в таких областях, как юридические тексты и академические исследования.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> преобразует </a>каждую страницу PDF в 256-1024 патча изображения для кросс-модального поиска по финансовым отчетам, контрактам, счетам и другим отсканированным документам.</p></li>
</ul>
<p>Массив структур позволяет Milvus хранить все эти векторы под одной сущностью и эффективно и нативно вычислять суммарное сходство (например, MAX_SIM). Чтобы сделать это более понятным, приведем два конкретных примера.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Пример 1: Поиск товаров в электронной коммерции</h3><p>Раньше товары с несколькими изображениями хранились в плоской схеме - по одному изображению в строке. Для товара с фронтальными, боковыми и угловыми снимками создавалось три ряда. Результаты поиска часто возвращали несколько изображений одного и того же продукта, что требовало ручной дедупликации и повторного ранжирования.</p>
<p>При использовании массива структур каждый продукт становится <strong>одной строкой</strong>. Все вложения изображений и метаданные (угол, is_primary и т. д.) хранятся в поле <code translate="no">images</code> в виде массива структур. Milvus понимает, что они принадлежат одному продукту, и возвращает продукт в целом, а не его отдельные изображения.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Пример 2: База знаний или поиск в Википедии</h3><p>Раньше одна статья Википедии была разбита на <em>N</em> строк абзацев. Результаты поиска возвращали разрозненные абзацы, заставляя систему группировать их и угадывать, к какой статье они относятся.</p>
<p>С массивом структур вся статья становится <strong>одной строкой</strong>. Все абзацы и их вкрапления группируются в поле paragraphs, и база данных возвращает полную статью, а не разрозненные фрагменты.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Практические руководства: Поиск на уровне документов с помощью массива структур<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Поиск документов в Википедии</h3><p>В этом руководстве мы рассмотрим, как использовать <strong>массив структур</strong> для преобразования данных на уровне абзацев в полные записи документов, что позволит Milvus выполнять <strong>поиск на уровне документов</strong>, а не возвращать изолированные фрагменты.</p>
<p>Многие конвейеры баз знаний хранят статьи Википедии в виде фрагментов абзацев. Это хорошо подходит для встраивания и индексирования, но мешает поиску: пользовательский запрос обычно возвращает разрозненные абзацы, заставляя вас вручную группировать и реконструировать статью. С помощью массива структур и MAX_SIM мы можем переделать схему хранения таким образом, что <strong>каждая статья станет одной строкой</strong>, и Milvus сможет ранжировать и возвращать весь документ в естественном виде.</p>
<p>В следующих шагах мы покажем, как:</p>
<ol>
<li><p>Загружать и предварительно обрабатывать данные об абзацах Википедии</p></li>
<li><p>Объединить все абзацы, принадлежащие одной статье, в массив структур</p></li>
<li><p>Вставить эти структурированные документы в Milvus</p></li>
<li><p>Выполнять запросы MAX_SIM для получения полных текстов статей - чисто, без дедупирования или реранжирования.</p></li>
</ol>
<p>К концу этого руководства у вас будет рабочий конвейер, в котором Milvus будет напрямую обрабатывать поиск на уровне сущностей, именно так, как ожидают пользователи.</p>
<p><strong>Модель данных:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 1: группировка и преобразование данных</strong></p>
<p>Для этой демонстрации мы используем набор данных <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 2: Создание коллекции Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 3: Вставка данных и создание индекса</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 4: Поиск документов</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Сравнение результатов: Традиционный поиск и массив структур</strong></p>
<p>Влияние массива структур становится очевидным, когда мы смотрим на то, что на самом деле возвращает база данных:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Размерность</strong></th><th style="text-align:center"><strong>Традиционный подход</strong></th><th style="text-align:center"><strong>Массив структур</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Вывод базы данных</strong></td><td style="text-align:center">Возвращает <strong>100 лучших абзацев</strong> (высокая избыточность)</td><td style="text-align:center">Возвращает <em>10 лучших полных документов</em> - чистых и точных</td></tr>
<tr><td style="text-align:center"><strong>Логика приложения</strong></td><td style="text-align:center">Требуется <strong>группировка, дедупликация и повторное ранжирование</strong> (сложно)</td><td style="text-align:center">Нет необходимости в постобработке - результаты на уровне сущностей поступают непосредственно из Milvus</td></tr>
</tbody>
</table>
<p>В примере с Википедией мы продемонстрировали лишь простейший случай: объединение векторов абзацев в единое представление документа. Но настоящая сила Array of Structs в том, что она универсальна для <strong>любой</strong> многовекторной модели данных - как для классических поисковых конвейеров, так и для современных архитектур ИИ.</p>
<p><strong>Традиционные сценарии многовекторного поиска</strong></p>
<p>Многие хорошо зарекомендовавшие себя поисковые и рекомендательные системы естественным образом оперируют сущностями с несколькими связанными векторами. Массив структур хорошо подходит для этих сценариев использования:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Сценарий</strong></th><th style="text-align:center"><strong>Модель данных</strong></th><th style="text-align:center"><strong>Векторы на сущность</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Продукты электронной коммерции</strong></td><td style="text-align:center">Один товар → несколько изображений</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Поиск видео</strong></td><td style="text-align:center">Одно видео → несколько клипов</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Поиск документов</strong></td><td style="text-align:center">Один документ → несколько разделов</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Рабочие нагрузки в моделях ИИ (ключевые многовекторные сценарии использования)</strong></p>
<p>Массив структур становится еще более важным в современных моделях ИИ, которые намеренно создают большие наборы векторов на сущность для тонких семантических рассуждений.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Модель</strong></th><th style="text-align:center"><strong>Модель данных</strong></th><th style="text-align:center"><strong>Векторы на сущность</strong></th><th style="text-align:center"><strong>Приложение</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Один документ → множество вкраплений токенов</td><td style="text-align:center">100-500</td><td style="text-align:center">Юридические тексты, научные статьи, тонкий поиск документов</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Одна страница PDF → множество вкраплений патчей</td><td style="text-align:center">256-1024</td><td style="text-align:center">Финансовые отчеты, контракты, счета-фактуры, мультимодальный поиск документов</td></tr>
</tbody>
</table>
<p>Эти модели <em>требуют</em> многовекторного шаблона хранения. До появления Array of Structs разработчикам приходилось разбивать векторы на строки и вручную сшивать результаты вместе. С Milvus эти сущности теперь можно хранить и извлекать нативно, а MAX_SIM автоматически обрабатывает скоринг на уровне документов.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. Поиск документов на основе изображений ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> - это мощная модель для кросс-модального поиска PDF-файлов. Вместо того чтобы полагаться на текст, она обрабатывает каждую PDF-страницу как изображение и разбивает ее на 1024 визуальных фрагмента, генерируя по одному вкраплению на каждый фрагмент. При традиционной схеме базы данных это потребовало бы хранения одной страницы в виде сотен или тысяч отдельных строк, что не позволило бы базе данных понять, что эти строки относятся к одной и той же странице. В результате поиск на уровне сущностей становится фрагментарным и непрактичным.</p>
<p>Array of Structs решает эту проблему, храня все вкрапления патчей <em>в одном поле</em>, что позволяет Milvus рассматривать страницу как единую целостную многовекторную сущность.</p>
<p>Традиционный поиск в PDF часто зависит от <strong>OCR</strong>, который преобразует изображения страниц в текст. Это работает для обычного текста, но при этом теряются графики, таблицы, макеты и другие визуальные подсказки. ColPali позволяет избежать этого ограничения, работая непосредственно с изображениями страниц, сохраняя всю визуальную и текстовую информацию. Компромисс заключается в масштабе: каждая страница теперь содержит сотни векторов, что требует базы данных, которая может объединить множество вкраплений в одну сущность - именно то, что обеспечивает Array of Structs + MAX_SIM.</p>
<p>Наиболее распространенным вариантом использования является <strong>Vision RAG</strong>, где каждая страница PDF становится многовекторной сущностью. Типичные сценарии включают:</p>
<ul>
<li><p><strong>Финансовые отчеты:</strong> поиск в тысячах PDF-файлов страниц, содержащих определенные графики или таблицы.</p></li>
<li><p><strong>Контракты:</strong> извлечение положений из отсканированных или сфотографированных юридических документов.</p></li>
<li><p><strong>Счета-фактуры:</strong> поиск счетов-фактур по поставщику, сумме или макету.</p></li>
<li><p><strong>Презентации:</strong> поиск слайдов, содержащих определенный рисунок или диаграмму.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Модель данных:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 1: Подготовка данных</strong>Подробную информацию о том, как ColPali преобразует изображения или текст в многовекторные представления, вы можете найти в документе.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 2: Создание коллекции Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 3: Вставка данных и создание индекса</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Шаг 4: Кросс-модальный поиск: Текстовый запрос → результаты по изображениям</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Образец вывода:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Здесь результаты напрямую возвращают полные страницы PDF. Нам не нужно беспокоиться о встраивании 1024 патчей - Milvus выполняет все операции автоматически.</p>
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
    </button></h2><p>Большинство векторных баз данных хранят каждый фрагмент как отдельную запись, что означает, что приложениям приходится собирать эти фрагменты, когда им нужен полный документ, продукт или страница. Массив структур меняет эту ситуацию. Объединяя скаляры, векторы, текст и другие поля в единый структурированный объект, он позволяет одной строке базы данных представлять одну полную сущность из конца в конец.</p>
<p>Результат прост, но эффективен: работа, которая раньше требовала сложной группировки, дедупирования и ранжирования на уровне приложения, становится встроенной возможностью базы данных. Именно за векторными базами данных будущее - более строгие структуры, более интеллектуальный поиск и более простые конвейеры.</p>
<p>Для получения дополнительной информации о Array of Structs и MAX_SIM ознакомьтесь с документацией ниже:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Milvus Documentation</a></li>
</ul>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции последней версии Milvus? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете записаться на 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы через<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
