---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: 'Дорожная карта Milvus 2025 - расскажите нам, что вы думаете'
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  В 2025 году мы выпускаем две основные версии, Milvus 2.6 и Milvus 3.0, а также
  много других технических возможностей. Мы приглашаем вас поделиться с нами
  своими мыслями.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Привет, пользователи и соавторы Milvus!</p>
<p>Мы рады поделиться с вами нашей <a href="https://milvus.io/docs/roadmap.md"><strong>дорожной картой Milvus 2025</strong></a>. 🚀 В этом техническом плане выделены ключевые функции и улучшения, которые мы создаем, чтобы сделать Milvus еще более мощным для ваших потребностей в векторном поиске.</p>
<p>Но это только начало - нам нужны ваши мнения! Ваши отзывы помогают формировать Milvus, обеспечивая его развитие в соответствии с реальными задачами. Сообщите нам свое мнение и помогите уточнить дорожную карту по мере продвижения вперед.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">Текущий ландшафт<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>За прошедший год мы видели, как многие из вас создали впечатляющие RAG и агентские приложения с помощью Milvus, используя многие из наших популярных функций, таких как интеграция моделей, полнотекстовый поиск и гибридный поиск. Ваши реализации позволили получить ценные сведения о требованиях к векторному поиску в реальном мире.</p>
<p>По мере развития технологий ИИ ваши сценарии использования становятся все более сложными - от базового векторного поиска до сложных мультимодальных приложений, охватывающих интеллектуальные агенты, автономные системы и воплощенный ИИ. Эти технические проблемы лежат в основе нашей дорожной карты, поскольку мы продолжаем развивать Milvus, чтобы удовлетворить ваши потребности.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Два крупных релиза в 2025 году: Milvus 2.6 и Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>В 2025 году мы выпустим две основные версии: Milvus 2.6 (середина 2025 года) и Milvus 3.0 (конец 2025 года).</p>
<p><strong>Milvus 2.6</strong> сфокусирован на основных улучшениях архитектуры, о которых вы просили:</p>
<ul>
<li><p>Более простое развертывание с меньшим количеством зависимостей (прощайте, головная боль при развертывании!)</p></li>
<li><p>Более быстрые конвейеры ввода данных</p></li>
<li><p>Снижение затрат на хранение данных (мы слышали ваши опасения по поводу стоимости производства)</p></li>
<li><p>Улучшенная обработка масштабных операций с данными (удаление/изменение)</p></li>
<li><p>Более эффективный скалярный и полнотекстовый поиск</p></li>
<li><p>Поддержка новейших моделей встраивания, с которыми вы работаете.</p></li>
</ul>
<p><strong>Milvus 3.0</strong> - это наша большая архитектурная эволюция, представляющая систему векторного озера данных для:</p>
<ul>
<li><p>Бесшовной интеграции сервисов ИИ</p></li>
<li><p>Поисковые возможности нового уровня</p></li>
<li><p>Более надежное управление данными</p></li>
<li><p>Лучшая обработка массивных автономных наборов данных, с которыми вы работаете.</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Планируемые технические возможности - нам нужна ваша обратная связь<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Ниже перечислены ключевые технические возможности, которые мы планируем добавить в Milvus.</p>
<table>
<thead>
<tr><th><strong>Область ключевых возможностей</strong></th><th><strong>Технические возможности</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Обработка неструктурированных данных на основе искусственного интеллекта</strong></td><td>- Ввод/вывод данных: Встроенная интеграция с основными модельными сервисами для ввода сырого текста<br>- Обработка исходных данных: Поддержка текстовых/URL ссылок для обработки исходных данных<br>- Поддержка тензоров: Реализация векторного списка (для сценариев ColBERT/CoPali/Video)<br>- Расширенные типы данных: DateTime, Map, поддержка ГИС на основе требований<br>- Итеративный поиск: Уточнение вектора запроса на основе обратной связи с пользователем</td></tr>
<tr><td><strong>Улучшение качества и производительности поиска</strong></td><td>- Расширенное сопоставление: возможности фразового и многократного сопоставления<br>- Обновление анализатора: расширенная поддержка токенизаторов и улучшенная наблюдаемость анализатора<br>- Оптимизация JSON: Ускоренная фильтрация благодаря улучшенному индексированию<br>- Сортировка выполнения: Упорядочивание результатов на основе скалярных полей<br>- Расширенный ранжировщик: Ранжирование на основе моделей и пользовательские функции оценки<br>- Итеративный поиск: Уточнение вектора запроса с помощью обратной связи с пользователем</td></tr>
<tr><td><strong>Гибкость управления данными</strong></td><td>- Изменение схемы: Добавление/удаление поля, изменение длины varchar<br>- Скалярные агрегации: операции count/distinct/min/max<br>- Поддержка UDF: Поддержка функций, определяемых пользователем<br>- Версионирование данных: Система отката на основе моментальных снимков<br>- Кластеризация данных: Совместное размещение с помощью конфигурации<br>- Выборка данных: Быстрое получение результатов на основе данных выборки</td></tr>
<tr><td><strong>Архитектурные усовершенствования</strong></td><td>- Потоковый узел: Упрощенный инкрементный ввод данных<br>- MixCoord: Унифицированная архитектура координатора<br>- Независимость хранилища логов: Уменьшение внешних зависимостей, как у pulsar<br>- PK Deduplication: Глобальная дедупликация первичных ключей</td></tr>
<tr><td><strong>Экономическая эффективность и усовершенствование архитектуры</strong></td><td>- Многоуровневое хранение: Разделение горячих и холодных данных для снижения стоимости хранения<br>- Политика удаления данных: Пользователи могут определять собственную политику удаления данных<br>- Массовые обновления: Поддержка модификации значений по конкретным полям, ETL и т. д.<br>- Large TopK: возврат массивных наборов данных<br>- VTS GA: Подключение к различным источникам данных<br>- Расширенное квантование: Оптимизация потребления памяти и производительности на основе методов квантования<br>- Эластичность ресурсов: Динамическое масштабирование ресурсов в соответствии с изменяющимися нагрузками на запись, чтение и фоновые задачи.</td></tr>
</tbody>
</table>
<p>По мере реализации этой дорожной карты мы будем благодарны за ваши мысли и отзывы по следующим вопросам:</p>
<ol>
<li><p><strong>Приоритеты функций:</strong> Какие функции из нашей дорожной карты окажут наибольшее влияние на вашу работу?</p></li>
<li><p><strong>Идеи реализации:</strong> Какие конкретные подходы, по вашему мнению, будут хорошо работать для этих функций?</p></li>
<li><p><strong>Соответствие сценариям использования:</strong> Как эти запланированные функции согласуются с вашими текущими и будущими сценариями использования?</p></li>
<li><p><strong>Соображения по поводу производительности:</strong> На каких аспектах производительности мы должны сосредоточиться для ваших конкретных нужд?</p></li>
</ol>
<p><strong>Ваши соображения помогут нам сделать Milvus лучше для всех. Не стесняйтесь делиться своими мыслями на нашем<a href="https://github.com/milvus-io/milvus/discussions/40263"> форуме Milvus Discussion Forum</a> или на нашем <a href="https://discord.com/invite/8uyFbECzPX">канале Discord</a>.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Добро пожаловать в Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Будучи проектом с открытым исходным кодом, Milvus всегда рад вашему вкладу:</p>
<ul>
<li><p><strong>Делитесь отзывами:</strong> Сообщайте о проблемах или предлагайте функции через нашу <a href="https://github.com/milvus-io/milvus/issues">страницу проблем на GitHub.</a></p></li>
<li><p><strong>Вклад в код:</strong> Подавайте запросы на исправление (см. наше <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">руководство для разработчиков</a>).</p></li>
<li><p><strong>Распространяйте информацию:</strong> делитесь своим опытом работы с Milvus и <a href="https://github.com/milvus-io/milvus">ставьте звездочки в нашем репозитории GitHub</a>.</p></li>
</ul>
<p>Мы рады построить следующую главу Milvus вместе с вами. Ваш код, идеи и отзывы двигают этот проект вперед!</p>
<p>- Команда Milvus</p>
