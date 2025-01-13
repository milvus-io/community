---
id: audio-retrieval-based-on-milvus.md
title: Технологии обработки
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  Аудиопоиск с помощью Milvus позволяет классифицировать и анализировать
  звуковые данные в режиме реального времени.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Поиск аудиоданных на основе милвуса</custom-h1><p>Звук - это информационно насыщенный тип данных. Хотя в эпоху видеоконтента он может казаться устаревшим, для многих людей аудио остается основным источником информации. Несмотря на долгосрочное сокращение числа слушателей, в 2020 году 83 % американцев в возрасте 12 лет и старше слушали наземное (AM/FM) радио в течение недели (по сравнению с 89 % в 2019 году). И наоборот, за последние два десятилетия число слушателей онлайн-аудио неуклонно растет: по данным того же <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">исследования Pew Research Center</a>, 62 % американцев слушают его в той или иной форме еженедельно.</p>
<p>Как волна, звук включает в себя четыре свойства: частоту, амплитуду, форму волны и продолжительность. В музыкальной терминологии они называются питч, динамика, тон и длительность. Звуки также помогают людям и другим животным воспринимать и понимать окружающую среду, предоставляя контекстные подсказки для определения местоположения и движения объектов в нашем окружении.</p>
<p>Как носитель информации, звук можно разделить на три категории:</p>
<ol>
<li><strong>Речь:</strong> Средство коммуникации, состоящее из слов и грамматики. С помощью алгоритмов распознавания речи ее можно преобразовать в текст.</li>
<li><strong>Музыка:</strong> Вокальные и/или инструментальные звуки, объединенные в композицию, состоящую из мелодии, гармонии, ритма и тембра. Музыка может быть представлена в виде партитуры.</li>
<li><strong>Форма волны:</strong> Цифровой аудиосигнал, полученный путем оцифровки аналоговых звуков. Волновые формы могут представлять собой речь, музыку, естественные или синтезированные звуки.</li>
</ol>
<p>Аудиопоиск может использоваться для поиска и мониторинга онлайн-медиа в режиме реального времени с целью пресечения нарушений прав интеллектуальной собственности. Он также играет важную роль в классификации и статистическом анализе аудиоданных.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Технологии обработки<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Речь, музыка и другие типовые звуки обладают уникальными характеристиками и требуют различных методов обработки. Как правило, аудио разделяют на группы, содержащие речь, и группы, не содержащие ее:</p>
<ul>
<li>Речевое аудио обрабатывается автоматическим распознаванием речи.</li>
<li>Неречевые звуки, включая музыкальное сопровождение, звуковые эффекты и оцифрованные речевые сигналы, обрабатываются с помощью систем аудиопоиска.</li>
</ul>
<p>Эта статья посвящена тому, как использовать аудиопоисковую систему для обработки неречевых аудиоданных. Распознавание речи в этой статье не рассматривается.</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Извлечение аудио признаков</h3><p>Извлечение признаков является наиболее важной технологией в аудиопоисковых системах, поскольку позволяет осуществлять поиск по сходству аудиоданных. Методы извлечения аудиохарактеристик делятся на две категории:</p>
<ul>
<li>Традиционные модели извлечения звуковых признаков, такие как модели гауссовой смеси (GMM) и скрытые марковские модели (HMM);</li>
<li>Модели извлечения аудиохарактеристик на основе глубокого обучения, такие как рекуррентные нейронные сети (RNN), сети долговременной памяти (LSTM), системы кодирования-декодирования, механизмы внимания и т. д.</li>
</ul>
<p>Модели на основе глубокого обучения имеют коэффициент ошибок на порядок ниже, чем традиционные модели, и поэтому набирают обороты в качестве основной технологии в области обработки аудиосигналов.</p>
<p>Аудиоданные обычно представлены извлеченными аудиофункциями. Процесс поиска ищет и сравнивает эти признаки и атрибуты, а не сами аудиоданные. Поэтому эффективность поиска по сходству аудиоданных во многом зависит от качества извлечения признаков.</p>
<p>В данной статье для извлечения векторов признаков используются <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">крупномасштабные предварительно обученные нейронные сети для распознавания звуковых образов (PANN)</a>, средняя точность которых составляет 0,439 (Hershey et al., 2017).</p>
<p>После извлечения векторов признаков из аудиоданных мы можем реализовать высокопроизводительный анализ векторов признаков с помощью Milvus.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Поиск сходства векторов</h3><p><a href="https://milvus.io/">Milvus</a> - это облачная база данных векторов с открытым исходным кодом, созданная для управления векторами встраивания, генерируемыми моделями машинного обучения и нейронными сетями. Она широко используется в таких областях, как компьютерное зрение, обработка естественного языка, вычислительная химия, персонализированные рекомендательные системы и т. д.</p>
<p>На следующей схеме показан общий процесс поиска сходства с помощью Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png.</span> </span></p>
<ol>
<li>Неструктурированные данные преобразуются в векторы признаков с помощью моделей глубокого обучения и вставляются в Milvus.</li>
<li>Milvus хранит и индексирует эти векторы признаков.</li>
<li>По запросу Milvus ищет и возвращает векторы, наиболее похожие на вектор запроса.</li>
</ol>
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
    </button></h2><p>Система аудиопоиска состоит в основном из двух частей: вставки (черная линия) и поиска (красная линия).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>audio-retrieval-system.png</span> </span></p>
<p>Образец набора данных, используемый в этом проекте, содержит звуки из игр с открытым исходным кодом, а код подробно описан в <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">буткампе Milvus</a>.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Шаг 1: Вставка данных</h3><p>Ниже приведен пример кода для генерации аудиовкраплений с помощью предварительно обученной модели PANNs-инференции и вставки их в Milvus, который присваивает уникальный идентификатор каждому векторному вкраплению.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Затем полученные <strong>идентификаторы</strong> Milvus сохраняются вместе с другой релевантной информацией (например, <strong>wav_name</strong>) для аудиоданных в базе данных MySQL для последующей обработки.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Шаг 2: Поиск аудиоданных</h3><p>Milvus вычисляет внутреннее произведение расстояния между предварительно сохраненными векторами признаков и входными векторами признаков, извлеченными из аудиоданных запроса с помощью модели PANNs-инференции, и возвращает <strong>ids_milvus</strong> похожих векторов признаков, которые соответствуют искомым аудиоданным.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">Ссылка на API и демонстрация<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Данная система поиска аудиоданных построена на основе открытого кода. Ее основными функциями являются вставка и удаление аудиоданных. Все API можно просмотреть, набрав в браузере <strong>127.0.0.1:<port></strong> /docs.</p>
<h3 id="Demo" class="common-anchor-header">Демонстрация</h3><p>Мы разместили на сайте <a href="https://zilliz.com/solutions">демонстрационную версию</a> системы поиска аудиоданных на основе Milvus, которую вы можете опробовать на собственных аудиоданных.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-search-demo.png</span> </span></p>
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
    </button></h2><p>Живя в эпоху больших данных, люди обнаруживают, что их жизнь изобилует всевозможной информацией. Чтобы разобраться в ней, традиционный текстовый поиск уже не справляется. Современные технологии поиска информации остро нуждаются в извлечении различных типов неструктурированных данных, таких как видео, изображения и аудио.</p>
<p>Неструктурированные данные, которые сложно обрабатывать компьютеру, можно преобразовать в векторы признаков с помощью моделей глубокого обучения. Эти преобразованные данные могут легко обрабатываться машинами, что позволяет нам анализировать неструктурированные данные так, как наши предшественники никогда не могли. Milvus, база данных векторов с открытым исходным кодом, может эффективно обрабатывать векторы признаков, извлеченные моделями искусственного интеллекта, и предоставляет множество общих расчетов сходства векторов.</p>
<h2 id="References" class="common-anchor-header">Ссылки<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>Херши С., Чаудхури С., Эллис Д.П., Геммеке Ж.Ф., Янсен А., Мур Р.К., Плакал М., Платт Д., Саурус Р.А., Сейболд Б. и Слейни М., 2017, март. Архитектуры CNN для крупномасштабной классификации аудио. Международная конференция IEEE по акустике, речи и обработке сигналов (ICASSP), 2017, стр. 131-135.</p>
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
<li><p>Найдите Milvus на <a href="https://github.com/milvus-io/milvus/">GitHub</a> и внесите в него свой вклад.</p></li>
<li><p>Общайтесь с сообществом через <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Общайтесь с нами в <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
