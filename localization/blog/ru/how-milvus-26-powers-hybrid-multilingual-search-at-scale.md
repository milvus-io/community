---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Как Milvus 2.6 модернизирует многоязычный полнотекстовый поиск в масштабе
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 представляет полностью переработанный конвейер анализа текстов с
  широкой многоязычной поддержкой полнотекстового поиска.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
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
    </button></h2><p>Современные приложения искусственного интеллекта становятся все более сложными. Нельзя просто бросить в проблему один метод поиска и считать ее решенной.</p>
<p>Возьмем, к примеру, рекомендательные системы - они требуют <strong>векторного поиска</strong> для понимания смысла текста и изображений, <strong>фильтрации метаданных</strong> для сужения результатов по цене, категории или местоположению, а также <strong>поиска по ключевым словам</strong> для прямых запросов вроде "Nike Air Max". Каждый метод решает свою часть проблемы, а в реальных системах все они должны работать вместе.</p>
<p>Будущее поиска - это не выбор между вектором и ключевым словом. Речь идет о сочетании вектора, ключевого слова и фильтрации, а также других типов поиска - и все это в одном месте. Именно поэтому мы начали внедрять <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">гибридный поиск</a> в Milvus год назад, с выходом Milvus 2.5.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Но полнотекстовый поиск работает по-другому<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Внедрить полнотекстовый поиск в векторно-нативную систему не так-то просто. Полнотекстовый поиск имеет свой собственный набор проблем.</p>
<p>В то время как векторный поиск улавливает <em>семантическое</em> значение текста, превращая его в высокоразмерные векторы, полнотекстовый поиск зависит от понимания <strong>структуры языка</strong>: как формируются слова, где они начинаются и заканчиваются и как соотносятся друг с другом. Например, когда пользователь ищет "беговые кроссовки" на английском языке, текст проходит несколько этапов обработки:</p>
<p><em>разделение на пробельные символы → выделение строчных символов → удаление стоп-слов → преобразование слова &quot;running&quot; в слово &quot;run&quot;.</em></p>
<p>Чтобы правильно справиться с этой задачей, нам нужен надежный <strong>языковой анализатор - такой</strong>, который справится с разбивкой на части, стеблями, фильтрацией и многим другим.</p>
<p>Когда мы представили <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">полнотекстовый поиск BM25</a> в Milvus 2.5, мы включили настраиваемый анализатор, и он хорошо справлялся с поставленными перед ним задачами. Вы могли определить конвейер с использованием токенизаторов, фильтров токенов и фильтров символов для подготовки текста к индексированию и поиску.</p>
<p>Для английского языка эта настройка была относительно простой. Но все становится сложнее, когда речь идет о нескольких языках.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">Проблема многоязычного полнотекстового поиска<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Многоязычный полнотекстовый поиск сопряжен с целым рядом проблем:</p>
<ul>
<li><p><strong>Сложные языки требуют особого подхода</strong>: В таких языках, как китайский, японский и корейский, пробелы между словами не используются. Им требуются продвинутые токенизаторы для сегментации символов в осмысленные слова. Эти инструменты могут хорошо работать для одного языка, но редко поддерживают несколько сложных языков одновременно.</p></li>
<li><p><strong>Даже похожие языки могут конфликтовать</strong>: Английский и французский языки могут использовать пробелы для разделения слов, но если применить специфические для каждого языка обработки, такие как стемминг или лемматизация, правила одного языка могут вмешаться в правила другого. То, что повышает точность для английского языка, может исказить французские запросы, и наоборот.</p></li>
</ul>
<p>Одним словом, <strong>для разных языков нужны разные анализаторы</strong>. Попытка обработать китайский текст с помощью английского анализатора приводит к неудаче - там нет пробелов, которые можно было бы разделить, а английские правила стеблирования могут испортить китайские символы.</p>
<p>В итоге? Полагаясь на один токенизатор и анализатор для многоязычных наборов данных, практически невозможно обеспечить последовательную и качественную токенизацию на всех языках. А это напрямую ведет к снижению производительности поиска.</p>
<p>Когда команды начали внедрять полнотекстовый поиск в Milvus 2.5, мы стали слышать одни и те же отзывы:</p>
<p><em>"Это идеально подходит для поиска на английском языке, но как быть с нашими многоязычными обращениями в службу поддержки?" "Нам нравится, что есть и векторный, и BM25-поиск, но наш набор данных включает китайский, японский и английский контент". "Можем ли мы получить одинаковую точность поиска на всех наших языках?"</em></p>
<p>Эти вопросы подтвердили то, что мы уже видели на практике: полнотекстовый поиск принципиально отличается от векторного. Семантическое сходство хорошо работает на разных языках, но точный текстовый поиск требует глубокого понимания структуры каждого языка.</p>
<p>Именно поэтому в <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> появился полностью обновленный конвейер анализа текста со всесторонней поддержкой нескольких языков. Эта новая система автоматически применяет правильный анализатор для каждого языка, обеспечивая точный и масштабируемый полнотекстовый поиск в многоязычных наборах данных без ручной настройки или снижения качества.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Как Milvus 2.6 обеспечивает надежный многоязычный полнотекстовый поиск<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>В результате обширных исследований и разработок мы создали набор функций, предназначенных для различных многоязычных сценариев. Каждый подход решает проблему языковой зависимости по-своему.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Многоязычный анализатор: Точность через контроль</h3><p><a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Многоязычный анализатор</strong></a> позволяет определять различные правила обработки текста для разных языков в одной коллекции, вместо того чтобы заставлять все языки проходить через один и тот же конвейер анализа.</p>
<p><strong>Вот как это работает:</strong> вы настраиваете анализаторы для разных языков и помечаете каждый документ его языком при вставке. При выполнении поиска BM25 вы указываете, какой языковой анализатор использовать для обработки запроса. Таким образом, и проиндексированный контент, и поисковые запросы будут обрабатываться по оптимальным правилам для соответствующих языков.</p>
<p><strong>Идеально подходит для:</strong> Приложений, в которых вы знаете язык содержимого и хотите добиться максимальной точности поиска. Например, многонациональные базы знаний, локализованные каталоги продукции или системы управления контентом для конкретного региона.</p>
<p><strong>Требования:</strong> Необходимо предоставить языковые метаданные для каждого документа. В настоящее время доступно только для поисковых операций BM25.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Токенизатор языковых идентификаторов: Автоматическое определение языка</h3><p>Мы знаем, что вручную помечать каждый фрагмент контента не всегда практично. <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Токенизатор языковых идентификаторов</strong></a> обеспечивает автоматическое определение языка непосредственно в конвейере анализа текста.</p>
<p><strong>Вот как это работает:</strong> Этот интеллектуальный токенизатор анализирует входящий текст, определяет его язык с помощью сложных алгоритмов обнаружения и автоматически применяет соответствующие правила обработки с учетом особенностей языка. Вы настраиваете его с помощью нескольких определений анализаторов - по одному для каждого языка, который вы хотите поддерживать, плюс резервный анализатор по умолчанию.</p>
<p>Мы поддерживаем два механизма обнаружения: <code translate="no">whatlang</code> для более быстрой обработки и <code translate="no">lingua</code> для более высокой точности. Система поддерживает 71-75 языков, в зависимости от выбранного вами детектора. Во время индексации и поиска токенизатор автоматически выбирает нужный анализатор в зависимости от обнаруженного языка, возвращаясь к конфигурации по умолчанию, если обнаружение неточно.</p>
<p><strong>Идеально подходит для:</strong> Динамичных сред с непредсказуемым смешением языков, платформ пользовательского контента или приложений, где ручная маркировка языков нецелесообразна.</p>
<p><strong>Компромисс:</strong> автоматическое обнаружение увеличивает время задержки обработки и может быть затруднено при работе с очень коротким текстом или контентом на разных языках. Однако для большинства реальных приложений удобство значительно перевешивает эти ограничения.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU Tokenizer: Универсальная основа</h3><p>Если первые два варианта кажутся вам излишеством, у нас есть кое-что попроще. Мы недавно интегрировали в Milvus 2.6<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> токенизатор ICU (International Components for Unicode)</a>. ICU существует уже целую вечность - это зрелый, широко используемый набор библиотек, который обрабатывает текст для множества языков и скриптов. Самое замечательное, что он может обрабатывать различные сложные и простые языки одновременно.</p>
<p>Токенизатор ICU - это отличный выбор по умолчанию. Он использует стандартные правила Unicode для разбиения слов, что делает его надежным для десятков языков, у которых нет собственных специализированных токенизаторов. Если вам нужно что-то мощное и универсальное, хорошо работающее на нескольких языках, ICU справится с этой задачей.</p>
<p><strong>Ограничения:</strong> ICU по-прежнему работает в рамках одного анализатора, поэтому все ваши языки в итоге используют одни и те же фильтры. Хотите сделать что-то специфическое для конкретного языка, например, стемминг или лемматизацию? Вы столкнетесь с теми же конфликтами, о которых мы говорили ранее.</p>
<p><strong>Где он действительно силен:</strong> Мы создали ICU для работы в качестве анализатора по умолчанию в мультиязычных системах или системах с языковыми идентификаторами. По сути, это интеллектуальная система безопасности для работы с языками, которые вы явно не настроили.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Посмотрите на него в действии: Демонстрация на практике<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Хватит теории - давайте погрузимся в код! Вот как использовать новые многоязычные функции в <strong>pymilvus</strong> для создания многоязычной поисковой коллекции.</p>
<p>Мы начнем с определения некоторых многоразовых конфигураций анализатора, а затем рассмотрим <strong>два готовых примера</strong>:</p>
<ul>
<li><p>Использование <strong>многоязычного анализатора</strong></p></li>
<li><p>Использование <strong>токенизатора языковых идентификаторов</strong></p></li>
</ul>
<p>👉 Полный код демоверсии можно найти на <a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">этой странице GitHub</a>.</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Шаг 1: Настройка клиента Milvus</h3><p><em>Сначала мы подключаемся к Milvus, задаем имя коллекции и очищаем все существующие коллекции, чтобы начать с чистого листа.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Шаг 2: Определите анализаторы для нескольких языков</h3><p>Далее мы определяем словарь <code translate="no">analyzers</code> с конфигурациями для разных языков. Они будут использоваться в обоих методах многоязычного поиска, показанных далее.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Вариант A: Использование многоязычного анализатора</h3><p>Этот подход лучше всего подходит, когда вы <strong>заранее знаете язык каждого документа</strong>. Вы передадите эту информацию через специальное поле <code translate="no">language</code> во время вставки данных.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Создание коллекции с помощью многоязыкового анализатора</h4><p>Мы создадим коллекцию, в которой поле <code translate="no">&quot;text&quot;</code> будет использовать разные анализаторы в зависимости от значения поля <code translate="no">language</code>.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Вставка многоязычных данных и загрузка коллекции</h4><p>Теперь вставьте документы на английском и японском языках. Поле <code translate="no">language</code> указывает Milvus, какой анализатор использовать.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Запуск полнотекстового поиска</h4><p>Для поиска укажите, какой анализатор использовать для запроса в зависимости от его языка.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Результаты:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Вариант B: Использование токенизатора языковых идентификаторов</h3><p>Этот подход избавляет вас от ручной обработки языка. <strong>Токенизатор языковых идентификаторов</strong> автоматически определяет язык каждого документа и применяет нужный анализатор - нет необходимости указывать поле <code translate="no">language</code>.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Создание коллекции с помощью токенизатора языковых идентификаторов</h4><p>Здесь мы создаем коллекцию, в которой поле <code translate="no">&quot;text&quot;</code> использует автоматическое определение языка для выбора правильного анализатора.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Вставка данных и загрузка коллекции</h4><p>Вставляйте текст на разных языках - не нужно их маркировать. Milvus автоматически определяет и применяет нужный анализатор.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Запуск полнотекстового поиска</h4><p>Самое интересное: при поиске <strong>не нужно указывать анализатор</strong>. Токенизатор автоматически определяет язык запроса и применяет правильную логику.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Результаты</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Milvus 2.6 делает большой шаг вперед, делая <strong>гибридный поиск</strong> более мощным и доступным, сочетая векторный поиск с поиском по ключевым словам, теперь на нескольких языках. Благодаря расширенной многоязыковой поддержке вы можете создавать приложения, которые понимают <em>, что имеют в виду пользователи</em> и <em>что они говорят</em>, независимо от того, какой язык они используют.</p>
<p>Но это только одна часть обновления. В Milvus 2.6 также появилось несколько других функций, которые делают поиск быстрее, умнее и проще в работе:</p>
<ul>
<li><p><strong>Улучшенное сопоставление запросов</strong> - используйте <code translate="no">phrase_match</code> и <code translate="no">multi_match</code> для более точного поиска.</p></li>
<li><p><strong>Более быстрая фильтрация JSON</strong> - благодаря новому специальному индексу для полей JSON</p></li>
<li><p><strong>Сортировка на основе скаляров</strong> - Сортировка результатов по любому числовому полю</p></li>
<li><p><strong>Расширенный рерайтинг</strong> - упорядочивание результатов с помощью моделей или пользовательской логики подсчета баллов</p></li>
</ul>
<p>Хотите получить полный обзор Milvus 2.6? Ознакомьтесь с нашей последней статьей: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Представление Milvus 2.6: доступный векторный поиск в миллиардных масштабах</strong></a><strong>.</strong></p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о какой-либо функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
