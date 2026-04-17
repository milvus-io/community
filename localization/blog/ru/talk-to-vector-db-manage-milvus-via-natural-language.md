---
id: talk-to-your-vector-database-managing-milvus-via-natural-language.md
title: >-
  Поговорите с вашей базой данных векторов: Управление Milvus с помощью
  естественного языка
author: Lawrence Luo
date: 2025-08-01T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Aug_2_2025_01_17_45_PM_9c50d607bb.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, MCP'
meta_title: |
  Talk to Your Vector Database: Managing Milvus via Natural Language
desc: >-
  Milvus MCP Server соединяет Milvus напрямую с помощниками по кодированию с
  искусственным интеллектом, такими как Claude Code и Cursor, через MCP. Вы
  можете управлять Milvus с помощью естественного языка.
origin: >-
  https://milvus.io/blog/talk-to-your-vector-database-managing-milvus-via-natural-language.md
---
<p>Вы когда-нибудь хотели, чтобы ваш помощник по искусственному интеллекту мог просто сказать: <em>"Покажите мне все коллекции в моей векторной базе данных"</em> или <em>"Найдите документы, похожие на этот текст"</em>, и чтобы он действительно работал?</p>
<p><a href="http://github.com/zilliztech/mcp-server-milvus"><strong>Milvus MCP Server</strong></a> делает это возможным, подключая вашу векторную базу данных Milvus непосредственно к помощникам по кодированию ИИ, таким как Claude Desktop и Cursor IDE, через протокол Model Context Protocol (MCP). Вместо того чтобы писать код <code translate="no">pymilvus</code>, вы можете управлять всем Milvus с помощью разговоров на естественном языке.</p>
<ul>
<li><p>Без Milvus MCP Server: Написание скриптов Python с помощью pymilvus SDK для поиска векторов</p></li>
<li><p>С Milvus MCP Server: "Найти документы, похожие на этот текст, в моей коллекции".</p></li>
</ul>
<p>👉 <strong>Репозиторий GitHub:</strong><a href="https://github.com/zilliztech/mcp-server-milvus"> github.com/zilliztech/mcp-server-milvus</a></p>
<p>Если вы используете <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (управляемый Milvus), мы тоже позаботимся о вас. В конце этого блога мы также представим <strong>Zilliz MCP Server</strong>, управляемый вариант, который работает без проблем с Zilliz Cloud. Давайте погрузимся в процесс.</p>
<h2 id="What-Youll-Get-with-Milvus-MCP-Server" class="common-anchor-header">Что вы получите с Milvus MCP Server<button data-href="#What-Youll-Get-with-Milvus-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus MCP Server предоставляет вашему ИИ-ассистенту следующие возможности:</p>
<ul>
<li><p><strong>Составление списка и изучение</strong> коллекций векторов</p></li>
<li><p><strong>Поиск векторов</strong> с использованием семантического сходства</p></li>
<li><p><strong>Создание новых коллекций</strong> с помощью пользовательских схем</p></li>
<li><p><strong>Вставка и управление</strong> векторными данными</p></li>
<li><p><strong>Выполнение сложных запросов</strong> без написания кода</p></li>
<li><p>И многое другое</p></li>
</ul>
<p>И все это с помощью естественного общения, как будто вы разговариваете с экспертом по базам данных. Полный список возможностей смотрите в <a href="https://github.com/zilliztech/mcp-server-milvus?tab=readme-ov-file#available-tools">этом репозитории</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/demo_adedb25430.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Quick-Start-Guide" class="common-anchor-header">Руководство по быстрому запуску<button data-href="#Quick-Start-Guide" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><p><strong>Требуется:</strong></p>
<ul>
<li><p>Python 3.10 или выше</p></li>
<li><p>Работающий экземпляр Milvus (локальный или удаленный)</p></li>
<li><p><a href="https://github.com/astral-sh/uv">менеджер пакетов uv</a> (рекомендуется)</p></li>
</ul>
<p><strong>Поддерживаемые приложения ИИ:</strong></p>
<ul>
<li><p>Claude Desktop</p></li>
<li><p>Cursor IDE</p></li>
<li><p>Любое MCP-совместимое приложение</p></li>
</ul>
<h3 id="Tech-Stack-We’ll-Use" class="common-anchor-header">Технологический стек, который мы будем использовать</h3><p>В этом уроке мы будем использовать следующий технологический стек:</p>
<ul>
<li><p><strong>Язык выполнения:</strong> <a href="https://www.python.org/">Python 3.11</a></p></li>
<li><p><strong>Менеджер пакетов:</strong> UV</p></li>
<li><p><strong>IDE:</strong> Cursor</p></li>
<li><p><strong>MCP-сервер:</strong> mcp-server-milvus</p></li>
<li><p><strong>LLM:</strong> Claude 3.7</p></li>
<li><p><strong>База данных векторов:</strong> Milvus</p></li>
</ul>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Шаг 1: Установка зависимостей</h3><p>Сначала установите менеджер пакетов uv:</p>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<p>Или:</p>
<pre><code translate="no">pip3 install uv -i <span class="hljs-attr">https</span>:<span class="hljs-comment">//mirrors.aliyun.com/pypi/simple</span>
<button class="copy-code-btn"></button></code></pre>
<p>Проверьте установку:</p>
<pre><code translate="no">uv --version
uvx --version
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_1_Install_Dependencies_3e452c55e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Milvus" class="common-anchor-header">Шаг 2: Установка Milvus</h3><p><a href="https://milvus.io/">Milvus</a> - это векторная база данных с открытым исходным кодом, созданная компанией <a href="https://zilliz.com/">Zilliz</a> для рабочих нагрузок искусственного интеллекта. Разработанная для работы с миллионами и миллиардами векторных записей, она набрала более 36 000 звезд на GitHub. Опираясь на эту основу, Zilliz также предлагает <a href="https://zilliz.com/cloud">Zilliz Cloud -</a>полностью управляемый сервис Milvus, разработанный для удобства использования, экономичности и безопасности с облачной нативной архитектурой.</p>
<p>Требования к развертыванию Milvus можно найти в <a href="https://milvus.io/docs/prerequisite-docker.md">этом руководстве на сайте doc</a>.</p>
<p><strong>Минимальные требования:</strong></p>
<ul>
<li><p><strong>Программное обеспечение:</strong> Docker, Docker Compose</p></li>
<li><p><strong>ОПЕРАТИВНАЯ ПАМЯТЬ:</strong> 16 ГБ+</p></li>
<li><p><strong>Диск:</strong> 100 ГБ+</p></li>
</ul>
<p>Загрузите YAML-файл развертывания:</p>
<pre><code translate="no">[root@Milvus ~]# wget https://github.com/milvus-io/milvus/releases/download/v2.5.4/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Запустите Milvus:</p>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker-compose up -d</span>
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[<span class="hljs-meta">root@Milvus ~</span>]<span class="hljs-meta"># docker ps -a</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_2_Set_Up_Milvus_4826468767.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ваш экземпляр Milvus будет доступен по адресу <code translate="no">http://localhost:19530</code>.</p>
<h3 id="Step-3-Install-the-MCP-Server" class="common-anchor-header">Шаг 3: Установка сервера MCP</h3><p>Клонируйте и протестируйте MCP-сервер:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus

<span class="hljs-comment"># Test the server locally</span>
uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530
<button class="copy-code-btn"></button></code></pre>
<p>Мы рекомендуем установить зависимости и проверить локально, прежде чем регистрировать сервер в Cursor:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.<span class="hljs-property">py</span> --milvus-uri <span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.4.48:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Если вы видите, что сервер успешно запустился, значит, вы готовы к настройке инструмента искусственного интеллекта.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Step_3_Install_the_MCP_Server_9ce01351e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-Your-AI-Assistant" class="common-anchor-header">Шаг 4: Настройка помощника искусственного интеллекта</h3><p><strong>Вариант A: Claude Desktop</strong></p>
<ol>
<li><h4 id="Install-Claude-Desktop-from-claudeaidownloadhttpclaudeaidownload" class="common-anchor-header">Установите Claude Desktop с сайта <code translate="no">[claude.ai/download](http://claude.ai/download)</code>.</h4></li>
<li><p>Откройте файл конфигурации:</p></li>
</ol>
<ul>
<li>macOS: <code translate="no">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
<li>Windows: <code translate="no">%APPDATA%\Claude\claude_desktop_config.json</code></li>
</ul>
<p>Добавьте эту конфигурацию:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/path/to/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;src/mcp_server_milvus/server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Перезапустить Claude Desktop</li>
</ol>
<p><strong>Вариант B: Cursor IDE</strong></p>
<ol>
<li><p>Откройте Настройки Курсора → Функции → MCP</p></li>
<li><p>Добавьте новый глобальный MCP-сервер (при этом создается <code translate="no">.cursor/mcp.json</code>).</p></li>
<li><p>Добавьте эту конфигурацию:</p></li>
</ol>
<p>Примечание: Отрегулируйте пути в соответствии с вашей фактической структурой файлов.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus&quot;</span>: {
      <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;/PATH/TO/uv&quot;</span>,
      <span class="hljs-string">&quot;args&quot;</span>: [
        <span class="hljs-string">&quot;--directory&quot;</span>,
        <span class="hljs-string">&quot;/path/to/mcp-server-milvus/src/mcp_server_milvus&quot;</span>,
        <span class="hljs-string">&quot;run&quot;</span>,
        <span class="hljs-string">&quot;server.py&quot;</span>,
        <span class="hljs-string">&quot;--milvus-uri&quot;</span>,
        <span class="hljs-string">&quot;http://127.0.0.1:19530&quot;</span>
      ]
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Option_B_Cursor_IDE_cd1321ea25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Параметры:</strong></p>
<ul>
<li><code translate="no">/PATH/TO/uv</code> путь к исполняемому файлу uv</li>
<li><code translate="no">--directory</code> путь к клонированному проекту</li>
<li><code translate="no">--milvus-uri</code> конечная точка вашего сервера Milvus</li>
</ul>
<ol start="4">
<li>Перезапустите курсор или перезагрузите окно</li>
</ol>
<p><strong>Совет:</strong> найдите путь к <code translate="no">uv</code> с помощью <code translate="no">which uv</code> на macOS/Linux или <code translate="no">where uv</code> на Windows.</p>
<h3 id="Step-5-See-It-in-Action" class="common-anchor-header">Шаг 5: Увидеть в действии</h3><p>После настройки попробуйте выполнить эти команды на естественном языке:</p>
<ul>
<li><p><strong>Изучите свою базу данных:</strong> "Какие коллекции есть в моей базе данных Milvus?".</p></li>
<li><p><strong>Создайте новую коллекцию:</strong> "Создайте коллекцию "Статьи" с полями для заголовка (строка), содержимого (строка) и векторным полем 768 измерений для вкраплений".</p></li>
<li><p><strong>Поиск похожего контента:</strong> "Найти пять наиболее похожих статей на "Приложения машинного обучения" в моей коллекции статей".</p></li>
<li><p><strong>Вставить данные:</strong> "Добавить новую статью с заголовком "AI Trends 2024" и содержанием "Искусственный интеллект продолжает развиваться..." в коллекцию статей".</p></li>
</ul>
<p><strong>То, что раньше требовало 30 с лишним минут кодирования, теперь занимает считанные секунды.</strong></p>
<p>Вы получаете контроль в реальном времени и доступ к Milvus на естественном языке без написания шаблонов или изучения API.</p>
<h2 id="Troubleshooting" class="common-anchor-header">Устранение неполадок<button data-href="#Troubleshooting" class="anchor-icon" translate="no">
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
    </button></h2><p>Если инструменты MCP не появляются, полностью перезапустите приложение искусственного интеллекта, проверьте путь UV с помощью <code translate="no">which uv</code>, а также протестируйте сервер вручную с помощью <code translate="no">uv run src/mcp_server_milvus/server.py --milvus-uri http://localhost:19530</code>.</p>
<p>При ошибках подключения проверьте, запущен ли Milvus с помощью <code translate="no">docker ps | grep milvus</code>, попробуйте использовать <code translate="no">127.0.0.1</code> вместо <code translate="no">localhost</code> и убедитесь, что порт 19530 доступен.</p>
<p>Если вы столкнулись с проблемами аутентификации, установите переменную окружения <code translate="no">MILVUS_TOKEN</code>, если ваш Milvus требует аутентификации, и проверьте права доступа для операций, которые вы пытаетесь выполнить.</p>
<h2 id="Managed-Alternative-Zilliz-MCP-Server" class="common-anchor-header">Управляемая альтернатива: Zilliz MCP Server<button data-href="#Managed-Alternative-Zilliz-MCP-Server" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Сервер Milvus MCP Server</strong> с открытым исходным кодом - отличное решение для локального или самостоятельного развертывания Milvus. Но если вы используете <a href="https://zilliz.com/cloud">Zilliz Cloud -</a>полностью управляемый сервис корпоративного уровня, созданный создателями Milvus, - существует специально разработанная альтернатива: <a href="https://zilliz.com/blog/introducing-zilliz-mcp-server"><strong>Zilliz MCP Server</strong></a>.</p>
<p><a href="https://zilliz.com/cloud">Zilliz Cloud</a> избавляет вас от необходимости управлять собственным экземпляром Milvus, предлагая масштабируемую, производительную и безопасную облачную векторную базу данных. <strong>Zilliz MCP Server</strong> интегрируется непосредственно с Zilliz Cloud и предоставляет свои возможности в виде MCP-совместимых инструментов. Это означает, что ваш помощник по искусственному интеллекту - будь то Claude, Cursor или другая среда с поддержкой MCP - теперь может запрашивать, управлять и организовывать рабочее пространство Zilliz Cloud, используя естественный язык.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_mcp_abe1ca1271.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Никакого шаблонного кода. Никаких переключений между вкладками. Не нужно вручную писать вызовы REST или SDK. Просто скажите свой запрос, а остальное пусть сделает ваш помощник.</p>
<h3 id="🚀-Getting-Started-with-Zilliz-MCP-Server" class="common-anchor-header">🚀 Начало работы с Zilliz MCP Server</h3><p>Если вы готовы к созданию готовой к производству векторной инфраструктуры с помощью естественного языка, начать работу можно всего за несколько шагов:</p>
<ol>
<li><p><a href="https://cloud.zilliz.com/signup"><strong>Зарегистрируйтесь в Zilliz Cloud</strong></a> - доступен бесплатный уровень.</p></li>
<li><p><a href="http://github.com/zilliztech/zilliz-mcp-server"><strong>Установите Zilliz MCP Server</strong> из </a>репозитория GitHub.</p></li>
<li><p><strong>Настройте ваш MCP-совместимый помощник</strong> (Claude, Cursor и т. д.) на подключение к экземпляру Zilliz Cloud.</p></li>
</ol>
<p>Таким образом, вы получаете лучшее из двух миров: мощный векторный поиск с инфраструктурой производственного уровня, теперь доступный на простом английском языке.</p>
<h2 id="Wrapping-Up" class="common-anchor-header">Подведение итогов<button data-href="#Wrapping-Up" class="anchor-icon" translate="no">
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
    </button></h2><p>Вот и все - вы только что узнали, как превратить Milvus в векторную базу данных на естественном языке, с которой можно буквально <em>разговаривать</em>. Больше не нужно копаться в SDK-документации или писать шаблоны, чтобы создать коллекцию или запустить поиск.</p>
<p>Независимо от того, работаете ли вы с Milvus локально или используете Zilliz Cloud, MCP Server дает вашему помощнику ИИ набор инструментов для управления векторными данными как профессионалу. Просто введите нужные действия, а Claude или Cursor сделают все остальное.</p>
<p>Так что вперед - запустите свой инструмент разработки ИИ, спросите "Какие коллекции у меня есть?" и посмотрите на него в действии. Вы никогда не захотите возвращаться к написанию векторных запросов вручную.</p>
<ul>
<li><p>Локальная установка? Используйте<a href="https://github.com/zilliztech/mcp-server-milvus"> сервер Milvus MCP Server</a> с открытым исходным кодом.</p></li>
<li><p>Предпочитаете управляемый сервис? Подпишитесь на Zilliz Cloud и используйте<a href="https://github.com/zilliztech/zilliz-mcp-server"> Zilliz MCP Server</a>.</p></li>
</ul>
<p>У вас есть инструменты. Теперь пусть ваш искусственный интеллект набирает текст.</p>
