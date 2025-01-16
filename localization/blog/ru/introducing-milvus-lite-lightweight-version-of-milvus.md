---
id: introducing-milvus-lite-lightweight-version-of-milvus.md
title: 'Представляем Milvus Lite: облегченную версию Milvus'
author: Fendy Feng
date: 2023-05-23T00:00:00.000Z
desc: >-
  Оцените скорость и эффективность Milvus Lite, облегченного варианта знаменитой
  векторной базы данных Milvus для молниеносного поиска сходства.
cover: assets.zilliz.com/introducing_Milvus_Lite_7c0d0a1174.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-lite-lightweight-version-of-milvus.md
---
<p><strong><em>Важное замечание</em></strong></p>
<p><em>В июне 2024 года мы обновили Milvus Lite, благодаря чему разработчики ИИ смогут быстрее создавать приложения, обеспечивая при этом согласованную работу в различных вариантах развертывания, включая Milvus on Kurbernetes, Docker и управляемые облачные сервисы. Milvus Lite также интегрируется с различными фреймворками и технологиями ИИ, упрощая разработку приложений ИИ с возможностями векторного поиска. Для получения дополнительной информации см. следующие ссылки:</em></p>
<ul>
<li><p><em>Блог о запуске Milvus Lite: h<a href="https://milvus.io/blog/introducing-milvus-lite.md">ttps://</a>milvus.io/blog/introducing-milvus-lite.md</em></p></li>
<li><p><em>Документация Milvus Lite: <a href="https://milvus.io/docs/quickstart.md">https://milvus.io/docs/quickstart.md</a></em></p></li>
<li><p><em>Репозиторий Milvus Lite на GitHub: <a href="https://github.com/milvus-io/milvus-lite">https://github.com/milvus-io/milvus-lite</a>.</em></p></li>
</ul>
<p><br></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> - это векторная база данных с открытым исходным кодом, предназначенная для индексации, хранения и запроса векторов встраивания, генерируемых глубокими нейронными сетями и другими моделями машинного обучения (ML) в миллиардных масштабах. Она стала популярным выбором для многих компаний, исследователей и разработчиков, которым необходимо выполнять поиск по сходству в больших наборах данных.</p>
<p>Однако некоторые пользователи могут посчитать полную версию Milvus слишком тяжелой или сложной. Чтобы решить эту проблему, <a href="https://github.com/matrixji">Бин Джи</a>, один из самых активных участников сообщества Milvus, создал <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a>, облегченную версию Milvus.</p>
<h2 id="What-is-Milvus-Lite" class="common-anchor-header">Что такое Milvus Lite?<button data-href="#What-is-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Как уже говорилось ранее, <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite</a> - это упрощенная альтернатива Milvus, которая предлагает множество преимуществ и достоинств.</p>
<ul>
<li>Вы можете интегрировать его в свое Python-приложение без лишнего веса.</li>
<li>Он самодостаточен и не требует других зависимостей, благодаря способности автономного Milvus работать со встроенными Etcd и локальными хранилищами.</li>
<li>Вы можете импортировать его как библиотеку Python и использовать как автономный сервер на основе интерфейса командной строки (CLI).</li>
<li>Он отлично работает с Google Colab и Jupyter Notebook.</li>
<li>Вы можете безопасно переносить свою работу и писать код на другие экземпляры Milvus (автономные, кластерные и полностью управляемые версии) без риска потери данных.</li>
</ul>
<h2 id="When-should-you-use-Milvus-Lite" class="common-anchor-header">Когда следует использовать Milvus Lite?<button data-href="#When-should-you-use-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>В частности, Milvus Lite наиболее полезен в следующих ситуациях:</p>
<ul>
<li>Если вы предпочитаете использовать Milvus без контейнерных технологий и инструментов, таких как <a href="https://milvus.io/docs/install_standalone-operator.md">Milvus Operator</a>, <a href="https://milvus.io/docs/install_standalone-helm.md">Helm</a> или <a href="https://milvus.io/docs/install_standalone-docker.md">Docker Compose</a>.</li>
<li>Когда для использования Milvus не нужны виртуальные машины или контейнеры.</li>
<li>Когда вы хотите внедрить функции Milvus в свои Python-приложения.</li>
<li>Если вы хотите запустить экземпляр Milvus в Colab или Notebook для быстрого эксперимента.</li>
</ul>
<p><strong>Примечание</strong>: Мы не рекомендуем использовать Milvus Lite в производственной среде или если вам требуется высокая производительность, высокая доступность или высокая масштабируемость. Вместо этого лучше использовать <a href="https://github.com/milvus-io/milvus">кластеры Milvus</a> или <a href="https://zilliz.com/cloud">полностью управляемый Milvus на Zilliz Cloud</a> для производства.</p>
<h2 id="How-to-get-started-with-Milvus-Lite" class="common-anchor-header">Как начать работу с Milvus Lite?<button data-href="#How-to-get-started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь давайте рассмотрим, как установить, настроить и использовать Milvus Lite.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><p>Чтобы использовать Milvus Lite, убедитесь, что вы выполнили следующие требования:</p>
<ul>
<li>Установлен Python 3.7 или более поздняя версия.</li>
<li>Использование одной из проверенных операционных систем, перечисленных ниже:<ul>
<li>Ubuntu &gt;= 18.04 (x86_64)</li>
<li>CentOS &gt;= 7.0 (x86_64)</li>
<li>MacOS &gt;= 11.0 (Apple Silicon)</li>
</ul></li>
</ul>
<p><strong>Примечания</strong>:</p>
<ol>
<li>Milvus Lite использует <code translate="no">manylinux2014</code> в качестве базового образа, что делает его совместимым с большинством дистрибутивов Linux для пользователей Linux.</li>
<li>Запуск Milvus Lite на Windows также возможен, хотя это еще не полностью проверено.</li>
</ol>
<h3 id="Install-Milvus-Lite" class="common-anchor-header">Установка Milvus Lite</h3><p>Milvus Lite доступен на PyPI, поэтому вы можете установить его через <code translate="no">pip</code>.</p>
<pre><code translate="no">$ python3 -m pip install milvus
<button class="copy-code-btn"></button></code></pre>
<p>Вы также можете установить его с помощью PyMilvus следующим образом:</p>
<pre><code translate="no">$ python3 -m pip install milvus[client]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Use-and-start-Milvus-Lite" class="common-anchor-header">Использование и запуск Milvus Lite</h3><p>Загрузите <a href="https://github.com/milvus-io/milvus-lite/tree/main/examples">пример блокнота</a> из папки example нашего репозитория проектов. У вас есть два варианта использования Milvus Lite: либо импортировать его как библиотеку Python, либо запустить его как отдельный сервер на вашей машине с помощью CLI.</p>
<ul>
<li>Чтобы запустить Milvus Lite как модуль Python, выполните следующие команды:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility

<span class="hljs-comment"># Start your milvus server</span>
default_server.start()

<span class="hljs-comment"># Now you can connect with localhost and the given port</span>
<span class="hljs-comment"># Port is defined by default_server.listen_port</span>
connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)

<span class="hljs-comment"># Check if the server is ready.</span>
<span class="hljs-built_in">print</span>(utility.get_server_version())

<span class="hljs-comment"># Stop your milvus server</span>
default_server.stop()
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Чтобы приостановить или остановить Milvus Lite, используйте оператор <code translate="no">with</code>.</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  <span class="hljs-comment"># Milvus Lite has already started, use default_server here.</span>
  connections.connect(host=<span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=default_server.listen_port)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Чтобы запустить Milvus Lite как автономный сервер на базе CLI, выполните следующую команду:</li>
</ul>
<pre><code translate="no">milvus-server
<button class="copy-code-btn"></button></code></pre>
<p>После запуска Milvus Lite вы можете использовать PyMilvus или другие инструменты, которые вы предпочитаете, для подключения к автономному серверу.</p>
<h3 id="Start-Milvus-Lite-in-a-debug-mode" class="common-anchor-header">Запуск Milvus Lite в режиме отладки</h3><ul>
<li>Чтобы запустить Milvus Lite в режиме отладки как Python-модуль, выполните следующие команды:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> debug_server, MilvusServer

debug_server.run()

<span class="hljs-comment"># Or you can create a MilvusServer by yourself</span>
<span class="hljs-comment"># server = MilvusServer(debug=True)</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Чтобы запустить автономный сервер в режиме отладки, выполните следующую команду:</li>
</ul>
<pre><code translate="no">milvus-server --debug
<button class="copy-code-btn"></button></code></pre>
<h3 id="Persist-data-and-logs" class="common-anchor-header">Сохранение данных и журналов</h3><ul>
<li>Чтобы создать локальный каталог для Milvus Lite, который будет содержать все необходимые данные и журналы, выполните следующие команды:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> <span class="hljs-attr">default_server</span>:
  default_server.<span class="hljs-title function_">set_base_dir</span>(<span class="hljs-string">&#x27;milvus_data&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Чтобы сохранить все данные и журналы, генерируемые автономным сервером, на локальном диске, выполните следующую команду:</li>
</ul>
<pre><code translate="no">$ milvus-server --data milvus_data
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configure-Milvus-Lite" class="common-anchor-header">Настроить Milvus Lite</h3><p>Настройка Milvus Lite аналогична настройке экземпляров Milvus с помощью Python API или CLI.</p>
<ul>
<li>Чтобы настроить Milvus Lite с помощью Python API, используйте <code translate="no">config.set</code> API экземпляра <code translate="no">MilvusServer</code> для основных и дополнительных настроек:</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server

<span class="hljs-keyword">with</span> default_server:
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;system_Log_level&#x27;</span>, <span class="hljs-string">&#x27;info&#x27;</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;proxy_port&#x27;</span>, <span class="hljs-number">19531</span>)
  default_server.config.<span class="hljs-built_in">set</span>(<span class="hljs-string">&#x27;dataCoord.segment.maxSize&#x27;</span>, <span class="hljs-number">1024</span>)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Чтобы настроить Milvus Lite с помощью CLI, выполните следующую команду для базовых настроек:</li>
</ul>
<pre><code translate="no">$ milvus-server --system-log-level info
$ milvus-server --proxy-port 19531
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Или выполните следующую команду для дополнительных настроек.</li>
</ul>
<pre><code translate="no">$ milvus-server --extra-config dataCoord.segment.maxSize=1024
<button class="copy-code-btn"></button></code></pre>
<p>Все настраиваемые элементы находятся в шаблоне <code translate="no">config.yaml</code>, поставляемом вместе с пакетом Milvus.</p>
<p>Более подробную техническую информацию об установке и настройке Milvus Lite можно найти в нашей <a href="https://milvus.io/docs/milvus_lite.md#Prerequisites">документации</a>.</p>
<h2 id="Summary" class="common-anchor-header">Резюме<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite - отличный выбор для тех, кто ищет возможности Milvus в компактном формате. Если вы исследователь, разработчик или специалист по изучению данных, вам стоит обратить внимание на этот вариант.</p>
<p>Milvus Lite также является прекрасным дополнением к сообществу разработчиков с открытым исходным кодом, демонстрирующим выдающуюся работу его участников. Благодаря усилиям Бин Чжи Milvus теперь доступен большему числу пользователей. Нам не терпится увидеть инновационные идеи, которые Бин Цзи и другие члены сообщества Milvus воплотят в жизнь в будущем.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Давайте поддерживать связь!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Если у вас возникнут проблемы с установкой или использованием Milvus Lite, вы можете <a href="https://github.com/milvus-io/milvus-lite/issues/new">подать заявку здесь</a> или связаться с нами через <a href="https://twitter.com/milvusio">Twitter</a> или <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Вы также можете присоединиться к нашему <a href="https://milvus.io/slack/">каналу Slack</a>, чтобы пообщаться с нашими инженерами и всем сообществом, или посетить <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">наши офисные часы по вторникам</a>!</p>
