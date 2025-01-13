---
id: graph-based-recommendation-system-with-milvus.md
title: Как работают рекомендательные системы?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Рекомендательные системы могут приносить доход, сокращать расходы и
  обеспечивать конкурентные преимущества. Узнайте, как создать такую систему
  бесплатно с помощью инструментов с открытым исходным кодом.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Построение системы рекомендаций на основе графиков с использованием наборов данных Milvus, PinSage, DGL и MovieLens</custom-h1><p>Системы рекомендаций работают на основе алгоритмов, которые имеют <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">скромное начало</a>, помогая людям отсеивать нежелательную почту. В 1990 году изобретатель Даг Терри использовал алгоритм совместной фильтрации для сортировки нужных писем от нежелательных. Просто поставив "лайк" или "ненависть" к письму в сотрудничестве с другими пользователями, которые делали то же самое с похожим содержимым, пользователи могли быстро обучить компьютеры определять, что следует отправить в папку "Входящие", а что - в папку "Нежелательная почта".</p>
<p>В общем смысле рекомендательные системы - это алгоритмы, которые делают соответствующие предложения пользователям. Предложения могут быть фильмами для просмотра, книгами для чтения, товарами для покупки или чем-либо еще, в зависимости от сценария или отрасли. Эти алгоритмы окружают нас повсюду, влияя на контент, который мы потребляем, и на товары, которые мы покупаем у таких крупных технологических компаний, как Youtube, Amazon, Netflix и многих других.</p>
<p>Хорошо продуманные рекомендательные системы могут стать важным источником дохода, сократить расходы и стать конкурентным преимуществом. Благодаря технологии с открытым исходным кодом и снижению стоимости вычислений настраиваемые рекомендательные системы стали как никогда доступны. В этой статье рассказывается, как использовать Milvus, векторную базу данных с открытым исходным кодом; PinSage, графовую конволюционную нейронную сеть (GCN); deep graph library (DGL), масштабируемый пакет python для глубокого обучения на графах; и наборы данных MovieLens для создания системы рекомендаций на основе графов.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Как работают рекомендательные системы?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Инструменты для создания рекомендательной системы</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Построение рекомендательной системы на основе графов с помощью Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Как работают рекомендательные системы?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Существует два распространенных подхода к построению рекомендательных систем: коллаборативная фильтрация и фильтрация на основе контента. Большинство разработчиков используют один или оба метода, и, хотя рекомендательные системы могут отличаться по сложности и конструкции, они обычно включают три основных элемента:</p>
<ol>
<li><strong>Модель пользователя:</strong> Рекомендательные системы требуют моделирования характеристик, предпочтений и потребностей пользователя. Многие рекомендательные системы основывают свои предложения на неявном или явном вводе данных от пользователей на уровне элементов.</li>
<li><strong>Модель объекта:</strong> Рекомендательные системы также моделируют объекты, чтобы делать рекомендации на основе портретов пользователей.</li>
<li><strong>Алгоритм рекомендации:</strong> Основным компонентом любой рекомендательной системы является алгоритм, на котором основаны ее рекомендации. Обычно используются такие алгоритмы, как коллаборативная фильтрация, неявное семантическое моделирование, моделирование на основе графов, комбинированные рекомендации и другие.</li>
</ol>
<p>На высоком уровне рекомендательные системы, основанные на коллаборативной фильтрации, строят модель на основе прошлого поведения пользователей (включая поведение похожих пользователей), чтобы предсказать, что может заинтересовать пользователя. Системы, основанные на контентной фильтрации, используют дискретные, заранее определенные теги, основанные на характеристиках товаров, чтобы рекомендовать похожие товары.</p>
<p>Примером совместной фильтрации может служить персонализированная радиостанция на Spotify, основанная на истории прослушивания, интересах, музыкальной библиотеке пользователя и т. д. Станция воспроизводит музыку, которую пользователь не сохранял и не проявлял к ней интереса, но которую часто слушают другие пользователи со схожим вкусом. Примером фильтрации на основе контента может быть радиостанция, основанная на определенной песне или исполнителе, которая использует атрибуты входных данных, чтобы рекомендовать похожую музыку.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Инструменты для создания рекомендательной системы<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>В данном примере создание рекомендательной системы на основе графов с нуля зависит от следующих инструментов:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Графовая конволюционная сеть</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> - это графовая конволюционная сеть со случайным ходом, способная обучать вкраплениям для узлов в графах веб-масштаба, содержащих миллиарды объектов. Сеть была разработана компанией <a href="https://www.pinterest.com/">Pinterest</a>, специализирующейся на онлайн-пинбордах, для предоставления тематических визуальных рекомендаций своим пользователям.</p>
<p>Пользователи Pinterest могут "прикреплять" интересующий их контент к "доскам", которые представляют собой коллекции прикрепленного контента. С более чем <a href="https://business.pinterest.com/audience/">478 миллионами</a> ежемесячных активных пользователей (MAU) и более чем <a href="https://newsroom.pinterest.com/en/company">240 миллиардами</a> сохраненных объектов, компания обладает огромным объемом пользовательских данных, для поддержания которых ей необходимо создавать новые технологии.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage использует двудольные графы пинов для создания высококачественных вкраплений из пинов, которые используются для рекомендации пользователям визуально похожего контента. В отличие от традиционных алгоритмов GCN, которые выполняют свертки на матрицах признаков и полном графе, PinSage выбирает близлежащие узлы/пины и выполняет более эффективные локальные свертки путем динамического построения вычислительных графов.</p>
<p>Выполнение сверток по всей окрестности узла приведет к созданию массивного вычислительного графа. Чтобы снизить требования к ресурсам, традиционные алгоритмы GCN обновляют представление узла, агрегируя информацию из его k-хоп окрестностей. PinSage имитирует случайную прогулку, чтобы установить часто посещаемый контент в качестве ключевого соседства, а затем строит свертку на его основе.</p>
<p>Поскольку соседства k-hop часто пересекаются, локальная свертка на узлах приводит к повторным вычислениям. Чтобы избежать этого, на каждом шаге агрегирования PinSage отображает все узлы без повторных вычислений, затем связывает их с соответствующими узлами верхнего уровня и, наконец, извлекает вкрапления узлов верхнего уровня.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Библиотека Deep Graph: Масштабируемый python-пакет для глубокого обучения на графах</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> - это пакет Python, предназначенный для построения нейросетевых моделей на основе графов поверх существующих фреймворков глубокого обучения (например, PyTorch, MXNet, Gluon и других). DGL включает в себя дружественный интерфейс бэкенда, что упрощает внедрение во фреймворки, основанные на тензорах и поддерживающие автоматическую генерацию. Упомянутый выше алгоритм PinSage оптимизирован для использования с DGL и PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: векторная база данных с открытым исходным кодом, созданная для ИИ и поиска сходств</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>how-does-milvus-work.png</span> </span></p>
<p>Milvus - это векторная база данных с открытым исходным кодом, созданная для работы с векторным поиском сходства и приложениями искусственного интеллекта (ИИ). В общих чертах использование Milvus для поиска сходства работает следующим образом:</p>
<ol>
<li>Модели глубокого обучения используются для преобразования неструктурированных данных в векторы признаков, которые импортируются в Milvus.</li>
<li>Milvus хранит и индексирует векторы признаков.</li>
<li>По запросу Milvus ищет и возвращает векторы, наиболее похожие на входной вектор.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Построение рекомендательной системы на основе графов с помощью Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-building-graph-based-recommender-system.png</span> </span></p>
<p>Построение графовой рекомендательной системы с помощью Milvus включает в себя следующие шаги:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Шаг 1: Предварительная обработка данных</h3><p>Предварительная обработка данных подразумевает преобразование исходных данных в более понятный формат. В этом примере используются открытые наборы данных MovieLens[5] (m1-1m), содержащие 1 000 000 оценок 4 000 фильмов, выставленных 6 000 пользователей. Эти данные были собраны компанией GroupLens и включают описания фильмов, оценки фильмов и характеристики пользователей.</p>
<p>Обратите внимание, что наборы данных MovieLens, используемые в этом примере, требуют минимальной очистки или организации данных. Однако если вы используете другие наборы данных, ваш пробег может отличаться.</p>
<p>Чтобы начать создание рекомендательной системы, постройте двудольный граф "пользователь-фильм" для целей классификации, используя исторические данные о фильмах пользователя из набора данных MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Шаг 2: Обучение модели с помощью PinSage</h3><p>Векторы встраивания пинов, созданные с помощью модели PinSage, являются векторами признаков полученной информации о фильмах. Создайте модель PinSage на основе двудольного графа g и заданных размеров вектора признаков фильма (по умолчанию 256-d). Затем обучите модель с помощью PyTorch, чтобы получить вкрапления h_item для 4 000 фильмов.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Шаг 3: Загрузка данных</h3><p>Загрузите вложения h_item фильмов, сгенерированные моделью PinSage, в Milvus, который вернет соответствующие идентификаторы. Импортируйте идентификаторы и соответствующую информацию о фильмах в MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Шаг 4: Проведите поиск векторного сходства</h3><p>Получите соответствующие вкрапления в Milvus на основе идентификаторов фильмов, затем используйте Milvus для выполнения поиска сходства с этими вкраплениями. Затем определите соответствующую информацию о фильме в базе данных MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Шаг 5: Получение рекомендаций</h3><p>Теперь система будет рекомендовать фильмы, наиболее похожие на поисковые запросы пользователей. Таков общий порядок построения рекомендательной системы. Чтобы быстро протестировать и развернуть рекомендательные системы и другие приложения искусственного интеллекта, попробуйте <a href="https://github.com/milvus-io/bootcamp">воспользоваться буткемпом</a> Milvus.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus может работать не только с рекомендательными системами<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus - это мощный инструмент, способный обеспечить работу огромного количества приложений для искусственного интеллекта и поиска векторного сходства. Чтобы узнать больше о проекте, ознакомьтесь со следующими ресурсами:</p>
<ul>
<li>Читайте наш <a href="https://zilliz.com/blog">блог</a>.</li>
<li>Общайтесь с нашим сообществом разработчиков открытого кода в <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Используйте самую популярную в мире базу данных векторов на <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
