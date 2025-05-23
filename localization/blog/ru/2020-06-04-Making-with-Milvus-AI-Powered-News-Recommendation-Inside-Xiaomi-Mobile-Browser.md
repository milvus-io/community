---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: Создание с помощью ИИ Milvus рекомендаций новостей в мобильном браузере Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Узнайте, как Xiaomi использовала ИИ и Milvus для создания интеллектуальной
  системы рекомендаций новостей, способной находить наиболее релевантный контент
  для пользователей своего мобильного веб-браузера.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Создание с Milvus: рекомендация новостей с помощью искусственного интеллекта в мобильном браузере Xiaomi</custom-h1><p>От лент социальных сетей до рекомендаций плейлистов на Spotify - <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">искусственный интеллект</a> уже играет важную роль в контенте, который мы видим и с которым взаимодействуем каждый день. Стремясь выделить свой мобильный веб-браузер, транснациональный производитель электроники Xiaomi создал механизм рекомендаций новостей на основе искусственного интеллекта. В качестве основной платформы управления данными в приложении была использована <a href="https://milvus.io/">Milvus</a>- векторная база данных с открытым исходным кодом, созданная специально для поиска сходства и искусственного интеллекта. В этой статье рассказывается о том, как Xiaomi создала новостной рекомендательный механизм на основе ИИ, а также о том, как использовались Milvus и другие алгоритмы ИИ.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Использование ИИ для предложения персонализированного контента и преодоления новостного шума</h3><p>Только газета New York Times ежедневно публикует более <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230</a> материалов, и из-за огромного количества статей отдельные люди не могут получить полное представление обо всех новостях. Чтобы просеять большие объемы контента и порекомендовать наиболее актуальные или интересные материалы, мы все чаще обращаемся к искусственному интеллекту. Хотя рекомендации по-прежнему далеки от совершенства, машинное обучение становится все более необходимым для того, чтобы пробиться сквозь постоянный поток новой информации, льющейся из нашего все более сложного и взаимосвязанного мира.</p>
<p>Компания Xiaomi производит и инвестирует в смартфоны, мобильные приложения, ноутбуки, бытовую технику и многие другие продукты. Стремясь выделить мобильный браузер, который предустанавливается на многие из 40 с лишним миллионов смартфонов, продаваемых компанией каждый квартал, Xiaomi встроила в него систему рекомендаций новостей. Когда пользователи запускают мобильный браузер Xiaomi, искусственный интеллект рекомендует им похожий контент, основываясь на истории поиска, интересах пользователя и многом другом. Milvus - это база данных векторного поиска по сходству с открытым исходным кодом, используемая для ускорения поиска связанных статей.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Как работает рекомендация контента на основе ИИ?</h3><p>По своей сути рекомендация новостей (или любой другой тип системы рекомендации контента) предполагает сравнение входных данных с массивной базой данных для поиска похожей информации. Успешная рекомендация контента предполагает баланс между актуальностью и своевременностью, а также эффективный учет огромных объемов новых данных - часто в режиме реального времени.</p>
<p>Для работы с огромными массивами данных рекомендательные системы обычно делятся на два этапа:</p>
<ol>
<li><strong>Поиск</strong>: Во время поиска контент сужается из обширной библиотеки на основе интересов и поведения пользователя. В мобильном браузере Xiaomi тысячи фрагментов контента выбираются из огромного набора данных, содержащего миллионы новостных статей.</li>
<li><strong>Сортировка</strong>: Далее контент, отобранный в процессе поиска, сортируется по определенным показателям, прежде чем быть предложенным пользователю. По мере того как пользователи просматривают рекомендованный контент, система в режиме реального времени адаптируется, чтобы предоставлять более релевантные предложения.</li>
</ol>
<p>Рекомендации новостного контента должны формироваться в режиме реального времени на основе поведения пользователей и недавно опубликованного контента. Кроме того, предлагаемый контент должен максимально соответствовать интересам пользователя и его поисковым запросам.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = интеллектуальные предложения контента</h3><p>Milvus - это поисковая база данных векторного сходства с открытым исходным кодом, которая может быть интегрирована с моделями глубокого обучения для работы приложений, охватывающих обработку естественного языка, проверку личности и многое другое. Milvus индексирует большие векторные массивы данных, чтобы сделать поиск более эффективным, и поддерживает множество популярных фреймворков ИИ, чтобы упростить процесс разработки приложений машинного обучения. Эти характеристики делают платформу идеальной для хранения и запроса векторных данных - важнейшего компонента многих приложений машинного обучения.</p>
<p>Компания Xiaomi выбрала Milvus для управления векторными данными в своей интеллектуальной системе рекомендаций новостей, поскольку она быстра, надежна и требует минимальной настройки и обслуживания. Однако для создания развертываемых приложений Milvus необходимо использовать в паре с алгоритмом искусственного интеллекта. Xiaomi выбрала BERT, сокращение от Bidirectional Encoder Representation Transformers, в качестве модели представления языка в своей рекомендательной системе. BERT может использоваться в качестве общей модели NLU (понимание естественного языка), которая способна решать множество различных задач NLP (обработка естественного языка). Ее ключевые особенности включают:</p>
<ul>
<li>Трансформатор BERT используется в качестве основного каркаса алгоритма и способен улавливать явные и неявные связи внутри и между предложениями.</li>
<li>Цели многозадачного обучения: моделирование языка по маске (MLM) и предсказание следующего предложения (NSP).</li>
<li>BERT лучше работает с большими объемами данных и может улучшить другие методы обработки естественного языка, такие как Word2Vec, выступая в качестве матрицы преобразования.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>Архитектура сети BERT использует многослойную трансформационную структуру, которая отказывается от традиционных нейронных сетей RNN и CNN. Она работает, преобразуя расстояние между двумя словами в любой позиции в одно с помощью механизма внимания, и решает проблему зависимостей, которая сохраняется в НЛП уже некоторое время.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT предлагает простую и сложную модели. Соответствующие гиперпараметры следующие: BERT BASE: L = 12, H = 768, A = 12, общее количество параметров 110M; BERT LARGE: L = 24, H = 1024, A = 16, общее количество параметров 340M.</p>
<p>В приведенных выше гиперпараметрах L представляет собой количество слоев в сети (т. е. количество блоков трансформации), A - количество самовниманий в Multi-Head Attention, а размер фильтра равен 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Система рекомендаций контента Xiaomi</h3><p>Браузерная система рекомендаций новостей Xiaomi опирается на три ключевых компонента: векторизацию, сопоставление идентификаторов и сервис приближенных ближайших соседей (ANN).</p>
<p>Векторизация - это процесс, в ходе которого заголовки статей преобразуются в векторы общих предложений. В рекомендательной системе Xiaomi используется модель SimBert, основанная на BERT. SimBert - это 12-слойная модель со скрытым размером 768. Для непрерывного обучения SimBert использует обучающую модель Chinese L-12_H-768_A-12 (задача обучения - "метрическое обучение +UniLM") и отработала 1,17 млн шагов на Signle TITAN RTX с оптимизатором Adam (скорость обучения 2e-6, размер партии 128). Проще говоря, это оптимизированная BERT-модель.</p>
<p>Алгоритмы ANN сравнивают векторные заголовки статей со всей библиотекой новостей, хранящейся в Milvus, и возвращают пользователям похожий контент. Сопоставление идентификаторов используется для получения релевантной информации, такой как просмотры страниц и клики по соответствующим статьям.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Данные, хранящиеся в Milvus, на основе которых работает механизм рекомендаций новостей Xiaomi, постоянно обновляются, включая дополнительные статьи и информацию об активности. По мере того как в систему включаются новые данные, старые приходится удалять. В этой системе полное обновление данных происходит в течение первых T-1 дней, а инкрементное - в последующие T дней.</p>
<p>Через определенные промежутки времени старые данные удаляются, а обработанные данные за T-1 день вставляются в коллекцию. При этом новые данные включаются в коллекцию в режиме реального времени. Как только новые данные вставлены, в Milvus выполняется поиск по сходству. Полученные статьи снова сортируются по количеству кликов и другим факторам, и пользователям показывается лучший контент. В подобном сценарии, когда данные часто обновляются и результаты должны выдаваться в режиме реального времени, способность Milvus быстро включать и искать новые данные позволяет значительно ускорить рекомендации новостного контента в мобильном браузере Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus улучшает поиск по векторному сходству</h3><p>Векторизация данных и последующее вычисление сходства между векторами - наиболее часто используемая технология поиска. Появление поисковых систем на основе ANN значительно повысило эффективность вычислений векторного сходства. По сравнению с аналогичными решениями, Milvus предлагает оптимизированное хранение данных, богатый набор SDK и распределенную версию, что значительно снижает нагрузку на создание поискового слоя. Кроме того, активное сообщество разработчиков Milvus с открытым исходным кодом - это мощный ресурс, который поможет ответить на вопросы и устранить проблемы по мере их возникновения.</p>
<p>Если вы хотите узнать больше о векторном поиске по сходству и Milvus, ознакомьтесь со следующими ресурсами:</p>
<ul>
<li>Посмотрите <a href="https://github.com/milvus-io/milvus">Milvus</a> на Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">Поиск векторного сходства скрывается от посторонних глаз</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Ускорение поиска по сходству в действительно больших данных с помощью векторного индексирования</a></li>
</ul>
<p>Читайте другие <a href="https://zilliz.com/user-stories">истории пользователей</a>, чтобы узнать больше о создании вещей с помощью Milvus.</p>
