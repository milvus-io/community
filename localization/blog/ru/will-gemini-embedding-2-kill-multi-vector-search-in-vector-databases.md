---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: Убьет ли Gemini Embedding 2 многовекторный поиск в векторных базах данных?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_1_05194e6859.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings, milvus, vector
  database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Gemini Embedding 2 vs Multi-Vector Search in Milvus
desc: >-
  Gemini Embedding 2 от Google объединяет текст, изображения, видео и аудио в
  один вектор. Сделает ли это многовекторный поиск устаревшим? Мы разберем, в
  чем преимущества каждого подхода.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google выпустила <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a> - первую мультимодальную модель встраивания, которая отображает текст, изображения, видео, аудио и документы в едином векторном пространстве.</p>
<p>Вы вставляете видеоклип, фотографию продукта и абзац текста одним вызовом API, и все они оказываются в одном и том же семантическом пространстве.</p>
<p>До появления подобных моделей у вас не было другого выбора, кроме как прогонять каждую модальность через свою собственную специализированную модель и хранить каждый результат в отдельном векторном столбце. Многовекторные колонки в векторных базах данных, таких как <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a>, были созданы именно для этого мира.</p>
<p>Теперь вопрос в том, насколько сложную задачу может решить Gemini Embedding 2, и где он не справляется? В этом посте мы рассмотрим, как каждый из этих подходов подходит друг другу и как они работают вместе.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Чем отличается Gemini Embedding 2 от CLIP/CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Модели встраивания преобразуют неструктурированные данные в плотные векторы, так что семантически схожие элементы группируются в векторном пространстве. Отличительной особенностью Gemini Embedding 2 является то, что она делает это в естественном режиме для всех модальностей, без отдельных моделей и конвейеров сшивания.</p>
<p>До сих пор для мультимодальных вкраплений требовались модели с двумя кодировщиками, обученные с помощью контрастного обучения: <a href="https://openai.com/index/clip/">CLIP</a> для изображения-текста, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> для аудио-текста, каждая из которых обрабатывала ровно две модальности. Если вам нужны были все три, вы запускали несколько моделей и самостоятельно координировали их пространства встраивания.</p>
<p>Например, индексирование подкаста с обложкой означало запуск CLIP для изображения, CLAP для аудио и текстового кодировщика для транскрипта - три модели, три векторных пространства и пользовательская логика слияния, чтобы сделать их оценки сопоставимыми во время запроса.</p>
<p>В отличие от этого, согласно <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">официальному заявлению Google</a>, Gemini Embedding 2 поддерживает следующие функции:</p>
<ul>
<li><strong>Текст</strong> до 8 192 лексем на запрос</li>
<li><strong>Изображения</strong> до 6 на запрос (PNG, JPEG)</li>
<li><strong>Видео</strong> до 120 секунд (MP4, MOV)</li>
<li><strong>Аудио</strong> до 80 секунд, встраивается нативно без ASR транскрипции</li>
<li><strong>Документы</strong> PDF, до 6 страниц</li>
</ul>
<p><strong>Смешанные входные</strong> изображения + текст в одном вызове встраивания</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 против CLIP/CLAP Одна модель против многих для мультимодального встраивания</h3><table>
<thead>
<tr><th></th><th><strong>Двойной кодировщик (CLIP, CLAP)</strong></th><th><strong>Gemini Embedding 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Модальности на одну модель</strong></td><td>2 (например, изображение + текст)</td><td>5 (текст, изображение, видео, аудио, PDF)</td></tr>
<tr><td><strong>Добавление новой модальности</strong></td><td>Вы приносите другую модель и выравниваете пространства вручную</td><td>Уже включено - один вызов API</td></tr>
<tr><td><strong>Кросс-модальный ввод</strong></td><td>Отдельные кодировщики, отдельные вызовы</td><td>Чередующийся ввод (например, изображение + текст в одном запросе)</td></tr>
<tr><td><strong>Архитектура</strong></td><td>Раздельные кодировщики изображения и текста, выровненные по контрасту</td><td>Единая модель, наследующая мультимодальное понимание от Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Преимущество Gemini Embedding 2: Упрощение конвейера<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Возьмем распространенный сценарий: создание семантической поисковой системы по короткой видеотеке. В каждом ролике есть визуальные кадры, озвученный звук и текст субтитров - все они описывают один и тот же контент.</p>
<p><strong>До Gemini Embedding 2</strong> вам потребовалось бы три отдельные модели встраивания (изображение, аудио, текст), три векторных столбца и конвейер поиска, выполняющий многосторонний отзыв, объединение результатов и дедупликацию. Это множество движущихся частей, которые нужно создавать и поддерживать.</p>
<p><strong>Теперь</strong> вы передаете кадры видео, аудио и субтитры в один вызов API и получаете единый вектор, который отражает полную семантическую картину.</p>
<p>Естественно, возникает соблазн сделать вывод, что многовекторные колонки мертвы. Но такой вывод путает "мультимодальное унифицированное представление" с "многомерным векторным поиском". Они решают разные задачи, и понимание разницы важно для выбора правильного подхода.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Что такое многовекторный поиск в Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>В <a href="http://milvus.io">Milvus</a> многовекторный поиск означает поиск одного и того же объекта сразу по нескольким векторным полям, а затем объединение результатов с помощью ранжирования.</p>
<p>Основная идея: один объект часто несет в себе более одного вида значения. У товара есть название <em>и</em> описание. У сообщения в социальной сети есть подпись <em>и</em> изображение. Каждый угол говорит о чем-то своем, поэтому для каждого из них создается свое векторное поле.</p>
<p>Milvus ищет каждое векторное поле независимо, а затем объединяет наборы кандидатов с помощью реранкера. В API каждый запрос связан с отдельным полем и конфигурацией поиска, а функция hybrid_search() возвращает объединенный результат.</p>
<p>От этого зависят два распространенных паттерна:</p>
<ul>
<li><strong>Разреженный+плотный векторный поиск.</strong> У вас есть каталог товаров, в котором пользователи вводят запросы вроде "красные Nike Air Max размер 10". Плотные векторы улавливают семантическое намерение ("кроссовки, красный, Nike"), но упускают точный размер. Разреженные векторы с помощью <a href="https://milvus.io/docs/full-text-search.md">BM25</a> или моделей типа <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> обеспечивают совпадение ключевых слов. Вам нужно, чтобы обе системы работали параллельно, а затем были переранжированы - потому что ни одна из них не дает хороших результатов при запросах, в которых естественный язык сочетается с конкретными идентификаторами, такими как SKU, имена файлов или коды ошибок.</li>
<li><strong>Мультимодальный векторный поиск.</strong> Пользователь загружает фотографию платья и набирает "что-то подобное, но синее". Вы одновременно ищете визуальное сходство в столбце вложения изображения и в столбце вложения текста на предмет ограничения по цвету. Каждый столбец имеет свой индекс и модель - <a href="https://openai.com/index/clip/">CLIP</a> для изображения, текстовый кодировщик для описания - и результаты объединяются.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> выполняет оба шаблона как параллельный <a href="https://milvus.io/docs/multi-vector-search.md">ANN-поиск</a> с собственным ранжированием с помощью RRFRanker. Определение схемы, настройка мультииндекса, встроенный BM25 - все это в одной системе.</p>
<p>Для наглядности рассмотрим каталог товаров, в котором каждый товар содержит текстовое описание и изображение. Вы можете параллельно выполнять три поиска по этим данным:</p>
<ul>
<li><strong>Семантический поиск по тексту.</strong> Запрос текстового описания с использованием плотных векторов, сгенерированных такими моделями, как <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> или <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> embeddings API.</li>
<li><strong>Полнотекстовый поиск.</strong> Запрос текстового описания с разреженными векторами с помощью <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> или моделей разреженного встраивания, таких как <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> или <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Кросс-модальный поиск по изображениям.</strong> Поиск по изображениям товаров с помощью текстового запроса и плотных векторов с помощью модели типа <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="Now-with-Gemini-Embedding-2-Does-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Теперь, с Gemini Embedding 2, многовекторный поиск все еще имеет значение?<button data-href="#Now-with-Gemini-Embedding-2-Does-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 обрабатывает больше модальностей за один вызов, что значительно упрощает конвейеры. Но унифицированное мультимодальное встраивание - это не то же самое, что многовекторный поиск. Другими словами, многовекторный поиск не станет устаревшим.</p>
<p>Gemini Embedding 2 объединяет текст, изображения, видео, аудио и документы в одно общее векторное пространство. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">позиционирует его</a> для мультимодального семантического поиска, поиска документов и рекомендаций - сценариев, в которых все модальности описывают один и тот же контент, а высокое кросс-модальное перекрытие делает единый вектор жизнеспособным.</p>
<p>Многовекторный поиск<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> решает другую задачу. Это способ поиска одного и того же объекта по <strong>нескольким векторным полям -</strong>например, заголовок плюс описание или текст плюс изображение - и последующего объединения этих сигналов при поиске. Другими словами, речь идет о сохранении и запросе <strong>нескольких семантических представлений</strong> одного и того же объекта, а не просто о сжатии всего в одно представление.</p>
<p>Но реальные данные редко вписываются в единое представление. Биометрические системы, агентурный поиск инструментов и электронная коммерция со смешанными намерениями - все они зависят от векторов, которые живут в совершенно разных семантических пространствах. Именно в таких случаях единое вложение перестает работать.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Почему одного встраивания недостаточно: Многовекторный поиск на практике</h3><p>Gemini Embedding 2 работает в том случае, если все ваши модальности описывают одну и ту же вещь. Многовекторный поиск справляется со всем остальным - а "все остальное" охватывает большинство производственных поисковых систем.</p>
<p><strong>Биометрия.</strong> У одного пользователя есть векторы лица, отпечатка голоса, отпечатка пальца и радужной оболочки глаза. Они описывают совершенно независимые биологические признаки с нулевым семантическим перекрытием. Их нельзя объединить в один вектор - для каждого нужен свой столбец, индекс и метрика сходства.</p>
<p><strong>Агентские инструменты.</strong> Такой помощник по кодированию, как OpenClaw, хранит плотные семантические векторы для истории разговоров ("та проблема с развертыванием на прошлой неделе") наряду с разреженными BM25-векторами для точного соответствия имен файлов, команд CLI и параметров конфигурации. Разные цели поиска, разные типы векторов, независимые пути поиска, а затем повторное ранжирование.</p>
<p><strong>Электронная коммерция со смешанными целями.</strong> Промо-видео и детальные изображения товара хорошо работают в едином вложении Gemini. Но если пользователь хочет найти "платья, похожие на это" <em>и</em> "из той же ткани, размер M", вам понадобится колонка визуального сходства и колонка структурированных атрибутов с отдельными индексами и гибридным поисковым слоем.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Когда использовать Gemini Embedding 2 против многовекторных столбцов<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Сценарий</strong></th><th><strong>Что использовать</strong></th><th><strong>Почему</strong></th></tr>
</thead>
<tbody>
<tr><td>Все модальности описывают один и тот же контент (видеокадры + аудио + субтитры)</td><td>Единый вектор Gemini Embedding 2</td><td>Высокое семантическое перекрытие означает, что один вектор захватывает полную картину - нет необходимости в слиянии</td></tr>
<tr><td>Вам нужна точность ключевых слов и семантический отзыв (BM25 + плотность)</td><td>Многовекторные колонки с помощью hybrid_search()</td><td>Разрозненные и плотные векторы служат разным целям поиска, которые не могут быть объединены в одно вложение</td></tr>
<tr><td>Кросс-модальный поиск является основным сценарием использования (текстовый запрос → результаты по изображениям)</td><td>Gemini Embedding 2 унифицированный вектор</td><td>Единое общее пространство делает кросс-модальное сходство естественным</td></tr>
<tr><td>Векторы живут в принципиально разных семантических пространствах (биометрия, структурированные атрибуты)</td><td>Многовекторные колонки с индексами для каждого поля</td><td>Независимые метрики сходства и типы индексов для каждого поля вектора</td></tr>
<tr><td>Вам нужна простота конвейера <em>и</em> тонкий поиск</td><td>И то, и другое - единый вектор Gemini + дополнительные разреженные или атрибутивные колонки в одной коллекции</td><td>Gemini обрабатывает мультимодальный столбец; Milvus обрабатывает гибридный поисковый слой вокруг него</td></tr>
</tbody>
</table>
<p>Эти два подхода не являются взаимоисключающими. Вы можете использовать Gemini Embedding 2 для унифицированного мультимодального столбца и при этом хранить дополнительные разреженные или специфические для атрибутов векторы в отдельных столбцах в той же коллекции <a href="https://milvus.io/"></a><a href="https://milvus.io/">Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Быстрый старт: Настройка Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Вот рабочая демонстрация. Вам понадобится работающий<a href="https://milvus.io/docs/install-overview.md">экземпляр</a> <a href="https://milvus.io/docs/install-overview.md"></a><a href="https://milvus.io/docs/install-overview.md">Milvus или Zilliz Cloud</a> и ключ GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Настройка</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Полный пример</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Для встраивания изображений и аудио используйте embed_image() и embed_audio() одинаково - векторы попадают в одну коллекцию и одно векторное пространство, что позволяет осуществлять настоящий кросс-модальный поиск.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 скоро будет доступен в Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> обеспечивает глубокую интеграцию с Gemini Embedding 2 с помощью функции <a href="https://milvus.io/docs/embeddings.md">Embedding Function</a>. После запуска этой функции вам не нужно будет вручную вызывать API для встраивания. Milvus будет автоматически вызывать модели (поддерживающие OpenAI, AWS Bedrock, Google Vertex AI и другие) для векторизации сырых данных при вставке и запросов при поиске.</p>
<p>Это означает, что вы получаете унифицированное мультимодальное встраивание от Gemini там, где оно подходит, и полный набор мультивекторных инструментов Milvus - разреженный-плотный гибридный поиск, мультииндексные схемы, реранжирование - там, где вам нужен тонкий контроль.</p>
<p>Хотите попробовать? Начните с <a href="https://milvus.io/docs/quickstart.md">быстрого запуска Milvus</a> и запустите демонстрацию выше, или ознакомьтесь с <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">руководством по гибридному поиску</a> для полной настройки многовекторного поиска в BGE-M3. Приносите свои вопросы в <a href="https://milvus.io/discord">Discord</a> или <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus Office Hours</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Продолжить чтение<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Представляем функцию встраивания: Как Milvus 2.6 оптимизирует векторизацию и семантический поиск - Блог Milvus</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Многовекторный гибридный поиск</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Документация по функции встраивания Milvus</a></li>
</ul>
