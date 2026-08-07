---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: 'От поиска к структурированным результатам: агрегация и ORDER BY в Milvus 3.0'
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Узнайте, как Milvus 3.0 добавляет агрегацию запросов, Search Aggregation и
  серверную сортировку ORDER BY для структурированных и эффективных результатов
  векторного поиска.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Рассмотрим знакомый сценарий поиска товаров. Покупатель загружает фотографию платья, а векторный поиск извлекает релевантный набор кандидатов из каталога, содержащего десятки миллионов товаров.</p>
<p>Однако странице нужен не только ранжированный список. Ей нужны фасеты по брендам. Нужна сортировка по цене. Команда мерчандайзинга хочет знать, какие бренды доминируют в этом наборе результатов, каков ценовой диапазон внутри каждого бренда и какие несколько репрезентативных товаров есть в каждой группе.</p>
<p>До Milvus 3.0 приложения обычно выполняли этот второй шаг самостоятельно: получали строки из Milvus, группировали и сортировали их в pandas или на уровне сервиса, а затем собирали ответ. Некоторые команды поддерживали отдельный аналитический конвейер исключительно для вычисления счетчиков и распределений по данным, которые уже находились в векторной базе данных.</p>
<p>Векторная база данных находила кандидатов; приложение должно было превращать их в структурированный результат.</p>
<p>Milvus 3.0 переносит большую часть этой работы в механизм извлечения. Он добавляет три связанные, но разные возможности:</p>
<ul>
<li><strong>Агрегация запросов</strong> вычисляет <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> и <code translate="no">max</code> по отфильтрованным видимым строкам с необязательными полями <code translate="no">GROUP BY</code>.</li>
<li><strong>Search Aggregation</strong> организует сохраненных кандидатов приблизительного поиска ближайших соседей (ANN) в корзины, вычисляет метрики по корзинам, строит вложенные корзины и возвращает репрезентативные совпадения.</li>
<li><strong>Серверный</strong> <code translate="no">**ORDER BY**</code> сортирует результаты запросов или ANN-кандидатов по одному или нескольким скалярным полям до того, как приложение их получит.</li>
</ul>
<p>Различие между query и search важно:</p>
<table>
<thead>
<tr><th>Возможность</th><th>Данные, которые обобщаются или упорядочиваются</th><th>Основная форма результата</th><th>Граница точности</th></tr>
</thead>
<tbody>
<tr><td>Агрегация запросов</td><td>Все видимые строки, соответствующие фильтру</td><td>Одна строка на группу с агрегированными значениями</td><td>Точно по видимому набору строк запроса</td></tr>
<tr><td>Search Aggregation</td><td>Кандидаты, сохраненные ANN-поиском и этапом группировки</td><td>Корзины, метрики, репрезентативные совпадения и необязательные дочерние корзины</td><td>Приблизительно по замыслу</td></tr>
<tr><td>Query <code translate="no">ORDER BY</code></td><td>Видимые строки, соответствующие фильтру</td><td>Отсортированные строки</td><td>Точно по отфильтрованному результату запроса</td></tr>
<tr><td>Search <code translate="no">ORDER BY</code></td><td>ANN-кандидаты</td><td>Отсортированные поисковые совпадения или группы</td><td>Не расширяет границу полноты ANN</td></tr>
</tbody>
</table>
<p>В этой статье объясняется, почему такие операции должны выполняться внутри базы данных, как работает распределенная агрегация, чем Search Aggregation отличается от Grouping Search и где заканчиваются новые семантики.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Почему постобработка на стороне приложения перестает работать<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Перенос агрегации и сортировки в приложение может выглядеть как небольшое архитектурное решение. В масштабе оно создает три более серьезные проблемы.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">Приложение перемещает гораздо больше данных, чем содержит ответ</h3><p>Предположим, операционной панели нужны количество товаров и средняя цена для каждой категории среди двух миллионов строк товаров в наличии. Даже при грубой оценке полезной нагрузки всего в 100 байт на строку для категории, цены, первичного ключа и накладных расходов сериализации приложение должно получить около 200 МБ данных, прежде чем сможет вычислить результат.</p>
<p>Если в каталоге 200 категорий, ответ — это всего несколько сотен ключей и чисел, то есть порядка килобайт. Приложение перемещает на несколько порядков больше данных, чем возвращает, платит ту же цену при каждом обновлении и требует достаточного объема клиентской памяти, чтобы удерживать или потоково обрабатывать промежуточные строки.</p>
<p>Агрегация внутри движка меняет единицу перемещения данных. Сырые строки остаются там, где находятся. Между узлами и в конечном итоге за пределы Milvus передается гораздо меньший набор частичных и финальных состояний групп.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">Сортировка в пределах страницы не является глобальной сортировкой</h3><p>Сортировка после пагинации — это ошибка корректности, а не просто неэффективная реализация.</p>
<p>Если приложение получает строки с 11-й по 20-ю и сортирует только эти строки по цене, оно получает ценовой порядок внутри этой страницы, а не строки с 11-й по 20-ю глобально отсортированного по цене результата. Более поздняя страница может содержать товары дешевле любого товара на первой странице.</p>
<p>Та же граница важна и в векторном поиске. Получение небольшого набора Top-K и его сортировка в приложении может переупорядочить только этих кандидатов. Она не может восстановить релевантных кандидатов, которых этап ANN не вернул, и часто заставляет приложения запрашивать избыточное количество результатов, чтобы клиентская сортировка была полезной.</p>
<p>Серверная сортировка дает Milvus контроль над порядком и последовательностью пагинации. Для query-нагрузок движок сортирует отфильтрованный набор строк до применения окна страницы. Для search-нагрузок он сортирует в пределах границы ANN-кандидатов и явно сохраняет это ограничение.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">Клиент не может воспроизвести видимость базы данных</h3><p>Агрегация также зависит от того, какие строки видимы на временной метке запроса. Удаления, сущности с истекшим сроком действия и параллельные записи регулируются многоверсионным управлением конкурентным доступом (MVCC) и семантиками консистентности Milvus.</p>
<p>После того как сырые строки покидают базу данных, приложение обычно предполагает, что полученный пакет представляет корректный снимок. Воссоздать те же правила видимости на клиенте практически невозможно, особенно когда коллекция принимает записи и удаления.</p>
<p>Распространенный обходной путь — второй аналитический движок, наполняемый через экспорт и ETL, — добавляет еще одну копию данных, еще одну границу консистентности и еще один конвейер для эксплуатации. Счетчики, метрики и сортировка должны выполняться там, где уже находятся и данные, и правила их видимости.</p>
<p>Теперь посмотрим, что предлагает Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Агрегация запросов: точная статистика по видимым строкам<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>Агрегация запросов отвечает на вопросы вроде:</p>
<ul>
<li>Сколько товаров в наличии есть в каждой категории?</li>
<li>Какова средняя цена по каждому бренду?</li>
<li>Каковы минимальные и максимальные временные метки событий для каждого хоста?</li>
<li>Сколько записей остается после применения фильтра и видимости TTL?</li>
</ul>
<p>API выглядит знакомо всем, кто использовал SQL: передайте одно или несколько полей в <code translate="no">group_by_fields</code>, затем поместите агрегирующие выражения в <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Синтаксис — простая часть. Модель выполнения — вот что делает результат полезным в распределенной векторной базе данных.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Локальные состояния сегментов заменяют перемещение сырых строк</h3><p>Коллекция Milvus может охватывать сотни или тысячи сегментов, распределенных по нескольким query-узлам, при этом недавно записанные данные все еще находятся на потоковом пути. Ни один отдельный узел выполнения изначально не имеет всех видимых строк.</p>
<p>Поэтому Milvus проталкивает агрегацию вниз, к сегментам:</p>
<ol>
<li>Каждый сегмент локально применяет фильтр и правила видимости MVCC.</li>
<li>Сегмент выдает одно частичное состояние на группу вместо совпавших строк.</li>
<li>Частичные состояния объединяются внутри query-узла.</li>
<li>Прокси выполняет финальное межузловое слияние и возвращает завершенные группы.</li>
</ol>
<p>Теперь объем промежуточных данных масштабируется с количеством групп и агрегатных состояний, а не напрямую с количеством совпавших строк.</p>
<p>Операция слияния зависит от агрегата:</p>
<table>
<thead>
<tr><th>Агрегат</th><th>Частичное состояние</th><th>Правило слияния</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Частичный счетчик</td><td>Сложить счетчики</td></tr>
<tr><td><code translate="no">sum</code></td><td>Частичная сумма</td><td>Сложить суммы</td></tr>
<tr><td><code translate="no">min</code></td><td>Частичный минимум</td><td>Взять минимум</td></tr>
<tr><td><code translate="no">max</code></td><td>Частичный максимум</td><td>Взять максимум</td></tr>
<tr><td><code translate="no">avg</code></td><td>Частичная сумма и счетчик</td><td>Сложить оба состояния, затем разделить один раз на финальном этапе</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> — показательный случай. Усреднение двух частичных средних некорректно, если разделы содержат разное количество строк. Milvus независимо переносит <code translate="no">sum</code> и <code translate="no">count</code> и вычисляет финальное среднее только после того, как оба значения были глобально объединены.</p>
<p>Это одна из причин, по которой агрегация должна находиться в базе данных: операция не сводится к тому, чтобы просто «запустить одну и ту же функцию на нескольких пакетах». Движок должен сохранять алгебру каждого агрегата при переходе через границы сегментов и узлов.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">Видимость применяется до агрегации</h3><p>Удаленные и истекшие строки исключаются из частичных состояний на уровне сегмента в соответствии с границей видимости запроса. Они не передаются выше, чтобы затем быть исправленными в приложении.</p>
<p>Поэтому результат описывает строки, которые Milvus считает видимыми для данного запроса, а не произвольный набор пакетов, полученных в слегка разные моменты времени.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> теперь считает группы</h3><p>В обычном запросе <code translate="no">limit</code> управляет количеством возвращаемых строк сущностей. В сгруппированном запросе он управляет количеством возвращаемых групп. Поскольку кардинальность результата определяется группами, а не совпавшими строками, агрегация запроса также может опускать <code translate="no">limit</code>, когда ей нужны все группы.</p>
<p>Это звучит как небольшая деталь API, но она отражает другую модель результата: вывод больше не является страницей сущностей. Это отношение, строки которого представляют группы.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: представление ANN-кандидатов в виде корзин<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>Агрегация запросов отвечает на вопрос: «Как выглядят видимые строки, соответствующие этому фильтру?» Search Aggregation задает другой вопрос: «Как выглядит набор кандидатов, извлеченный для этого вектора?»</p>
<p>У этой операции нет точного SQL-эквивалента. ANN-поиск сначала устанавливает границу кандидатов на основе сходства. Затем Milvus организует сохраненных кандидатов по скалярным ключам и возвращает дерево корзин вместо обычного плоского списка совпадений.</p>
<p>Корзина может содержать:</p>
<ul>
<li>ключ, например <code translate="no">brand</code>, или составной ключ, например <code translate="no">(brand, color)</code>;</li>
<li>счетчик сохраненных кандидатов;</li>
<li>метрики, включая <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> и <code translate="no">max</code>;</li>
<li>репрезентативные сущности, выбранные с помощью <code translate="no">top_hits</code>; и</li>
<li>вложенную <code translate="no">sub_aggregation</code>, создающую дочерние корзины.</li>
</ul>
<p>Для страницы поиска товаров один запрос может вернуть корзины брендов, среднюю цену внутри каждой корзины и три репрезентативных товара на бренд:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Когда задан <code translate="no">search_aggregation</code>, обычный список совпадений пуст. Приложение читает ответ с корзинами из <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">Спецификация агрегации задает две разные границы</h3><p>Search Aggregation не выполняет <code translate="no">GROUP BY</code> по каждой сущности в коллекции и не просто берет обычный ответ Top-K и агрегирует этот плоский список.</p>
<p>Ее выполнение состоит из трех этапов:</p>
<ol>
<li>Milvus выполняет ANN-поиск, чтобы извлечь кандидатов рядом с вектором запроса.</li>
<li>Этап группировки сохраняет ограниченное количество кандидатов для каждого полного ключа корзины.</li>
<li>Milvus строит корзины, вычисляет метрики по сохраненным кандидатам, упорядочивает корзины и прикрепляет репрезентативные совпадения или дочерние корзины.</li>
</ol>
<p>Два параметра управляют разными частями результата:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> ограничивает количество корзин, возвращаемых на данном уровне агрегации.</li>
<li>Наибольшее значение <code translate="no">TopHits.size</code> в любом месте дерева агрегации задает бюджет сохраненных кандидатов для каждого полного составного ключа. Если запрос не содержит <code translate="no">top_hits</code>, бюджет на ключ по умолчанию равен одному.</li>
</ul>
<p>Верхнеуровневый search <code translate="no">limit</code> не управляет этим режимом и игнорируется, когда присутствует <code translate="no">search_aggregation</code>.</p>
<p>Это различие существенно при чтении <code translate="no">count</code> или метрик корзины. При <code translate="no">TopHits(size=3)</code> корзина бренда может обобщать не более трех сохраненных кандидатов для своего полного ключа, даже если коллекция содержит тысячи релевантных товаров этого бренда. Увеличение <code translate="no">TopHits.size</code> расширяет окно метрик на ключ, но не превращает ANN-поиск в точное сканирование.</p>
<p>Если приложению нужны точные статистики по каждой видимой строке, соответствующей фильтру, следует использовать агрегацию запросов. Search Aggregation предназначена для описания и сравнения кандидатов, полученных поиском по сходству.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation и Grouping Search решают разные задачи<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus поддерживает Grouping Search (<code translate="no">group_by</code>)с Milvus 2.4. Легко увидеть слово «grouping» в обеих возможностях и предположить, что это два интерфейса для одной и той же операции. Их контракты вывода различаются.</p>
<p><strong>Grouping Search</strong> меняет то, какие сущности появляются в ранжированном списке результатов. Распространенный паттерн RAG хранит фрагменты как отдельные сущности, группирует их по <code translate="no">doc_id</code> и возвращает один или несколько фрагментов из каждого документа. Основным выводом остаются обычные поисковые совпадения, но с меньшим числом повторяющихся значений поля группировки.</p>
<p><strong>Search Aggregation</strong> возвращает статистическое представление. Основной вывод — это дерево корзин, содержащее ключи, счетчики, метрики, репрезентативные совпадения и необязательные дочерние корзины.</p>
<table>
<thead>
<tr><th>Потребность приложения</th><th>Предпочтительно</th><th>Что использовать</th></tr>
</thead>
<tbody>
<tr><td>Ранжированный список сущностей с большим разнообразием по полю</td><td>Grouping Search</td><td>Обычные поисковые совпадения</td></tr>
<tr><td>Счетчики фасетов, метрики по группам, репрезентативные совпадения или вложенные распределения</td><td>Search Aggregation</td><td>Объекты <code translate="no">AggregationBucket</code> в <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Практическое правило — начинать с формы ответа UI или API. Если приложение отображает список, Grouping Search обычно является правильным примитивом. Если оно отображает фасеты, карточки распределений или иерархию групп, используйте Search Aggregation.</p>
<p>Эти два режима взаимоисключают друг друга в одном запросе, потому что определяют разные основные формы результата.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: перенесите сортировку до границы приложения<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>Сортировка — наименее экзотическая возможность в этом релизе и одна из тех, которые проще всего неправильно реализовать вне движка.</p>
<p>Milvus 3.0 предоставляет сортировку как для query, так и для search, но эти два пути используют разные параметры SDK и работают с разными входными наборами.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">Сортировка query упорядочивает отфильтрованный набор строк</h3><p>Query в PyMilvus использует <code translate="no">order_by</code>, выраженный как список строк <code translate="no">&quot;field:direction&quot;</code>. Движок применяет фильтр, упорядочивает видимые строки, а затем применяет <code translate="no">limit</code> и <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Это делает query полезным для просмотра в бизнес-порядке: самые новые загруженные записи, самые дорогие товары внутри фильтра, минимальные остатки или экстремальные значения для исследования данных. Без серверного упорядочивания приложениям приходилось сначала получать строки, и они не могли задать надежный бизнес-порядок на разных страницах.</p>
<p>Для nullable-полей query при сортировке по возрастанию null-значения помещаются в конец, а при сортировке по убыванию — в начало. Поле сортировки не обязано присутствовать в <code translate="no">output_fields</code>; включайте его только тогда, когда приложению нужно это значение в ответе.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">Сортировка search переупорядочивает набор ANN-кандидатов</h3><p>Search в PyMilvus использует <code translate="no">order_by_fields</code>, где каждая запись задает имя скалярного поля и направление:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN по-прежнему определяет, какие сущности становятся кандидатами. <code translate="no">order_by_fields</code> меняет то, как эти кандидаты возвращаются; он не заставляет поиск глобально сканировать коллекцию в поисках самых дешевых товаров.</p>
<p>Эта граница дает двум API разные задачи:</p>
<ul>
<li>Используйте query плюс <code translate="no">order_by</code>, когда сам скалярный порядок определяет результат, например десять самых дешевых товаров в наличии.</li>
<li>Используйте search плюс <code translate="no">order_by_fields</code>, когда семантическая или векторная релевантность определяет набор кандидатов, а скалярное поле определяет, как эти кандидаты должны быть представлены.</li>
</ul>
<p>Многоуровневая сортировка применяет ключи в порядке списка. Когда search-кандидаты имеют одинаковые значения для каждого заданного скалярного ключа, Milvus сохраняет их исходный порядок по оценке сходства.</p>
<p>Сортировка также сочетается с Grouping Search. Milvus упорядочивает группы по настроенному скалярному значению из верхней сущности каждой группы, сохраняя сгруппированную форму результата. Это полезно, когда приложению нужны и разнообразие по полю, и бизнес-релевантный порядок групп.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Что позволяют эти возможности<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>Эти API являются универсальными примитивами базы данных, но несколько retrieval-нагрузок получают от них немедленную пользу.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG и агенты: анализ концентрации извлечения</h3><p>RAG- или агентная система может раскладывать извлеченные фрагменты по исходному документу, продуктовой линейке, арендатору или типу контента. Результат, сконцентрированный в двух документах, несет другой сигнал покрытия, чем результат, распределенный по десяткам источников.</p>
<p>Такое распределение не является гарантией качества ответа. Однако это полезная диагностика извлечения, которую приложение или агент может сочетать с оценками, цитированием и другими проверками при решении, расширять ли запрос, выполнять извлечение снова или попросить уточнение.</p>
<p>Grouping Search остается правильным выбором, когда цель — просто разнообразить возвращаемые фрагменты. Search Aggregation полезна, когда системе нужно само распределение.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">E-commerce и рекомендации контента: возвращайте фасеты вместе с поиском</h3><p>Начальная страница поиска товаров может получить из Milvus корзины брендов, ценовые метрики, репрезентативные позиции и отсортированный по скалярному полю список кандидатов. Приложение по-прежнему контролирует представление и бизнес-логику, но ему больше не нужно восстанавливать базовые семантики корзин из экспортированных совпадений.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Логи и безопасность: сочетание сходства с распределением инцидентов</h3><p>Поиск по сходству может находить события, связанные с подозрительной строкой лога. Затем Search Aggregation может показать, какие хосты доминируют среди этих кандидатов, минимальную и максимальную временную метку в каждой корзине хоста или как кандидаты распределяются по severity и сервису.</p>
<p>Результат остается представлением извлеченных кандидатов, а не точным глобальным счетчиком инцидентов. Когда расследованию нужны точные счетчики по каждому событию, соответствующему фильтру, агрегация запросов предоставляет второй путь.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Операции и исследование данных: вычислять вместо экспортировать</h3><p>Панели мониторинга и административные инструменты могут выполнять точные счетчики и средние значения по отфильтрованным строкам, а затем просматривать базовые сущности в заданном скалярном порядке. Это устраняет множество одноразовых утилит «экспортировать, вычислить и отсортировать», не делая вид, что Milvus стал полноценной аналитической базой данных.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Границы: что агрегация и <code translate="no">ORDER BY</code> не заменяют<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Эти функции расширяют retrieval-движок; они не превращают Milvus в систему оперативной аналитической обработки (OLAP).</p>
<ul>
<li>Агрегация запросов поддерживает группировку плюс <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> и <code translate="no">max</code>. Она не добавляет соединения, оконные функции или сложные подзапросы. Крупные офлайн-аналитические задания по-прежнему относятся к системам вроде Spark, которые могут работать со снимками Milvus 3.0 и общими путями хранения.</li>
<li>Ключи групп query поддерживают поля integer, <code translate="no">VARCHAR</code> и <code translate="no">TIMESTAMPTZ</code>. Ключи корзин Search Aggregation дополнительно поддерживают булевы поля. Значения с плавающей точкой, векторы, JSON и массивы не являются ключами корзин.</li>
<li>Для Search Aggregation <code translate="no">count</code> принимает <code translate="no">&quot;*&quot;</code> или не-JSON, нединамический источник; <code translate="no">sum</code> и <code translate="no">avg</code> требуют числовых источников; а <code translate="no">min</code> и <code translate="no">max</code> также поддерживают строковые и <code translate="no">TIMESTAMPTZ</code> источники. Агрегация запросов следует тем же границам арифметических типов. Обратитесь к руководству API перед применением агрегата к сложному типу поля.</li>
<li>Агрегация запросов может упорядочивать сгруппированный вывод по ключам групп, тогда как упорядочивание по вычисленному агрегату, например <code translate="no">count(*)</code>, остается текущей границей. Без явного порядка порядок групп не гарантируется.</li>
<li>Search Aggregation в настоящее время нельзя сочетать в одном запросе с Hybrid Search, Grouping Search, Search Iterators, ненулевым offset или подсветкой.</li>
<li>Счетчики и метрики Search Aggregation описывают сохраненных ANN-кандидатов, а не всю коллекцию и не каждую сущность, которая может быть семантически релевантной.</li>
<li>Search <code translate="no">ORDER BY</code> меняет представление кандидатов. Он не исправляет пропущенных ANN-кандидатов и не превращает поиск по сходству в точный скалярный запрос Top-N.</li>
</ul>
<p>Самый простой способ выбрать между новыми примитивами — начать с вопроса:</p>
<ul>
<li>Для точной статистики по отфильтрованным видимым строкам используйте агрегацию запросов.</li>
<li>Для распределения по кандидатам поиска по сходству используйте Search Aggregation.</li>
<li>Для разнообразного ранжированного списка используйте Grouping Search.</li>
<li>Для заданного скалярного порядка используйте query или search <code translate="no">ORDER BY</code> в зависимости от того, какой путь сформировал набор результатов.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">От списков кандидатов к структурированным результатам<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Векторные базы данных традиционно оптимизировали один вопрос: какие K сущностей находятся ближе всего к этому вектору?</strong></p>
<p>Производственные retrieval-системы сразу задают последующие вопросы. Какие группы доминируют в результате? Каковы их счетчики и диапазоны? Какие примеры представляют каждую группу? В каком бизнес-порядке приложение должно показывать строки или кандидатов?</p>
<p>Milvus 3.0 переносит эти операции в тот же движок, которому принадлежат данные, граница ANN-кандидатов и семантики видимости. Агрегация запросов выполняет точное распределенное сокращение по видимым строкам. Search Aggregation строит представление в виде корзин по сохраненным ANN-кандидатам. <code translate="no">ORDER BY</code> дает путям query и search серверный скалярный порядок, не заставляя приложение восстанавливать его постранично.</p>
<p>Результат — это не OLAP-движок, скрытый внутри векторной базы данных. Это retrieval-движок, который может возвращать больше структуры, фактически необходимой приложениям.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Попробуйте агрегацию и <code translate="no">ORDER BY</code> в Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 уже доступен. Используйте <a href="https://milvus.io/docs/get-and-scalar-query.md">руководство по Query</a> для точной агрегации и сортировки query, <a href="https://milvus.io/docs/search-aggregation.md">руководство по Search Aggregation</a> для семантик корзин и ограничений, <a href="https://milvus.io/docs/single-vector-search.md">руководство по Basic Vector Search</a> для сортировки search и <a href="https://milvus.io/docs/grouping-search.md">руководство по Grouping Search</a>, когда ваша основная цель — разнообразие результатов.</p>
<p>Подробнее о релизе в целом см. <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">блог о запуске Milvus 3.0</a>, <a href="https://milvus.io/docs/release_notes.md">заметки о выпуске Milvus 3.0</a> и <a href="https://github.com/milvus-io/milvus">репозиторий milvus-io/milvus</a>.</p>
<p>Если вы хотите оценить те же API без самостоятельной эксплуатации кластера, попробуйте их в <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. Текущие <a href="https://docs.zilliz.com/reference/python/python/Vector-query">справочник Zilliz Cloud по query</a> и <a href="https://docs.zilliz.com/reference/python/python/Vector-search">справочник по search</a> описывают доступность и параметры для типов управляемых кластеров.</p>
<p>Чтобы обсудить нагрузку или пограничный случай с командой, присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX">сообществу Milvus в Discord</a> или запишитесь на <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">сессию Milvus Office Hours</a>.</p>
