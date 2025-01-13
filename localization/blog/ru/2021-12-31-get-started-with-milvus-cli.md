---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Начните работу с Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: Эта статья знакомит с Milvus_CLI и помогает выполнять общие задачи.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>В эпоху информационного взрыва мы постоянно получаем голоса, изображения, видео и другие неструктурированные данные. Как эффективно анализировать эти огромные объемы данных? Появление нейронных сетей позволяет встраивать неструктурированные данные в виде векторов, а база данных Milvus - это базовое программное обеспечение для обслуживания данных, которое помогает завершить хранение, поиск и анализ векторных данных.</p>
<p>Но как можно быстро использовать векторную базу данных Milvus?</p>
<p>Некоторые пользователи жалуются, что API трудно запомнить, и надеются, что для работы с базой данных Milvus можно было бы использовать простые командные строки.</p>
<p>Мы рады представить Milvus_CLI, инструмент командной строки, предназначенный для работы с векторной базой данных Milvus.</p>
<p>Milvus_CLI - это удобный CLI для базы данных Milvus, поддерживающий подключение к базе данных, импорт данных, экспорт данных и вычисление векторов с помощью интерактивных команд в оболочках. Последняя версия Milvus_CLI обладает следующими возможностями.</p>
<ul>
<li><p>Поддерживаются все платформы, включая Windows, Mac и Linux.</p></li>
<li><p>Поддерживается онлайн и офлайн установка с помощью pip</p></li>
<li><p>Портативный, может использоваться где угодно</p></li>
<li><p>Построен на базе Milvus SDK для Python</p></li>
<li><p>Включена справочная документация</p></li>
<li><p>Поддерживается автозаполнение</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Установка<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>Вы можете установить Milvus_CLI как онлайн, так и офлайн.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Установка Milvus_CLI онлайн</h3><p>Выполните следующую команду, чтобы установить Milvus_CLI онлайн с помощью pip. Требуется Python 3.8 или более поздняя версия.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Установка Milvus_CLI в автономном режиме</h3><p>Чтобы установить Milvus_CLI в автономном режиме, сначала <a href="https://github.com/milvus-io/milvus_cli/releases">скачайте</a> последнюю версию tarball со страницы релиза.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>После загрузки тарбола выполните следующую команду для установки Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>После установки Milvus_CLI выполните команду <code translate="no">milvus_cli</code>. Появившееся приглашение <code translate="no">milvus_cli &gt;</code> означает, что командная строка готова.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Если вы используете Mac с чипом M1 или PC без среды Python, вы можете использовать портативное приложение. Для этого <a href="https://github.com/milvus-io/milvus_cli/releases">загрузите</a> файл на странице выпуска, соответствующей вашей ОС, запустите <code translate="no">chmod +x</code>, чтобы сделать его исполняемым, и запустите <code translate="no">./</code>, чтобы запустить его.</p>
<h4 id="Example" class="common-anchor-header"><strong>Пример</strong></h4><p>Следующий пример делает <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> исполняемым и запускает его.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Использование<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Подключение к Milvus</h3><p>Перед подключением к Milvus убедитесь, что Milvus установлен на вашем сервере. Дополнительные сведения см. в разделе <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Установка Milvus Standalone</a> или <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Установка Milvus Cluster</a>.</p>
<p>Если Milvus установлен на вашем localhost с портом по умолчанию, запустите <code translate="no">connect</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>В противном случае выполните следующую команду с IP-адресом вашего сервера Milvus. В следующем примере в качестве IP-адреса используется <code translate="no">172.16.20.3</code>, а в качестве номера порта - <code translate="no">19530</code>.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h3 id="Create-a-collection" class="common-anchor-header">Создание коллекции</h3><p>В этом разделе рассказывается о том, как создать коллекцию.</p>
<p>Коллекция состоит из сущностей и похожа на таблицу в RDBMS. Дополнительную информацию см. в <a href="https://milvus.io/docs/v2.0.x/glossary.md">Глоссарии</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h4 id="Example" class="common-anchor-header">Пример</h4><p>В следующем примере создается коллекция с именем <code translate="no">car</code>. Коллекция <code translate="no">car</code> имеет четыре поля: <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code> и <code translate="no">brand</code>. Первичное ключевое поле - <code translate="no">id</code>. Дополнительную информацию см. в разделе <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">Создание коллекции</a>.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">Список коллекций</h3><p>Выполните следующую команду, чтобы перечислить все коллекции в данном экземпляре Milvus.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Выполните следующую команду, чтобы проверить сведения о коллекции <code translate="no">car</code>.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Вычислить расстояние между двумя векторами</h3><p>Выполните следующую команду, чтобы импортировать данные в коллекцию <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Запустите команду <code translate="no">query</code> и при появлении запроса введите <code translate="no">car</code> в качестве имени коллекции и <code translate="no">id&gt;0</code> в качестве выражения запроса. Идентификаторы сущностей, удовлетворяющих критериям, будут возвращены, как показано на следующем рисунке.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Запустите <code translate="no">calc</code> и введите соответствующие значения при появлении запроса, чтобы вычислить расстояния между векторными массивами.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Удаление коллекции</h3><p>Выполните следующую команду, чтобы удалить коллекцию <code translate="no">car</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="More" class="common-anchor-header">Больше<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI не ограничивается перечисленными выше функциями. Выполните команду <code translate="no">help</code>, чтобы просмотреть все команды, которые включает Milvus_CLI, и их описания. Выполните команду <code translate="no">&lt;command&gt; --help</code>, чтобы просмотреть подробные сведения о заданной команде.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<p><strong>См. также:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Справочник команд Milvus_CLI</a> в разделе Milvus Docs</p>
<p>Мы надеемся, что Milvus_CLI поможет вам легко использовать векторную базу данных Milvus. Мы будем продолжать оптимизировать Milvus_CLI, и мы будем рады вашему вкладу.</p>
<p>Если у вас возникли вопросы, не стесняйтесь <a href="https://github.com/zilliztech/milvus_cli/issues">подать заявку</a> на GitHub.</p>
