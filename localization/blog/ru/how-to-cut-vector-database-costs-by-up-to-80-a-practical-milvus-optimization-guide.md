---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Как сократить расходы на базы данных векторов на 80 %: Практическое
  руководство по оптимизации Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus бесплатен, но инфраструктура - нет. Узнайте, как сократить расходы на
  память векторных баз данных на 60-80 % с помощью улучшенных индексов, MMap и
  многоуровневого хранения.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Ваш прототип RAG работал отлично. Затем он был запущен в производство, трафик вырос, и теперь ваш счет за базу данных векторов вырос с $500 до $5 000 в месяц. Знакомо?</p>
<p>Это одна из самых распространенных проблем масштабирования в приложениях ИИ. Вы создали что-то, что создает реальную ценность, но расходы на инфраструктуру растут быстрее, чем растет ваша пользовательская база. И когда вы смотрите на счет, база данных векторов часто становится самым большим сюрпризом - в тех развертываниях, которые мы видели, она может составлять примерно 40-50 % от общей стоимости приложения, уступая только вызовам LLM API.</p>
<p>В этом руководстве я расскажу о том, куда на самом деле уходят деньги и что конкретно можно сделать, чтобы снизить их - во многих случаях на 60-80 %. В качестве основного примера я использую <a href="https://milvus.io/">Milvus</a>, самую популярную векторную базу данных с открытым исходным кодом, поскольку именно ее я знаю лучше всего, но принципы применимы к большинству векторных баз данных.</p>
<p><em>Для ясности:</em> <em>сам</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>является бесплатным и с открытым исходным кодом - вы никогда не платите за программное обеспечение. Все расходы связаны с инфраструктурой, на которой он работает: облачные экземпляры, память, хранилище и сеть. Хорошая новость заключается в том, что большинство затрат на инфраструктуру можно сократить.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Куда на самом деле уходят деньги при использовании VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте начнем с конкретного примера. Допустим, у вас есть 100 миллионов векторов, 768 измерений, хранящихся в формате float32 - довольно типичная настройка RAG. Вот сколько это стоит в AWS в месяц:</p>
<table>
<thead>
<tr><th><strong>Компонент затрат</strong></th><th><strong>Доля</strong></th><th><strong>~Месячная стоимость</strong></th><th><strong>Примечания</strong></th></tr>
</thead>
<tbody>
<tr><td>Вычисления (процессор + память)</td><td>85-90%</td><td>$2,800</td><td>Самый большой - в основном за счет памяти</td></tr>
<tr><td>Сеть</td><td>5-10%</td><td>$250</td><td>Кросс-АЗ трафик, большие полезные нагрузки</td></tr>
<tr><td>Хранилище</td><td>2-5%</td><td>$100</td><td>Дешевое - объектное хранилище (S3/MinIO) стоит ~$0,03/ГБ.</td></tr>
</tbody>
</table>
<p>Вывод прост: память - это то, куда уходит 85-90% ваших денег. Сеть и хранилище имеют значение на периферии, но если вы хотите существенно сократить расходы, то память - это рычаг. Все в этом руководстве сосредоточено на ней.</p>
<p><strong>Небольшое замечание по поводу сети и хранилища:</strong> Вы можете сократить расходы на сеть, возвращая только те поля, которые вам нужны (ID, оценка, ключевые метаданные), и избегая межрегиональных запросов. Что касается хранения, то Milvus уже отделяет хранение от вычислений - ваши векторы хранятся в дешевом объектном хранилище, таком как S3, поэтому даже при 100 М векторов хранение обычно стоит менее 50 долларов в месяц. Ни то, ни другое не даст такого эффекта, как оптимизация памяти.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Почему память так дорога для векторного поиска<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Если вы работаете с традиционными базами данных, требования к памяти для векторного поиска могут удивить вас. Реляционная база данных может использовать дисковые B-деревья индексов и страничный кэш ОС. Векторный поиск отличается - он включает в себя массивные вычисления с плавающей запятой, и такие индексы, как HNSW или IVF, должны оставаться загруженными в память, чтобы обеспечить задержку на уровне миллисекунд.</p>
<p>Вот краткая формула для оценки потребностей в памяти:</p>
<p><strong>Требуемая память = (векторы × размеры × 4 байта) × индексный множитель</strong></p>
<p>Для нашего примера 100M × 768 × float32 с HNSW (множитель ~1,8x):</p>
<ul>
<li>Исходные данные: 100M × 768 × 4 байта ≈ 307 ГБ.</li>
<li>С индексом HNSW: 307 ГБ × 1,8 ≈ 553 ГБ</li>
<li>С накладными расходами ОС, кэшем и резервом: ~768 Гб всего</li>
<li>На AWS: 3× r6i.8xlarge (256 ГБ каждый) ≈ 2800 долларов в месяц.</li>
</ul>
<p><strong>Это базовый уровень. Теперь давайте посмотрим, как его снизить.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Выберите правильный индекс, чтобы получить в 4 раза меньшее потребление памяти<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Это самое значительное изменение, которое вы можете сделать. Для одного и того же 100-мегабайтного набора данных использование памяти может измениться в 4-6 раз в зависимости от выбора индекса.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: почти никакого сжатия, поэтому объем памяти остается близким к размеру исходных данных, около <strong>300 ГБ</strong>.</li>
<li><strong>HNSW</strong>: хранит дополнительную структуру графа, поэтому объем памяти обычно составляет <strong>1,5-2,0x</strong> от объема исходных данных, или около <strong>450-600 ГБ.</strong></li>
<li><strong>IVF_SQ8</strong>: сжимает значения float32 в uint8, обеспечивая примерно <strong>4-кратное сжатие</strong>, поэтому объем используемой памяти может снизиться до <strong>75-100 ГБ</strong>.</li>
<li><strong>IVF_PQ / DiskANN</strong>: используют более сильное сжатие или индекс на основе диска, поэтому объем памяти может сократиться еще больше - до <strong>30-60 ГБ</strong>.</li>
</ul>
<p>Многие команды начинают с HNSW, потому что у него лучшая скорость запросов, но в итоге они платят в 3-5 раз больше, чем нужно.</p>
<p>Вот как сравниваются основные типы индексов:</p>
<table>
<thead>
<tr><th><strong>Индекс</strong></th><th><strong>Множитель памяти</strong></th><th><strong>Скорость запросов</strong></th><th><strong>Recall</strong></th><th><strong>Лучший для</strong></th></tr>
</thead>
<tbody>
<tr><td>ПЛОСКИЙ</td><td>~1.0x</td><td>Медленный</td><td>100%</td><td>Небольшие наборы данных (&lt;1M), тестирование</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Средние</td><td>95-99%</td><td>Общее использование</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Средний</td><td>93-97%</td><td>Производство с учетом затрат (рекомендуется)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Быстрый</td><td>70-80%</td><td>Очень большие наборы данных, грубый поиск</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Очень быстро</td><td>98-99%</td><td>Только когда задержка важнее стоимости</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Средний</td><td>95-98%</td><td>Очень большие масштабы с твердотельными накопителями NVMe</td></tr>
</tbody>
</table>
<p><strong>Итог:</strong> Переход с HNSW или IVF_FLAT на IVF_SQ8 обычно снижает отзыв всего на 2-3% (например, с 97% до 94-95%), при этом стоимость памяти сокращается примерно на 70%. Для большинства рабочих нагрузок RAG этот компромисс абсолютно оправдан. Если вы выполняете грубый поиск или ваша планка точности ниже, IVF_PQ или IVF_RABITQ могут еще больше увеличить экономию.</p>
<p><strong>Моя рекомендация:</strong> Если вы используете HNSW в производстве и вас беспокоит стоимость, сначала попробуйте IVF_SQ8 на тестовой коллекции. Измерьте отзыв на реальных запросах. Большинство команд удивляются тому, насколько незначительно падение точности.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Перестаньте загружать все в память, чтобы сократить расходы на 60-80 %.<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Даже после выбора более эффективного индекса в памяти может оставаться больше данных, чем нужно. Milvus предлагает два способа решения этой проблемы: <strong>MMap (доступен с версии 2.3) и многоуровневое хранилище (доступно с версии 2.6). Оба способа позволяют сократить использование памяти на 60-80%.</strong></p>
<p>Основная идея обоих способов одинакова: не все ваши данные должны постоянно находиться в памяти. Разница в том, как они обращаются с данными, которые не находятся в памяти.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (Memory-Mapped Files)</h3><p>MMap отображает файлы данных с локального диска в адресное пространство процесса. Полный набор данных остается на локальном диске узла, а ОС загружает страницы в память по требованию - только при обращении к ним. Перед использованием MMap все данные загружаются из объектного хранилища (S3/MinIO) на локальный диск QueryNode.</p>
<ul>
<li>Использование памяти снижается до ~10-30 % от режима полной нагрузки.</li>
<li>Латентность остается стабильной и предсказуемой (данные находятся на локальном диске, нет сетевой выборки).</li>
<li>Компромисс: локальный диск должен быть достаточно большим, чтобы вместить весь набор данных.</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Многоуровневое хранилище</h3><p>Многоуровневое хранилище делает еще один шаг вперед. Вместо того чтобы загружать все на локальный диск, оно использует локальный диск в качестве кэша для "горячих" данных и сохраняет объектное хранилище в качестве основного уровня. Данные извлекаются из объектного хранилища только при необходимости.</p>
<ul>
<li>Использование памяти снижается до &lt;10% от режима полной нагрузки.</li>
<li>Использование локального диска также снижается - кэшируются только горячие данные (обычно 10-30 % от общего объема).</li>
<li>Компромисс: пропуски кэша увеличивают задержку на 50-200 мс (выборка из объектного хранилища).</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Поток данных и использование ресурсов</h3><table>
<thead>
<tr><th><strong>Режим</strong></th><th><strong>Поток данных</strong></th><th><strong>Использование памяти</strong></th><th><strong>Использование локального диска</strong></th><th><strong>Латентность</strong></th></tr>
</thead>
<tbody>
<tr><td>Традиционная полная загрузка</td><td>Хранилище объектов → память (100%)</td><td>Очень высокая (100%)</td><td>Низкая (только временная)</td><td>Очень низкая и стабильная</td></tr>
<tr><td>MMap</td><td>Хранилище объектов → локальный диск (100%) → память (по требованию)</td><td>Низкий (10-30%)</td><td>Высокий (100%)</td><td>Низкая и стабильная</td></tr>
<tr><td>Многоуровневое хранение</td><td>Объектное хранилище ↔ локальный кэш (горячие данные) → память (по требованию)</td><td>Очень низкий (&lt;10%)</td><td>Низкий (только горячие данные)</td><td>Низкая вероятность попадания в кэш, высокая вероятность пропусков кэша</td></tr>
</tbody>
</table>
<p><strong>Рекомендации по оборудованию:</strong> оба метода сильно зависят от локального дискового ввода-вывода, поэтому настоятельно рекомендуется использовать <strong>твердотельные накопители NVMe</strong>, в идеале с <strong>IOPS выше 10 000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap против многоуровневого хранения: Что лучше использовать?</h3><table>
<thead>
<tr><th><strong>Ваша ситуация</strong></th><th><strong>Использовать это</strong></th><th><strong>Почему</strong></th></tr>
</thead>
<tbody>
<tr><td>Чувствительность к задержкам (P99 &lt; 20 мс)</td><td>MMap</td><td>Данные уже находятся на локальном диске - нет необходимости в сетевой выборке, стабильная задержка</td></tr>
<tr><td>Равномерный доступ (нет четкого разделения на горячие и холодные)</td><td>MMap</td><td>Для эффективности многоуровневого хранения необходим перекос между горячим и холодным доступом; без него коэффициент попадания в кэш будет низким</td></tr>
<tr><td>Приоритет - стоимость (случайные скачки задержки - это нормально)</td><td>Многоуровневое хранилище</td><td>Экономия памяти и локального диска (на 70-90 % меньше диска)</td></tr>
<tr><td>Четкий шаблон "горячий/холодный" (правило 80/20)</td><td>Многоуровневое хранилище</td><td>Горячие данные остаются в кэше, холодные данные остаются в дешевом объектном хранилище</td></tr>
<tr><td>Очень большие масштабы (&gt;500M векторов)</td><td>Многоуровневое хранение</td><td>Локальный диск одного узла часто не может вместить полный набор данных в таком масштабе</td></tr>
</tbody>
</table>
<p><strong>Примечание:</strong> Для MMap требуется Milvus 2.3+. Для многоуровневого хранилища требуется Milvus 2.6+. Обе системы лучше всего работают с твердотельными дисками NVMe (рекомендуется 10 000+ IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Как настроить MMap</h3><p><strong>Вариант 1: конфигурация YAML (рекомендуется для новых развертываний)</strong></p>
<p>Отредактируйте файл конфигурации Milvus milvus.yaml и добавьте следующие настройки в раздел queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Вариант 2: Конфигурация Python SDK (для существующих коллекций)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Как настроить многоуровневое хранилище (Milvus 2.6+)</h3><p>Отредактируйте файл конфигурации Milvus milvus.yaml и добавьте следующие параметры в раздел queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Use Lower-Dimensional Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Этот параметр легко упустить из виду, но размерность напрямую влияет на ваши затраты. Память, хранилище и вычисления растут линейно с увеличением размерности. Модель с размерностью 1536 стоит примерно в 4 раза больше инфраструктуры, чем модель с размерностью 384 для тех же данных.</p>
<p>Затраты на запросы растут так же - косинусоидальное сходство равно O(D), поэтому на один запрос векторов размером 768 требуется примерно в два раза больше вычислений, чем векторов размером 384. В рабочих нагрузках с высоким коэффициентом производительности эта разница напрямую выражается в меньшем количестве необходимых узлов.</p>
<p>Вот как сравниваются распространенные модели встраивания (используя 384-dim в качестве базового уровня 1,0x):</p>
<table>
<thead>
<tr><th><strong>Модель</strong></th><th><strong>Размеры</strong></th><th><strong>Относительная стоимость</strong></th><th><strong>Отзыв</strong></th><th><strong>Лучшая для</strong></th></tr>
</thead>
<tbody>
<tr><td>текст-вставка-3-большой</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Когда точность не подлежит обсуждению (исследования, здравоохранение)</td></tr>
<tr><td>text-embedding-3-small</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Общие рабочие нагрузки RAG</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Хорошее соотношение цены и производительности</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Рабочие нагрузки, чувствительные к затратам</td></tr>
</tbody>
</table>
<p><strong>Практический совет:</strong> Не думайте, что вам нужна самая большая модель. Проведите тестирование на репрезентативной выборке ваших реальных запросов (обычно достаточно 1 млн векторов) и найдите модель с наименьшей размерностью, которая соответствует вашему критерию точности. Многие команды обнаруживают, что 768 измерений работает так же хорошо, как и 1536 для их сценария использования.</p>
<p><strong>Вы уже выбрали модель с высокой размерностью?</strong> Вы можете уменьшить размерность постфактум. PCA (анализ главных компонент) позволяет убрать лишние признаки, а <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">вкрапления "Матрешка"</a> позволяют усечь модель до первых N измерений, сохранив при этом большую часть качества. Оба способа стоит попробовать, прежде чем повторно встраивать весь набор данных.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Управление жизненным циклом данных с помощью уплотнения и TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Этот способ менее эффектный, но все же имеет значение, особенно для долго работающих производственных систем. В Milvus используется модель хранения "только приложение": когда вы удаляете данные, они помечаются как удаленные, но не удаляются сразу. Со временем эти мертвые данные накапливаются, тратят место в хранилище и заставляют запросы сканировать больше строк, чем нужно.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Компактификация: Восстановление памяти после удаления данных</h3><p>Compaction - это фоновый процесс очистки в Milvus. Он объединяет небольшие сегменты, физически удаляет удаленные данные и перезаписывает сжатые файлы. Вам понадобится эта функция, если:</p>
<ul>
<li>Вы часто записываете и удаляете данные (каталоги продуктов, обновления контента, журналы реального времени).</li>
<li>Количество сегментов постоянно растет (это увеличивает накладные расходы на каждый запрос).</li>
<li>Использование хранилища растет гораздо быстрее, чем реальные данные.</li>
</ul>
<p><strong>Внимание:</strong> Компактирование требует больших затрат на ввод-вывод. Запланируйте ее на периоды с низким трафиком (например, на ночь) или тщательно настройте триггеры, чтобы она не конкурировала с производственными запросами.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (Time to Live): Автоматическое удаление старых векторных данных</h3><p>Для данных, срок действия которых истекает естественным образом, TTL - более эффективный способ, чем ручное удаление. Установите время жизни данных, и Milvus автоматически пометит их на удаление по истечении срока действия. Компактирование выполняет фактическую очистку.</p>
<p>Это полезно для:</p>
<ul>
<li>Журналы и данные сеансов - храните только последние 7 или 30 дней.</li>
<li>RAG, чувствительные к времени, - предпочитайте свежие знания, пусть старые документы устареют.</li>
<li>Рекомендации в реальном времени - извлекать информацию только из недавнего поведения пользователя.</li>
</ul>
<p>Вместе уплотнение и TTL не дают вашей системе бесшумно накапливать мусор. Это не самый большой рычаг снижения затрат, но он предотвращает медленное разрастание хранилища, которое застает команды врасплох.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Еще один вариант: Zilliz Cloud (полностью управляемый Milvus)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Полное раскрытие информации: <a href="https://zilliz.com/">Zilliz Cloud</a> создана той же командой, что и Milvus, так что воспринимайте это с соответствующей долей соли.</p>
<p>Но вот что интересно: несмотря на то, что Milvus является бесплатным и с открытым исходным кодом, управляемый сервис может стоить дешевле, чем самостоятельный хостинг. Причина проста - программное обеспечение бесплатно, но облачная инфраструктура для его работы - нет, и вам нужны инженеры для ее эксплуатации и обслуживания. Если управляемая служба может выполнять ту же работу с меньшим количеством машин и меньшим количеством часов работы инженеров, ваш общий счет уменьшится даже после оплаты самой службы.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> - это полностью управляемый сервис, построенный на базе Milvus и совместимый с ним по API. На стоимость влияют две вещи:</p>
<ul>
<li><strong>Более высокая производительность на узел.</strong> Zilliz Cloud работает на Cardinal, нашей оптимизированной поисковой системе. По <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">результатам VectorDBBench</a>, она обеспечивает в 3-5 раз большую пропускную способность, чем Milvus с открытым исходным кодом, и в 10 раз быстрее. На практике это означает, что для выполнения той же нагрузки вам потребуется примерно на треть-пятую часть больше вычислительных узлов.</li>
<li><strong>Встроенные оптимизации.</strong> Функции, о которых пойдет речь в этом руководстве, - MMap, многоуровневое хранилище и квантование индексов - встроены в систему и автоматически настраиваются. Автоматическое масштабирование регулирует мощность в зависимости от фактической нагрузки, поэтому вы не платите за ненужный вам запас.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">Миграция</a> не представляет сложности, поскольку API и форматы данных совместимы. Zilliz также предоставляет инструменты для миграции. Подробное сравнение см: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Резюме: пошаговый план сокращения расходов на базы данных Vector<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Если вы делаете только одну вещь, сделайте следующее: проверьте тип индекса.</strong></p>
<p>Если вы используете HNSW на рабочей нагрузке, чувствительной к затратам, переключитесь на IVF_SQ8. Только это может сократить расходы на память на ~70 % при минимальных потерях при запоминании.</p>
<p>Если вы хотите пойти дальше, то вот порядок приоритетов:</p>
<ul>
<li><strong>Переключите индекс</strong> - HNSW → IVF_SQ8 для большинства рабочих нагрузок. Наибольший эффект при нулевом изменении архитектуры.</li>
<li><strong>Включите MMap или многоуровневое хранение</strong> - перестаньте держать все в памяти. Это изменение конфигурации, а не редизайн.</li>
<li><strong>Оцените размеры встраивания</strong> - проверьте, соответствует ли меньшая модель вашим потребностям в точности. Это потребует повторного встраивания, но экономия будет значительной.</li>
<li><strong>Настройте уплотнение и TTL</strong> - предотвратите безмолвное раздувание данных, особенно если вы часто записываете/удаляете данные.</li>
</ul>
<p>В совокупности эти стратегии могут сократить расходы на векторную базу данных на 60-80 %. Не каждой команде нужны все четыре стратегии - начните с изменения индекса, измерьте влияние и двигайтесь вниз по списку.</p>
<p>Для команд, желающих сократить объем операционной работы и повысить эффективность затрат, <a href="https://zilliz.com/">Zilliz Cloud</a> (управляемый Milvus) - еще один вариант.</p>
<p>Если вы работаете над одной из этих оптимизаций и хотите сравнить результаты, задавайте вопросы в <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-сообществе Milvus</a>. Вы также можете присоединиться к <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>, чтобы быстро пообщаться с командой инженеров о вашей конкретной настройке.</p>
