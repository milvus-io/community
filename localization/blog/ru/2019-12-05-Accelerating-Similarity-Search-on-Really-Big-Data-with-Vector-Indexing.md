---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Ускорение поиска по сходству в действительно больших данных с помощью
  векторного индексирования
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Без векторной индексации многие современные приложения ИИ работали бы
  невероятно медленно. Узнайте, как выбрать правильный индекс для вашего
  следующего приложения машинного обучения.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Ускорение поиска по сходству в действительно больших данных с помощью векторного индексирования</custom-h1><p>Векторные системы поиска сходства - от компьютерного зрения до поиска новых лекарств - используются во многих популярных приложениях искусственного интеллекта (ИИ). Огромным компонентом, позволяющим эффективно запрашивать миллионные, миллиардные и даже триллионные наборы векторных данных, на которые опираются системы поиска сходства, является индексирование - процесс организации данных, который значительно ускоряет поиск в больших данных. В этой статье рассказывается о роли индексации в обеспечении эффективности поиска по векторному сходству, о различных типах индексов векторных инвертированных файлов (IVF) и о том, какой индекс следует использовать в различных сценариях.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Ускорение поиска сходства в действительно больших данных с помощью векторного индексирования</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">Как векторное индексирование ускоряет поиск по сходству и машинное обучение?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Что такое различные типы ЭКО-индексов и для каких сценариев они лучше всего подходят?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Хорошо подходит для поиска в относительно небольших (миллионных) наборах данных, когда требуется 100-процентный отзыв.</a><ul>
<li><a href="#flat-performance-test-results">Результаты тестов производительности FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Результаты тестирования времени выполнения запросов для индекса FLAT в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Основные выводы:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Повышает скорость за счет точности (и наоборот).</a><ul>
<li><a href="#ivf_flat-performance-test-results">Результаты теста производительности IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Результаты теста времени выполнения запроса для индекса IVF_FLAT в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Основные выводы:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Результаты теста Recall rate для индекса IVF_FLAT в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Основные выводы:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: быстрее и менее требователен к ресурсам, чем IVF_FLAT, но и менее точен.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">Результаты тестирования производительности IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Результаты теста времени выполнения запросов для индекса IVF_SQ8 в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Основные выводы:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Результаты теста Recall rate для индекса IVF_SQ8 в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Основные выводы:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: новый гибридный подход на базе GPU/CPU, который еще быстрее, чем IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Результаты тестирования производительности IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Результаты тестирования времени выполнения запросов для индекса IVF_SQ8H в Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Основные выводы:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Узнайте больше о Milvus, платформе для управления векторными данными в огромных масштабах.</a></li>
<li><a href="#methodology">Методология</a><ul>
<li><a href="#performance-testing-environment">Среда тестирования производительности</a></li>
<li><a href="#relevant-technical-concepts">Соответствующие технические концепции</a></li>
<li><a href="#resources">Ресурсы</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">Как векторное индексирование ускоряет поиск по сходству и машинное обучение?</h3><p>Системы поиска по сходству работают, сравнивая входные данные с базой данных, чтобы найти объекты, которые наиболее похожи на входные данные. Индексирование - это процесс эффективной организации данных, и оно играет важную роль в обеспечении полезности поиска по сходству, значительно ускоряя трудоемкие запросы к большим массивам данных. После индексации огромного набора векторных данных запросы могут быть направлены в кластеры или подмножества данных, которые с наибольшей вероятностью содержат векторы, похожие на входной запрос. На практике это означает, что для ускорения запросов к действительно большим векторным данным приходится жертвовать определенной степенью точности.</p>
<p>Можно провести аналогию со словарем, в котором слова отсортированы по алфавиту. При поиске слова можно быстро перейти к разделу, содержащему только слова с тем же начальным значением, что значительно ускоряет поиск определения вводимого слова.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Какие существуют типы индексов ЭКО и для каких сценариев они лучше всего подходят?</h3><p>Существует множество индексов, предназначенных для поиска векторного сходства в высоких измерениях, и каждый из них имеет свои компромиссы в производительности, точности и требованиях к хранению данных. В этой статье рассматриваются несколько распространенных типов индексов ЭКО, их сильные и слабые стороны, а также результаты тестирования производительности для каждого типа индексов. В ходе тестирования производительности были определены время выполнения запроса и скорость запоминания для каждого типа индексов в <a href="https://milvus.io/">Milvus</a>, платформе управления векторными данными с открытым исходным кодом. Дополнительную информацию о среде тестирования см. в разделе "Методология" в нижней части этой статьи.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Хорошо подходит для поиска в относительно небольших (миллионных) наборах данных, когда требуется 100-процентный отзыв.</h3><p>Для приложений поиска векторного сходства, требующих идеальной точности и зависящих от относительно небольших (миллионных) наборов данных, индекс FLAT является хорошим выбором. FLAT не сжимает векторы и является единственным индексом, который может гарантировать точные результаты поиска. Результаты, полученные с помощью FLAT, можно также использовать для сравнения с результатами, полученными с помощью других индексов, которые имеют менее чем 100-процентный отзыв.</p>
<p>Точность FLAT обусловлена тем, что он использует исчерпывающий подход к поиску, то есть для каждого запроса целевой входной сигнал сравнивается с каждым вектором в наборе данных. Это делает FLAT самым медленным индексом в нашем списке и плохо подходит для запросов к массивным векторным данным. В Milvus нет параметров для индекса FLAT, и его использование не требует подготовки данных или дополнительного хранения.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Результаты тестирования производительности FLAT:</h4><p>Тестирование времени выполнения запросов FLAT в Milvus проводилось на наборе данных, состоящем из 2 миллионов 128-мерных векторов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>С увеличением nq (количества целевых векторов для запроса) время выполнения запроса увеличивается.</li>
<li>Используя индекс FLAT в Milvus, мы видим, что время запроса резко возрастает, когда nq превышает 200.</li>
<li>В целом, индекс FLAT быстрее и стабильнее при работе Milvus на GPU по сравнению с CPU. Однако запросы FLAT на CPU выполняются быстрее, когда nq меньше 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Повышает скорость за счет точности (и наоборот).</h3><p>Распространенным способом ускорения процесса поиска сходства за счет снижения точности является приближенный поиск ближайших соседей (ANN). Алгоритмы ANN снижают требования к хранению и вычислительную нагрузку, объединяя похожие векторы в кластеры, что приводит к ускорению поиска векторов. IVF_FLAT - это самый базовый тип инвертированного файлового индекса, в котором используется одна из форм поиска ANN.</p>
<p>IVF_FLAT делит векторные данные на некоторое количество кластеров (nlist), а затем сравнивает расстояния между целевым входным вектором и центром каждого кластера. В зависимости от количества кластеров, к которым система настроена на запрос (nprobe), результаты поиска сходства возвращаются на основе сравнений между целевым входным вектором и векторами только в наиболее похожих кластерах, что значительно сокращает время запроса.</p>
<p>Настраивая nprobe, можно найти идеальный баланс между точностью и скоростью для конкретного сценария. Результаты тестирования производительности IVF_FLAT показывают, что время выполнения запроса резко возрастает при увеличении как количества векторов целевого ввода (nq), так и количества кластеров для поиска (nprobe). IVF_FLAT не сжимает векторные данные, однако индексные файлы содержат метаданные, которые незначительно увеличивают требования к хранению по сравнению с исходным неиндексированным набором векторных данных.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Результаты тестирования производительности IVF_FLAT:</h4><p>Тестирование времени выполнения запроса IVF_FLAT проводилось в Milvus с использованием публичного набора данных 1B SIFT, который содержит 1 миллиард 128-мерных векторов.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>При работе на CPU время запроса для индекса IVF_FLAT в Milvus увеличивается с ростом nprobe и nq. Это означает, что чем больше входных векторов содержит запрос или чем больше кластеров просматривает запрос, тем больше будет время выполнения запроса.</li>
<li>На GPU индекс показывает меньшую зависимость времени от изменений nq и nprobe. Это объясняется тем, что данные индекса велики, а копирование данных из памяти CPU в память GPU составляет большую часть общего времени выполнения запроса.</li>
<li>Во всех сценариях, кроме nq = 1 000 и nprobe = 32, индекс IVF_FLAT более эффективен при работе на CPU.</li>
</ul>
<p>Тестирование производительности отзыва IVF_FLAT проводилось в Milvus с использованием как публичного набора данных 1M SIFT, содержащего 1 миллион 128-мерных векторов, так и набора данных glove-200-angular, содержащего более 1 миллиона 200-мерных векторов, для построения индекса (nlist = 16 384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>Индекс IVF_FLAT можно оптимизировать по точности, добившись показателя recall выше 0,99 на наборе данных 1M SIFT при nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: быстрее и менее требователен к ресурсам, чем IVF_FLAT, но также менее точен.</h3><p>IVF_FLAT не производит никакого сжатия, поэтому индексные файлы, которые он создает, примерно такого же размера, как и исходные, необработанные векторные данные без индексации. Например, если исходный набор данных 1B SIFT имеет размер 476 ГБ, то индексные файлы IVF_FLAT будут немного больше (~470 ГБ). Загрузка всех индексных файлов в память займет 470 ГБ.</p>
<p>Если ресурсы памяти диска, CPU или GPU ограничены, IVF_SQ8 будет лучшим вариантом, чем IVF_FLAT. Этот тип индекса может преобразовать каждое FLOAT (4 байта) в UINT8 (1 байт), выполнив скалярное квантование. Это позволяет сократить потребление памяти на диске, CPU и GPU на 70-75 %. Для набора данных 1B SIFT индексные файлы IVF_SQ8 требуют всего 140 ГБ памяти.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Результаты тестирования производительности IVF_SQ8:</h4><p>Тестирование времени выполнения запросов IVF_SQ8 проводилось в Milvus с использованием публичного набора данных 1B SIFT, содержащего 1 миллиард 128-мерных векторов, для построения индекса.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>За счет уменьшения размера индексного файла IVF_SQ8 обеспечивает заметный прирост производительности по сравнению с IVF_FLAT. Кривая производительности IVF_SQ8 похожа на кривую производительности IVF_FLAT, а время выполнения запроса увеличивается с ростом nq и nprobe.</li>
<li>Как и в случае с IVF_FLAT, производительность IVF_SQ8 выше при работе на CPU и при меньших значениях nq и nprobe.</li>
</ul>
<p>Тестирование производительности IVF_SQ8 по отзывам проводилось в Milvus с использованием как публичного набора данных 1M SIFT, содержащего 1 миллион 128-мерных векторов, так и набора данных glove-200-angular, содержащего более 1 миллиона 200-мерных векторов, для построения индекса (nlist = 16 384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>Несмотря на сжатие исходных данных, точность запросов в IVF_SQ8 существенно не снижается. При различных настройках nprobe показатель отзыва у IVF_SQ8 не более чем на 1 % ниже, чем у IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: новый гибридный подход на GPU/CPU, который еще быстрее, чем IVF_SQ8.</h3><p>IVF_SQ8H - это новый тип индекса, который улучшает производительность запросов по сравнению с IVF_SQ8. При запросе к индексу IVF_SQ8, работающему на CPU, большая часть общего времени запроса тратится на поиск nprobe кластеров, ближайших к целевому входному вектору. Чтобы сократить время запроса, IVF_SQ8 копирует данные для операций грубого квантования, которые меньше файлов индекса, в память GPU, что значительно ускоряет операции грубого квантования. Затем порог gpu_search_threshold определяет, на каком устройстве выполняется запрос. Если nq &gt;= gpu_search_threshold, запрос выполняется на GPU; в противном случае запрос выполняется на CPU.</p>
<p>IVF_SQ8H - это гибридный тип индекса, требующий совместной работы CPU и GPU. Его можно использовать только с Milvus с поддержкой GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Результаты тестирования производительности IVF_SQ8H:</h4><p>Тестирование времени выполнения запроса IVF_SQ8H проводилось в Milvus с использованием публичного набора данных 1B SIFT, содержащего 1 миллиард 128-мерных векторов, для построения индекса.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Основные выводы:</h4><ul>
<li>Когда nq меньше или равно 1000, время выполнения запросов в IVF_SQ8H почти в два раза быстрее, чем в IVFSQ8.</li>
<li>Когда nq = 2000, время выполнения запросов для IVFSQ8H и IVF_SQ8 одинаково. Однако если параметр gpu_search_threshold меньше 2000, IVF_SQ8H превосходит IVF_SQ8.</li>
<li>Показатель отзыва запросов у IVF_SQ8H идентичен показателю IVF_SQ8, что означает сокращение времени выполнения запросов без потери точности поиска.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Узнайте больше о Milvus, платформе для управления векторными данными в огромных масштабах.</h3><p>Milvus - это платформа для управления векторными данными, которая позволяет использовать приложения для поиска по сходству в таких областях, как искусственный интеллект, глубокое обучение, традиционные векторные вычисления и т. д. Дополнительную информацию о Milvus можно найти на следующих ресурсах:</p>
<ul>
<li>Milvus доступен под лицензией с открытым исходным кодом на <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>В Milvus поддерживаются дополнительные типы индексов, включая индексы на основе графов и деревьев. Полный список поддерживаемых типов индексов можно найти в <a href="https://milvus.io/docs/v0.11.0/index.md">документации по векторным индексам</a> в Milvus.</li>
<li>Чтобы узнать больше о компании, которая выпустила Milvus, посетите сайт <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Пообщайтесь с сообществом Milvus или получите помощь в решении проблемы в <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Методология</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Среда тестирования производительности</h4><p>В тестах производительности, о которых говорится в этой статье, использовалась следующая конфигурация сервера:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2,50 ГГц, 24 ядра</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 ГБ памяти</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Соответствующие технические концепции</h4><p>Хотя это и не обязательно для понимания данной статьи, здесь приведены несколько технических понятий, которые помогут интерпретировать результаты наших тестов производительности индекса:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Ресурсы</h4><p>Для написания этой статьи были использованы следующие источники:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Энциклопедия систем баз данных</a>", Ling Liu и M. Tamer Özsu.</li>
</ul>
