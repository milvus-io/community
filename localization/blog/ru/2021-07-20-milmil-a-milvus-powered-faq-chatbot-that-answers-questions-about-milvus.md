---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: 'MilMil Чатбот FAQ на базе Milvus, который отвечает на вопросы о Milvus'
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: >-
  Использование инструментов векторного поиска с открытым исходным кодом для
  создания сервиса ответов на вопросы.
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil: Чатбот FAQ на базе Milvus, который отвечает на вопросы о Milvus</custom-h1><p>Недавно сообщество разработчиков открытого кода создало MilMil - чат-бот Milvus FAQ, созданный пользователями Milvus и для пользователей Milvus. MilMil доступен круглосуточно и без выходных на сайте <a href="https://milvus.io/">Milvus.io</a>, чтобы ответить на распространенные вопросы о Milvus, самой продвинутой в мире векторной базе данных с открытым исходным кодом.</p>
<p>Эта система ответов на вопросы не только помогает быстрее решать общие проблемы, с которыми сталкиваются пользователи Milvus, но и выявляет новые проблемы на основе ответов пользователей. База данных MilMil включает вопросы, заданные пользователями с момента выхода проекта под лицензией с открытым исходным кодом в 2019 году. Вопросы хранятся в двух коллекциях: одна для Milvus 1.x и более ранних версий, другая - для Milvus 2.0.</p>
<p>В настоящее время MilMil доступен только на английском языке.</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">Как работает MilMil?<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMil опирается на модель <em>sentence-transformers/paraphrase-mpnet-base-v2</em> для получения векторных представлений базы данных FAQ, затем Milvus используется для поиска векторного сходства, чтобы вернуть семантически похожие вопросы.</p>
<p>Сначала данные FAQ преобразуются в семантические векторы с помощью BERT, модели обработки естественного языка (NLP). Затем эти вложения вставляются в Milvus, и каждому из них присваивается уникальный идентификатор. Наконец, вопросы и ответы вставляются в реляционную базу данных PostgreSQL вместе с идентификаторами векторов.</p>
<p>Когда пользователи задают вопрос, система преобразует его в вектор признаков с помощью BERT. Затем она ищет в Milvus пять векторов, наиболее похожих на вектор запроса, и извлекает их идентификаторы. Наконец, вопросы и ответы, соответствующие идентификаторам векторов, возвращаются пользователю.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>system-process.png</span> </span></p>
<p>Посмотрите проект <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">"Система ответов на вопросы"</a> в буткемпе Milvus, чтобы изучить код, используемый для создания чат-ботов с искусственным интеллектом.</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">Спросите Милмила о Milvus<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы пообщаться с MilMil, перейдите на любую страницу на <a href="https://milvus.io/">Milvus.io</a> и нажмите на значок птички в правом нижнем углу. Введите свой вопрос в поле для ввода текста и нажмите кнопку "Отправить". МилМил ответит вам через миллисекунды! Кроме того, выпадающий список в левом верхнем углу можно использовать для переключения между технической документацией для разных версий Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>После отправки вопроса бот сразу же возвращает три вопроса, семантически схожих с заданным. Вы можете нажать "Посмотреть ответ", чтобы просмотреть возможные ответы на ваш вопрос, или "Посмотреть еще", чтобы просмотреть больше вопросов, связанных с вашим поиском. Если подходящего ответа нет, нажмите "Оставить свой отзыв здесь", чтобы задать свой вопрос и указать адрес электронной почты. Помощь от сообщества Milvus придет в ближайшее время!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>chatbot_UI.png</span> </span></p>
<p>Попробуйте MilMil и дайте нам знать, что вы думаете. Все вопросы, комментарии или любая форма обратной связи приветствуются.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Не будьте незнакомцем<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Найдите Milvus на <a href="https://github.com/milvus-io/milvus/">GitHub</a> и внесите в него свой вклад.</li>
<li>Общайтесь с сообществом через <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Общайтесь с нами в <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
