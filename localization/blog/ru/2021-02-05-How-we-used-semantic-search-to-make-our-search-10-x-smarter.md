---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Поиск по ключевым словам
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia использовала Milvus для создания в 10 раз более интеллектуальной
  системы поиска, которая значительно улучшила пользовательский опыт.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>Как мы использовали семантический поиск, чтобы сделать наш поиск в 10 раз умнее</custom-h1><p>В Tokopedia мы понимаем, что ценность нашего корпуса товаров раскрывается только тогда, когда наши покупатели могут найти товары, которые им подходят, поэтому мы стремимся улучшить релевантность результатов поиска.</p>
<p>Для этого мы вводим в Tokopedia <strong>поиск по сходству</strong>. Если вы перейдете на страницу результатов поиска на мобильных устройствах, вы найдете кнопку "...", которая открывает меню, позволяющее искать товары, похожие на данный продукт.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Поиск по ключевым словам<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search использует <strong>Elasticsearch</strong> для поиска и ранжирования товаров. Для каждого поискового запроса мы сначала запрашиваем Elasticsearch, который ранжирует продукты в соответствии с поисковым запросом. ElasticSearch хранит каждое слово как последовательность чисел, представляющих собой <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (или UTF) коды для каждой буквы. Он строит <a href="https://en.wikipedia.org/wiki/Inverted_index">инвертированный индекс</a>, чтобы быстро определить, какие документы содержат слова из запроса пользователя, а затем находит среди них наилучшее соответствие, используя различные алгоритмы подсчета баллов. Эти алгоритмы уделяют мало внимания тому, что означают слова, а скорее тому, как часто они встречаются в документе, насколько близко они расположены друг к другу и т. д. ASCII-представление, очевидно, содержит достаточно информации, чтобы передать семантику (в конце концов, мы, люди, можем ее понять). К сожалению, для компьютера не существует хорошего алгоритма сравнения слов, закодированных в ASCII, по их значению.</p>
<h2 id="Vector-representation" class="common-anchor-header">Векторное представление<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>Одним из решений этой проблемы может стать альтернативное представление, которое говорит нам не только о буквах, содержащихся в слове, но и о его значении. Например, мы могли бы закодировать <em>, с какими другими словами наше слово часто используется вместе</em> (представляя их вероятным контекстом). Затем мы предположим, что похожие контексты обозначают похожие вещи, и попытаемся сравнить их с помощью математических методов. Мы даже можем найти способ кодировать целые предложения по их смыслу.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_2.png</span> </span></p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Выбор поисковой системы для поиска сходства вкраплений<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда у нас есть векторы признаков, остается вопрос, как извлечь из большого объема векторов те, которые похожи на целевой вектор. Когда речь зашла о поисковой системе для вкраплений, мы попробовали POC на нескольких движках, доступных на Github, некоторые из них - FAISS, Vearch, Milvus.</p>
<p>По результатам нагрузочных тестов мы предпочли Milvus другим движкам. С одной стороны, мы уже использовали FAISS в других командах и поэтому хотели бы попробовать что-то новое. По сравнению с Milvus, FAISS больше похож на базовую библиотеку, поэтому не совсем удобен в использовании. Узнав больше о Milvus, мы в итоге решили взять Milvus из-за двух его основных особенностей:</p>
<ul>
<li><p>Milvus очень прост в использовании. Все, что вам нужно сделать, - это извлечь его Docker-образ и обновить параметры в соответствии с вашим собственным сценарием.</p></li>
<li><p>Он поддерживает больше индексов и имеет подробную вспомогательную документацию.</p></li>
</ul>
<p>Одним словом, Milvus очень дружелюбен к пользователям, а документация довольно подробная. Если вы столкнетесь с какой-либо проблемой, вы обычно сможете найти решение в документации; в противном случае вы всегда можете получить поддержку от сообщества Milvus.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Кластерная служба Milvus<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>После того как мы решили использовать Milvus в качестве векторной поисковой системы, мы решили использовать Milvus для одного из наших случаев использования сервиса Ads, когда мы хотели сопоставить ключевые слова с <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">низким коэффициентом заполнения</a> с ключевыми словами с высоким коэффициентом заполнения. Мы настроили отдельный узел в среде разработки (DEV) и запустили обслуживание, оно хорошо работало в течение нескольких дней и давало нам улучшенные показатели CTR/CVR. Если бы автономный узел сломался в производственной среде, весь сервис стал бы недоступен. Таким образом, нам необходимо развернуть высокодоступный поисковый сервис.</p>
<p>Milvus предоставляет Mishards, промежуточное ПО для шардинга кластеров, и Milvus-Helm для настройки. В Tokopedia мы используем плейбуки Ansible для настройки инфраструктуры, поэтому мы создали плейбук для оркестровки инфраструктуры. Приведенная ниже диаграмма из документации Milvus показывает, как работает Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_3.png</span> </span></p>
<p>Mishards каскадирует запрос от восходящего потока к своим подмодулям, разделяющим запрос восходящего потока, а затем собирает и возвращает результаты работы подсервисов восходящему потоку. Общая архитектура кластерного решения на базе Mishards показана ниже: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" /><span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span> </span></p>
<p>В официальной документации дается четкое представление о Mishards. Вы можете обратиться к <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>, если вам это интересно.</p>
<p>В нашем сервисе поиска по ключевым словам мы развернули один узел с возможностью записи, два узла только для чтения и один экземпляр промежуточного ПО Mishards в GCP, используя ансибл Milvus. До сих пор все работало стабильно. Огромным компонентом того, что позволяет эффективно запрашивать миллионные, миллиардные и даже триллионные векторные наборы данных, на которые опираются поисковые системы сходства, является <a href="https://milvus.io/docs/v0.10.5/index.md">индексирование</a>- процесс организации данных, который значительно ускоряет поиск в больших данных.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">Как векторное индексирование ускоряет поиск по сходству?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Системы поиска по сходству работают, сравнивая входные данные с базой данных, чтобы найти объекты, наиболее похожие на входные данные. Индексирование - это процесс эффективной организации данных, и оно играет важную роль в том, чтобы сделать поиск по сходству полезным, значительно ускоряя трудоемкие запросы к большим массивам данных. После индексации огромного набора векторных данных запросы могут быть направлены в кластеры или подмножества данных, которые с наибольшей вероятностью содержат векторы, похожие на входной запрос. На практике это означает, что для ускорения запросов к действительно большим векторным данным приходится жертвовать определенной степенью точности.</p>
<p>Можно провести аналогию со словарем, в котором слова отсортированы по алфавиту. При поиске слова можно быстро перейти к разделу, содержащему только слова с одинаковым начальным значением, что значительно ускоряет поиск определения введенного слова.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">Что дальше, спросите вы?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_How we used semantic search to make our search 10x smarter_5.jpeg</span> </span></p>
<p>Как показано выше, не существует решения, которое бы подходило всем, мы всегда хотим улучшить производительность модели, используемой для получения вкраплений.</p>
<p>Кроме того, с технической точки зрения мы хотим запускать несколько моделей обучения одновременно и сравнивать результаты различных экспериментов. Следите за этим пространством, чтобы узнать больше о наших экспериментах, таких как поиск изображений и поиск видео.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">Ссылки:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>Эта статья перепечатана из блога: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821.</em></p>
<p>Читайте другие <a href="https://zilliz.com/user-stories">истории пользователей</a>, чтобы узнать больше о создании вещей с помощью Milvus.</p>
