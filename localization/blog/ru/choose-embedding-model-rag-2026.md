---
id: choose-embedding-model-rag-2026.md
title: >-
  Как выбрать лучшую модель встраивания для RAG в 2026 году: 10 моделей в
  сравнении
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Мы провели сравнительный анализ 10 моделей встраивания в задачах
  кросс-модального, кросс-языкового, длиннодокументного и размерного сжатия.
  Посмотрите, какая из них подходит для вашего конвейера RAG.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> Мы протестировали 10 <a href="https://zilliz.com/ai-models">моделей встраивания</a> в четырех производственных сценариях, которые не учитываются в публичных бенчмарках: кросс-модальный поиск, кросс-языковой поиск, поиск ключевой информации и сжатие размеров. Ни одна модель не победила во всех случаях. Gemini Embedding 2 - лучший универсал. Qwen3-VL-2B с открытым исходным кодом выигрывает у закрытых API в кросс-модальных задачах. Если вам нужно сжать размеры для экономии места, выбирайте Voyage Multimodal 3.5 или Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Почему MTEB недостаточно для выбора модели встраивания<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Большинство прототипов <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> начинают с модели OpenAI text-embedding-3-small. Она дешевая, ее легко интегрировать, и для поиска английского текста она работает достаточно хорошо. Но производственный RAG быстро перерастает его. В ваш конвейер попадают изображения, PDF-файлы, многоязычные документы - и <a href="https://zilliz.com/ai-models">модели встраивания</a> только текста перестает быть достаточно.</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">Таблица лидеров MTEB</a> подсказывает вам, что есть варианты получше. Проблема? MTEB тестирует только одноязычный поиск текста. Он не охватывает кросс-модальный поиск (текстовые запросы к коллекциям изображений), кросс-языковой поиск (китайский запрос находит английский документ), точность длинных документов или то, насколько теряется качество при усечении <a href="https://zilliz.com/glossary/dimension">размеров встраивания</a> для экономии места в <a href="https://zilliz.com/learn/what-is-a-vector-database">векторной базе данных</a>.</p>
<p>Так какую же модель встраивания следует использовать? Это зависит от типов данных, языков, длины документов и того, нужно ли вам сжатие размеров. Мы создали эталон под названием <strong>CCKM</strong> и протестировали 10 моделей, выпущенных в период с 2025 по 2026 год, именно по этим параметрам.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">Что такое эталон CCKM?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) тестирует четыре возможности, которых не хватает стандартным эталонам:</p>
<table>
<thead>
<tr><th>Измерение</th><th>Что проверяет</th><th>Почему это важно</th></tr>
</thead>
<tbody>
<tr><td><strong>Кросс-модальный поиск</strong></td><td>Сопоставление текстовых описаний с правильным изображением при наличии почти идентичных отвлекающих элементов</td><td><a href="https://zilliz.com/learn/multimodal-rag">Мультимодальные</a> конвейеры<a href="https://zilliz.com/learn/multimodal-rag">RAG</a> нуждаются во вкраплениях текста и изображений в одном и том же векторном пространстве</td></tr>
<tr><td><strong>Межъязыковой поиск</strong></td><td>Поиск правильного английского документа по китайскому запросу и наоборот</td><td>Производственные базы знаний часто бывают многоязычными</td></tr>
<tr><td><strong>Поиск ключевой информации</strong></td><td>Поиск конкретного факта в документе объемом 4K-32K символов (иголка в стоге сена).</td><td>Системы RAG часто обрабатывают длинные документы, такие как контракты и исследовательские работы</td></tr>
<tr><td><strong>Сжатие размеров MRL</strong></td><td>Измерьте, насколько теряет качество модель при сокращении вкраплений до 256 измерений.</td><td>Меньшее количество измерений = меньшая стоимость хранения в вашей векторной базе данных, но какой ценой достигается качество?</td></tr>
</tbody>
</table>
<p>MTEB не покрывает ни одну из этих задач. MMEB добавляет мультимодальность, но пропускает жесткие отрицания, поэтому модели получают высокие баллы, не доказав, что они справляются с тонкими различиями. CCKM призвана покрыть то, что они упускают.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Какие модели встраивания мы тестировали? Gemini Embedding 2, Jina Embeddings v4 и другие.<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы протестировали 10 моделей, охватывающих как API-сервисы, так и варианты с открытым исходным кодом, а также CLIP ViT-L-14 в качестве базового уровня 2021 года.</p>
<table>
<thead>
<tr><th>Модель</th><th>Источник</th><th>Параметры</th><th>Размеры</th><th>Модальность</th><th>Ключевой признак</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Google</td><td>Нераскрытый</td><td>3072</td><td>Текст / изображение / видео / аудио / PDF</td><td>Всемодальность, широчайший охват</td></tr>
<tr><td>Jina Embeddings v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Текст / изображение / PDF</td><td>Адаптеры MRL + LoRA</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Нераскрытый</td><td>1024</td><td>Текст / изображение / видео</td><td>Сбалансированность задач</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Текст / изображение / видео</td><td>Открытый исходный код, легкий мультимодальный</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Текст / изображение</td><td>Модернизированная архитектура CLIP</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Нераскрытый</td><td>Исправлено</td><td>Текст</td><td>Корпоративный поиск</td></tr>
<tr><td>OpenAI text-embedding-3-large</td><td>OpenAI</td><td>Нераскрытый</td><td>3072</td><td>Текст</td><td>Наиболее широко используемый</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>БААИ</td><td>568M</td><td>1024</td><td>Текст</td><td>Открытый исходный код, 100+ языков</td></tr>
<tr><td>mxbai-embed-large</td><td>Смешанный хлебный искусственный интеллект</td><td>335M</td><td>1024</td><td>Текст</td><td>Легкий, ориентированный на английский язык</td></tr>
<tr><td>nomic-embed-text</td><td>Номический ИИ</td><td>137M</td><td>768</td><td>Текст</td><td>Сверхлегкий</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Текст / изображение</td><td>Базовый</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Кросс-модальный поиск: Какие модели справляются с поиском от текста к изображению?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Если ваш конвейер RAG работает с изображениями наряду с текстом, модель встраивания должна поместить оба вида модальности в одно <a href="https://zilliz.com/glossary/vector-embeddings">векторное пространство</a>. Подумайте о поиске изображений в электронной коммерции, смешанных базах знаний с изображениями и текстом или о любой другой системе, где текстовый запрос должен найти нужное изображение.</p>
<h3 id="Method" class="common-anchor-header">Метод</h3><p>Мы взяли 200 пар "изображение-текст" из COCO val2017. Для каждого изображения GPT-4o-mini сгенерировал подробное описание. Затем мы написали 3 жестких негатива для каждого изображения - описания, которые отличаются от правильного всего одной или двумя деталями. Модель должна найти правильное соответствие в пуле из 200 изображений и 600 дистракторов.</p>
<p>Пример из набора данных:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Старинные коричневые кожаные чемоданы с наклейками о путешествиях, включая Калифорнию и Кубу, размещенные на металлической багажной полке на фоне голубого неба - используется в качестве тестового изображения в бенчмарке кросс-модального поиска</span> </span>.</p>
<blockquote>
<p><strong>Правильное описание:</strong> "На изображении представлены винтажные коричневые кожаные чемоданы с различными наклейками о путешествиях, включая "Калифорнию", "Кубу" и "Нью-Йорк", размещенные на металлической багажной полке на фоне ясного голубого неба."</p>
<p><strong>Жесткий негатив:</strong> То же предложение, но "Калифорния" превращается в "Флориду", а "голубое небо" - в "пасмурное небо". Модель должна понять детали изображения, чтобы отличить их друг от друга.</p>
</blockquote>
<p><strong>Оценка:</strong></p>
<ul>
<li>Сгенерируйте <a href="https://zilliz.com/glossary/vector-embeddings">вкрапления</a> для всех изображений и всего текста (200 правильных описаний + 600 жестких отрицаний).</li>
<li><strong>От текста к изображению (t2i):</strong> Для каждого описания выполняется поиск ближайшего совпадения по 200 изображениям. Очко начисляется, если верхний результат верен.</li>
<li><strong>От изображения к тексту (i2t):</strong> Для каждого изображения выполняется поиск ближайшего совпадения по всем 800 текстам. Балл начисляется только в том случае, если верхний результат - правильное описание, а не жесткий негатив.</li>
<li><strong>Итоговый балл:</strong> hard_avg_R@1 = (точность t2i + точность i2t) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Горизонтальная гистограмма, показывающая рейтинг кросс-модального поиска: Qwen3-VL-2B лидирует с результатом 0,945, за ним следуют Gemini Embed 2 с результатом 0,928, Voyage MM-3.5 с результатом 0,900, Jina CLIP v2 с результатом 0,873 и CLIP ViT-L-14 с результатом 0,768</span> </span></p>
<p>Qwen3-VL-2B, модель с открытым исходным кодом и 2B параметрами от команды Alibaba's Qwen, заняла первое место, опередив все API с закрытым исходным кодом.</p>
<p><strong>Разница в модальности</strong> объясняет большую часть разницы. Модели встраивания отображают текст и изображения в одно и то же векторное пространство, но на практике эти две модальности имеют тенденцию группироваться в разных регионах. Зазор между модальностями измеряет расстояние L2 между этими двумя кластерами. Меньший разрыв = более легкий кросс-модальный поиск.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Визуализация, сравнивающая большой разрыв модальности (0,73, кластеры для встраивания текста и изображений далеко друг от друга) с малым разрывом модальности (0,25, кластеры перекрываются) - меньший разрыв облегчает кросс-модальное сопоставление</span> </span></p>
<table>
<thead>
<tr><th>Модель</th><th>Оценка (R@1)</th><th>Разрыв модальности</th><th>Параметры</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (с открытым исходным кодом)</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.928</td><td>0.73</td><td>Неизвестно (закрыто)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Неизвестно (закрыто)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>КЛИП ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Разрыв между модальностями у Qwen составляет 0,25 - примерно треть от 0,73 у Gemini. В <a href="https://zilliz.com/learn/what-is-a-vector-database">векторной базе данных</a>, подобной <a href="https://milvus.io/">Milvus</a>, небольшой разрыв между модальностями означает, что вы можете хранить вложения текста и изображений в одной <a href="https://milvus.io/docs/manage-collections.md">коллекции</a> и <a href="https://milvus.io/docs/single-vector-search.md">осуществлять поиск</a> по ним напрямую. Большой разрыв может сделать <a href="https://zilliz.com/glossary/similarity-search">поиск по</a> кросс-модальному <a href="https://zilliz.com/glossary/similarity-search">сходству</a> менее надежным, и для его компенсации может потребоваться шаг повторного ранжирования.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Межъязыковой поиск: Какие модели выравнивают значение между языками?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Многоязычные базы знаний часто встречаются в производстве. Пользователь задает вопрос на китайском, а ответ находится в английском документе - или наоборот. Модель встраивания должна согласовывать смысл между языками, а не только внутри одного.</p>
<h3 id="Method" class="common-anchor-header">Метод</h3><p>Мы создали 166 параллельных пар предложений на китайском и английском языках на трех уровнях сложности:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Уровни межъязыковой сложности: Легкий уровень сопоставляет дословные переводы, такие как 我爱你 - Я люблю тебя; Средний уровень сопоставляет перефразированные предложения, такие как 这道菜太咸了 - Это блюдо слишком соленое с жесткими отрицаниями; Жесткий уровень сопоставляет китайские идиомы, такие как 画蛇添足 - Позолотить лилию с семантически различными жесткими отрицаниями.</span> </span></p>
<p>Каждый язык также получает 152 жестких отрицательных дистрактора.</p>
<p><strong>Оценка:</strong></p>
<ul>
<li>Генерируем вкрапления для всего китайского текста (166 правильных + 152 дистрактора) и всего английского текста (166 правильных + 152 дистрактора).</li>
<li><strong>Китайский → английский:</strong> Для каждого китайского предложения ищем его правильный перевод в 318 английских текстах.</li>
<li><strong>Английский → Китайский:</strong> То же самое в обратном порядке.</li>
<li><strong>Итоговая оценка:</strong> hard_avg_R@1 = (точность zh→en + точность en→zh) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Горизонтальная гистограмма, показывающая рейтинг межъязыкового поиска: Gemini Embed 2 лидирует с результатом 0,997, за ним следуют Qwen3-VL-2B с результатом 0,988, Jina v4 с результатом 0,985, Voyage MM-3.5 с результатом 0,982, до mxbai с результатом 0,120</span> </span></p>
<p>Gemini Embedding 2 получила 0,997 балла - самый высокий среди всех протестированных моделей. Это была единственная модель, набравшая 1.000 баллов на уровне Hard, где пары типа "画蛇添足" → "позолотить лилию" требуют подлинного <a href="https://zilliz.com/glossary/semantic-search">семантического</a> понимания на разных языках, а не сопоставления шаблонов.</p>
<table>
<thead>
<tr><th>Модель</th><th>Оценка (R@1)</th><th>Легко</th><th>Средняя</th><th>Сложная (идиомы)</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-большой</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>Все 7 лучших моделей имеют общий балл 0,93 - реальное различие происходит на уровне Hard (китайские идиомы). nomic-embed-text и mxbai-embed-large, англоязычные облегченные модели, показывают почти нулевые результаты в кросс-языковых задачах.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Поиск ключевой информации: Могут ли модели найти иголку в документе объемом 32 тыс. слов?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>Системы RAG часто обрабатывают объемные документы - юридические контракты, исследовательские работы, внутренние отчеты, содержащие <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированные данные</a>. Вопрос в том, сможет ли модель встраивания найти один конкретный факт в тысячах символов окружающего текста.</p>
<h3 id="Method" class="common-anchor-header">Метод</h3><p>В качестве стога сена мы взяли статьи Википедии разной длины (от 4 до 32 тысяч символов) и вставили в них один сфабрикованный факт - иголку - в разных позициях: начало, 25 %, 50 %, 75 % и конец. Модель должна определить, основываясь на вставке запроса, в какой версии документа содержится игла.</p>
<p><strong>Пример:</strong></p>
<ul>
<li><strong>Игла:</strong> "Корпорация Meridian сообщила о квартальной выручке в размере 847,3 млн долларов в III квартале 2025 года".</li>
<li><strong>Запрос:</strong> "Какова была квартальная выручка Meridian Corporation?".</li>
<li><strong>Стог сена:</strong> Статья в Википедии о фотосинтезе объемом 32 000 символов, в которой игла спрятана где-то внутри.</li>
</ul>
<p><strong>Оценка:</strong></p>
<ul>
<li>Сгенерируйте вкрапления для запроса, документа с иглой и документа без иглы.</li>
<li>Если запрос более похож на документ, содержащий иглу, засчитываем его как попадание.</li>
<li>Средняя точность для всех длин документов и положений иглы.</li>
<li><strong>Итоговые метрики:</strong> overall_accuracy и degradation_rate (насколько падает точность от самого короткого к самому длинному документу).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Тепловая карта, показывающая точность "игла в стоге" в зависимости от длины документа: Gemini Embed 2 набирает 1.000 баллов на всех длинах до 32K; 7 лучших моделей показывают отличные результаты в пределах своих контекстных окон; mxbai и nomic резко деградируют при 4K+</span> </span></p>
<p>Gemini Embedding 2 - единственная модель, протестированная во всем диапазоне 4K-32K, и она показала отличные результаты при любой длине. Ни у одной другой модели в этом тесте контекстное окно не достигает 32 Кбайт.</p>
<table>
<thead>
<tr><th>Модель</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>В целом</th><th>Деградация</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-большой</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Embeddings v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Вояж Мультимодальный 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Джина КЛИП v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" означает, что длина документа превышает контекстное окно модели.</p>
<p>Семь лучших моделей показывают отличные результаты в пределах своего контекстного окна. BGE-M3 начинает проседать при 8K (0,920). Легкие модели (mxbai и nomic) падают до 0,4-0,6 уже при 4К символов - примерно 1 000 лексем. Для mxbai это падение частично отражает то, что его контекстное окно на 512 слов обрезает большую часть документа.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">Сжатие размеров MRL: Сколько качества вы теряете при 256 измерениях?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka Representation Learning (MRL)</strong> - это техника обучения, которая делает первые N измерений вектора значимыми сами по себе. Возьмем вектор с 3072 измерениями, усечем его до 256, и он все равно сохранит большую часть своих семантических качеств. Меньшее количество измерений означает меньшие затраты на хранение и память в вашей <a href="https://zilliz.com/learn/what-is-a-vector-database">базе данных векторов</a> - переход от 3072 к 256 измерениям означает 12-кратное сокращение объема памяти.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Иллюстрация, показывающая усечение размерности MRL: 3072 размера при полном качестве, 1024 при 95 %, 512 при 90 %, 256 при 85 % - с 12-кратной экономией на хранении при 256 размерах.</span> </span></p>
<h3 id="Method" class="common-anchor-header">Метод</h3><p>Мы использовали 150 пар предложений из бенчмарка STS-B, каждая из которых имела оценку сходства (0-5), подтвержденную человеком. Для каждой модели мы генерировали вкрапления в полной размерности, затем усекали до 1024, 512 и 256.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>Примеры данных STS-B, показывающие пары предложений с человеческими оценками сходства: A girl is styling her hair vs A girl is brushing her hair - 2,5 балла; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach - 3,6 балла.</span> </span></p>
<p><strong>Подсчет баллов:</strong></p>
<ul>
<li>На каждом уровне размерности вычислите <a href="https://zilliz.com/glossary/cosine-similarity">косинусоидальное сходство</a> между вложениями каждой пары предложений.</li>
<li>Сравните рейтинг сходства, полученный моделью, с рейтингом, полученным человеком, используя <strong>ρ Спирмена</strong> (ранговая корреляция).</li>
</ul>
<blockquote>
<p><strong>Что такое ρ Спирмена?</strong> Он измеряет, насколько хорошо согласуются два ранжирования. Если человек оценивает пару A как наиболее похожую, B - как вторую, C - как наименее похожую, а косинусы сходства модели дают тот же порядок A &gt; B &gt; C, то ρ приближается к 1,0. Значение ρ, равное 1,0, означает полное согласие. Значение ρ, равное 0, означает отсутствие корреляции.</p>
</blockquote>
<p><strong>Итоговые метрики:</strong> spearman_rho (выше - лучше) и min_viable_dim (наименьшее измерение, в котором качество остается в пределах 5 % от производительности полного измерения).</p>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Точечная диаграмма, показывающая соотношение качества MRL Full Dimension и 256 Dimension: Voyage MM-3.5 лидирует с изменением на +0,6%, Jina v4 - на +0,5%, а Gemini Embed 2 показывает -0,6% в самом низу</span> </span>.</p>
<p>Если вы планируете сократить расходы на хранение в <a href="https://milvus.io/">Milvus</a> или другой векторной базе данных за счет усечения размеров, этот результат имеет значение.</p>
<table>
<thead>
<tr><th>Модель</th><th>ρ (полная размерность)</th><th>ρ (256 dim)</th><th>Распад</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3,5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Embeddings v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-large</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Embedding 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage и Jina v4 лидируют, потому что обе модели были явно обучены с MRL в качестве цели. Сжатие размерности имеет мало общего с размером модели - важно то, была ли модель обучена для этого.</p>
<p>Примечание к результату Gemini: рейтинг MRL отражает, насколько хорошо модель сохраняет качество после усечения, а не то, насколько хорош ее полноразмерный поиск. Полноразмерный поиск Gemini очень силен - это уже доказали результаты кросс-лингвистического поиска и поиска ключевой информации. Он просто не был оптимизирован для сокращения. Если вам не нужно сжатие размеров, эта метрика для вас неприменима.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Какую модель встраивания следует использовать?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Ни одна модель не выигрывает во всем. Вот полная таблица результатов:</p>
<table>
<thead>
<tr><th>Модель</th><th>Параметры</th><th>Кросс-модальная</th><th>Кросс-языковая</th><th>Ключевая информация</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Gemini Embedding 2</td><td>Нераскрытый</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Нераскрытый</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Embeddings v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-большой</td><td>Нераскрытый</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Не раскрыто</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Джина КЛИП v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" означает, что модель не поддерживает данную модальность или возможность. CLIP - это базовый уровень 2021 года для сравнения.</p>
<p>Вот что выделяется:</p>
<ul>
<li><strong>Кросс-модальность:</strong> Qwen3-VL-2B (0,945) - первый, Gemini (0,928) - второй, Voyage (0,900) - третий. Модель 2B с открытым исходным кодом победила все API с закрытым исходным кодом. Решающим фактором стал разрыв между модальностями, а не количество параметров.</li>
<li><strong>Кросс-язык:</strong> лидирует Gemini (0,997) - единственная модель, получившая отличную оценку за выравнивание на уровне идиом. Все 8 лучших моделей набрали 0,93 балла. Легкомысленные модели, использующие только английский язык, показывают почти нулевые результаты.</li>
<li><strong>Ключевая информация:</strong> API и крупные модели с открытым исходным кодом показывают отличные результаты вплоть до 8K. Модели ниже 335M начинают деградировать при 4K. Gemini - единственная модель, которая отлично справляется с 32K.</li>
<li><strong>Сжатие размеров MRL:</strong> Voyage (0,880) и Jina v4 (0,833) лидируют, теряя менее 1% при 256 размерах. Gemini (0,668) занимает последнее место - сильная при полной размерности, не оптимизированная для усечения.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Как выбрать: блок-схема принятия решений</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Блок-схема выбора модели встраивания: Начало → Нужны изображения или видео? → Да: Нужен ли самостоятельный хостинг? → Да: Qwen3-VL-2B, Нет: Gemini Embedding 2. Нет изображений → Нужно ли экономить место для хранения? → Да: Jina v4 или Voyage, Нет: Нужна многоязычность? → Да: Gemini Embedding 2, Нет: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">Лучший универсал: Gemini Embedding 2</h3><p>В целом, Gemini Embedding 2 является самой сильной моделью в этом бенчмарке.</p>
<p><strong>Сильные стороны:</strong> Первое место в кросс-лингвистическом (0,997) и ключевом поиске информации (1,000 для всех длин до 32K). Второе место по кросс-модальности (0,928). Самый широкий охват модальностей - пять модальностей (текст, изображение, видео, аудио, PDF), в то время как большинство моделей ограничиваются тремя.</p>
<p><strong>Слабые стороны:</strong> Последнее место по сжатию MRL (ρ = 0,668). В кросс-модальности побеждает Qwen3-VL-2B с открытым исходным кодом.</p>
<p>Если вам не нужно сжатие размеров, то у Gemini нет реальных конкурентов в комбинации кросс-языковой поиск + поиск по длинным документам. Но для кросс-модальной точности или оптимизации хранения специализированные модели работают лучше.</p>
<h2 id="Limitations" class="common-anchor-header">Ограничения<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Мы включили не все модели, заслуживающие внимания - NV-Embed-v2 от NVIDIA и v5-text от Jina были в списке, но не попали в этот раунд.</li>
<li>Мы сосредоточились на модальностях текста и изображений; встраивание видео, аудио и PDF (несмотря на то, что некоторые модели заявляют о его поддержке) не рассматривалось.</li>
<li>Поиск кода и другие специфические сценарии не рассматривались.</li>
<li>Размер выборки был относительно небольшим, поэтому сильные различия в рейтинге между моделями могут оказаться статистическим шумом.</li>
</ul>
<p>Результаты этой статьи устареют в течение года. Постоянно появляются новые модели, и таблица лидеров перетасовывается с каждым релизом. Более долгосрочным вложением средств является создание собственного конвейера оценки - определите типы данных, шаблоны запросов, длину документов и прогоняйте новые модели через свои собственные тесты, когда они появятся. Публичные бенчмарки, такие как MTEB, MMTEB и MMEB, стоит отслеживать, но окончательный вывод всегда должен быть сделан на основе ваших собственных данных.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Наш код бенчмарка находится с открытым исходным кодом на GitHub</a> - форкните его и адаптируйте под свои нужды.</p>
<hr>
<p>После того как вы выбрали модель встраивания, вам нужно где-то хранить и искать эти векторы в масштабе. <a href="https://milvus.io/">Milvus</a> - самая распространенная в мире база данных векторов с открытым исходным кодом и <a href="https://github.com/milvus-io/milvus">43K+ звездами на GitHub</a>, созданная именно для этого - она поддерживает MRL-усеченные размеры, смешанные мультимодальные коллекции, гибридный поиск, сочетающий плотные и разреженные векторы, и <a href="https://milvus.io/docs/architecture_overview.md">масштабируется от ноутбука до миллиардов векторов</a>.</p>
<ul>
<li>Начните работу с <a href="https://milvus.io/docs/quickstart.md">руководством по быстрому запуску Milvus</a> или установите его с помощью <code translate="no">pip install pymilvus</code>.</li>
<li>Присоединяйтесь к <a href="https://milvusio.slack.com/">Milvus Slack</a> или <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>, чтобы задать вопросы об интеграции моделей встраивания, стратегиях векторного индексирования или масштабировании производства.</li>
<li><a href="https://milvus.io/office-hours">Закажите бесплатную сессию Milvus Office Hours</a>, чтобы обсудить вашу архитектуру RAG - мы поможем с выбором модели, разработкой схемы коллекции и настройкой производительности.</li>
<li>Если вы предпочитаете обойтись без работы с инфраструктурой, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемая Milvus) предлагает бесплатный уровень для начала работы.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают у инженеров при выборе модели встраивания для производственного RAG:</p>
<p><strong>Вопрос: Следует ли мне использовать мультимодальную модель встраивания, даже если сейчас у меня есть только текстовые данные?</strong></p>
<p>Это зависит от вашей дорожной карты. Если в ближайшие 6-12 месяцев в ваш конвейер будут добавлены изображения, PDF-файлы или другие модальности, начните с мультимодальной модели, например Gemini Embedding 2 или Voyage Multimodal 3.5, чтобы избежать болезненной миграции в дальнейшем - вам не придется заново встраивать весь набор данных. Если вы уверены, что в обозримом будущем данные будут использоваться только в текстовом виде, то модель, ориентированная на текстовые данные, например OpenAI 3-large или Cohere Embed v4, обеспечит лучшее соотношение цена/производительность.</p>
<p><strong>В: Сколько места в векторной базе данных реально экономит сжатие размеров MRL?</strong></p>
<p>Переход от 3072 измерений к 256 - это 12-кратное сокращение объема памяти на вектор. Для коллекции <a href="https://milvus.io/">Milvus</a> со 100 миллионами векторов в float32 это примерно 1,14 ТБ → 95 ГБ. Важно, что не все модели хорошо справляются с усечением - Voyage Multimodal 3.5 и Jina Embeddings v4 теряют менее 1 % качества при 256 измерениях, в то время как другие модели значительно ухудшают качество.</p>
<p><strong>В: Действительно ли Qwen3-VL-2B лучше Gemini Embedding 2 для кросс-модального поиска?</strong></p>
<p>В нашем бенчмарке да - Qwen3-VL-2B набрал 0,945 против 0,928 у Gemini в жестком кросс-модальном поиске с почти идентичными дистракторами. Основная причина - гораздо меньший разрыв между модальностями (0,25 против 0,73), что означает, что в векторном пространстве текстовые и графические <a href="https://zilliz.com/glossary/vector-embeddings">вложения</a> группируются ближе друг к другу. При этом Gemini охватывает пять модальностей, а Qwen - три, так что если вам нужно встраивание аудио или PDF, Gemini - единственный вариант.</p>
<p><strong>В: Могу ли я использовать эти модели встраивания непосредственно в Milvus?</strong></p>
<p>Да. Все эти модели выводят стандартные float-векторы, которые вы можете <a href="https://milvus.io/docs/insert-update-delete.md">вставить в Milvus</a> и искать по <a href="https://zilliz.com/glossary/cosine-similarity">косинусному сходству</a>, расстоянию L2 или внутреннему произведению. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> работает с любой моделью встраивания - генерируйте векторы с помощью SDK модели, затем сохраняйте и ищите их в Milvus. Чтобы получить MRL-усеченные векторы, просто установите размерность коллекции на целевое значение (например, 256) при <a href="https://milvus.io/docs/manage-collections.md">создании коллекции</a>.</p>
