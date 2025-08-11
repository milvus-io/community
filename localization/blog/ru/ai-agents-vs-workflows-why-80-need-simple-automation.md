---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  Агенты ИИ или рабочие процессы? Почему вам следует отказаться от использования
  агентов в 80 % задач автоматизации
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  Интеграция Refly и Milvus предлагает прагматичный подход к автоматизации -
  надежность и простота использования важнее излишней сложности.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>ИИ-агенты сейчас повсюду - от вторых пилотов в кодировании до ботов в службе поддержки клиентов - и они могут быть потрясающе хороши в сложных рассуждениях. Как и многие из вас, я люблю их. Но, создавая агентов и автоматизированные рабочие процессы, я понял одну простую истину: <strong>агенты не являются лучшим решением для всех проблем.</strong></p>
<p>Например, когда я создавал мультиагентную систему с CrewAI для декодирования ML, все быстро пошло наперекосяк. Исследовательские агенты игнорировали веб-краулеры в 70 % случаев. Агенты, составляющие сводки, отбрасывали цитаты. Координация разваливалась всякий раз, когда задачи не были кристально ясными.</p>
<p>И это не только в экспериментах. Многие из нас уже перескакивают между ChatGPT для мозгового штурма, Claude для кодирования и полудюжиной API для обработки данных, тихо думая: <em>должен быть лучший способ заставить все это работать вместе.</em></p>
<p>Иногда ответ находится в виде агента. Чаще всего это <strong>хорошо продуманный рабочий процесс ИИ</strong>, который объединяет ваши существующие инструменты в нечто мощное, но без непредсказуемых сложностей.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Создание более разумных рабочих процессов ИИ с помощью Refly и Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Я знаю, что некоторые из вас уже качают головой: "Рабочие процессы? Они негибкие. Они недостаточно умны для настоящей автоматизации ИИ". Справедливое замечание - большинство рабочих процессов негибкие, потому что они созданы по образцу старых сборочных линий: шаг A → шаг B → шаг C, никаких отклонений.</p>
<p>Но на самом деле проблема заключается не <em>в идее</em> рабочих процессов, а в их <em>исполнении</em>. Нам не нужно довольствоваться хрупкими линейными конвейерами. Мы можем разработать более интеллектуальные рабочие процессы, которые адаптируются к контексту, гибко реагируют на творческие изменения и при этом дают предсказуемые результаты.</p>
<p>В этом руководстве мы построим полную систему создания контента с помощью Refly и Milvus, чтобы показать, почему рабочие процессы с искусственным интеллектом могут превзойти сложные многоагентные архитектуры, особенно если вам важны скорость, надежность и ремонтопригодность.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Инструменты, которые мы используем</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Платформа для создания контента с открытым исходным кодом, основанная на искусственном интеллекте и построенная на концепции "свободного холста".</p>
<ul>
<li><p><strong>Основные возможности:</strong> интеллектуальный холст, управление знаниями, многопоточный диалог и профессиональные инструменты создания.</p></li>
<li><p><strong>Почему это полезно:</strong> Построение рабочих процессов с помощью перетаскивания позволяет объединять инструменты в последовательности автоматизации, не ограничиваясь жестким однопутевым исполнением.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: Векторная база данных с открытым исходным кодом, работающая на уровне данных.</p>
<ul>
<li><p><strong>Почему это важно:</strong> Создание контента - это в основном поиск и перекомбинирование существующей информации. Традиционные базы данных хорошо справляются со структурированными данными, но большинство творческих работ связано с неструктурированными форматами - документами, изображениями, видео.</p></li>
<li><p><strong>Что это дает:</strong> Milvus использует интегрированные модели встраивания для кодирования неструктурированных данных в виде векторов, обеспечивая семантический поиск, благодаря чему рабочие процессы могут извлекать релевантный контекст с задержкой в миллисекунды. Благодаря таким протоколам, как MCP, он легко интегрируется с вашими системами искусственного интеллекта, позволяя вам запрашивать данные на естественном языке, а не бороться с синтаксисом баз данных.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Настройка среды</h3><p>Позвольте мне рассказать вам о том, как настроить этот рабочий процесс на локальном уровне.</p>
<p><strong>Быстрый список настроек:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (или аналогичный Linux)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>API-ключ от любого LLM, поддерживающего вызов функций. В данном руководстве я буду использовать LLM <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Системные требования</strong></p>
<ul>
<li><p>ПРОЦЕССОР: 8 ядер минимум (рекомендуется 16 ядер)</p></li>
<li><p>Память: минимум 16 ГБ (рекомендуется 32 ГБ)</p></li>
<li><p>Хранилище: 100 ГБ SSD минимум (рекомендуется 500 ГБ)</p></li>
<li><p>Сеть: Требуется стабильное подключение к Интернету</p></li>
</ul>
<p><strong>Зависимость от программного обеспечения</strong></p>
<ul>
<li><p>Операционная система: Linux (рекомендуется Ubuntu 20.04+)</p></li>
<li><p>Контейнеризация: Docker + Docker Compose</p></li>
<li><p>Python: Версия 3.11 или выше</p></li>
<li><p>Языковая модель: Любая модель, поддерживающая вызовы функций (работают онлайн-сервисы или офлайн-развертывание Ollama).</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Шаг 1: Развертывание векторной базы данных Milvus</h3><p><strong>1.1 Загрузите Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Запустите службы Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Шаг 2: Развертывание платформы Refly</h3><p><strong>2.1 Клонирование репозитория</strong></p>
<p>Вы можете использовать значения по умолчанию для всех переменных окружения, если у вас нет особых требований:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Проверьте статус службы</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Шаг 3: Настройка служб MCP</h3><p><strong>3.1 Загрузите MCP-сервер Milvus</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Запустите службу MCP</strong></p>
<p>В этом примере используется режим SSE. Замените URI на доступную конечную точку службы Milvus:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Убедитесь, что служба MCP запущена</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Шаг 4: Конфигурация и настройка</h3><p>Теперь, когда ваша инфраструктура запущена, давайте настроим все для бесперебойной работы.</p>
<p><strong>4.1 Доступ к платформе Refly</strong></p>
<p>Перейдите к локальному экземпляру Refly:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Создайте свою учетную запись</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Настройте языковую модель</strong></p>
<p>В этом руководстве мы будем использовать <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. Сначала зарегистрируйтесь и получите ключ API.</p>
<p><strong>4.4 Добавьте поставщика модели</strong></p>
<p>Введите API-ключ, полученный на предыдущем шаге:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Настройте модель LLM</strong></p>
<p>Обязательно выберите модель, поддерживающую возможность вызова функций, так как это необходимо для интеграции рабочих процессов, которые мы будем создавать:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Интеграция сервиса Milvus-MCP</strong></p>
<p>Обратите внимание, что веб-версия не поддерживает соединения типа stdio, поэтому мы будем использовать конечную точку HTTP, которую мы настроили ранее:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Отлично! Когда все настроено, давайте посмотрим на эту систему в действии на нескольких практических примерах.</p>
<p><strong>4.7 Пример: Эффективный поиск векторов с помощью MCP-Milvus-Server</strong></p>
<p>Этот пример показывает, как <strong>MCP-Milvus-Server</strong> работает в качестве промежуточного программного обеспечения между вашими моделями ИИ и экземплярами векторной базы данных Milvus. Он действует как переводчик, принимая запросы на естественном языке от вашей модели ИИ, преобразуя их в правильные запросы к базе данных и возвращая результаты, так что ваши модели могут работать с векторными данными без знания синтаксиса базы данных.</p>
<p><strong>4.7.1 Создайте новый холст</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Начните диалог</strong></p>
<p>Откройте диалоговый интерфейс, выберите модель, введите свой вопрос и отправьте.</p>
<p><strong>4.7.3 Просмотр результатов</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Происходящее здесь весьма примечательно: мы только что продемонстрировали управление векторной базой данных Milvus на естественном языке, используя <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> в качестве интеграционного слоя. Никакого сложного синтаксиса запросов - просто скажите системе, что вам нужно на простом английском языке, и она выполнит все операции с базой данных за вас.</p>
<p><strong>4.8 Пример 2: Создание руководства по развертыванию Refly с помощью рабочих процессов</strong></p>
<p>Этот второй пример демонстрирует реальную силу оркестровки рабочих процессов. Мы создадим полное руководство по развертыванию, объединив несколько инструментов искусственного интеллекта и источников данных в единый, последовательный процесс.</p>
<p><strong>4.8.1 Соберите исходные материалы</strong></p>
<p>Сила Refly заключается в его гибкости при работе с различными форматами исходных данных. Вы можете импортировать ресурсы в различных форматах, будь то документы, изображения или структурированные данные.</p>
<p><strong>4.8.2 Создайте задачи и свяжите карточки ресурсов</strong></p>
<p>Теперь мы создадим наш рабочий процесс, определив задачи и связав их с нашими исходными материалами.</p>
<p><strong>4.8.3 Настройте три задачи обработки</strong></p>
<p>Именно здесь подход к рабочему процессу действительно сияет. Вместо того чтобы пытаться обработать все в одном сложном процессе, мы разбиваем работу на три сфокусированные задачи, которые интегрируют загруженные материалы и систематически их дорабатывают.</p>
<ul>
<li><p><strong>Задача интеграции контента</strong>: Объединяет и структурирует исходные материалы</p></li>
<li><p><strong>Задача по доработке контента</strong>: улучшение ясности и подачи материала</p></li>
<li><p><strong>Составление окончательного варианта</strong>: Создание готового к публикации материала.</p></li>
</ul>
<p>Результаты говорят сами за себя. То, на что ушли бы часы ручной работы с несколькими инструментами, теперь выполняется автоматически, причем каждый шаг логически выстраивается на основе предыдущего.</p>
<p><strong>Возможности мультимодального рабочего процесса:</strong></p>
<ul>
<li><p><strong>Генерация и обработка изображений</strong>: Интеграция с высококачественными моделями, включая flux-schnell, flux-pro и SDXL.</p></li>
<li><p><strong>Создание и понимание видео</strong>: Поддержка различных стилизованных видеомоделей, включая Seedance, Kling и Veo.</p></li>
<li><p><strong>Инструменты для генерации аудио</strong>: Генерация музыки с помощью таких моделей, как Lyria-2, и синтез голоса с помощью таких моделей, как Chatterbox.</p></li>
<li><p><strong>Интегрированная обработка</strong>: Все мультимодальные выходные данные можно ссылать, анализировать и обрабатывать внутри системы.</p></li>
</ul>
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
    </button></h2><p>Интеграция <strong>Refly</strong> и <strong>Milvus</strong> предлагает прагматичный подход к автоматизации - надежность и простота использования важнее излишней сложности. Сочетая оркестровку рабочих процессов с мультимодальной обработкой, команды могут быстрее переходить от концепции к публикации, сохраняя полный контроль на каждом этапе.</p>
<p>Речь не идет о том, чтобы отвергать агентов ИИ. Они полезны для решения действительно сложных и непредсказуемых задач. Но для многих задач автоматизации - особенно при создании контента и обработке данных - хорошо продуманный рабочий процесс может дать лучшие результаты при меньших затратах.</p>
<p>По мере развития технологий ИИ наиболее эффективные системы, скорее всего, будут сочетать в себе обе стратегии:</p>
<ul>
<li><p><strong>Рабочие процессы</strong>, где ключевыми являются предсказуемость, поддерживаемость и воспроизводимость.</p></li>
<li><p><strong>Агенты</strong> - там, где требуются реальные рассуждения, адаптивность и возможность решать проблемы в произвольном порядке.</p></li>
</ul>
<p>Цель состоит не в том, чтобы создать самый яркий ИИ, а в том, чтобы создать самый <em>полезный</em>. И часто самое полезное решение оказывается самым простым.</p>
