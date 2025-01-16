---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: Общая архитектура
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: QA-бот нового поколения уже здесь
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>Создание интеллектуальной системы контроля качества с помощью НЛП и Milvus</custom-h1><p>Проект Milvus：github.com/milvus-io/milvus</p>
<p>Система ответов на вопросы широко используется в области обработки естественного языка. Она используется для ответов на вопросы в форме естественного языка и имеет широкий спектр применения. Типичные приложения включают в себя: интеллектуальное голосовое взаимодействие, обслуживание клиентов онлайн, получение знаний, персонализированные эмоциональные чаты и многое другое. Большинство систем ответов на вопросы можно классифицировать следующим образом: генеративные и поисковые системы ответов на вопросы, однораундовые и многораундовые системы ответов на вопросы, открытые системы ответов на вопросы и специфические системы ответов на вопросы.</p>
<p>В данной статье рассматривается система QA, разработанная для конкретной области, которую обычно называют интеллектуальным роботом для обслуживания клиентов. В прошлом создание робота для обслуживания клиентов обычно требовало преобразования знаний о домене в ряд правил и графов знаний. Процесс построения в значительной степени зависит от "человеческого" интеллекта. После изменения сценариев требовалось много повторяющейся работы. С применением глубокого обучения в обработке естественного языка (NLP) машинное чтение может автоматически находить ответы на соответствующие вопросы непосредственно из документов. Языковая модель глубокого обучения преобразует вопросы и документы в семантические векторы, чтобы найти подходящий ответ.</p>
<p>В этой статье используется открытая модель BERT от Google и Milvus, векторная поисковая система с открытым исходным кодом, для быстрого создания бота для вопросов и ответов, основанного на семантическом понимании.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Общая архитектура<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>В этой статье реализована система ответов на вопросы с помощью сопоставления семантического сходства. Общий процесс построения выглядит следующим образом:</p>
<ol>
<li>Получите большое количество вопросов с ответами в определенной области (стандартный набор вопросов).</li>
<li>С помощью модели BERT преобразуйте эти вопросы в векторы признаков и сохраните их в Milvus. Одновременно Milvus присвоит каждому вектору идентификатор вектора.</li>
<li>Храните эти репрезентативные идентификаторы вопросов и соответствующие им ответы в PostgreSQL.</li>
</ol>
<p>Когда пользователь задает вопрос:</p>
<ol>
<li>BERT-модель преобразует его в вектор признаков.</li>
<li>Milvus выполняет поиск по сходству и извлекает идентификатор, наиболее похожий на вопрос.</li>
<li>PostgreSQL возвращает соответствующий ответ.</li>
</ol>
<p>Схема архитектуры системы выглядит следующим образом (синие линии представляют процесс импорта, а желтые - процесс запроса):</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>Далее мы покажем вам, как шаг за шагом построить онлайн-систему вопросов и ответов.</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Шаги по созданию системы вопросов и ответов<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Прежде чем начать, необходимо установить Milvus и PostgreSQL. Конкретные шаги по установке см. на официальном сайте Milvus.</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1. Подготовка данных</h3><p>Экспериментальные данные в этой статье получены с сайта: https://github.com/chatopera/insuranceqa-corpus-zh.</p>
<p>Набор данных содержит пары вопросов и ответов, связанных со страховой индустрией. В этой статье мы извлекаем из него 20 000 пар вопросов и ответов. Используя этот набор вопросов и ответов, вы сможете быстро создать робота для обслуживания клиентов в страховой отрасли.</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2. Генерируем векторы признаков</h3><p>Эта система использует модель, предварительно обученную компанией BERT. Загрузите ее по ссылке ниже перед началом работы: https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip.</p>
<p>Используйте эту модель для преобразования базы данных вопросов в векторы признаков для последующего поиска сходства. Дополнительные сведения о службе BERT см. на сайте https://github.com/hanxiao/bert-as-service.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-code-block.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3. Импорт в Milvus и PostgreSQL</h3><p>Нормализуйте и импортируйте сгенерированные векторы признаков в Milvus, а затем импортируйте идентификаторы, полученные Milvus, и соответствующие ответы в PostgreSQL. Ниже показана структура таблицы в PostgreSQL:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4. Получение ответов</h3><p>Пользователь вводит вопрос, и после генерации вектора признаков с помощью BERT он может найти наиболее похожий вопрос в библиотеке Milvus. В этой статье используется косинусное расстояние для представления сходства между двумя предложениями. Поскольку все векторы нормализованы, чем ближе косинусное расстояние между двумя векторами признаков к 1, тем выше сходство.</p>
<p>На практике ваша система может не иметь в библиотеке идеально подходящих вопросов. Тогда можно установить пороговое значение 0,9. Если наибольшее найденное расстояние сходства меньше этого порога, система сообщит, что в ней нет связанных вопросов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-retrieve-answers.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">Демонстрация работы системы<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Ниже показан пример интерфейса системы:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>Введите свой вопрос в диалоговое окно и получите соответствующий ответ:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
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
    </button></h2><p>Мы надеемся, что после прочтения этой статьи вы легко сможете создать свою собственную систему вопросов и ответов.</p>
<p>Благодаря модели BERT вам больше не нужно предварительно сортировать и организовывать текстовые корпорации. В то же время, благодаря высокой производительности и масштабируемости векторного поискового движка Milvus с открытым исходным кодом, ваша система QA может поддерживать корпус до сотен миллионов текстов.</p>
<p>Milvus официально присоединился к Linux AI (LF AI) Foundation для инкубации. Приглашаем вас присоединиться к сообществу Milvus и работать с нами над ускорением применения технологий искусственного интеллекта!</p>
<p>=&gt; Попробуйте нашу онлайн-демонстрацию здесь: https://www.milvus.io/scenarios</p>
