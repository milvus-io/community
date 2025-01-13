---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Управление базой данных Milvus Vector с помощью одного щелчка мыши
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - инструмент графического интерфейса для Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение обложки Бинлога</span> </span></p>
<p>Черновик <a href="https://github.com/czhen-zilliz">Чжэнь Чэня</a> и перевод <a href="https://github.com/LocoRichard">Личэнь Вана</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Нажмите <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">здесь</a>, чтобы ознакомиться с оригинальным сообщением.</p> 
<p>В условиях стремительно растущего спроса на обработку неструктурированных данных выделяется Milvus 2.0. Это векторная система баз данных, ориентированная на ИИ и предназначенная для массовых производственных сценариев. Помимо всех этих Milvus SDK и Milvus CLI, интерфейса командной строки для Milvus, есть ли инструмент, который позволяет пользователям работать с Milvus более интуитивно? Ответ на этот вопрос - ДА. Компания Zilliz анонсировала графический интерфейс пользователя - Attu - специально для Milvus. В этой статье мы хотим показать вам шаг за шагом, как выполнить поиск векторного сходства с помощью Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>Остров Attu</span> </span></p>
<p>По сравнению с Milvus CLI, который обеспечивает предельную простоту использования, Attu имеет больше возможностей:</p>
<ul>
<li>Инсталляторы для Windows OS, macOS и Linux OS;</li>
<li>Интуитивно понятный графический интерфейс для более простого использования Milvus;</li>
<li>Охват основных функциональных возможностей Milvus;</li>
<li>Плагины для расширения настраиваемых функций;</li>
<li>Полная информация о топологии системы для облегчения понимания и администрирования экземпляра Milvus.</li>
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
    </button></h2><p>Самый новый выпуск Attu можно найти на <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu предлагает исполняемые инсталляторы для различных операционных систем. Это проект с открытым исходным кодом и приветствует участие всех желающих.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Установка</span> </span></p>
<p>Вы также можете установить Attu через Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> это IP-адрес среды, в которой работает Attu, а <code translate="no">milvus server IP</code> - IP-адрес среды, в которой работает Milvus.</p>
<p>После успешной установки Attu вы можете ввести IP и порт Milvus в интерфейс для запуска Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Подключение Milvus к Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Обзор функций<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Страница обзора</span> </span></p>
<p>Интерфейс Attu состоит из страницы <strong>обзора</strong>, страницы <strong>коллекций</strong>, страницы <strong>поиска векторов</strong> и страницы <strong>просмотра системы</strong>, что соответствует четырем значкам на левой панели навигации соответственно.</p>
<p>На странице <strong>обзора</strong> отображаются загруженные коллекции. На странице <strong>коллекции</strong> перечислены все коллекции и указано, загружены они или освобождены.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Страница коллекции</span> </span></p>
<p>Страницы <strong>Vector Search</strong> и <strong>System View</strong> являются плагинами Attu. Концепция и использование плагинов будут представлены в заключительной части блога.</p>
<p>На странице Vector <strong>Search</strong> можно выполнить поиск векторного сходства.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Страница Vector Search</span> </span></p>
<p>На странице <strong>System View</strong> можно посмотреть топологическую структуру Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Страница просмотра системы</span> </span></p>
<p>Вы также можете просмотреть подробную информацию о каждом узле, щелкнув по узлу.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Вид узла</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Демонстрация<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте изучим Attu на тестовом наборе данных.</p>
<p>Проверьте наш <a href="https://github.com/zilliztech/attu/tree/main/examples">репозиторий GitHub</a>, чтобы найти набор данных, используемый в следующем тесте.</p>
<p>Сначала создайте коллекцию с именем test со следующими четырьмя полями:</p>
<ul>
<li>Имя поля: id, поле с первичным ключом</li>
<li>Имя поля: vector, векторное поле, float vector, размерность: 128</li>
<li>Имя поля: brand, скалярное поле, Int64</li>
<li>Имя поля: цвет, скалярное поле, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Создание коллекции</span> </span></p>
<p>Загрузите коллекцию для поиска после ее успешного создания.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Загрузка коллекции</span> </span></p>
<p>Теперь вы можете проверить только что созданную коллекцию на странице <strong>обзора</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Проверить коллекцию</span> </span></p>
<p>Импортируйте тестовый набор данных в Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Импортировать данные</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Импортировать данные</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Импортированные данные</span> </span></p>
<p>Щелкните название коллекции на странице Обзор или Коллекция, чтобы войти в интерфейс запроса для проверки импортированных данных.</p>
<p>Добавьте фильтр, укажите выражение <code translate="no">id != 0</code>, нажмите <strong>Применить фильтр</strong> и нажмите <strong>Запрос</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Данные запроса</span> </span></p>
<p>Вы увидите, что все пятьдесят записей сущностей успешно импортированы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Результат запроса</span> </span></p>
<p>Попробуем выполнить поиск векторного сходства.</p>
<p>Скопируйте один вектор с сайта <code translate="no">search_vectors.csv</code> и вставьте его в поле <strong>Vector Value</strong>. Выберите коллекцию и поле. Нажмите кнопку <strong>Поиск</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Данные поиска</span> </span></p>
<p>Затем вы можете проверить результат поиска. Поиск с помощью Milvus не требует компиляции скриптов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Результат поиска</span> </span></p>
<p>Наконец, давайте проверим страницу <strong>System View</strong>.</p>
<p>С помощью Metrics API, встроенного в Milvus Node.js SDK, вы можете проверить состояние системы, отношения узлов и состояние узлов.</p>
<p>Как эксклюзивная особенность Attu, страница "Обзор системы" включает в себя полный топологический граф системы. Щелкнув на каждом узле, вы можете проверить его статус (обновление каждые 10 секунд).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Топологический график узлов Milvus</span> </span></p>
<p>Щелкните на каждом узле, чтобы перейти к <strong>просмотру списка узлов</strong>. Вы можете проверить все дочерние узлы узла коорд. С помощью сортировки можно быстро определить узлы с высоким использованием процессора или памяти и найти проблему в системе.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Список узлов Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">Что еще<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Как упоминалось ранее, страницы <strong>Vector Search</strong> и <strong>System View</strong> являются плагинами Attu. Мы призываем пользователей разрабатывать собственные плагины для Attu в соответствии с их сценариями применения. В исходном коде есть папка, созданная специально для кодов плагинов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>Плагины</span> </span></p>
<p>Вы можете обратиться к любому из плагинов, чтобы узнать, как создать плагин. Установив следующий конфигурационный файл, вы можете добавить плагин в Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Добавление плагинов в Attu</span> </span></p>
<p>Для получения подробных инструкций вы можете посмотреть <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> и <a href="https://milvus.io/docs/v2.0.x/attu.md">Технический документ Milvus</a>.</p>
<p>Attu - это проект с открытым исходным кодом. Любой вклад приветствуется. Вы также можете <a href="https://github.com/zilliztech/attu/issues">подать заявку</a>, если у вас возникли проблемы с Attu.</p>
<p>Мы искренне надеемся, что Attu поможет вам улучшить работу с Milvus. Если вам нравится Attu или у вас есть замечания по его использованию, вы можете заполнить этот <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">опросник</a>, чтобы помочь нам оптимизировать Attu для улучшения работы пользователей.</p>
