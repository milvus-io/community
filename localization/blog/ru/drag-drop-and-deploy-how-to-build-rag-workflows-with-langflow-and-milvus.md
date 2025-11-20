---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: >-
  Перетащить, бросить и развернуть: Как создавать рабочие процессы RAG с помощью
  Langflow и Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/drag_drop_deploy_859c4369e8.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Узнайте, как создавать визуальные рабочие процессы RAG с помощью Langflow и
  Milvus. Перетаскивайте и развертывайте контекстно-ориентированные приложения
  искусственного интеллекта за считанные минуты - кодирование не требуется.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Построение рабочего процесса ИИ часто кажется сложнее, чем должно быть. Написание кода, отладка вызовов API и управление конвейерами данных - этот процесс может занять несколько часов, прежде чем вы увидите результаты. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> и <a href="https://milvus.io/"><strong>Milvus</strong></a> значительно упрощают этот процесс, предоставляя вам легкий способ разработки, тестирования и развертывания рабочих процессов с дополненным поиском (RAG) за минуты, а не за дни.</p>
<p><strong>Langflow</strong> предлагает чистый, перетаскиваемый интерфейс, который больше похож на набросок идей на доске, чем на кодирование. Вы можете визуально соединить языковые модели, источники данных и внешние инструменты, чтобы определить логику рабочего процесса - и все это без единой строчки шаблонного кода.</p>
<p>В сочетании с <strong>Milvus</strong>, векторной базой данных с открытым исходным кодом, которая обеспечивает LLM долговременной памятью и контекстуальным пониманием, эти два компонента образуют полноценную среду для RAG производственного уровня. Milvus эффективно хранит и извлекает вкрапления из данных вашего предприятия или конкретного домена, позволяя LLM генерировать обоснованные, точные и учитывающие контекст ответы.</p>
<p>В этом руководстве мы расскажем, как объединить Langflow и Milvus для создания продвинутого рабочего процесса RAG - и все это с помощью нескольких перетаскиваний, падений и щелчков.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">Что такое Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем приступить к демонстрации RAG, давайте узнаем, что такое Langflow и что он может делать.</p>
<p>Langflow - это фреймворк с открытым исходным кодом на базе Python, который упрощает создание приложений искусственного интеллекта и эксперименты с ними. Он поддерживает такие ключевые возможности ИИ, как агенты и протокол модель-контекст (MCP), предоставляя разработчикам и тем, кто не занимается разработкой, гибкую основу для создания интеллектуальных систем.</p>
<p>В основе Langflow лежит визуальный редактор. Вы можете перетаскивать и соединять различные ресурсы, чтобы создавать полноценные приложения, объединяющие модели, инструменты и источники данных. При экспорте рабочего процесса Langflow автоматически генерирует файл с именем <code translate="no">FLOW_NAME.json</code> на локальном компьютере. В этот файл записываются все узлы, ребра и метаданные, описывающие ваш поток, что позволяет легко контролировать версии, делиться и воспроизводить проекты в разных командах.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>За кулисами поток выполняет механизм выполнения на основе Python. Он управляет LLM, инструментами, модулями поиска и логикой маршрутизации, контролируя поток данных, состояние и обработку ошибок, чтобы обеспечить бесперебойное выполнение от начала до конца.</p>
<p>Langflow также включает богатую библиотеку компонентов с готовыми адаптерами для популярных LLM и векторных баз данных, включая <a href="https://milvus.io/">Milvus</a>. Вы можете расширить эту библиотеку, создавая собственные Python-компоненты для специализированных случаев использования. Для тестирования и оптимизации Langflow предлагает пошаговое выполнение, Playground для быстрого тестирования, а также интеграцию с LangSmith и Langfuse для мониторинга, отладки и воспроизведения рабочих процессов из конца в конец.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Практическая демонстрация: Как построить рабочий процесс RAG с помощью Langflow и Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Опираясь на архитектуру Langflow, Milvus может служить векторной базой данных, которая управляет вкраплениями и извлекает частные данные предприятия или специфические знания домена.</p>
<p>В этой демонстрации мы используем шаблон Langflow Vector Store RAG, чтобы показать, как интегрировать Milvus и создать векторный индекс из локальных данных, что позволит эффективно отвечать на вопросы с учетом контекста.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия：</h3><p>1.Python 3.11 (или Conda)</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4.ключ OpenAI</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Шаг 1. Развертывание векторной базы данных Milvus</h3><p>Скачайте файлы развертывания.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Запустите службу Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Шаг 2. Создание виртуальной среды Python</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Шаг 3. Установите последние пакеты</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Шаг 4. Запуск Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Зайдите на сайт Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Шаг 5. Настройте шаблон RAG</h3><p>Выберите шаблон Vector Store RAG в Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Выберите Milvus в качестве базы данных векторов по умолчанию.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На левой панели найдите "Milvus" и добавьте его в свой поток.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Настройте детали подключения Milvus. Остальные параметры пока оставьте по умолчанию.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Добавьте свой API-ключ OpenAI в соответствующий узел.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Шаг 6. Подготовьте тестовые данные</h3><p>Примечание: В качестве тестовых данных используйте официальный FAQ по Milvus 2.6.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Шаг 7. Первая фаза тестирования</h3><p>Загрузите набор данных и внедрите его в Milvus. Примечание: Langflow затем преобразует текст в векторное представление. Вы должны загрузить не менее двух наборов данных, иначе процесс встраивания будет неудачным. Это известная ошибка в текущей реализации узлов Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Проверьте состояние ваших узлов.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Шаг 8. Вторая фаза тестирования</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Шаг 9. Запуск полного рабочего процесса RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>Создание рабочих процессов ИИ не обязательно должно быть сложным. Langflow + Milvus делают это быстро, наглядно и с минимальным количеством кода - простой способ улучшить RAG без больших инженерных усилий.</p>
<p>Интерфейс Langflow, основанный на принципе drag-and-drop, делает его подходящим выбором для обучения, семинаров или живых демонстраций, где нужно наглядно и интерактивно показать, как работают системы ИИ. Для команд, стремящихся объединить интуитивно понятный дизайн рабочего процесса с векторным поиском корпоративного уровня, сочетание простоты Langflow с высокопроизводительным поиском Milvus обеспечивает гибкость и мощь.</p>
<p>👉 Начните создавать более интеллектуальные рабочие процессы RAG с <a href="https://milvus.io/">Milvus</a> уже сегодня.</p>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете заказать 20-минутную индивидуальную сессию, чтобы получить знания, рекомендации и ответы на свои вопросы в<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
