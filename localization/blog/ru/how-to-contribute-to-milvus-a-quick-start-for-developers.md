---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'Как внести вклад в Milvus: краткое руководство для разработчиков'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> - это <a href="https://zilliz.com/learn/what-is-vector-database">векторная база данных</a> с открытым исходным кодом, предназначенная для управления высокоразмерными векторными данными. Если вы создаете интеллектуальные поисковые системы, системы рекомендаций или решения нового поколения в области искусственного интеллекта, такие как поиск с расширенной генерацией<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>), Milvus - это мощный инструмент в вашем распоряжении.</p>
<p>Но по-настоящему двигает Milvus вперед не только его передовая технология, но и активное, увлеченное <a href="https://zilliz.com/community">сообщество разработчиков</a>, стоящее за ним. Будучи проектом с открытым исходным кодом, Milvus процветает и развивается благодаря вкладу таких разработчиков, как вы. Каждое исправление ошибок, добавление функций и повышение производительности, предлагаемые сообществом, делают Milvus быстрее, масштабируемее и надежнее.</p>
<p>Если вы неравнодушны к открытому коду, хотите учиться или оказать значительное влияние на ИИ, Milvus - идеальное место для вашего вклада. Это руководство проведет вас через весь процесс - от создания среды разработки до отправки первого запроса на внесение изменений. Мы также расскажем о типичных проблемах, с которыми вы можете столкнуться, и предложим решения для их преодоления.</p>
<p>Готовы погрузиться в работу? Давайте вместе сделаем Milvus еще лучше!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Настройка среды разработки Milvus<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде всего, необходимо настроить среду разработки. Вы можете установить Milvus на локальную машину или использовать Docker - оба способа просты, но вам также потребуется установить несколько сторонних зависимостей, чтобы все заработало.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Сборка Milvus на локальной машине</h3><p>Если вы любите создавать вещи с нуля, то сборка Milvus на локальной машине не составит труда. Milvus упрощает задачу, собирая все зависимости в скрипт <code translate="no">install_deps.sh</code>. Вот быстрая настройка:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Сборка Milvus с помощью Docker</h3><p>Если вы предпочитаете Docker, есть два пути: вы можете запускать команды в предварительно собранном контейнере или создать контейнер для разработчиков, чтобы использовать более практичный подход.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Примечания к платформе:</strong> Если вы работаете в Linux, то все в порядке - проблемы с компиляцией возникают довольно редко. Однако пользователи Mac, особенно с чипами M1, могут столкнуться с некоторыми трудностями на этом пути. Не волнуйтесь - у нас есть руководство, которое поможет вам справиться с наиболее распространенными проблемами.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Рисунок: Конфигурация ОС</em></p>
<p>Полное руководство по настройке можно найти в официальном <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">руководстве по разработке Milvus</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Общие проблемы и способы их решения</h3><p>Иногда настройка среды разработки Milvus проходит не так гладко, как планировалось. Не волнуйтесь - вот краткая информация о типичных проблемах, с которыми вы можете столкнуться, и о том, как их быстро решить.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Неожиданное отключение при чтении пакета Sideband</h4><p>Если вы используете Homebrew и видите ошибку, подобную этой:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Исправление:</strong> Увеличьте размер <code translate="no">http.postBuffer</code>:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>Если вы также столкнулись с <code translate="no">Brew: command not found</code> после установки Homebrew, возможно, вам нужно настроить конфигурацию пользователя Git:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: ошибка при получении учетных данных</h4><p>При работе с Docker вы можете увидеть следующее:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Исправить:</strong> Откройте<code translate="no">~/.docker/config.json</code> и удалите поле <code translate="no">credsStore</code>.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: Нет модуля с именем 'imp'</h4><p>Если Python выдает эту ошибку, это связано с тем, что в Python 3.12 удален модуль <code translate="no">imp</code>, который все еще используется в некоторых старых зависимостях.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Исправьте:</strong> Перейдите на Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Нераспознанные аргументы или команда не найдена</h4><p><strong>Проблема:</strong> Если вы видите <code translate="no">Unrecognized arguments: --install-folder conan</code>, то, скорее всего, вы используете несовместимую версию Conan.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Исправить:</strong> Перейдите на Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Проблема:</strong> Если вы видите <code translate="no">Conan command not found</code>, это означает, что ваше окружение Python не настроено должным образом.</p>
<p><strong>Исправление:</strong> Добавьте каталог bin Python в ваш <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Use of Undeclared Identifier 'kSecFormatOpenSSL'</h4><p>Эта ошибка обычно означает, что ваши зависимости LLVM устарели.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Исправить:</strong> Переустановите LLVM 15 и обновите переменные окружения:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Советы профессионала</strong></p>
<ul>
<li><p>Всегда перепроверяйте версии инструментов и зависимостей.</p></li>
<li><p>Если что-то не работает, то на<a href="https://github.com/milvus-io/milvus/issues"> странице Milvus GitHub Issues</a> можно найти ответы или попросить помощи.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Настройка VS Code для интеграции C++ и Go</h3><p>Обеспечить совместную работу C++ и Go в VS Code проще, чем кажется. При правильной настройке вы сможете упростить процесс разработки для Milvus. Просто измените свой файл <code translate="no">user.settings</code> с помощью приведенной ниже конфигурации:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Вот что делает эта конфигурация:</p>
<ul>
<li><p><strong>Переменные окружения:</strong> Устанавливает пути для <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code> и <code translate="no">RPATH</code>, которые важны для поиска библиотек во время сборки и тестирования.</p></li>
<li><p><strong>Интеграция инструментов Go:</strong> Включает языковой сервер Go (<code translate="no">gopls</code>) и настраивает такие инструменты, как <code translate="no">gofumpt</code> для форматирования и <code translate="no">golangci-lint</code> для линтинга.</p></li>
<li><p><strong>Настройка тестирования:</strong> Добавляет <code translate="no">testTags</code> и увеличивает таймаут выполнения тестов до 10 минут.</p></li>
</ul>
<p>После добавления эта настройка обеспечивает бесшовную интеграцию между рабочими процессами C++ и Go. Она идеально подходит для сборки и тестирования Milvus без постоянной настройки окружения.</p>
<p><strong>Профессиональный совет</strong></p>
<p>После настройки запустите быструю тестовую сборку, чтобы убедиться, что все работает. Если что-то не так, перепроверьте пути и версию расширения Go в VS Code.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Развертывание Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus поддерживает <a href="https://milvus.io/docs/install-overview.md">три режима развертывания - Lite</a><strong>, Standalone</strong> и <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> - это библиотека Python и сверхлегкая версия Milvus. Она идеально подходит для быстрого создания прототипов на Python или в среде ноутбука, а также для небольших локальных экспериментов.</p></li>
<li><p><strong>Milvus Standalone</strong> - это вариант развертывания Milvus на одном узле, использующий модель клиент-сервер. Это Milvus-эквивалент MySQL, а Milvus Lite - SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> - это распределенный режим Milvus, который идеально подходит для корпоративных пользователей, создающих крупномасштабные системы векторных баз данных или платформы векторных данных.</p></li>
</ul>
<p>Все эти развертывания основаны на трех ключевых компонентах:</p>
<ul>
<li><p><strong>Milvus:</strong> движок векторной базы данных, который управляет всеми операциями.</p></li>
<li><p><strong>Etcd:</strong> Механизм метаданных, управляющий внутренними метаданными Milvus.</p></li>
<li><p><strong>MinIO:</strong> механизм хранения, обеспечивающий сохранность данных.</p></li>
</ul>
<p>При работе в режиме <strong>Distributed</strong> в Milvus также встроен <strong>Pulsar</strong> для распределенной обработки сообщений с помощью механизма Pub/Sub, что делает его масштабируемым для сред с высокой пропускной способностью.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Режим Standalone предназначен для установки одного экземпляра, что делает его идеальным для тестирования и небольших приложений. Вот как начать работу:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (ранее известный как Milvus Cluster)</h3><p>Для больших наборов данных и высокого трафика режим Distributed предлагает горизонтальную масштабируемость. Он объединяет несколько экземпляров Milvus в единую целостную систему. Развертывание упрощается с помощью <strong>Milvus Operator</strong>, который работает на Kubernetes и управляет всем стеком Milvus за вас.</p>
<p>Хотите получить пошаговое руководство? Ознакомьтесь с <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">руководством по установке Milvus</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Выполнение сквозных тестов (E2E)<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>После того как развертывание Milvus запущено, проверить его работоспособность можно с помощью тестов E2E. Эти тесты охватывают все части вашей установки, чтобы убедиться, что все работает так, как ожидалось. Вот как их проводить:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>Подробные инструкции и советы по устранению неполадок см. в <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">руководстве по разработке Milvus</a>.</p>
<p><strong>Совет профессионала</strong></p>
<p>Если вы новичок в Milvus, начните с Milvus Lite или автономного режима, чтобы прочувствовать его возможности, а затем перейдите в распределенный режим для рабочих нагрузок производственного уровня.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Отправка вашего кода<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Поздравляем! Вы прошли все модульные и E2E-тесты (или отладили и перекомпилировали при необходимости). Хотя первая сборка может занять некоторое время, последующие будут намного быстрее, так что не стоит беспокоиться. Когда все пройдено, вы готовы отправить свои изменения и внести свой вклад в Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Свяжите ваш Pull Request (PR) с проблемой</h3><p>Каждый PR в Milvus должен быть привязан к соответствующему выпуску. Вот как это сделать:</p>
<ul>
<li><p><strong>Проверьте наличие существующих проблем:</strong> Просмотрите<a href="https://github.com/milvus-io/milvus/issues"> трекер выпусков Milvus</a>, чтобы узнать, есть ли уже выпуск, связанный с вашими изменениями.</p></li>
<li><p><strong>Создайте новую проблему:</strong> Если соответствующей проблемы не существует, откройте новую и объясните, какую проблему вы решаете или какую функцию добавляете.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Отправка вашего кода</h3><ol>
<li><p><strong>Форк репозитория:</strong> Начните с форка<a href="https://github.com/milvus-io/milvus"> репозитория Milvus</a> на свой аккаунт GitHub.</p></li>
<li><p><strong>Создайте ветку:</strong> Клонируйте форк локально и создайте новую ветку для своих изменений.</p></li>
<li><p><strong>Сделайте коммит с подписью:</strong> Убедитесь, что ваши коммиты содержат подпись <code translate="no">Signed-off-by</code>, чтобы соответствовать лицензированию с открытым исходным кодом:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>Этот шаг подтверждает, что ваш вклад соответствует Сертификату происхождения разработчика (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Полезные ресурсы</strong></h4><p>Для получения подробной информации о шагах и лучших практиках ознакомьтесь с<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Руководством по внесению вклада в Milvus</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Возможности для внесения вклада<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Поздравляем - вы запустили Milvus! Вы изучили его режимы развертывания, провели тесты и, возможно, даже покопались в коде. Теперь пришло время повысить свой уровень: внести свой вклад в <a href="https://github.com/milvus-io/milvus">Milvus</a> и помочь сформировать будущее ИИ и <a href="https://zilliz.com/learn/introduction-to-unstructured-data">неструктурированных данных</a>.</p>
<p>Независимо от ваших навыков, в сообществе Milvus найдется место и для вас! Будь вы разработчиком, которому нравится решать сложные задачи, техническим писателем, которому нравится писать чистую документацию или инженерные блоги, или энтузиастом Kubernetes, стремящимся улучшить развертывание, - для вас найдется способ внести свой вклад.</p>
<p>Ознакомьтесь с представленными ниже возможностями и найдите свой идеальный вариант. Каждый вклад помогает Milvus двигаться вперед - и кто знает? Возможно, ваш следующий запрос на исправление приведет в движение следующую волну инноваций. Итак, чего же вы ждете? Давайте начнем! 🚀</p>
<table>
<thead>
<tr><th>Проекты</th><th>Подходит для</th><th>Руководство</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Разработчики Go</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>Разработчики CPP</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Разработчики, интересующиеся другими языками</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Вклад в PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Энтузиасты Kubernetes</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Технические писатели</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Вклад в документацию milvus</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Веб-разработчики</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">Заключительное слово<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus предлагает различные <a href="https://milvus.io/docs/install-pymilvus.md">SDK</a> - на Питоне (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a> и <a href="https://milvus.io/docs/install-node.md">Node.js</a>, - которые позволяют легко начать разработку. Вклад в Milvus - это не просто код, это присоединение к энергичному и инновационному сообществу.</p>
<p>Добро пожаловать в сообщество разработчиков Milvus и удачного кодинга! Нам не терпится увидеть, что вы создадите.</p>
<h2 id="Further-Reading" class="common-anchor-header">Читать далее<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Присоединяйтесь к сообществу разработчиков ИИ Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">Что такое векторные базы данных и как они работают?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed: Какой режим подходит вам? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Создание приложений для ИИ с помощью Milvus: учебники и блокноты</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Лучшие модели искусственного интеллекта для ваших приложений GenAI | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Что такое RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Ресурсный центр генеративного ИИ | Zilliz</a></p></li>
</ul>
