---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  Практическое руководство: Создание помощника по работе с документами на основе
  RAG за 10 минут с помощью Dify и Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Узнайте, как создать помощника по работе с документами на базе искусственного
  интеллекта с помощью технологии Retrieval Augmented Generation (RAG) с помощью
  Dify и Milvus в этом быстром практическом руководстве для разработчиков.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Что, если бы вы могли превратить всю свою библиотеку документации - тысячи страниц технических спецификаций, внутренних вики и документации по коду - в интеллектуального помощника с искусственным интеллектом, который мгновенно отвечает на конкретные вопросы?</p>
<p>А еще лучше, если бы вы могли создать его за меньшее время, чем требуется для устранения конфликта при слиянии?</p>
<p>Таковы перспективы технологии <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation</a> (RAG) при правильной реализации.</p>
<p>Хотя ChatGPT и другие LLM впечатляют, они быстро теряют свою эффективность, когда их спрашивают о документации, кодовой базе или базе знаний вашей компании. RAG устраняет этот пробел, интегрируя ваши собственные данные в разговор, предоставляя вам возможности искусственного интеллекта, которые имеют непосредственное отношение к вашей работе.</p>
<p>В чем проблема? Традиционная реализация RAG выглядит следующим образом:</p>
<ul>
<li><p>Написание пользовательских конвейеров генерации вложений</p></li>
<li><p>настройка и развертывание базы данных векторов</p></li>
<li><p>Разработка сложных шаблонов подсказок</p></li>
<li><p>Создание логики поиска и порогов сходства</p></li>
<li><p>Создание удобного интерфейса</p></li>
</ul>
<p>Но что, если бы вы могли сразу перейти к результатам?</p>
<p>В этом руководстве мы создадим простое приложение RAG, используя два инструмента, ориентированных на разработчиков:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: Платформа с открытым исходным кодом, которая управляет оркестровкой RAG с минимальными настройками.</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: молниеносная векторная база данных с открытым исходным кодом, специально созданная для поиска сходства и ИИ-поиска.</p></li>
</ul>
<p>К концу этого 10-минутного руководства у вас будет работающий ИИ-помощник, способный отвечать на подробные вопросы о любой коллекции документов, которую вы ему подкинете, и для этого не нужно иметь степень в области машинного обучения.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">Что вы создадите<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Всего за несколько минут активной работы вы создадите:</p>
<ul>
<li><p>конвейер обработки документов, который преобразует любой PDF-файл в знания, доступные для запроса</p></li>
<li><p>Систему векторного поиска, которая находит именно ту информацию, которая нужна.</p></li>
<li><p>Интерфейс чат-бота, который отвечает на технические вопросы с высокой точностью.</p></li>
<li><p>Развертываемое решение, которое можно интегрировать с существующими инструментами.</p></li>
</ul>
<p>И что самое приятное? Большинство из них настраивается с помощью простого пользовательского интерфейса (UI), а не пользовательского кода.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">Что вам понадобится<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Базовые знания Docker (только уровень <code translate="no">docker-compose up -d</code> ).</p></li>
<li><p>Ключ API OpenAI</p></li>
<li><p>PDF-документ для экспериментов (мы будем использовать научную статью).</p></li>
</ul>
<p>Готовы создать что-то действительно полезное в рекордные сроки? Давайте приступим!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Создание RAG-приложения с помощью Milvus и Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом разделе мы создадим простое приложение RAG с помощью Dify, в котором мы сможем задавать вопросы об информации, содержащейся в научной статье. В качестве научной статьи вы можете использовать любую статью, однако в данном случае мы воспользуемся знаменитой статьей, познакомившей нас с архитектурой Transformer, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>&quot;.</p>
<p>В качестве векторного хранилища мы будем использовать Milvus, где будут храниться все необходимые контексты. Для модели встраивания и LLM мы будем использовать модели из OpenAI. Поэтому сначала нам нужно настроить API-ключ OpenAI. Подробнее о его настройке вы можете узнать<a href="https://platform.openai.com/docs/quickstart"> здесь</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Шаг 1: Запуск контейнеров Dify и Milvus</h3><p>В этом примере мы будем самостоятельно размещать Dify с помощью Docker Compose. Поэтому, прежде чем начать, убедитесь, что Docker установлен на вашей локальной машине. Если он еще не установлен, установите Docker, обратившись к<a href="https://docs.docker.com/desktop/"> странице его установки</a>.</p>
<p>После установки Docker нам нужно клонировать исходный код Dify на нашу локальную машину с помощью следующей команды:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Затем перейдите в каталог <code translate="no">docker</code> внутри исходного кода, который вы только что клонировали. Там нужно скопировать файл <code translate="no">.env</code> с помощью следующей команды:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>В двух словах, файл <code translate="no">.env</code> содержит конфигурации, необходимые для запуска приложения Dify, такие как выбор векторных баз данных, учетные данные, необходимые для доступа к векторной базе, адрес вашего приложения Dify и т. д.</p>
<p>Поскольку мы собираемся использовать Milvus в качестве нашей векторной базы данных, то нам нужно изменить значение переменной <code translate="no">VECTOR_STORE</code> в файле <code translate="no">.env</code> на <code translate="no">milvus</code>. Также нужно изменить значение переменной <code translate="no">MILVUS_URI</code> на <code translate="no">http://host.docker.internal:19530</code>, чтобы в дальнейшем после развертывания не возникало проблем со связью между Docker-контейнерами.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Теперь мы готовы к запуску контейнеров Docker. Для этого нам нужно лишь выполнить команду <code translate="no">docker compose up -d</code>. После ее завершения вы увидите в терминале вывод, аналогичный приведенному ниже:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>С помощью команды <code translate="no">docker compose ps</code> мы можем проверить состояние всех контейнеров и убедиться, что они работают нормально. Если все они здоровы, вы увидите вывод, как показано ниже:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>И наконец, если мы перейдем по адресу<a href="http://localhost/install"> </a>http://localhost/install, то увидим целевую страницу Dify, на которой мы можем зарегистрироваться и начать создавать наше RAG-приложение в кратчайшие сроки.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Как только вы зарегистрировались, вы можете просто войти в Dify, используя свои учетные данные.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Шаг 2: Настройка ключа API OpenAI</h3><p>Первое, что нам нужно сделать после регистрации в Dify, - это настроить наши API-ключи, которые мы будем использовать для вызова модели встраивания, а также LLM. Поскольку мы собираемся использовать модели от OpenAI, нам нужно вставить наш API-ключ OpenAI в наш профиль. Для этого перейдите в раздел "Настройки", наведя курсор на свой профиль в правой верхней части пользовательского интерфейса, как показано на скриншоте ниже:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Далее перейдите в раздел "Model Provider", наведите курсор на OpenAI, а затем нажмите "Setup". Появится всплывающее окно, в котором вам будет предложено ввести ключ API OpenAI. После этого мы готовы использовать модели из OpenAI в качестве нашей модели вставки и LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Шаг 3: Вставка документов в базу знаний</h3><p>Теперь давайте создадим базу знаний для нашего приложения RAG. База знаний состоит из коллекции внутренних документов или текстов, которые могут быть использованы в качестве релевантных контекстов, чтобы помочь LLM генерировать более точные ответы.</p>
<p>В нашем случае база знаний - это, по сути, документ "Внимание - это все, что вам нужно". Однако мы не можем хранить документ в его нынешнем виде по нескольким причинам. Во-первых, статья слишком длинная, и предоставление слишком длинного контекста для LLM не поможет, поскольку контекст слишком широк. Во-вторых, мы не можем выполнить поиск по сходству, чтобы получить наиболее релевантный контекст, если наш вход - это необработанный текст.</p>
<p>Поэтому перед тем, как поместить статью в базу знаний, необходимо выполнить как минимум два шага. Во-первых, нам нужно разделить статью на фрагменты текста, а затем преобразовать каждый фрагмент во вставку с помощью модели вставки. Наконец, мы можем сохранить эти вкрапления в Milvus в качестве нашей векторной базы данных.</p>
<p>Dify позволяет нам легко разделить текст статьи на фрагменты и превратить их в эмбеддинги. Все, что нам нужно сделать, - это загрузить PDF-файл статьи, задать длину фрагмента и выбрать модель встраивания с помощью ползунка. Чтобы выполнить все эти действия, перейдите в раздел &quot;Знания&quot;, а затем нажмите &quot;Создать знания&quot;. Далее вам будет предложено загрузить PDF-файл с вашего локального компьютера. Поэтому лучше сначала скачать статью с ArXiv и сохранить ее на своем компьютере.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>После загрузки файла мы можем задать длину чанка, метод индексирования, модель встраивания и настройки поиска.</p>
<p>В области "Настройка чанка" вы можете выбрать любое число в качестве максимальной длины чанка (в нашем случае мы установим ее на 100). Далее, в разделе "Метод индексации" нам нужно выбрать опцию "Высокое качество", так как это позволит нам выполнять поиск по сходству, чтобы найти релевантные контексты. Для "Модели встраивания" вы можете выбрать любую модель встраивания из OpenAI, но в данном примере мы будем использовать модель text-embedding-3-small. Наконец, для "Retrieval Setting" нам нужно выбрать "Vector Search", так как мы хотим выполнять поиск по сходству, чтобы найти наиболее релевантные контексты.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Если вы нажмете на кнопку "Сохранить и обработать" и все пройдет успешно, вы увидите зеленую галочку, как показано на следующем скриншоте:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Шаг 4: Создание приложения RAG</h3><p>До этого момента мы успешно создали базу знаний и сохранили ее в базе данных Milvus. Теперь мы готовы к созданию приложения RAG.</p>
<p>Создание приложения RAG в Dify очень простое. Нам нужно перейти в "Студию", а не в "Знания", как раньше, а затем нажать на "Создать из пустого места". Далее выберите "Чатбот" в качестве типа приложения и дайте своему приложению имя в соответствующем поле. Как только вы закончите, нажмите "Создать". Теперь вы увидите следующую страницу:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>В поле "Инструкция" мы можем написать системную подсказку, например "Кратко ответить на вопрос пользователя". Далее в поле "Контекст" нам нужно нажать на символ "Добавить", а затем добавить базу знаний, которую мы только что создали. Таким образом, наше приложение RAG будет извлекать возможные контексты из этой базы знаний для ответа на запрос пользователя.</p>
<p>Теперь, когда мы добавили базу знаний в наше приложение RAG, нам осталось выбрать LLM из OpenAI. Для этого вы можете нажать на список моделей, доступный в правом верхнем углу, как вы можете видеть на скриншоте ниже:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>И теперь мы готовы опубликовать наше RAG-приложение! В правом верхнем углу нажмите "Опубликовать", и там вы найдете множество способов опубликовать наше приложение RAG: мы можем просто запустить его в браузере, встроить его на наш сайт или получить доступ к приложению через API. В этом примере мы просто запустим наше приложение в браузере, поэтому мы можем нажать на &quot;Run App&quot;.</p>
<p>Вот и все! Теперь вы можете задать LLM любой вопрос, связанный со статьей "Внимание - это все, что вам нужно" или любыми документами, включенными в нашу базу знаний.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Теперь вы создали работающее RAG-приложение с помощью Dify и Milvus с минимальным количеством кода и настроек. Такой подход делает сложную архитектуру RAG доступной для разработчиков, не требуя глубоких знаний в области векторных баз данных или интеграции LLM. Основные выводы:</p>
<ol>
<li><strong>Низкие затраты на настройку</strong>: Использование Docker Compose упрощает развертывание.</li>
<li><strong>Оркестровка без кода и с низким уровнем кода</strong>: Dify обрабатывает большую часть конвейера RAG</li>
<li><strong>Готовая к производству векторная база данных</strong>: Milvus обеспечивает эффективное хранение и поиск встраивания.</li>
<li><strong>Расширяемая архитектура</strong>: Легко добавлять документы или настраивать параметры При развертывании на производстве следует учесть следующее:</li>
</ol>
<ul>
<li>Настройку аутентификации для вашего приложения</li>
<li>Настройка правильного масштабирования Milvus (особенно для больших коллекций документов)</li>
<li>Внедрение мониторинга для экземпляров Dify и Milvus</li>
<li>Тонкая настройка параметров поиска для достижения оптимальной производительности Сочетание Dify и Milvus позволяет быстро разрабатывать приложения RAG, которые могут эффективно использовать внутренние знания вашей организации с помощью современных больших языковых моделей (LLM). Удачного создания!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Дополнительные ресурсы<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Документация Dify</a></li>
<li><a href="https://milvus.io/docs">Документация Milvus</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Основы работы с векторными базами данных</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Шаблоны реализации RAG</a></li>
</ul>
