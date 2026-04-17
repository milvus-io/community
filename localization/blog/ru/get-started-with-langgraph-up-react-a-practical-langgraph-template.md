---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Начало работы с langgraph-up-react: Практический шаблон LangGraph'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  Представляем langgraph-up-react, готовый к использованию шаблон LangGraph +
  ReAct для агентов ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>ИИ-агенты становятся основной моделью прикладного ИИ. Все больше проектов переходят от единичных подсказок и подключают модели к циклам принятия решений. Это интересно, но это также означает управление состоянием, координацию инструментов, обработку ветвлений и добавление человеческих команд - вещи, которые не сразу очевидны.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> - отличный выбор для этого слоя. Это фреймворк для ИИ, который обеспечивает циклы, условия, постоянство, управление "человек в цикле" и потоковую передачу - достаточно структуры, чтобы превратить идею в настоящее мультиагентное приложение. Однако LangGraph имеет крутую кривую обучения. Документация по нему готовится быстро, к абстракциям нужно время, чтобы привыкнуть, а переход от простой демонстрации к чему-то, что похоже на продукт, может разочаровать.</p>
<p>Недавно я начал использовать <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react -</strong></a>готовый к использованию шаблон LangGraph + ReAct для агентов ReAct. Он сокращает настройки, поставляется с разумными настройками по умолчанию и позволяет сосредоточиться на поведении, а не на шаблонах. В этом посте я расскажу, как начать работу с LangGraph, используя этот шаблон.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Понимание агентов ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем погрузиться в сам шаблон, стоит рассмотреть тип агента, который мы будем создавать. Одним из наиболее распространенных шаблонов на сегодняшний день является фреймворк <strong>ReAct (Reason + Act)</strong>, впервые представленный в документе Google 2022 года <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>Идея проста: вместо того чтобы рассматривать рассуждения и действия отдельно, ReAct объединяет их в цикл обратной связи, который очень похож на решение проблем человеком. Агент <strong>рассуждает</strong> о проблеме, <strong>действует</strong>, вызывая инструмент или API, а затем <strong>наблюдает за</strong> результатом, прежде чем решить, что делать дальше. Этот простой цикл - рассуждать → действовать → наблюдать - позволяет агентам динамически адаптироваться, а не следовать фиксированному сценарию.</p>
<p>Вот как эти части сочетаются друг с другом:</p>
<ul>
<li><p><strong>Разум</strong>: Модель разбивает проблемы на шаги, планирует стратегии и даже может исправлять ошибки на полпути.</p></li>
<li><p><strong>Действуйте</strong>: Основываясь на своих рассуждениях, агент вызывает инструменты - поисковую систему, калькулятор или ваш собственный API.</p></li>
<li><p><strong>Наблюдение</strong>: Агент просматривает результаты работы инструмента, фильтрует их и использует в следующем цикле рассуждений.</p></li>
</ul>
<p>Этот цикл быстро стал основой современных агентов ИИ. Вы можете увидеть его следы в плагинах ChatGPT, конвейерах RAG, интеллектуальных помощниках и даже робототехнике. В нашем случае это фундамент, на котором строится шаблон <code translate="no">langgraph-up-react</code>.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Понимание LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда мы рассмотрели паттерн ReAct, возникает следующий вопрос: как реализовать нечто подобное на практике? Из коробки большинство языковых моделей не очень хорошо справляются с многошаговыми рассуждениями. Каждый вызов не имеет состояния: модель генерирует ответ и забывает обо всем, как только закончит. Это затрудняет перенос промежуточных результатов или корректировку последующих шагов на основе предыдущих.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> устраняет этот пробел. Вместо того чтобы рассматривать каждую подсказку как одноразовую, он дает вам возможность разбить сложные задачи на шаги, запомнить, что произошло в каждой точке, и решить, что делать дальше, исходя из текущего состояния. Другими словами, это превращает процесс рассуждений агента в нечто структурированное и повторяющееся, а не в цепочку случайных подсказок.</p>
<p>Можно представить это как <strong>блок-схему рассуждений ИИ</strong>:</p>
<ul>
<li><p><strong>Анализ</strong> запроса пользователя</p></li>
<li><p><strong>Выбор</strong> подходящего инструмента для работы</p></li>
<li><p><strong>Выполнить</strong> задачу, вызвав инструмент</p></li>
<li><p><strong>Обработка</strong> результатов</p></li>
<li><p><strong>Проверьте</strong>, выполнено ли задание; если нет, вернитесь назад и продолжите рассуждения.</p></li>
<li><p><strong>Вывести</strong> окончательный ответ</p></li>
</ul>
<p>Попутно LangGraph обрабатывает <strong>память</strong>, чтобы не потерять результаты предыдущих шагов, и интегрируется с <strong>внешней библиотекой инструментов</strong> (API, базы данных, поиск, калькуляторы, файловые системы и т. д.).</p>
<p>Именно поэтому он называется <em>LangGraph</em>: <strong>Lang (язык) + Graph -</strong>фреймворк для организации того, как языковые модели думают и действуют во времени.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Понимание langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph - мощный инструмент, но он связан с большими расходами. Настройка управления состояниями, проектирование узлов и ребер, обработка ошибок, подключение моделей и инструментов - все это требует времени. Отладка многоступенчатых потоков также может быть болезненной - когда что-то ломается, проблема может быть в любом узле или переходе. По мере роста проекта даже небольшие изменения могут распространяться по кодовой базе и замедлять работу.</p>
<p>Именно здесь зрелый шаблон имеет огромное значение. Вместо того чтобы начинать с нуля, шаблон дает вам проверенную структуру, готовые инструменты и скрипты, которые просто работают. Вы пропускаете шаблоны и сосредотачиваетесь непосредственно на логике агента.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> - один из таких шаблонов. Он разработан, чтобы помочь вам быстро создать агента LangGraph ReAct, с:</p>
<ul>
<li><p>🔧 <strong>Встроенная экосистема инструментов</strong>: адаптеры и утилиты, готовые к использованию из коробки</p></li>
<li><p>⚡ <strong>Быстрый старт</strong>: простая настройка и работающий агент за несколько минут</p></li>
<li><p>🧪 <strong>Тестирование включено</strong>: модульные тесты и интеграционные тесты для уверенности при расширении</p></li>
<li><p>📦 <strong>Готовая к производству установка</strong>: архитектурные шаблоны и скрипты, которые экономят время при развертывании.</p></li>
</ul>
<p>Короче говоря, он берет на себя все заботы, чтобы вы могли сосредоточиться на создании агентов, которые действительно решают ваши бизнес-задачи.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Начало работы с шаблоном langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Запуск шаблона очень прост. Вот пошаговый процесс установки:</p>
<ol>
<li>Установите зависимости окружения</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Клонировать проект</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Установить зависимости</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Настроить окружение</li>
</ol>
<p>Скопируйте пример конфига и добавьте свои ключи:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Отредактируйте .env и установите по крайней мере один провайдер модели плюс свой ключ Tavily API:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Запустите проект</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Теперь ваш dev-сервер будет запущен и готов к тестированию.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">Что можно построить с помощью langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Итак, что же вы можете сделать, когда шаблон запущен и работает? Вот два конкретных примера, которые показывают, как его можно применить в реальных проектах.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">База знаний предприятия в вопросах и ответах (Agentic RAG)</h3><p>Распространенным вариантом использования является внутренний помощник по вопросам и ответам для знаний компании. Вспомните руководства по продуктам, технические документы, часто задаваемые вопросы - полезная, но разрозненная информация. С помощью <code translate="no">langgraph-up-react</code> вы можете создать агента, который будет индексировать эти документы в векторной базе данных <a href="https://milvus.io/"><strong>Milvus</strong></a>, извлекать наиболее важные фрагменты и генерировать точные ответы, основанные на контексте.</p>
<p>Для развертывания Milvus предлагает гибкие варианты: <strong>Lite</strong> для быстрого создания прототипов, <strong>Standalone</strong> для средних производственных нагрузок и <strong>Distributed</strong> для систем масштаба предприятия. Вам также потребуется настроить параметры индекса (например, HNSW), чтобы сбалансировать скорость и точность, и настроить мониторинг задержки и отзыва, чтобы система оставалась надежной под нагрузкой.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Многоагентное взаимодействие</h3><p>Еще один мощный вариант использования - совместная работа нескольких агентов. Вместо того чтобы один агент пытался делать все, вы определяете несколько специализированных агентов, которые работают вместе. Например, в рабочем процессе разработки программного обеспечения агент менеджера по продукту определяет требования, агент архитектора разрабатывает проект, агент разработчика пишет код, а агент тестирования проверяет результаты.</p>
<p>Такая оркестровка подчеркивает сильные стороны LangGraph - управление состоянием, ветвление и координацию между агентами. Мы рассмотрим эту схему более подробно в одной из следующих статей, но главное заключается в том, что <code translate="no">langgraph-up-react</code> позволяет опробовать эти паттерны, не тратя недели на создание лесов.</p>
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
    </button></h2><p>Создание надежных агентов - это не только умные подсказки, но и структурирование рассуждений, управление состоянием и объединение всего этого в систему, которую можно поддерживать. LangGraph дает вам основу для этого, а <code translate="no">langgraph-up-react</code> снижает барьер, обрабатывая кодовую таблицу, чтобы вы могли сосредоточиться на поведении агента.</p>
<p>С помощью этого шаблона вы можете запускать такие проекты, как базы знаний, системы вопросов и ответов или мультиагентные рабочие процессы, не теряясь в настройках. Это отправная точка, которая экономит время, позволяет избежать распространенных подводных камней и делает эксперименты с LangGraph гораздо более плавными.</p>
<p>В следующем посте я углублюсь в практическое руководство и покажу шаг за шагом, как расширить шаблон и создать работающего агента для реального случая использования, используя LangGraph, <code translate="no">langgraph-up-react</code> и векторную базу данных Milvus. Оставайтесь с нами.</p>
