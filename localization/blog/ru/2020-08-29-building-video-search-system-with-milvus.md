---
id: building-video-search-system-with-milvus.md
title: Обзор системы
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Поиск видео по изображению с помощью Milvus
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>4 шага к созданию системы поиска видео</custom-h1><p>Как следует из названия, поиск видео по изображению - это процесс извлечения из хранилища видео, содержащего кадры, схожие с входным изображением. Одним из ключевых шагов является превращение видео в эмбеддинги, то есть извлечение ключевых кадров и преобразование их характеристик в векторы. Теперь некоторые любопытные читатели могут задаться вопросом, в чем разница между поиском видео по изображению и поиском изображения по изображению? На самом деле, поиск ключевых кадров в видео эквивалентен поиску изображения по картинке.</p>
<p>Если вам интересно, вы можете обратиться к нашей предыдущей статье <a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: Building a Content-based Image Retrieval System</a>.</p>
<h2 id="System-overview" class="common-anchor-header">Обзор системы<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>На следующей схеме показан типичный рабочий процесс такой системы поиска видео.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-video-search-system-workflow.png</span> </span></p>
<p>При импорте видео мы используем библиотеку OpenCV, чтобы разрезать каждое видео на кадры, извлечь векторы ключевых кадров с помощью модели извлечения признаков изображения VGG, а затем вставить извлеченные векторы (эмбеддинги) в Milvus. Для хранения исходных видео мы используем Minio, а для хранения корреляций между видео и векторами - Redis.</p>
<p>При поиске видео мы используем ту же модель VGG для преобразования входного изображения в вектор признаков и вставляем его в Milvus, чтобы найти векторы с наибольшим сходством. Затем система извлекает соответствующие видео из Minio на своем интерфейсе в соответствии с корреляциями в Redis.</p>
<h2 id="Data-preparation" class="common-anchor-header">Подготовка данных<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье мы используем около 100 000 GIF-файлов из Tumblr в качестве примера набора данных для создания комплексного решения для поиска видео. Вы можете использовать свои собственные хранилища видео.</p>
<h2 id="Deployment" class="common-anchor-header">Развертывание<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Код для построения системы поиска видео в этой статье находится на GitHub.</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">Шаг 1: Сборка образов Docker.</h3><p>Для работы системы видеопоиска необходимы докер Milvus v0.7.1, докер Redis, докер Minio, докер внешнего интерфейса и докер внутреннего API. Докер внешнего интерфейса и докер API внутреннего интерфейса вы должны собрать самостоятельно, а остальные три докера вы можете взять непосредственно из Docker Hub.</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">Шаг 2: Настройте окружение.<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>Здесь мы используем docker-compose.yml для управления вышеупомянутыми пятью контейнерами. Конфигурация docker-compose.yml приведена в следующей таблице:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>IP-адрес 192.168.1.38 в таблице выше - это адрес сервера, специально предназначенный для создания системы поиска видео в этой статье. Вам необходимо изменить его на адрес вашего сервера.</p>
<p>Вам нужно вручную создать каталоги хранения для Milvus, Redis и Minio, а затем добавить соответствующие пути в docker-compose.yml. В этом примере мы создали следующие каталоги:</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>Вы можете настроить Milvus, Redis и Minio в docker-compose.yml следующим образом:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span></p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">Шаг 3: Запустите систему.<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>Используйте модифицированный docker-compose.yml для запуска пяти контейнеров docker, которые будут использоваться в системе поиска видео:</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>Затем можно запустить docker-compose ps, чтобы проверить, правильно ли запустились пять докер-контейнеров. На следующем скриншоте показан типичный интерфейс после успешного запуска.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>Итак, вы успешно создали систему поиска видео, хотя в базе данных нет ни одного видео.</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">Шаг 4: Импорт видео.<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>В каталоге deploy репозитория системы лежит import_data.py, скрипт для импорта видео. Для запуска скрипта достаточно обновить путь к видеофайлам и интервал импорта.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-path-video.png</span> </span></p>
<p>data_path: Путь к видеофайлам для импорта.</p>
<p>time.sleep(0.5): Интервал, через который система импортирует видео. Сервер, на котором мы построили систему поиска видео, имеет 96 ядер процессора. Поэтому рекомендуется установить интервал в 0,5 секунды. Если ваш сервер имеет меньшее количество процессорных ядер, установите большее значение. В противном случае процесс импорта будет создавать нагрузку на центральный процессор и создавать зомби-процессы.</p>
<p>Запустите файл import_data.py для импорта видео.</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>После того как видео импортировано, у вас готова собственная система поиска видео!</p>
<h2 id="Interface-display" class="common-anchor-header">Отображение интерфейса<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>Откройте браузер и введите 192.168.1.38:8001, чтобы увидеть интерфейс системы видеопоиска, как показано ниже.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-video-search-interface.png</span> </span></p>
<p>Переключите переключатель в правом верхнем углу, чтобы просмотреть все видео в хранилище.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-view-all-videos-repository.png</span> </span></p>
<p>Нажмите на поле загрузки в левом верхнем углу, чтобы ввести целевое изображение. Как показано ниже, система возвращает видео, содержащие наиболее похожие кадры.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-recommender-system-cats.png</span> </span></p>
<p>Далее, развлекайтесь с нашей системой поиска видео!</p>
<h2 id="Build-your-own" class="common-anchor-header">Создайте свою собственную<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье мы использовали Milvus для создания системы поиска видео по изображениям. Это пример применения Milvus для обработки неструктурированных данных.</p>
<p>Milvus совместим с множеством фреймворков глубокого обучения и позволяет осуществлять поиск за миллисекунды для векторов масштабом в миллиарды. Не стесняйтесь брать Milvus с собой в другие AI-сценарии: https://github.com/milvus-io/milvus.</p>
<p>Не будьте чужими, следите за нами в <a href="https://twitter.com/milvusio/">Twitter</a> или присоединяйтесь к нам в <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</p>
