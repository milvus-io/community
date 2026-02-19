---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  Что если бы вы могли увидеть, почему RAG не работает? Отладка RAG в 3D с
  помощью Project_Golem и Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Узнайте, как Project_Golem и Milvus делают системы RAG наблюдаемыми,
  визуализируя векторное пространство, отлаживая ошибки поиска и масштабируя
  векторный поиск в реальном времени.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Когда поиск по RAG идет не так, вы обычно знаете, что он сломан - релевантные документы не отображаются или отображаются нерелевантные. Но выяснить причину - совсем другая история. Все, с чем вам приходится работать, - это оценки сходства и плоский список результатов. Нет возможности увидеть, как документы расположены в векторном пространстве, как фрагменты соотносятся друг с другом или где ваш запрос оказался относительно контента, который он должен был найти. На практике это означает, что отладка RAG сводится в основном к методу проб и ошибок: меняем стратегию чанкинга, меняем модель встраивания, корректируем top-k и надеемся, что результаты улучшатся.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> - это инструмент с открытым исходным кодом, который делает векторное пространство видимым. Он использует UMAP для проецирования высокоразмерных вкраплений в 3D и Three.js для их интерактивного отображения в браузере. Вместо того чтобы гадать, почему поиск не удался, вы можете увидеть, как семантически кластеризуются фрагменты, куда попадает ваш запрос и какие документы были получены - и все это в едином визуальном интерфейсе.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Это потрясающе. Однако оригинальный Project_Golem был разработан для небольших демо-версий, а не для реальных систем. Он опирается на плоские файлы, грубый поиск и перестройку всего набора данных, а это значит, что он быстро выходит из строя, когда объем ваших данных превышает несколько тысяч документов.</p>
<p>Чтобы устранить этот пробел, мы интегрировали Project_Golem с <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (в частности, с версией 2.6.8) в качестве векторной основы. Milvus - это высокопроизводительная векторная база данных с открытым исходным кодом, которая обрабатывает данные в реальном времени, масштабируемое индексирование и поиск на миллисекундном уровне, а Project_Golem остается сосредоточенным на том, что он делает лучше всего: делает поведение векторного поиска видимым. Вместе они превращают 3D-визуализацию из игрушечной демонстрации в практический инструмент отладки для производственных систем RAG.</p>
<p>В этом посте мы расскажем о Project_Golem и покажем, как мы интегрировали его с Milvus, чтобы сделать поведение векторного поиска наблюдаемым, масштабируемым и готовым к производству.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Что такое Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>Отладка RAG затруднена по простой причине: векторные пространства являются высокоразмерными, и человек не может их увидеть.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> - это браузерный инструмент, позволяющий увидеть векторное пространство, в котором работает ваша RAG-система. Он берет высокоразмерные вкрапления, которые используются для поиска - обычно это 768 или 1536 измерений - и проецирует их в интерактивную 3D-сцену, которую вы можете исследовать напрямую.</p>
<p>Вот как это работает под капотом:</p>
<ul>
<li>Снижение размерности с помощью UMAP. Project_Golem использует UMAP для сжатия высокоразмерных векторов до трех измерений с сохранением их относительных расстояний. Куски, семантически схожие в исходном пространстве, остаются рядом в 3D-проекции; несвязанные куски оказываются далеко друг от друга.</li>
<li>3D-рендеринг с помощью Three.js. Каждый фрагмент документа отображается в виде узла в 3D-сцене, отображаемой в браузере. Вы можете вращать, масштабировать и исследовать пространство, чтобы увидеть, как группируются ваши документы - какие темы тесно сгруппированы, какие пересекаются и где находятся границы.</li>
<li>Выделение при запросе. Когда вы выполняете запрос, поиск по-прежнему происходит в исходном высокоразмерном пространстве с использованием косинусного сходства. Но после получения результатов извлеченные фрагменты подсвечиваются в 3D-виде. Вы можете сразу же увидеть, куда попал ваш запрос относительно результатов - и, что не менее важно, относительно документов, которые он не извлек.</li>
</ul>
<p>Именно это делает Project_Golem полезным для отладки. Вместо того чтобы смотреть на ранжированный список результатов и гадать, почему был пропущен релевантный документ, вы можете увидеть, находится ли он в отдаленном кластере (проблема встраивания), перекрывается нерелевантным контентом (проблема объединения) или просто едва выходит за порог поиска (проблема конфигурации). 3D-видение превращает абстрактные показатели сходства в пространственные отношения, о которых можно рассуждать.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Почему Project_Golem не готов к производству<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem создавался как прототип визуализации, и он отлично справляется с этой задачей. Но в его архитектуре заложены предположения, которые быстро разрушаются при масштабировании - в тех случаях, когда вы хотите использовать его для реальной отладки RAG.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Каждое обновление требует полной пересборки</h3><p>Это самое фундаментальное ограничение. В первоначальном варианте добавление новых документов приводит к полной перестройке конвейера: встраивания регенерируются и записываются в файлы .npy, UMAP повторно запускается для всего набора данных, а 3D-координаты повторно экспортируются в формате JSON.</p>
<p>Даже при 100 000 документов запуск UMAP на одном ядре занимает 5-10 минут. При масштабе в миллион документов это становится совершенно нецелесообразным. Вы не сможете использовать этот метод для любых наборов данных, которые постоянно меняются - новостные ленты, документация, разговоры пользователей, - поскольку каждое обновление означает ожидание полного цикла обработки.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">Грубый поиск не масштабируется</h3><p>У стороны поиска есть свой потолок. Оригинальная реализация использует NumPy для грубого поиска по косинусному сходству - линейная сложность по времени, без индексации. На наборе данных в миллион документов один запрос может занять более секунды. Это неприемлемо для любой интерактивной или онлайновой системы.</p>
<p>Проблема усугубляется нехваткой памяти. Каждый 768-мерный вектор float32 занимает примерно 3 КБ, поэтому набор данных из миллиона векторов требует более 3 ГБ памяти - и все это загружено в плоский массив NumPy без индексной структуры, чтобы сделать поиск эффективным.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Нет фильтрации метаданных, нет многопользовательского доступа</h3><p>В реальной системе RAG сходство векторов редко является единственным критерием поиска. Почти всегда требуется фильтрация по метаданным, таким как тип документа, временные метки, разрешения пользователя или границы на уровне приложения. Например, RAG-система поддержки клиентов должна ограничивать поиск документами конкретного арендатора, а не искать по всем данным.</p>
<p>Project_Golem не поддерживает ничего из этого. Здесь нет ни ANN-индексов (таких как HNSW или IVF), ни скалярной фильтрации, ни изоляции арендаторов, ни гибридного поиска. Это слой визуализации, под которым нет механизма поиска.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Как Milvus обеспечивает работу поискового слоя Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>В предыдущем разделе были выявлены три недостатка: полная перестройка при каждом обновлении, поиск с применением грубой силы и отсутствие поиска с учетом метаданных. Все три недостатка связаны с одной и той же первопричиной - у Project_Golem нет слоя базы данных. Извлечение, хранение и визуализация объединены в единый конвейер, поэтому изменение любой части приводит к перестройке всего.</p>
<p>Исправление заключается не в оптимизации этого конвейера. Его нужно разделить на части.</p>
<p>Интегрировав Milvus 2.6.8 в качестве векторной основы, поиск становится выделенным, производственным уровнем, который работает независимо от визуализации. Milvus занимается хранением векторов, индексацией и поиском. Project_Golem фокусируется исключительно на визуализации - потреблении идентификаторов документов из Milvus и их выделении в 3D-виде.</p>
<p>Такое разделение позволяет создать два чистых, независимых потока:</p>
<p>Поток извлечения (онлайн, миллисекундный уровень)</p>
<ul>
<li>Ваш запрос преобразуется в вектор с помощью вкраплений OpenAI.</li>
<li>Вектор запроса отправляется в коллекцию Milvus.</li>
<li>Milvus AUTOINDEX выбирает и оптимизирует подходящий индекс.</li>
<li>Поиск по косинусному сходству в реальном времени возвращает идентификаторы соответствующих документов.</li>
</ul>
<p>Поток визуализации (автономный, демонстрационный)</p>
<ul>
<li>UMAP генерирует 3D-координаты во время приема данных (n_neighbors=30, min_dist=0.1).</li>
<li>Координаты хранятся в файле golem_cortex.json.</li>
<li>Фронтенд выделяет соответствующие 3D-узлы, используя идентификаторы документов, возвращаемые Milvus.</li>
</ul>
<p>Важный момент: поиск больше не ждет визуализации. Вы можете загружать новые документы и сразу же искать их - 3D-видение будет работать по собственному расписанию.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Что меняют потоковые узлы</h3><p>Захват документов в режиме реального времени обеспечивается новой возможностью в Milvus 2.6.8: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">потоковыми узлами</a>. В более ранних версиях для ингестирования в реальном времени требовалась внешняя очередь сообщений, например Kafka или Pulsar. Streaming Nodes переносит эту координацию в сам Milvus - новые векторы поступают непрерывно, индексы обновляются постепенно, а вновь добавленные документы становятся доступными для поиска немедленно, без полной перестройки и внешних зависимостей.</p>
<p>Для Project_Golem это то, что делает архитектуру практичной. Вы можете постоянно добавлять документы в систему RAG - новые статьи, обновленные документы, пользовательский контент - и поиск будет оставаться актуальным без дорогостоящего цикла UMAP → JSON → перезагрузка.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Расширение визуализации до миллионных масштабов (будущий путь)</h3><p>В настоящее время Project_Golem, поддерживающий Milvus, поддерживает интерактивные демонстрации на уровне около 10 000 документов. Извлечение документов масштабируется гораздо шире - Milvus справляется с миллионами, - но конвейер визуализации все еще полагается на пакетные запуски UMAP. Чтобы устранить этот пробел, архитектура может быть расширена инкрементным конвейером визуализации:</p>
<ul>
<li><p>Триггеры обновлений: Система прослушивает события вставки в коллекцию Milvus. Как только количество добавленных документов достигает определенного порога (например, 1 000 единиц), запускается инкрементное обновление.</p></li>
<li><p>Инкрементная проекция: Вместо повторного запуска UMAP по всему набору данных новые векторы проецируются в существующее 3D-пространство с помощью метода UMAP transform(). Это позволяет сохранить глобальную структуру и значительно сократить вычислительные затраты.</p></li>
<li><p>Синхронизация с фронтендом: Обновленные фрагменты координат передаются на фронтенд через WebSocket, что позволяет динамически появляться новым узлам без перезагрузки всей сцены.</p></li>
</ul>
<p>Помимо масштабируемости, Milvus 2.6.8 обеспечивает гибридный поиск, сочетая векторное сходство с полнотекстовым поиском и скалярной фильтрацией. Это открывает возможности для более богатых 3D-взаимодействий, таких как выделение ключевых слов, фильтрация по категориям и нарезка по времени, предоставляя разработчикам более мощные способы изучения, отладки и рассуждений о поведении RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Как развернуть и изучить Project_Golem с помощью Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Обновленный Project_Golem теперь имеет открытый исходный код на <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Используя официальную документацию Milvus в качестве набора данных, мы рассмотрим полный процесс визуализации поиска RAG в 3D. В настройке используются Docker и Python, и ее легко выполнить, даже если вы начинаете с нуля.</p>
<h3 id="Prerequisites" class="common-anchor-header">Необходимые условия</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Ключ API OpenAI</li>
<li>Набор данных (документация Milvus в формате Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Разверните Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Реализация ядра</h3><p>Интеграция Milvus (ingest.py)</p>
<p>Примечание: Реализация поддерживает до восьми категорий документов. Если количество категорий превышает этот лимит, цвета используются повторно по кругу.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Визуализация фронтенда (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Скачайте набор данных и поместите его в указанный каталог</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Запустите проект</h3><p>Преобразование текстовых вкраплений в 3D-пространство</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[image]</p>
<p>Запустите службу фронтенда</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Визуализация и взаимодействие</h3><p>После того как фронтенд получает результаты поиска, яркость узлов масштабируется на основе косинусоидального сходства, при этом оригинальные цвета узлов сохраняются, чтобы сохранить четкие кластеры категорий. Полупрозрачные линии проводятся от точки запроса до каждого совпадающего узла, а камера плавно поворачивается и увеличивается, чтобы сфокусироваться на активированном кластере.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Пример 1: Внутридоменное сопоставление</h4><p>Запрос: "Какие типы индексов поддерживает Milvus?".</p>
<p>Поведение визуализации:</p>
<ul>
<li><p>В 3D-пространстве примерно 15 узлов в красном кластере с надписью INDEXES заметно увеличивают яркость (примерно на 2-3×).</p></li>
<li><p>Соответствующие узлы включают фрагменты из таких документов, как index_types.md, hnsw_index.md и ivf_index.md.</p></li>
<li><p>От вектора запроса к каждому совпадающему узлу отрисовываются полупрозрачные линии, и камера плавно фокусируется на красном кластере.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Пример 2: Отклонение запросов вне домена</h4><p>Запрос: "Сколько стоит столовая KFC?".</p>
<p>Поведение визуализации:</p>
<ul>
<li><p>Все узлы сохраняют свои оригинальные цвета, с незначительными изменениями размера (менее 1,1×).</p></li>
<li><p>Совпавшие узлы разбросаны по нескольким кластерам с разными цветами, не показывая четкой смысловой концентрации.</p></li>
<li><p>Камера не вызывает действия фокусировки, поскольку порог сходства (0,5) не достигнут.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Project_Golem в паре с Milvus не заменит существующий конвейер оценки RAG, но он добавляет то, чего не хватает большинству конвейеров: возможность видеть, что происходит внутри векторного пространства.</p>
<p>С помощью этой системы вы можете отличить неудачный поиск, вызванный плохим вложением, неудачный поиск, вызванный плохим разбиением на части, от неудачного поиска, вызванного слишком жестким порогом. Раньше для такой диагностики требовались догадки и итерации. Теперь вы можете это увидеть.</p>
<p>Текущая интеграция поддерживает интерактивную отладку в демонстрационном масштабе (~10 000 документов), при этом векторная база данных Milvus выполняет поиск производственного уровня за кулисами. Путь к визуализации в миллионном масштабе намечен, но еще не построен, поэтому сейчас самое время принять участие.</p>
<p>Проверьте <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> на GitHub, попробуйте его с вашим собственным набором данных и посмотрите, как на самом деле выглядит ваше векторное пространство.</p>
<p>Если у вас есть вопросы или вы хотите поделиться своими находками, присоединяйтесь к нашему <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">каналу Slack</a> или запишитесь на сеанс <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы получить практическое руководство по настройке.</p>
