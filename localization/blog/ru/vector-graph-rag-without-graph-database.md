---
id: vector-graph-rag-without-graph-database.md
title: Мы создали Graph RAG без базы данных Graph
author: Cheney Zhang
date: 2026-4-17
cover: assets.zilliz.com/vector_graph_rag_without_graph_database_md_1_e9c1adda4a.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'graph RAG, multi-hop RAG, vector database, Milvus, knowledge graph RAG'
meta_title: |
  Graph RAG Without a Graph Database | Vector Graph RAG
desc: >-
  Векторный граф RAG с открытым исходным кодом добавляет многоходовое
  рассуждение в RAG, используя только Milvus. 87,8% Recall@5, 2 вызова LLM на
  запрос, база данных графов не требуется.
origin: 'https://milvus.io/blog/vector-graph-rag-without-graph-database.md'
---
<blockquote>
<p><strong><em>TL;DR:</em></strong> <em>Нужна ли вам база данных графов для Graph RAG? Нет. Поместите сущности, отношения и переходы в Milvus. Используйте расширение подграфа вместо обхода графа, и один LLM-перебор вместо многораундовых циклов агентов. Это и есть</em> <a href="https://github.com/zilliztech/vector-graph-rag"><strong><em>Vector Graph RAG</em></strong></a> <em>, и именно его мы построили. Этот подход показал средний результат 87,8% Recall@5 в трех многохоповых QA бенчмарках и превзошел HippoRAG 2 на одном экземпляре Milvus.</em></p>
</blockquote>
<p>Многохоповые вопросы - это стена, о которую рано или поздно бьется большинство конвейеров RAG. Ответ есть в вашем корпусе, но он охватывает несколько отрывков, связанных сущностями, которые в вопросе не названы. Обычное решение - добавить базу данных графов, что означает запуск двух систем вместо одной.</p>
<p>Мы сами постоянно натыкались на эту стену и не хотели запускать две базы данных только для того, чтобы справиться с ней. Поэтому мы создали и выложили в открытый доступ <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a>- библиотеку на Python, которая обеспечивает многоходовое рассуждение в <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, используя только <a href="https://milvus.io/docs">Milvus</a>, наиболее широко распространенную векторную базу данных с открытым исходным кодом. Она обеспечивает те же возможности многохопового рассуждения с одной базой данных вместо двух.</p>
<iframe width="826" height="465" src="https://www.youtube.com/embed/yCooOl-koxc" title="Stop Using Graph Database to Build Your Graph RAG System — Vector Graph RAG Explained" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="Why-Multi-Hop-Questions-Break-Standard-RAG" class="common-anchor-header">Почему многохоповые вопросы ломают стандартную RAG<button data-href="#Why-Multi-Hop-Questions-Break-Standard-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Многохоповые вопросы нарушают стандартную RAG, потому что ответ зависит от отношений между сущностями, которые векторный поиск не видит. Сущность-мост, соединяющая вопрос с ответом, часто отсутствует в самом вопросе.</p>
<p>Простые вопросы работают отлично. Вы разбиваете документы на куски, встраиваете их, извлекаете наиболее близкие совпадения и передаете их в LLM. Вопрос "Какие индексы поддерживает Milvus?" содержится в одном отрывке, и векторный поиск находит его.</p>
<p>Многоходовые вопросы не вписываются в эту схему. Возьмем, например, вопрос <em>"Каких побочных эффектов следует опасаться при использовании препаратов первого ряда для лечения диабета?"</em> из базы медицинских знаний.</p>
<p>Ответ на него требует двух шагов рассуждения. Во-первых, система должна знать, что метформин - это препарат первой линии для лечения диабета. Только после этого она может найти побочные эффекты метформина: контроль функции почек, дискомфорт в ЖКТ, дефицит витамина B12.</p>
<p>"Метформин" - это связующее звено. Он соединяет вопрос с ответом, но в вопросе он не упоминается.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_2_8e769cbe40.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>На этом <a href="https://zilliz.com/learn/vector-similarity-search">поиск сходства Вектор</a> останавливается. Он находит отрывки, похожие на вопрос, - руководства по лечению диабета и списки побочных эффектов лекарств, - но не может проследить отношения между сущностями, которые связывают эти отрывки воедино. Такие факты, как "метформин - препарат первой линии для лечения диабета", живут в этих отношениях, а не в тексте отдельного отрывка.</p>
<h2 id="Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="common-anchor-header">Почему графовые базы данных и агентный RAG - не выход<button data-href="#Why-Graph-Databases-and-Agentic-RAG-Arent-the-Answer" class="anchor-icon" translate="no">
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
    </button></h2><p>Стандартные способы решения многоходовой RAG - это базы данных графов и итеративные агентские циклы. Оба работают. Оба стоят больше, чем большинство команд хотят заплатить за одну функцию.</p>
<p>Сначала воспользуйтесь маршрутом с использованием базы данных графов. Вы извлекаете тройки из документов, храните их в базе данных графов и обходите ребра, чтобы найти многохоповые соединения. Это означает, что рядом с <a href="https://zilliz.com/learn/what-is-vector-database">векторной базой данных</a> будет работать вторая система, изучать Cypher или Gremlin и синхронизировать графовые и векторные хранилища.</p>
<p>Другой подход - итеративные циклы агентов. LLM извлекает пакет, обдумывает его, решает, достаточно ли в нем контекста, и снова извлекает, если нет. <a href="https://arxiv.org/abs/2212.10509">IRCoT</a> (Trivedi et al., 2023) делает 3-5 вызовов LLM на один запрос. Агентский RAG может превышать 10, поскольку агент сам решает, когда остановиться. Стоимость одного запроса становится непредсказуемой, а задержка P99 увеличивается всякий раз, когда агент выполняет дополнительные раунды.</p>
<p>Ни то, ни другое не подходит командам, которым нужны многоходовые рассуждения без перестройки стека. Поэтому мы попробовали кое-что другое.</p>
<h2 id="What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="common-anchor-header">Что такое Vector Graph RAG, графовая структура внутри векторной базы данных<button data-href="#What-is-Vector-Graph-RAG-a-Graph-Structure-Inside-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/vector-graph-rag"><strong>Vector Graph RAG</strong></a> - это библиотека Python с открытым исходным кодом, которая позволяет реализовать многоходовое рассуждение в <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, используя только <a href="https://milvus.io/docs">Milvus</a>. Она хранит структуру графа в виде идентификационных ссылок в трех коллекциях Milvus. Обход становится цепочкой поисков первичных ключей в Milvus вместо запросов Cypher к базе данных графов. Один Milvus выполняет обе задачи.</p>
<p>Это работает, потому что отношения в графе знаний - это просто текст. Тройка <em>(метформин - препарат первой линии для лечения диабета 2-го типа)</em> - это направленное ребро в базе данных графов. Это также предложение: "Метформин - препарат первой линии для лечения диабета 2-го типа". Это предложение можно представить в виде вектора и хранить в <a href="https://milvus.io/docs">Milvus</a>, как и любой другой текст.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_3_da1305389a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ответ на многоходовый запрос означает отслеживание связей от того, что упоминается в запросе (например, "диабет"), до того, что в нем не упоминается (например, "метформин"). Это работает только в том случае, если хранилище сохраняет эти связи: какая сущность с какой связана через какое отношение. Обычный текст можно искать, но не отслеживать.</p>
<p>Чтобы связи в Milvus можно было отслеживать, мы присваиваем каждой сущности и каждому отношению уникальный ID, а затем храним их в отдельных коллекциях, которые ссылаются друг на друга по ID. Всего коллекций три: <strong>сущности</strong> (узлы), <strong>связи</strong> (ребра) и <strong>отрывки</strong> (исходный текст, который нужен LLM для генерации ответов). Каждая строка имеет векторное вложение, поэтому мы можем осуществлять семантический поиск по любой из трех коллекций.</p>
<p><strong>Сущности</strong> хранят дедуплицированные сущности. Каждая из них имеет уникальный идентификатор, <a href="https://zilliz.com/glossary/vector-embeddings">векторное вложение</a> для <a href="https://zilliz.com/glossary/semantic-search">семантического поиска</a> и список идентификаторов отношений, в которых она участвует.</p>
<table>
<thead>
<tr><th>id</th><th>имя</th><th>встраивание</th><th>relation_ids</th></tr>
</thead>
<tbody>
<tr><td>e01</td><td>метформин</td><td>[0.12, ...]</td><td>[r01, r02, r03]</td></tr>
<tr><td>e02</td><td>диабет 2 типа</td><td>[0.34, ...]</td><td>[r01, r04]</td></tr>
<tr><td>e03</td><td>функция почек</td><td>[0.56, ...]</td><td>[r02]</td></tr>
</tbody>
</table>
<p><strong>Отношения</strong> хранят тройки знаний. Каждая из них записывает идентификаторы субъекта и объекта, идентификаторы отрывков, из которых она взята, и вставку полного текста отношения.</p>
<table>
<thead>
<tr><th>id</th><th>субъект_ид</th><th>идентификатор объекта</th><th>текст</th><th>вставка</th><th>идентификаторы проходов</th></tr>
</thead>
<tbody>
<tr><td>r01</td><td>e01</td><td>e02</td><td>Метформин - препарат первой линии для лечения диабета 2 типа</td><td>[0.78, ...]</td><td>[p01]</td></tr>
<tr><td>r02</td><td>e01</td><td>e03</td><td>Пациенты, принимающие метформин, должны контролировать функцию почек</td><td>[0.91, ...]</td><td>[p02]</td></tr>
</tbody>
</table>
<p><strong>Пассажи</strong> хранят исходные фрагменты документов со ссылками на сущности и отношения, извлеченные из них.</p>
<p>Эти три коллекции указывают друг на друга через поля идентификаторов: сущности несут идентификаторы своих отношений, отношения - идентификаторы своих субъектов и объектов и исходных отрывков, а отрывки - идентификаторы всего, что из них извлечено. Эта сеть идентификационных ссылок и есть граф.</p>
<p>Обход графа - это просто цепочка поисков идентификаторов. Вы извлекаете сущность e01, чтобы получить ее <code translate="no">relation_ids</code>, извлекаете отношения r01 и r02 по этим идентификаторам, читаете <code translate="no">object_id</code> из r01, чтобы обнаружить сущность e02, и так далее. Каждый переход - это стандартный <a href="https://milvus.io/docs/get-and-scalar-query.md">запрос</a> Milvus <a href="https://milvus.io/docs/get-and-scalar-query.md">с первичным ключом</a>. Никакого Cypher не требуется.</p>
<p>Вы можете задаться вопросом, не увеличивается ли количество дополнительных обращений к Milvus. Это не так. На расширение подграфа уходит 2-3 запроса на основе идентификаторов общей длительностью 20-30 мс. Вызов LLM занимает 1-3 секунды, что делает поиск идентификаторов незаметным рядом с ним.</p>
<h2 id="How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="common-anchor-header">Как Vector Graph RAG отвечает на многоходовые запросы<button data-href="#How-Vector-Graph-RAG-Answers-a-Multi-Hop-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Поток поиска приводит многоходовый запрос к обоснованному ответу за четыре шага: <strong>поиск семян → расширение подграфа → LLM-перебор → генерация ответа.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_4_86ccf5b914.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Мы рассмотрим вопрос о диабете: <em>"Каких побочных эффектов следует опасаться при приеме препаратов первой линии для лечения диабета?".</em></p>
<h3 id="Step-1-Seed-Retrieval" class="common-anchor-header">Шаг 1: Поиск семян</h3><p>LLM извлекает из вопроса ключевые сущности: "диабет", "побочные эффекты", "препарат первой линии". Векторный поиск в Milvus находит наиболее релевантные сущности и связи напрямую.</p>
<p>Но метформина среди них нет. В вопросе он не упоминается, поэтому векторный поиск не может его найти.</p>
<h3 id="Step-2-Subgraph-Expansion" class="common-anchor-header">Шаг 2: Расширение подграфа</h3><p>Именно здесь Vector Graph RAG отличается от стандартного RAG.</p>
<p>Система следует за идентификационными ссылками от начальных сущностей на один шаг вперед. Она получает идентификаторы начальных сущностей, находит все отношения, содержащие эти идентификаторы, и втягивает новые идентификаторы сущностей в подграф. По умолчанию: один прыжок.</p>
<p><strong>Метформин, мостовая сущность, входит в подграф.</strong></p>
<p>"Диабет" имеет отношение: <em>"Метформин - препарат первой линии для лечения диабета 2 типа".</em> Следуя по этому ребру, мы получаем метформин. Как только метформин оказывается в подграфе, вместе с ним появляются его собственные отношения: <em>"Пациентам, принимающим метформин, следует контролировать функцию почек", "Метформин может вызывать желудочно-кишечный дискомфорт", "Длительное применение метформина может привести к дефициту витамина B12".</em></p>
<p>Два факта, которые жили в отдельных отрывках, теперь связаны одним прыжком расширения графа. Мост, о котором не упоминалось в вопросе, теперь можно обнаружить.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_5_8ac4a11d1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-LLM-Rerank" class="common-anchor-header">Шаг 3: LLM Rerank</h3><p>В результате расширения у вас остаются десятки отношений-кандидатов. Большинство из них - шум.</p>
<pre><code translate="no">Expanded candidate pool (example):
r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          ← Key
r02: Patients on metformin should have kidney function monitored   ← Key
r03: Metformin may cause gastrointestinal discomfort               ← Key
r04: <span class="hljs-type">Type</span> <span class="hljs-number">2</span> diabetes patients should have regular eye exams        ✗ Noise
r05: Insulin injection sites should be rotated                     ✗ Noise
r06: Diabetes <span class="hljs-keyword">is</span> linked to cardiovascular disease risk             ✗ Noise
r07: Metformin <span class="hljs-keyword">is</span> contraindicated <span class="hljs-keyword">in</span> severe liver dysfunction      ✗ Noise (contraindication, <span class="hljs-keyword">not</span> side effect)
r08: HbA1c <span class="hljs-keyword">is</span> a monitoring indicator <span class="hljs-keyword">for</span> diabetes                  ✗ Noise
r09: Sulfonylureas are second-line treatment <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes   ✗ Noise (second-line, <span class="hljs-keyword">not</span> first-line)
r10: Long-term metformin use may lead to vitamin B12 deficiency    ← Key
...(more)
<button class="copy-code-btn"></button></code></pre>
<p>Система отправляет этих кандидатов и исходный вопрос на LLM: "Что относится к побочным эффектам препаратов первой линии для лечения диабета?". Это один вызов без итераций.</p>
<pre><code translate="no">After LLM filtering:
✓ r01: Metformin <span class="hljs-keyword">is</span> the first-line drug <span class="hljs-keyword">for</span> <span class="hljs-built_in">type</span> <span class="hljs-number">2</span> diabetes          → Establishes the bridge: first-line drug = metformin
✓ r02: Patients on metformin should have kidney function monitored   → Side effect: kidney impact
✓ r03: Metformin may cause gastrointestinal discomfort               → Side effect: GI issues
✓ r10: Long-term metformin use may lead to vitamin B12 deficiency    → Side effect: nutrient deficiency
<button class="copy-code-btn"></button></code></pre>
<p>Выбранные отношения охватывают всю цепочку: диабет → метформин → мониторинг почек / дискомфорт в ЖКТ / дефицит B12.</p>
<h3 id="Step-4-Answer-Generation" class="common-anchor-header">Шаг 4: Генерация ответов</h3><p>Система извлекает оригинальные отрывки для выбранных отношений и отправляет их в LLM.</p>
<p>LLM генерирует ответы из полного текста отрывка, а не из обрезанных троек. Тройки - это сжатые резюме. В них отсутствуют контекст, предостережения и особенности, необходимые LLM для создания обоснованного ответа.</p>
<h3 id="See-Vector-Graph-RAG-in-action" class="common-anchor-header">Посмотрите на Vector Graph RAG в действии</h3><p>Мы также создали интерактивный фронтенд, который визуализирует каждый шаг. Щелкните по панели шагов слева, и граф обновится в реальном времени: оранжевый - для начальных узлов, синий - для расширенных узлов, зеленый - для выбранных отношений. Это делает процесс поиска конкретным, а не абстрактным.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_6_f6d8b1e841.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-One-Rerank-Beats-Multiple-Iterations" class="common-anchor-header">Почему один реранк лучше нескольких итераций<button data-href="#Why-One-Rerank-Beats-Multiple-Iterations" class="anchor-icon" translate="no">
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
    </button></h2><p>Наш конвейер делает два вызова LLM на запрос: один для реранки, другой для генерации. Итеративные системы, такие как IRCoT и Agentic RAG, выполняют от 3 до 10+ вызовов, потому что они зацикливаются: получить, рассудить, снова получить. Мы пропускаем цикл, потому что векторный поиск и расширение подграфа охватывают семантическое сходство и структурные связи за один проход, что дает LLM достаточно кандидатов, чтобы завершить работу за одно повторное ранжирование.</p>
<table>
<thead>
<tr><th>Подход</th><th>Количество вызовов LLM на запрос</th><th>Профиль задержки</th><th>Относительная стоимость API</th></tr>
</thead>
<tbody>
<tr><td>Векторный граф RAG</td><td>2 (рерайтинг + генерация)</td><td>Фиксированный, предсказуемый</td><td>1x</td></tr>
<tr><td>IRCoT</td><td>3-5</td><td>Переменная</td><td>~2-3x</td></tr>
<tr><td>Агентурный RAG</td><td>5-10+</td><td>Непредсказуемый</td><td>~3-5x</td></tr>
</tbody>
</table>
<p>В производстве это примерно на 60 % меньше затрат на API, в 2-3 раза быстрее ответы и предсказуемая задержка. Никаких неожиданных скачков, когда агент решает выполнить дополнительные раунды.</p>
<h2 id="Benchmark-Results" class="common-anchor-header">Результаты бенчмарка<button data-href="#Benchmark-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG показал средний результат 87,8 % Recall@5 в трех стандартных многоходовых QA бенчмарках, совпав или превзойдя все протестированные нами методы, включая HippoRAG 2, с использованием только Milvus и 2 вызовов LLM.</p>
<p>Мы оценивали MuSiQue (2-4 хопа, самый сложный), HotpotQA (2 хопа, наиболее широко используемый) и 2WikiMultiHopQA (2 хопа, междокументное рассуждение). Метрика - Recall@5: появляются ли правильные вспомогательные отрывки в топ-5 найденных результатов.</p>
<p>Для корректного сравнения мы использовали точно такие же предварительно извлеченные тройки из <a href="https://github.com/OSU-NLP-Group/HippoRAG">репозитория HippoRAG</a>. Никакой реэкстракции, никакой пользовательской препроцессинга. Сравнение изолирует сам алгоритм поиска.</p>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-Standard-Naive-RAG" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Векторный граф RAG</a> против стандартного (наивного) RAG</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_7_61772e68c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG повышает средний показатель Recall@5 с 73,4 до 87,8 %, что составляет 19,6 процентных пункта.</p>
<ul>
<li>MuSiQue: наибольший прирост (+31,4 п. п.). Бенчмарк 3-4 хопа, самые трудные многохоповые вопросы, и именно здесь расширение подграфа оказывает наибольшее влияние.</li>
<li>2WikiMultiHopQA: резкое улучшение (+27,7 балла). Междокументные рассуждения, еще одно "сладкое" место для расширения подграфа.</li>
<li>HotpotQA: меньший прирост (+6,1 п. п.), но стандартный RAG уже набрал 90,8 % баллов на этом наборе данных. Потолок невысок.</li>
</ul>
<h3 id="Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-vs-State-of-the-Art-Methods-SOTA" class="common-anchor-header"><a href="https://github.com/zilliztech/vector-graph-rag">Векторный граф RAG</a> в сравнении с современными методами (SOTA)</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_graph_rag_without_graph_database_md_8_2a0b90b574.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Vector Graph RAG набирает наивысший средний балл 87,8 % в сравнении с HippoRAG 2, IRCoT и NV-Embed-v2.</p>
<p>Бенчмарк за бенчмарком:</p>
<ul>
<li>HotpotQA: сравнялся с HippoRAG 2 (оба 96,3%)</li>
<li>2WikiMultiHopQA: лидирует на 3,7 балла (94,1 % против 90,4 %)</li>
<li>MuSiQue (самый сложный): отстает на 1,7 балла (73,0% против 74,7%).</li>
</ul>
<p>Vector Graph RAG достигает таких показателей всего при 2 вызовах LLM на запрос, без базы данных графов и без ColBERTv2. Он работает на самой простой инфраструктуре в этом сравнении и все равно имеет самый высокий средний балл.</p>
<h2 id="How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="common-anchor-header">Сравнение <a href="https://github.com/zilliztech/vector-graph-rag">Vector Graph RAG</a> с другими подходами Graph RAG<button data-href="#How-Vector-Graph-RAGhttpsgithubcomzilliztechvector-graph-rag-Compares-to-Other-Graph-RAG-Approaches" class="anchor-icon" translate="no">
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
    </button></h2><p>Различные подходы Graph RAG оптимизированы для решения разных задач. Vector Graph RAG создан для производственного многоходового QA с предсказуемой стоимостью и простой инфраструктурой.</p>
<table>
<thead>
<tr><th></th><th>Microsoft GraphRAG</th><th>HippoRAG 2</th><th>IRCoT / Agentic RAG</th><th><strong>Vector Graph RAG</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Инфраструктура</strong></td><td>Графовая БД + векторная БД</td><td>ColBERTv2 + граф в памяти</td><td>Векторная БД + многораундовые агенты</td><td><strong>Только Milvus</strong></td></tr>
<tr><td><strong>Вызовы LLM на один запрос</strong></td><td>Варьируется</td><td>Умеренный</td><td>3-10+</td><td><strong>2</strong></td></tr>
<tr><td><strong>Лучше всего подходит для</strong></td><td>Резюме глобальных корпусов</td><td>Тонкий академический поиск</td><td>Сложные исследования открытого типа</td><td><strong>Производственная многоходовая QA</strong></td></tr>
<tr><td><strong>Проблема масштабирования</strong></td><td>Дорогостоящее индексирование LLM</td><td>Полный граф в памяти</td><td>Непредсказуемая задержка и стоимость</td><td><strong>Масштабируется с Milvus</strong></td></tr>
<tr><td><strong>Сложность настройки</strong></td><td>Высокая</td><td>Средне-высокая</td><td>Средняя</td><td><strong>Низкая (установка с помощью pip)</strong></td></tr>
</tbody>
</table>
<p><a href="https://github.com/microsoft/graphrag">Microsoft GraphRAG</a> использует иерархическую кластеризацию сообществ для ответа на глобальные вопросы обобщения, такие как "каковы основные темы в этом корпусе?". Это другая проблема, чем многоходовая QA&quot;.</p>
<p>В<a href="https://arxiv.org/abs/2502.14802">HippoRAG 2</a> (Gutierrez et al., 2025) используется когнитивно-инспирированное извлечение с сопоставлением на уровне токенов ColBERTv2. Загрузка полного графа в память ограничивает масштабируемость.</p>
<p>Итеративные подходы, такие как <a href="https://arxiv.org/abs/2212.10509">IRCoT</a>, обменивают простоту инфраструктуры на стоимость LLM и непредсказуемую задержку.</p>
<p>Vector Graph RAG нацелен на производственные многоходовые QA: команды, которым нужна предсказуемая стоимость и задержка без добавления базы данных графов.</p>
<h2 id="When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="common-anchor-header">Когда использовать Vector Graph RAG и ключевые сценарии использования<button data-href="#When-to-Use-Vector-Graph-RAG-and-Key-Use-Cases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vector Graph RAG предназначен для четырех типов рабочих нагрузок:</p>
<table>
<thead>
<tr><th>Сценарий</th><th>Почему он подходит</th></tr>
</thead>
<tbody>
<tr><td><strong>Документы с большим объемом знаний</strong></td><td>Юридические кодексы с перекрестными ссылками, биомедицинская литература с цепочками "лекарство-ген-болезнь", финансовые документы со связями "компания-персона-событие", технические документы с графиками зависимостей API</td></tr>
<tr><td><strong>Вопросы с 2-4 хопами</strong></td><td>Вопросы с одним хопом отлично работают со стандартным RAG. При пяти и более хопах могут потребоваться итерационные методы. Диапазон 2-4 хопа - это оптимальный вариант расширения подграфов.</td></tr>
<tr><td><strong>Простое развертывание</strong></td><td>Одна база данных, один <code translate="no">pip install</code>, не нужно изучать графовую инфраструктуру.</td></tr>
<tr><td><strong>Чувствительность к стоимости и задержкам</strong></td><td>Два вызова LLM на один запрос, фиксированные и предсказуемые. При тысячах ежедневных запросов разница возрастает.</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-Vector-Graph-RAG" class="common-anchor-header">Начните работу с векторным графом RAG<button data-href="#Get-Started-with-Vector-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no" class="language-bash">pip install vector-graph-rag

<span class="hljs-keyword">from</span> vector_graph_rag <span class="hljs-keyword">import</span> VectorGraphRAG

rag = VectorGraphRAG()  <span class="hljs-comment"># defaults to Milvus Lite, no server needed</span>

rag.add_texts([
    <span class="hljs-string">&quot;Metformin is the first-line drug for type 2 diabetes.&quot;</span>,
    <span class="hljs-string">&quot;Patients taking metformin should have their kidney function monitored regularly.&quot;</span>,
])

result = rag.query(<span class="hljs-string">&quot;What side effects should I watch for with first-line diabetes drugs?&quot;</span>)
<span class="hljs-built_in">print</span>(result.answer)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">VectorGraphRAG()</code> без аргументов по умолчанию использует <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Он создает локальный файл <code translate="no">.db</code>, как SQLite. Не нужно запускать сервер, ничего настраивать.</p>
<p><code translate="no">add_texts()</code> Вызывает LLM для извлечения триплетов из вашего текста, векторизует их и сохраняет в Milvus. <code translate="no">query()</code> запускает полный четырехступенчатый поток поиска: seed, expand, rerank, generate.</p>
<p>Для производства поменяйте один параметр URI. Остальной код остается прежним:</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Local development</span>
rag = VectorGraphRAG()

<span class="hljs-comment"># Self-hosted Milvus</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;http://your-milvus-server:19530&quot;</span>)

<span class="hljs-comment"># Zilliz Cloud (managed Milvus, free tier available)</span>
rag = VectorGraphRAG(uri=<span class="hljs-string">&quot;your-zilliz-endpoint&quot;</span>, token=<span class="hljs-string">&quot;your-api-key&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Импортировать PDF-файлы, веб-страницы или файлы Word:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> vector_graph_rag.loaders <span class="hljs-keyword">import</span> DocumentImporter

importer = DocumentImporter(chunk_size=<span class="hljs-number">1000</span>, chunk_overlap=<span class="hljs-number">200</span>)
result = importer.import_sources([
    <span class="hljs-string">&quot;https://en.wikipedia.org/wiki/Metformin&quot;</span>,
    <span class="hljs-string">&quot;/path/to/clinical-guidelines.pdf&quot;</span>,
])
rag.add_documents(result.documents, extract_triplets=<span class="hljs-literal">True</span>)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Graph RAG не нуждается в базе данных графов. Vector Graph RAG хранит структуру графа в виде идентификационных ссылок в трех коллекциях Milvus, что превращает обход графа в поиск по первичному ключу и сохраняет каждый многоходовый запрос в фиксированных двух вызовах LLM.</p>
<p>С первого взгляда:</p>
<ul>
<li>Библиотека Python с открытым исходным кодом. Многоходовые рассуждения только на Milvus.</li>
<li>Три коллекции, связанные по ID. Сущности (узлы), отношения (ребра), отрывки (исходный текст). Расширение подграфа по идентификаторам для обнаружения сущностей-мостов, не упомянутых в запросе.</li>
<li>Два вызова LLM на один запрос. Один реранг, одна генерация. Без итераций.</li>
<li>87,8% средний Recall@5 для MuSiQue, HotpotQA и 2WikiMultiHopQA, совпадает или превосходит HippoRAG 2 в двух случаях из трех.</li>
</ul>
<h3 id="Try-it" class="common-anchor-header">Попробуйте:</h3><ul>
<li><a href="https://github.com/zilliztech/vector-graph-rag">GitHub: zilliztech/vector-graph-rag</a> для кода</li>
<li><a href="https://zilliztech.github.io/vector-graph-rag">Docs</a> для полного API и примеров</li>
<li>Присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX">сообществу</a> <a href="https://slack.milvus.io/">Milvus</a> <a href="https://slack.milvus.io/">в Discord</a>, чтобы задавать вопросы и делиться отзывами.</li>
<li><a href="https://milvus.io/office-hours">Закажите сеанс Milvus Office Hours</a> для обсуждения вашего сценария использования.</li>
<li><a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> предлагает бесплатный уровень с управляемым Milvus, если вы предпочитаете обойтись без настройки инфраструктуры.</li>
</ul>
<h2 id="FAQ" class="common-anchor-header">ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ<button data-href="#FAQ" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Can-I-do-Graph-RAG-with-just-a-vector-database" class="common-anchor-header">Могу ли я использовать Graph RAG только с векторной базой данных?</h3><p>Да. Vector Graph RAG хранит структуру графа знаний (сущности, отношения и их связи) в трех коллекциях Milvus, связанных перекрестными ссылками ID. Вместо того чтобы обходить ребра в базе данных графов, он использует цепочку поиска первичных ключей в Milvus для расширения подграфа вокруг начальных сущностей. Это позволяет достичь 87,8 % среднего Recall@5 на трех стандартных многоходовых тестах без использования инфраструктуры базы данных графов.</p>
<h3 id="How-does-Vector-Graph-RAG-compare-to-Microsoft-GraphRAG" class="common-anchor-header">Чем Vector Graph RAG отличается от Microsoft GraphRAG?</h3><p>Они решают разные задачи. Microsoft GraphRAG использует иерархическую кластеризацию сообществ для глобального обобщения корпусов документов ("Каковы основные темы этих документов?"). Vector Graph RAG фокусируется на многоходовых ответах на вопросы, где целью является выстраивание цепочек конкретных фактов по отрывкам. Vector Graph RAG требует только Milvus и два вызова LLM на запрос. Microsoft GraphRAG требует базы данных графов и несет большие затраты на индексирование.</p>
<h3 id="What-types-of-questions-benefit-from-multi-hop-RAG" class="common-anchor-header">Какие типы вопросов выигрывают от многоходовой RAG?</h3><p>Многоходовая RAG помогает в вопросах, где ответ зависит от связи информации, разбросанной по нескольким отрывкам, особенно если ключевая сущность никогда не встречается в вопросе. В качестве примера можно привести вопрос "Какие побочные эффекты имеет препарат первой линии для лечения диабета?". (требует обнаружения метформина в качестве связующего звена), поиск перекрестных ссылок в юридическом или нормативном тексте, а также отслеживание цепочки зависимостей в технической документации. Стандартный RAG хорошо справляется с поиском одного факта. Многоступенчатая RAG повышает эффективность, когда путь рассуждений состоит из двух-четырех шагов.</p>
<h3 id="Do-I-need-to-extract-knowledge-graph-triples-manually" class="common-anchor-header">Нужно ли извлекать тройки графа знаний вручную?</h3><p>Нет. <code translate="no">add_texts()</code> и <code translate="no">add_documents()</code> автоматически вызывают LLM для извлечения сущностей и отношений, их векторизации и хранения в Milvus. Вы можете импортировать документы из URL, PDF и DOCX-файлов с помощью встроенного <code translate="no">DocumentImporter</code>. Для бенчмаркинга или миграции библиотека поддерживает импорт предварительно извлеченных триплетов из других фреймворков, например HippoRAG.</p>
