---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >-
  Как использовать Milvus Boost Ranker для векторного поиска с учетом
  особенностей бизнеса
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Узнайте, как Milvus Boost Ranker позволяет накладывать бизнес-правила поверх
  векторного сходства - повышать рейтинг официальных документов, понижать
  рейтинг устаревшего контента, добавлять разнообразие.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>Векторный поиск ранжирует результаты по сходству встраивания - чем ближе векторы, тем выше результат. Некоторые системы добавляют реранкер на основе модели (BGE, Voyage, Cohere), чтобы улучшить упорядочивание. Но ни один из подходов не справляется с фундаментальным требованием производства: <strong>бизнес-контекст имеет такое же значение, как и семантическая релевантность, а иногда и большее.</strong></p>
<p>Сайт электронной коммерции должен в первую очередь отображать товары, имеющиеся в наличии в официальных магазинах. Контент-платформа хочет размещать последние анонсы. Корпоративной базе знаний нужны авторитетные документы на самом верху. Когда ранжирование основывается исключительно на векторном расстоянии, эти правила игнорируются. Результаты могут быть релевантными, но они не подходят.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, представленный в <a href="https://milvus.io/intro">Milvus</a> 2.6, решает эту проблему. Он позволяет корректировать ранжирование результатов поиска с помощью правил метаданных - без перестройки индекса и изменения модели. В этой статье мы расскажем о том, как он работает, когда его использовать и как реализовать в коде.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Что такое Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker - это легкая функция рерайтинга на основе правил в Milvus 2.6.2</strong>, которая корректирует <a href="https://zilliz.com/learn/vector-similarity-search">векторные</a> результаты <a href="https://zilliz.com/learn/vector-similarity-search">поиска</a> с помощью скалярных полей метаданных. В отличие от реранкеров на основе моделей, которые вызывают внешние LLM или сервисы встраивания, Boost Ranker работает полностью внутри Milvus, используя простые правила фильтрации и взвешивания. Никаких внешних зависимостей, минимальные накладные расходы на задержку - подходит для использования в реальном времени.</p>
<p>Вы настраиваете его через <a href="https://milvus.io/docs/manage-functions.md">API Function</a>. После того как векторный поиск возвращает набор кандидатов, Boost Ranker применяет три операции:</p>
<ol>
<li><strong>Фильтр:</strong> определяет результаты, соответствующие определенным условиям (например, <code translate="no">is_official == true</code>).</li>
<li><strong>Boost:</strong> умножение их оценок на заданный вес</li>
<li><strong>Перемешивание:</strong> опционально добавляется небольшой случайный фактор (0-1) для внесения разнообразия.</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Принцип работы</h3><p>Boost Ranker работает внутри Milvus в качестве этапа постобработки:</p>
<ol>
<li><strong>Векторный поиск</strong> - каждый сегмент возвращает кандидатов с идентификаторами, оценками сходства и метаданными.</li>
<li><strong>Применение правил</strong> - система фильтрует совпадающие записи и корректирует их оценки, используя настроенный вес и дополнительные параметры <code translate="no">random_score</code>.</li>
<li><strong>Слияние и сортировка</strong> - все кандидаты объединяются и пересортировываются по обновленным оценкам, чтобы получить окончательные результаты Top-K.</li>
</ol>
<p>Поскольку Boost Ranker работает только с уже найденными кандидатами, а не со всем набором данных, дополнительные вычислительные затраты незначительны.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Когда следует использовать Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Повышение важных результатов</h3><p>Самый распространенный вариант использования: наложение простых бизнес-правил поверх семантического поиска.</p>
<ul>
<li><strong>Электронная коммерция:</strong> повышайте товары из флагманских магазинов, официальных продавцов или платных акций. Продвигайте товары с высоким уровнем недавних продаж или показателем кликов.</li>
<li><strong>Контент-платформы:</strong> установите приоритет недавно опубликованного контента с помощью поля <code translate="no">publish_time</code> или повысьте рейтинг постов от проверенных аккаунтов.</li>
<li><strong>Корпоративный поиск:</strong> повышайте приоритет документов, в которых указаны <code translate="no">doctype == &quot;policy&quot;</code> или <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Все настраивается с помощью фильтра + веса. Никаких изменений модели встраивания, никаких перестроек индекса.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Понижение рейтинга без удаления</h3><p>Boost Ranker также может понижать рейтинг для определенных результатов - более мягкая альтернатива жесткой фильтрации.</p>
<ul>
<li><strong>Товары с низким уровнем продаж:</strong> если <code translate="no">stock &lt; 10</code>, немного уменьшите их вес. Их все еще можно найти, но они не будут доминировать в верхних позициях.</li>
<li><strong>Чувствительный контент:</strong> уменьшите вес отмеченного контента, а не удаляйте его полностью. Ограничивает доступность без жесткой цензуры.</li>
<li><strong>Несвежие документы:</strong> документы, в которых <code translate="no">year &lt; 2020</code> занимает более низкое место, чтобы более новый контент появлялся первым.</li>
</ul>
<p>Пользователи все еще могут найти пониженные результаты, прокручивая страницу или выполняя более точный поиск, но они не будут вытеснять более релевантный контент.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Добавление разнообразия с помощью контролируемой случайности</h3><p>Когда многие результаты имеют одинаковые оценки, Top-K может выглядеть одинаково по всем запросам. Параметр <code translate="no">random_score</code> в Boost Ranker вносит небольшую вариативность:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: контролирует общую случайность для воспроизводимости</li>
<li><code translate="no">field</code>: обычно первичный ключ <code translate="no">id</code>, гарантирует, что одна и та же запись каждый раз получает одно и то же случайное значение.</li>
</ul>
<p>Это полезно для <strong>диверсификации рекомендаций</strong> (предотвращения постоянного появления одних и тех же элементов на первом месте) и <strong>исследования</strong> (комбинирования фиксированных весов бизнеса с небольшими случайными возмущениями).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Комбинирование Boost Ranker с другими ранжировщиками</h3><p>Boost Ranker настраивается через API Function с помощью <code translate="no">params.reranker = &quot;boost&quot;</code>. Два момента, которые следует знать о его комбинировании:</p>
<ul>
<li><strong>Ограничение:</strong> в гибридном (многовекторном) поиске Boost Ranker не может быть ранжировщиком верхнего уровня. Но его можно использовать внутри каждого отдельного <code translate="no">AnnSearchRequest</code> для корректировки результатов перед их объединением.</li>
<li><strong>Распространенные комбинации:</strong><ul>
<li><strong>RRF + Boost:</strong> используйте RRF для объединения многомодальных результатов, а затем применяйте Boost для тонкой настройки на основе метаданных.</li>
<li><strong>Ранжировщик моделей + Boost:</strong> используйте ранжировщик на основе моделей для семантического качества, а затем Boost для бизнес-правил.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Как настроить Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker настраивается через API Function. Для более сложной логики объедините его с <code translate="no">FunctionScore</code>, чтобы применять несколько правил вместе.</p>
<h3 id="Required-Fields" class="common-anchor-header">Обязательные поля</h3><p>При создании объекта <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: любое пользовательское имя</li>
<li><code translate="no">input_field_names</code>: должно быть пустым списком <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: должно быть установлено <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: должно быть <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Ключевые параметры</h3><p><strong><code translate="no">params.weight</code> (обязательно)</strong></p>
<p>Множитель, применяемый к оценкам совпадающих записей. Его значение зависит от метрики:</p>
<table>
<thead>
<tr><th>Тип метрики</th><th>Повысить результаты</th><th>Понизить результаты</th></tr>
</thead>
<tbody>
<tr><td>Выше-лучше (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Ниже-лучше (L2/Euclidean)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (необязательно)</strong></p>
<p>Условие, выбирающее, для каких записей будут скорректированы оценки:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Затрагиваются только совпадающие записи. Все остальные сохраняют свой первоначальный балл.</p>
<p><strong><code translate="no">params.random_score</code> (необязательно)</strong></p>
<p>Добавляет случайное значение от 0 до 1 для разнообразия. Подробности см. в разделе "Случайность" выше.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Одиночные и множественные правила</h3><p><strong>Одиночное правило</strong> - когда у вас есть одно бизнес-ограничение (например, увеличить количество официальных документов), передайте ранжирующее значение непосредственно на <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Несколько правил</strong> - если вам нужно несколько ограничений (приоритет товаров на складе + понижение товаров с низким рейтингом + добавление случайности), создайте несколько объектов <code translate="no">Function</code> и объедините их с <code translate="no">FunctionScore</code>. Вы настраиваете:</p>
<ul>
<li><code translate="no">boost_mode</code>: как каждое правило сочетается с исходной оценкой (<code translate="no">multiply</code> или <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: как несколько правил сочетаются друг с другом (<code translate="no">multiply</code> или <code translate="no">add</code>).</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Практическая работа: определение приоритетов официальных документов<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте рассмотрим конкретный пример: как сделать так, чтобы официальные документы занимали более высокое место в системе поиска документов.</p>
<h3 id="Schema" class="common-anchor-header">Схема</h3><p>Коллекция <code translate="no">milvus_collection</code> с такими полями:</p>
<table>
<thead>
<tr><th>Поле</th><th>Тип</th><th>Назначение</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Первичный ключ</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Текст документа</td></tr>
<tr><td><code translate="no">embedding</code></td><td>FLOAT_VECTOR (3072)</td><td>Семантический вектор</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Происхождение: &quot;официальный&quot;, &quot;сообщество&quot; или &quot;билет&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> если <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Поля <code translate="no">source</code> и <code translate="no">is_official</code> - это метаданные, которые Boost Ranker будет использовать для корректировки рейтинга.</p>
<h3 id="Setup-Code" class="common-anchor-header">Код настройки</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Сравнение результатов: С Boost Ranker и без него</h3><p>Сначала выполните базовый поиск без Boost Ranker. Затем добавьте Boost Ranker с полями <code translate="no">filter: is_official == true</code> и <code translate="no">weight: 1.2</code> и сравните.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Результаты</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ключевое изменение: документ <code translate="no">id=2</code> (официальный) поднялся с 4-го на 2-е место, потому что его оценка была умножена на 1,2. Посты сообщества и записи о тикетах не удаляются - они просто занимают более низкие места. В этом и заключается суть Boost Ranker: семантический поиск - это основа, а сверху накладываются бизнес-правила.</p>
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> дает вам возможность внедрить бизнес-логику в результаты векторного поиска, не трогая вложения и не перестраивая индексы. Повышайте официальный контент, понижайте устаревшие результаты, добавляйте контролируемое разнообразие - и все это с помощью простой настройки фильтра + веса в <a href="https://milvus.io/docs/manage-functions.md">Milvus Function API</a>.</p>
<p>Если вы создаете конвейеры RAG, рекомендательные системы или корпоративный поиск, Boost Ranker поможет преодолеть разрыв между семантически похожими результатами и тем, что действительно полезно для ваших пользователей.</p>
<p>Если вы работаете над поисковым ранжированием и хотите обсудить свой вариант использования:</p>
<ul>
<li>Присоединяйтесь к <a href="https://slack.milvus.io/">сообществу Milvus Slack</a>, чтобы пообщаться с другими разработчиками, создающими системы поиска и извлечения информации.</li>
<li><a href="https://milvus.io/office-hours">Запишитесь на бесплатную 20-минутную сессию Milvus Office Hours</a>, чтобы обсудить с командой логику ранжирования.</li>
<li>Если вы не хотите заниматься настройкой инфраструктуры, в <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (управляемой Milvus) есть бесплатный уровень для начала работы.</li>
</ul>
<hr>
<p>Несколько вопросов, которые возникают, когда команды начинают использовать Boost Ranker:</p>
<p><strong>Может ли Boost Ranker заменить реранкер на основе моделей, например Cohere или BGE?</strong>Они решают разные задачи. Ранкеры, основанные на моделях, оценивают результаты по семантическому качеству - они хорошо решают, "какой документ действительно отвечает на вопрос". Boost Ranker корректирует оценки по бизнес-правилам - он решает, "какой релевантный документ должен появиться первым". На практике часто нужны оба варианта: модель ранжирования для семантической релевантности, а затем Boost Ranker для бизнес-логики.</p>
<p><strong>Добавляет ли Boost Ranker значительную задержку?</strong>Нет. Он работает с уже извлеченным набором кандидатов (обычно Top-K из векторного поиска), а не со всем набором данных. Операции представляют собой простой фильтр и умножение, поэтому накладные расходы незначительны по сравнению с самим векторным поиском.</p>
<p><strong>Как задать значение веса?</strong>Начните с небольших корректировок. Для сходства COSINE (чем выше, тем лучше) веса в 1,1-1,3 обычно достаточно, чтобы заметно изменить ранжирование, не отменяя полностью семантическую релевантность. Протестируйте на реальных данных - если ускоренные результаты с низкой схожестью начинают доминировать, снизьте вес.</p>
<p><strong>Можно ли объединить несколько правил Boost Ranker?</strong>Да. Создайте несколько объектов <code translate="no">Function</code> и объедините их с помощью <code translate="no">FunctionScore</code>. Вы контролируете взаимодействие правил через <code translate="no">boost_mode</code> (как каждое правило объединяется с исходным показателем) и <code translate="no">function_mode</code> (как правила объединяются друг с другом) - оба поддерживают <code translate="no">multiply</code> и <code translate="no">add</code>.</p>
