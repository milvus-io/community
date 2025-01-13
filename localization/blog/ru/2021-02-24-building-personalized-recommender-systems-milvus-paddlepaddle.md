---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Предыстория Введение
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: Как построить рекомендательную систему на основе глубокого обучения
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Создание персонализированных рекомендательных систем с помощью Milvus и PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Предыстория Введение<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>С непрерывным развитием сетевых технологий и постоянно расширяющимся масштабом электронной коммерции количество и разнообразие товаров стремительно растут, и пользователям приходится тратить много времени на поиск товаров, которые они хотят купить. Это и есть информационная перегрузка. Для решения этой проблемы и появилась рекомендательная система.</p>
<p>Рекомендательная система - это подмножество системы фильтрации информации, которая может использоваться в различных областях, таких как фильмы, музыка, электронная коммерция и рекомендации потоков. Рекомендательная система выявляет персонализированные потребности и интересы пользователя путем анализа и изучения его поведения и рекомендует информацию или продукты, которые могут быть интересны пользователю. В отличие от поисковых систем, рекомендательные системы не требуют от пользователей точного описания своих потребностей, а моделируют их историческое поведение, чтобы проактивно предоставлять информацию, соответствующую интересам и потребностям пользователя.</p>
<p>В этой статье мы используем PaddlePaddle, платформу глубокого обучения от Baidu, для построения модели и объединяем Milvus, поисковую систему векторного сходства, для создания персонализированной рекомендательной системы, которая может быстро и точно предоставлять пользователям интересную информацию.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Подготовка данных<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>В качестве примера мы берем MovieLens Million Dataset (ml-1m) [1]. Набор данных ml-1m содержит 1 000 000 рецензий на 4 000 фильмов от 6 000 пользователей, собранных исследовательской лабораторией GroupLens. Исходные данные включают в себя характеристики фильма, характеристики пользователя и пользовательский рейтинг фильма, вы можете обратиться к ml-1m-README [2] .</p>
<p>Набор данных ml-1m включает 3 файла .dat: movies.dat, users.dat и ratings.dat. movies.dat включает характеристики фильма, см. пример ниже:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Это означает, что идентификатор фильма - 1, а название - 《Toy Story》, который разделен на три категории. Эти три категории - анимация, дети и комедия.</p>
<p>users.dat содержит характеристики пользователя, см. пример ниже:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>Это означает, что идентификатор пользователя - 1, он женского пола и моложе 18 лет. Идентификатор профессии - 10.</p>
<p>ratings.dat включает характеристику рейтинга фильмов, см. пример ниже:</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>То есть пользователь 1 оценивает фильм 1193 в 5 баллов.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Модель слияния рекомендаций<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>В системе персонализированных рекомендаций фильмов мы использовали модель Fusion Recommendation Model [3], которую реализовала компания PaddlePaddle. Эта модель создана на основе ее производственной практики.</p>
<p>Сначала на вход нейронной сети подаются пользовательские характеристики и характеристики фильма, где:</p>
<ul>
<li>Характеристики пользователя включают в себя четыре атрибута: идентификатор пользователя, пол, профессию и возраст.</li>
<li>Характеристики фильма включают в себя три атрибута: ID фильма, ID типа фильма и название фильма.</li>
</ul>
<p>Для пользовательского признака отобразите идентификатор пользователя в векторное представление с размерностью 256, войдите в слой с полной связью и проделайте аналогичную обработку для трех других признаков. Затем представления четырех признаков полностью соединяются и добавляются отдельно.</p>
<p>Для признаков фильма идентификатор фильма обрабатывается аналогично идентификатору пользователя. Идентификатор типа фильма напрямую вводится в слой с полным подключением в виде вектора, а название фильма представляется вектором фиксированной длины с помощью текстовой конволюционной нейронной сети. Затем представления трех атрибутов полностью соединяются и добавляются по отдельности.</p>
<p>После получения векторного представления пользователя и фильма вычисляется их косинусоидальное сходство в качестве оценки системы персонализированных рекомендаций. Наконец, квадрат разницы между оценкой сходства и истинной оценкой пользователя используется в качестве функции потерь регрессионной модели.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-user-film-personalized-recommender-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Обзор системы<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>В сочетании с моделью рекомендаций PaddlePaddle fusion, вектор характеристик фильма, созданный моделью, хранится в системе поиска векторного сходства Milvus, а характеристика пользователя используется в качестве целевого вектора для поиска. Поиск по сходству выполняется в Milvus, чтобы получить результат запроса в виде рекомендованных пользователю фильмов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>Для вычисления расстояния между векторами в Milvus используется метод внутреннего произведения (IP). После нормализации данных сходство внутреннего произведения согласуется с результатом косинусного сходства в модели рекомендаций fusion.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Применение персональной рекомендательной системы<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Построение системы персональных рекомендаций с помощью Milvus состоит из трех этапов, подробности о работе см. в Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Шаг 1：Обучение модели</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>Выполнение этой команды приведет к созданию модели recommender_system.inference.model в каталоге, которая может преобразовывать данные фильма и данные пользователя в векторы признаков и генерировать данные приложения для хранения и извлечения Milvus.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Шаг 2：Предварительная обработка данных</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>Выполнение этой команды приведет к созданию тестовых данных movies_data.txt в каталоге для предварительной обработки данных о фильмах.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Шаг 3：Внедрение персональной рекомендательной системы с помощью Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>Выполнение этой команды позволит реализовать персональные рекомендации для указанных пользователей.</p>
<p>Основной процесс заключается в следующем:</p>
<ul>
<li>С помощью load_inference_model данные о фильмах обрабатываются моделью для создания вектора признаков фильма.</li>
<li>Вектор признаков фильмов загружается в Milvus через milvus.insert.</li>
<li>В соответствии с возрастом / полом / профессией пользователя, заданными параметрами, он преобразуется в вектор признаков пользователя, milvus.search_vectors используется для поиска сходства, и возвращается результат с наибольшим сходством между пользователем и фильмом.</li>
</ul>
<p>Предсказание пяти лучших фильмов, которыми интересуется пользователь:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
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
    </button></h2><p>Введя информацию о пользователе и фильме в модель рекомендаций fusion, мы можем получить оценки сходства, а затем отсортировать оценки всех фильмов на основе данных о пользователе, чтобы рекомендовать фильмы, которые могут быть интересны пользователю. <strong>В этой статье объединены Milvus и PaddlePaddle для создания системы персонализированных рекомендаций. Milvus, векторная поисковая система, используется для хранения всех данных о характеристиках фильмов, а затем выполняется поиск по сходству с характеристиками пользователя в Milvus.</strong> Результатом поиска является рейтинг фильмов, рекомендованных системой пользователю.</p>
<p>Система векторного поиска по сходству Milvus [5] совместима с различными платформами глубокого обучения и ищет миллиарды векторов с откликом всего в миллисекунду. С Milvus вы с легкостью откроете для себя новые возможности применения ИИ!</p>
<h2 id="Reference" class="common-anchor-header">Ссылка<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Fusion Recommendation Model by PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
