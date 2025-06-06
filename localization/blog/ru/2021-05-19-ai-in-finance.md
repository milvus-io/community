---
id: ai-in-.md
title: >-
  Ускорение ИИ в финансах с помощью Milvus, векторной базы данных с открытым
  исходным кодом
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus можно использовать для создания приложений искусственного интеллекта
  для финансовой отрасли, включая чат-боты, системы рекомендаций и многое
  другое.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Ускорение ИИ в финансах с помощью Milvus, векторной базы данных с открытым исходным кодом</custom-h1><p>Банки и другие финансовые учреждения уже давно стали первыми последователями программного обеспечения с открытым исходным кодом для обработки больших данных и аналитики. В 2010 году Morgan Stanley <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">начал использовать</a> фреймворк Apache Hadoop с открытым исходным кодом в рамках небольшого эксперимента. Компании не удавалось успешно масштабировать традиционные базы данных для работы с огромными объемами данных, которые хотели использовать ее ученые, поэтому она решила изучить альтернативные решения. Сейчас Hadoop является основным инструментом в Morgan Stanley, помогая во всем - от управления данными CRM до портфельного анализа. Другие реляционные базы данных с открытым исходным кодом, такие как MySQL, MongoDB и PostgreSQL, стали незаменимыми инструментами для осмысления больших данных в финансовой отрасли.</p>
<p>Технологии - это то, что дает индустрии финансовых услуг конкурентное преимущество, а искусственный интеллект (ИИ) быстро становится стандартным подходом к извлечению ценных сведений из больших данных и анализу деятельности в режиме реального времени в банковском секторе, секторе управления активами и страховании. Используя алгоритмы искусственного интеллекта для преобразования неструктурированных данных, таких как изображения, аудио или видео, в векторы - машиночитаемый формат числовых данных, - можно проводить поиск сходства в огромных наборах векторных данных, насчитывающих миллионы, миллиарды или даже триллионы. Векторные данные хранятся в высокоразмерном пространстве, и похожие векторы можно найти с помощью поиска сходства, для чего требуется специальная инфраструктура, называемая векторной базой данных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> - это векторная база данных с открытым исходным кодом, созданная специально для управления векторными данными, что означает, что инженеры и специалисты по анализу данных могут сосредоточиться на создании приложений ИИ или проведении анализа, а не на базовой инфраструктуре данных. Платформа была создана с учетом рабочих процессов разработки приложений ИИ и оптимизирована для оптимизации операций машинного обучения (MLOps). Более подробную информацию о Milvus и лежащей в ее основе технологии можно найти в нашем <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">блоге</a>.</p>
<p>Распространенные области применения ИИ в сфере финансовых услуг включают алгоритмическую торговлю, составление и оптимизацию портфелей, проверку моделей, бэктестирование, робо-консультирование, виртуальные помощники клиентов, анализ влияния на рынок, соответствие нормативным требованиям и стресс-тестирование. В этой статье рассматриваются три конкретные области, в которых векторные данные используются как один из наиболее ценных активов для банковских и финансовых компаний:</p>
<ol>
<li>Повышение качества обслуживания клиентов с помощью банковских чат-ботов</li>
<li>Повышение продаж финансовых услуг и многое другое с помощью рекомендательных систем</li>
<li>Анализ отчетов о прибылях и других неструктурированных финансовых данных с помощью семантического анализа текста</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Повышение качества обслуживания клиентов с помощью банковских чатботов</h3><p>Банковские чат-боты могут повысить качество обслуживания клиентов, помогая им выбирать инвестиции, банковские продукты и страховые полисы. Цифровые услуги быстро набирают популярность, отчасти благодаря тенденциям, ускоренным пандемией коронавируса. Чат-боты работают, используя обработку естественного языка (NLP) для преобразования заданных пользователем вопросов в семантические векторы для поиска подходящих ответов. Современные банковские чат-боты предлагают пользователям персонализированный естественный опыт и разговаривают в разговорном тоне. Milvus предоставляет структуру данных, хорошо подходящую для создания чат-ботов с использованием поиска векторного сходства в режиме реального времени.</p>
<p>Узнайте больше в нашей демонстрации, посвященной созданию <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">чат-ботов с помощью Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Повышение продаж финансовых услуг и многое другое с помощью рекомендательных систем:</h4><p>Частный банковский сектор использует рекомендательные системы для увеличения продаж финансовых продуктов за счет персонализированных рекомендаций на основе профилей клиентов. Рекомендательные системы также могут быть использованы в финансовых исследованиях, деловых новостях, выборе акций и системах поддержки торговли. Благодаря моделям глубокого обучения каждый пользователь и товар описывается как вектор вложения. Векторная база данных предлагает пространство встраивания, в котором можно вычислить сходство между пользователями и предметами.</p>
<p>Узнайте больше из нашей <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">демонстрации</a>, посвященной рекомендательным системам на основе графов с помощью Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Анализ отчетов о прибылях и других неструктурированных финансовых данных с помощью семантического анализа текста:</h4><p>Методы интеллектуального анализа текста оказали существенное влияние на финансовую отрасль. По мере экспоненциального роста финансовых данных, анализ текстов стал важной областью исследований в финансовой сфере.</p>
<p>В настоящее время применяются модели глубокого обучения для представления финансовых отчетов в виде векторов слов, способных отражать многочисленные семантические аспекты. Векторная база данных, такая как Milvus, способна хранить массивные семантические векторы слов из миллионов отчетов и проводить по ним поиск сходства за миллисекунды.</p>
<p>Узнайте больше о том, как <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">использовать Deepset's Haystack с Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Не будьте чужаком</h3><ul>
<li>Найдите Milvus на <a href="https://github.com/milvus-io/milvus/">GitHub</a> и внесите в него свой вклад.</li>
<li>Общайтесь с сообществом через <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Общайтесь с нами в <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
