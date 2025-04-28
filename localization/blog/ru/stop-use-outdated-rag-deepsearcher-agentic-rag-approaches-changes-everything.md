---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 'Хватит строить ванильные RAG: принимайте агентские RAG с DeepSearcher'
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">Переход к поиску на основе искусственного интеллекта с помощью LLM и глубоких исследований<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>За десятилетия развития поисковых технологий произошел значительный прогресс: от поиска по ключевым словам в 2000-х годах до персонализированного поиска в 2010-х. Сейчас мы наблюдаем появление решений на базе искусственного интеллекта, способных обрабатывать сложные запросы, требующие глубокого профессионального анализа.</p>
<p>Примером такого изменения может служить OpenAI's Deep Research, использующий возможности рассуждения для синтеза больших объемов информации и создания многоэтапных исследовательских отчетов. Например, на вопрос "Какова разумная рыночная стоимость Tesla?" Deep Research может всесторонне проанализировать корпоративные финансы, траектории роста бизнеса и оценки рыночной стоимости.</p>
<p>В основе Deep Research лежит усовершенствованная форма фреймворка RAG (Retrieval-Augmented Generation). Традиционный RAG улучшает результаты языковых моделей путем извлечения и включения в них релевантной внешней информации. Подход OpenAI идет дальше, реализуя итеративные циклы поиска и рассуждений. Вместо одного шага поиска Deep Research динамически генерирует несколько запросов, оценивает промежуточные результаты и уточняет стратегию поиска, демонстрируя, как продвинутые или агентские методы RAG могут обеспечить высококачественный контент корпоративного уровня, который больше похож на профессиональное исследование, чем на простой ответ на вопрос.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Локальное глубокое исследование, позволяющее сделать агентный RAG доступным для всех.<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Вдохновленные этими достижениями, разработчики по всему миру стали создавать свои собственные реализации. Инженеры Zilliz создали и выложили в открытый доступ проект <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, который можно считать локальным Deep Research с открытым исходным кодом. Менее чем за месяц этот проект набрал более 4 900 звезд на GitHub.</p>
<p>DeepSearcher переосмысливает корпоративный поиск на базе ИИ, сочетая в себе мощь передовых моделей рассуждений, сложные функции поиска и интегрированный помощник исследователя. Благодаря интеграции локальных данных с помощью <a href="https://milvus.io/docs/overview.md">Milvus</a> (высокопроизводительной векторной базы данных с открытым исходным кодом) DeepSearcher обеспечивает более быстрые и релевантные результаты, позволяя пользователям легко менять основные модели для получения индивидуального опыта.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 1:</em> <em>Звездная история DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Источник</em></a><em>)</em></p>
<p>В этой статье мы рассмотрим эволюцию от традиционного RAG к агентскому RAG и выясним, что именно отличает эти подходы на техническом уровне. Затем мы обсудим реализацию DeepSearcher и покажем, как она использует возможности интеллектуального агента для обеспечения динамических, многооборотных рассуждений, и почему это важно для разработчиков, создающих поисковые решения корпоративного уровня.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">От традиционного RAG к агентному RAG: сила итеративного рассуждения<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Агентный RAG расширяет традиционный фреймворк RAG за счет использования возможностей интеллектуальных агентов. DeepSearcher является ярким примером агентной системы RAG. Благодаря динамическому планированию, многоступенчатым рассуждениям и автономному принятию решений, он создает замкнутый процесс, который позволяет получать, обрабатывать, проверять и оптимизировать данные для решения сложных задач.</p>
<p>Растущая популярность агентных RAG обусловлена значительным развитием возможностей рассуждений на основе больших языковых моделей (LLM), в частности их улучшенной способностью разбивать сложные проблемы на части и поддерживать последовательные цепочки мыслей на протяжении нескольких шагов.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Сравнительное измерение</strong></td><td><strong>Традиционная RAG</strong></td><td><strong>Агентный RAG</strong></td></tr>
<tr><td>Основной подход</td><td>Пассивный и реактивный</td><td>Проактивный, управляемый агентами</td></tr>
<tr><td>Поток процессов</td><td>Одноэтапный поиск и генерация (одноразовый процесс)</td><td>Динамический, многоэтапный поиск и генерация (итеративное уточнение)</td></tr>
<tr><td>Стратегия поиска</td><td>Фиксированный поиск по ключевым словам, зависящий от исходного запроса</td><td>Адаптивный поиск (например, уточнение ключевых слов, переключение источников данных)</td></tr>
<tr><td>Обработка сложных запросов</td><td>Прямая генерация; подвержена ошибкам при наличии противоречивых данных</td><td>Декомпозиция задачи → целевой поиск → синтез ответа</td></tr>
<tr><td>Возможность взаимодействия</td><td>Полностью полагается на ввод данных пользователем; нет автономности</td><td>Проактивное взаимодействие (например, прояснение неясностей, запрос деталей)</td></tr>
<tr><td>Исправление ошибок и обратная связь</td><td>Отсутствие самокоррекции; ограничено первоначальными результатами</td><td>Итеративная проверка → самостоятельный повторный поиск для обеспечения точности</td></tr>
<tr><td>Идеальные примеры использования</td><td>Простые вопросы и ответы, поиск фактов</td><td>Сложные рассуждения, многоэтапное решение проблем, открытые задачи</td></tr>
<tr><td>Пример</td><td>Пользователь спрашивает: "Что такое квантовые вычисления?" → Система возвращает определение из учебника</td><td>Пользователь спрашивает: "Как квантовые вычисления могут оптимизировать логистику?" → Система извлекает квантовые принципы и логистические алгоритмы, а затем синтезирует полезные идеи.</td></tr>
</tbody>
</table>
<p>В отличие от традиционной RAG, которая опирается на единый запрос, агентная RAG разбивает запрос на несколько подвопросов и итеративно совершенствует поиск до получения удовлетворительного ответа. Эта эволюция дает три основных преимущества:</p>
<ul>
<li><p><strong>Проактивное решение проблем:</strong> Система переходит от пассивного реагирования к активному решению проблем.</p></li>
<li><p><strong>Динамический, многооборотный поиск:</strong> Вместо одноразового поиска система постоянно корректирует свои запросы и самокорректируется на основе постоянной обратной связи.</p></li>
<li><p><strong>Более широкая применимость:</strong> Система не ограничивается базовой проверкой фактов, а решает сложные задачи рассуждения и генерирует комплексные отчеты.</p></li>
</ul>
<p>Используя эти возможности, приложения Agentic RAG, такие как DeepSearcher, работают подобно экспертам-людям, предоставляя не только окончательный ответ, но и полное, прозрачное описание процесса рассуждений и деталей выполнения.</p>
<p>В долгосрочной перспективе агентурные RAG должны обогнать базовые системы RAG. Традиционные подходы часто не могут справиться с логикой, лежащей в основе пользовательских запросов, которые требуют итеративных рассуждений, размышлений и постоянной оптимизации.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Как выглядит архитектура Agentic RAG? Пример DeepSearcher<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы поняли возможности агентных RAG-систем, как выглядит их архитектура? Давайте рассмотрим DeepSearcher в качестве примера.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 2: Два модуля в DeepSearcher</em></p>
<p>Архитектура DeepSearcher состоит из двух основных модулей:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Модуль сбора данных</h3><p>Этот модуль подключает различные сторонние источники данных через векторную базу данных Milvus. Он особенно ценен для корпоративных сред, которые полагаются на проприетарные наборы данных. Модуль обрабатывает:</p>
<ul>
<li><p>синтаксический анализ и разбиение документов</p></li>
<li><p>Генерация вкраплений</p></li>
<li><p>хранение и индексирование векторов</p></li>
<li><p>Управление метаданными для эффективного поиска</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Модуль онлайновых рассуждений и запросов</h3><p>Этот компонент реализует различные стратегии агентов в рамках RAG для получения точных и глубоких ответов. Он работает по динамическому, итерационному циклу - после каждого извлечения данных система анализирует, достаточно ли накопленной информации для ответа на первоначальный запрос. Если нет, запускается еще одна итерация; если да - формируется окончательный отчет.</p>
<p>Этот непрерывный цикл "продолжения" и "осмысления" представляет собой фундаментальное улучшение по сравнению с другими базовыми подходами RAG. В то время как традиционные RAG выполняют одномоментный поиск и генерацию информации, итерационный подход DeepSearcher отражает работу исследователей: они задают первые вопросы, оценивают полученную информацию, выявляют пробелы и ищут новые направления.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">Насколько эффективен DeepSearcher и для каких случаев использования он подходит лучше всего?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>После установки и настройки DeepSearcher индексирует ваши локальные файлы с помощью векторной базы данных Milvus. Когда вы отправляете запрос, он выполняет всесторонний, глубокий поиск по этому проиндексированному контенту. Ключевым преимуществом для разработчиков является то, что система регистрирует каждый шаг своего процесса поиска и рассуждений, обеспечивая прозрачность того, как она пришла к своим выводам - критически важная функция для отладки и оптимизации RAG-систем.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 3: Ускоренное воспроизведение итерации DeepSearcher</em></p>
<p>Этот подход потребляет больше вычислительных ресурсов, чем традиционная RAG, но обеспечивает лучшие результаты при выполнении сложных запросов. Давайте обсудим два конкретных случая использования DeepSearcher, для которых он подходит лучше всего.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Запросы типа "обзор</h3><p>Запросы типа "обзор" - например, создание отчетов, подготовка документов или обобщение тенденций - содержат краткую тему, но требуют исчерпывающего, подробного результата.</p>
<p>Например, при запросе &quot;Как менялся сериал &quot;Симпсоны&quot; с течением времени?&quot; DeepSearcher сначала генерирует начальный набор подзапросов:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Он извлекает релевантную информацию, а затем с помощью обратной связи уточняет поиск, генерируя следующие подзапросы:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Каждая итерация опирается на предыдущую, в результате чего получается всеобъемлющий отчет, охватывающий множество аспектов темы и состоящий из таких разделов, как:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Для краткости показаны только фрагменты процесса и итогового отчета)</em></p>
<p>Итоговый отчет представляет собой тщательный анализ с надлежащим цитированием и структурированной организацией.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Сложные логические запросы</h3><p>Сложные запросы включают в себя несколько уровней логики и взаимосвязанных сущностей.</p>
<p>Рассмотрим запрос: "В каком фильме режиссер старше: "Божий дар женщинам" или "Aldri annet enn bråk"?".</p>
<p>Хотя человеку этот вопрос может показаться простым, простые системы RAG справляются с ним с трудом, поскольку ответ не хранится непосредственно в базе знаний. DeepSearcher решает эту проблему путем декомпозиции запроса на более мелкие подвопросы:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Сначала он извлекает информацию о режиссерах обоих фильмов,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>затем генерирует подзапросы:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>, затем извлекает даты их рождения и, наконец, сравнивает их, чтобы определить правильный ответ:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>В отличие от этого, обычная система RAG может упустить ключевые детали из-за ограниченного поиска за один проход, что может привести к <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">галлюцинациям</a> или неточным ответам:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher отличается тем, что выполняет глубокий итеративный поиск в импортированных локальных данных. Он регистрирует каждый шаг процесса поиска и в итоге предоставляет полный и унифицированный отчет. Это делает его особенно эффективным для запросов обзорного типа, таких как создание подробных отчетов или обобщение тенденций, а также для сложных запросов, требующих разбиения вопроса на более мелкие подвопросы и агрегирования данных с помощью нескольких циклов обратной связи.</p>
<p>В следующем разделе мы сравним DeepSearcher с другими системами RAG, изучим, как его итеративный подход и гибкая интеграция моделей сочетаются с традиционными методами.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Количественное сравнение: DeepSearcher против традиционных RAG<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>В репозитории DeepSearcher на GitHub мы разместили код для количественного тестирования. Для этого анализа мы использовали популярный набор данных 2WikiMultiHopQA. (Примечание: мы оценивали только первые 50 записей, чтобы не тратить токены API, но общие тенденции остаются очевидными).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Сравнение коэффициента запоминания</h3><p>Как показано на рисунке 4, показатель запоминания значительно улучшается по мере увеличения количества максимальных итераций:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 4: Максимальное количество итераций против коэффициента запоминания</em></p>
<p>После определенного момента маргинальные улучшения сходят на нет, поэтому по умолчанию мы обычно устанавливаем 3 итерации, хотя этот параметр может быть изменен в зависимости от конкретных потребностей.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Анализ потребления токенов</h3><p>Мы также измерили общее потребление токенов для 50 запросов с разным количеством итераций:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 5: Максимальное количество итераций в сравнении с использованием токенов</em></p>
<p>Результаты показывают, что потребление токенов линейно возрастает с увеличением числа итераций. Например, при 4 итерациях DeepSearcher потребляет примерно 0,3 М токенов. Используя грубую оценку, основанную на цене OpenAI gpt-4o-mini в <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn><mi>60/1Moutputtokens</mi><mo separator="true">,</mo><mi>что соответствует средней стоимости</mi><mi>около</mi><mi>0</mi></mrow><annotation encoding="application/x-tex">,60/1M выходных токенов, это соответствует средней стоимости около</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1Moutputtokens</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">что соответствует средней стоимости</span><span class="mord mathnormal">около</span><span class="mord mathnormal">0</span></span></span></span>,0036 за запрос (или около $0,18 за 50 запросов).</p>
<p>Для более ресурсоемких моделей выводов затраты будут в несколько раз выше из-за более высокой цены за токен и более крупных выходов токенов.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Сравнение производительности моделей</h3><p>Существенным преимуществом DeepSearcher является гибкость в переключении между различными моделями. Мы протестировали различные модели с выводом и модели без вывода (например, gpt-4o-mini). В целом, модели вывода - особенно Claude 3.7 Sonnet - показали наилучшие результаты, хотя разница не была значительной.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 6: Средний показатель Recall в зависимости от модели</em></p>
<p>Примечательно, что некоторые небольшие неинферентные модели иногда не могли завершить полный процесс запроса агента из-за своей ограниченной способности следовать инструкциям, что является общей проблемой для многих разработчиков, работающих с подобными системами.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) против Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> также способен обрабатывать сложные запросы, в частности многоходовые. В чем же тогда разница между DeepSearcher (Agentic RAG) и Graph RAG?</p>
<p>Graph RAG предназначен для запросов к документам на основе явных реляционных связей, что делает его особенно сильным в многоходовых запросах. Например, при обработке длинного романа Graph RAG может точно определить сложные отношения между персонажами. Однако этот метод требует значительного использования маркеров при импорте данных для определения этих связей, а его режим запросов имеет тенденцию быть жестким - как правило, он эффективен только для запросов с одной связью.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок 7: Graph RAG в сравнении с DeepSearcher</em></p>
<p>В отличие от этого, агентный RAG, примером которого является DeepSearcher, использует принципиально иной подход. Он минимизирует потребление маркеров при импорте данных и вместо этого вкладывает вычислительные ресурсы в обработку запросов. Такой выбор дизайна создает важные технические компромиссы:</p>
<ol>
<li><p>Более низкие первоначальные затраты: DeepSearcher требует меньше предварительной обработки документов, что делает первоначальную настройку более быстрой и менее дорогостоящей.</p></li>
<li><p>Динамическая обработка запросов: Система может корректировать свою стратегию поиска на лету, основываясь на промежуточных результатах.</p></li>
<li><p>Более высокая стоимость каждого запроса: Каждый запрос требует больше вычислений, чем Graph RAG, но обеспечивает более гибкие результаты.</p></li>
</ol>
<p>Для разработчиков это различие имеет решающее значение при проектировании систем с различными моделями использования. Graph RAG может быть более эффективным для приложений с предсказуемыми шаблонами запросов и большим объемом запросов, в то время как подход DeepSearcher превосходит его в сценариях, требующих гибкости и обработки непредсказуемых, сложных запросов.</p>
<p>В перспективе, по мере снижения стоимости LLM и дальнейшего повышения производительности вычислений, агентные системы RAG, подобные DeepSearcher, вероятно, станут более распространенными. Недостаток вычислительных затрат уменьшится, а преимущество в гибкости сохранится.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher в сравнении с Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>В отличие от Deep Research от OpenAI, DeepSearcher специально разработан для глубокого поиска и анализа конфиденциальных данных. Используя векторную базу данных, DeepSearcher может получать данные из разных источников, интегрировать различные типы данных и хранить их в едином векторном хранилище знаний. Надежные возможности семантического поиска позволяют ему эффективно искать в огромных объемах автономных данных.</p>
<p>Кроме того, DeepSearcher имеет полностью открытый исходный код. Несмотря на то что Deep Research остается лидером по качеству генерации контента, за его использование взимается ежемесячная плата, а сам он работает как продукт с закрытым исходным кодом, то есть его внутренние процессы скрыты от пользователей. В отличие от этого DeepSearcher обеспечивает полную прозрачность - пользователи могут изучать код, настраивать его под свои нужды и даже развертывать в собственных производственных средах.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Технические выводы<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>В ходе разработки и последующих итераций DeepSearcher мы получили несколько важных технических сведений:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Модели умозаключений: эффективные, но не безошибочные</h3><p>Наши эксперименты показали, что, хотя модели умозаключений хорошо работают в качестве агентов, они иногда чрезмерно анализируют простые инструкции, что приводит к чрезмерному потреблению токенов и замедлению времени отклика. Это наблюдение согласуется с подходом крупных поставщиков ИИ, таких как OpenAI, которые больше не делают различий между моделями, основанными на выводах и не основанными на выводах. Вместо этого сервисы моделей должны автоматически определять необходимость вывода на основе конкретных требований по экономии токенов.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">Неминуемый подъем агентского RAG</h3><p>С точки зрения спроса, глубокая генерация контента очень важна; с технической точки зрения, повышение эффективности RAG также имеет решающее значение. В долгосрочной перспективе основным препятствием для широкого распространения агентских RAG является стоимость. Однако с появлением экономичных и высококачественных LLM, таких как DeepSeek-R1, и снижением стоимости, обусловленным законом Мура, ожидается снижение расходов, связанных с сервисами вывода.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">Скрытый предел масштабирования агентного RAG</h3><p>Важнейший результат нашего исследования касается взаимосвязи между производительностью и вычислительными ресурсами. Изначально мы предположили, что простое увеличение количества итераций и распределение токенов пропорционально улучшит результаты для сложных запросов.</p>
<p>Наши эксперименты выявили более тонкую реальность: хотя производительность улучшается с увеличением числа итераций, мы наблюдали явную убывающую отдачу. А именно:</p>
<ul>
<li><p>Производительность резко возрастала от 1 до 3 итераций</p></li>
<li><p>Улучшения от 3 до 5 итераций были скромными</p></li>
<li><p>После 5 итераций прирост был незначительным, несмотря на значительное увеличение потребления токенов.</p></li>
</ul>
<p>Этот вывод имеет важное значение для разработчиков: простое увеличение вычислительных ресурсов в системах RAG - не самый эффективный подход. Качество стратегии поиска, логики декомпозиции и процесса синтеза зачастую имеет большее значение, чем количество итераций. Это говорит о том, что разработчикам следует сосредоточиться на оптимизации этих компонентов, а не просто увеличивать бюджеты на токены.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">Эволюция за пределы традиционной RAG</h3><p>Традиционная RAG обеспечивает высокую эффективность за счет своей дешевизны и однократного поиска, что делает ее подходящей для простых сценариев ответа на вопросы. Однако его недостатки становятся очевидными при обработке запросов со сложной неявной логикой.</p>
<p>Рассмотрим запрос пользователя типа "Как заработать 100 миллионов за год". Традиционная система RAG может получить информацию о высокооплачиваемых профессиях или инвестиционных стратегиях, но не сможет:</p>
<ol>
<li><p>выявить нереалистичные ожидания в запросе</p></li>
<li><p>Разбить проблему на выполнимые подцели</p></li>
<li><p>Синтезировать информацию из нескольких областей (бизнес, финансы, предпринимательство).</p></li>
<li><p>Представить структурированный, многоходовый подход с реалистичными сроками.</p></li>
</ol>
<p>Именно здесь агентские системы RAG, такие как DeepSearcher, демонстрируют свою силу. Декомпозируя сложные запросы и применяя многоступенчатые рассуждения, они могут предоставлять тонкие, комплексные ответы, которые лучше удовлетворяют основные информационные потребности пользователя. По мере повышения эффективности этих систем мы ожидаем ускорения их внедрения в корпоративные приложения.</p>
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
    </button></h2><p>DeepSearcher представляет собой значительную эволюцию в проектировании систем RAG, предлагая разработчикам мощную основу для создания более сложных поисковых и исследовательских возможностей. К его ключевым техническим преимуществам относятся:</p>
<ol>
<li><p>Итеративное рассуждение: Возможность разбивать сложные запросы на логические подэтапы и постепенно получать исчерпывающие ответы.</p></li>
<li><p>Гибкая архитектура: Поддержка замены базовых моделей и настройка процесса рассуждений в соответствии с конкретными потребностями приложения.</p></li>
<li><p>Интеграция с базами данных Vector: Бесшовное подключение к Milvus для эффективного хранения и извлечения векторных вкраплений из частных источников данных</p></li>
<li><p>Прозрачное выполнение: Подробное протоколирование каждого шага рассуждений, позволяющее разработчикам отлаживать и оптимизировать поведение системы.</p></li>
</ol>
<p>Наше тестирование производительности подтверждает, что DeepSearcher обеспечивает превосходные результаты для сложных запросов по сравнению с традиционными подходами RAG, хотя и с явным компромиссом в вычислительной эффективности. Оптимальная конфигурация (обычно около 3 итераций) позволяет сбалансировать точность и потребление ресурсов.</p>
<p>По мере того как стоимость LLM будет снижаться, а возможности рассуждений улучшаться, агентный подход RAG, реализованный в DeepSearcher, будет становиться все более практичным для производственных приложений. Для разработчиков, работающих над корпоративным поиском, помощниками исследователей или системами управления знаниями, DeepSearcher предлагает мощную основу с открытым исходным кодом, которая может быть адаптирована к конкретным требованиям области.</p>
<p>Мы приветствуем вклад сообщества разработчиков и приглашаем вас изучить эту новую парадигму реализации RAG, заглянув в наш <a href="https://github.com/zilliztech/deep-searcher">репозиторий на GitHub</a>.</p>
