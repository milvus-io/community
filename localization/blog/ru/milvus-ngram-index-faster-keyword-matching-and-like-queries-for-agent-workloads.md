---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: >-
  Представляем индекс Milvus Ngram: Ускоренное сопоставление ключевых слов и
  LIKE-запросы для агентских рабочих нагрузок
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  Узнайте, как индекс Ngram в Milvus ускоряет запросы LIKE, превращая поиск
  подстроки в эффективный поиск n-грамм, обеспечивая производительность в 100
  раз выше.
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>В агентных системах <strong>поиск контекста</strong> является основополагающим строительным блоком для всего конвейера, обеспечивая основу для последующих рассуждений, планирования и действий. Векторный поиск помогает агентам извлекать семантически релевантный контекст, отражающий намерения и смысл в больших и неструктурированных наборах данных. Однако одной лишь семантической релевантности зачастую недостаточно. Агентские конвейеры также полагаются на полнотекстовый поиск для обеспечения точных ограничений на ключевые слова - например, названия продуктов, вызовы функций, коды ошибок или юридически значимые термины. Этот вспомогательный слой гарантирует, что найденный контекст не только релевантен, но и явно удовлетворяет жестким текстовым требованиям.</p>
<p>Реальные рабочие нагрузки постоянно отражают эту потребность:</p>
<ul>
<li><p>Ассистенты службы поддержки клиентов должны найти разговоры, в которых упоминается конкретный продукт или ингредиент.</p></li>
<li><p>Кодировщики ищут фрагменты, содержащие точное имя функции, вызов API или строку ошибки.</p></li>
<li><p>Юридические, медицинские и научные агенты фильтруют документы на предмет фрагментов или цитат, которые должны быть дословными.</p></li>
</ul>
<p>Традиционно системы справляются с этой задачей с помощью оператора SQL <code translate="no">LIKE</code>. Такой запрос, как <code translate="no">name LIKE '%rod%'</code>, прост и широко поддерживается, но при высоком параллелизме и больших объемах данных эта простота влечет за собой значительные издержки производительности.</p>
<ul>
<li><p><strong>Без индекса</strong> запрос <code translate="no">LIKE</code> сканирует все контекстное хранилище и применяет сопоставление шаблонов строка за строкой. При миллионах записей даже один запрос может занять несколько секунд - слишком медленно для взаимодействия с агентами в реальном времени.</p></li>
<li><p><strong>Даже с обычным инвертированным индексом</strong> шаблоны с подстановочными знаками, такие как <code translate="no">%rod%</code>, по-прежнему трудно оптимизировать, поскольку движок должен просматривать весь словарь и выполнять сопоставление шаблонов по каждой записи. Эта операция позволяет избежать сканирования строк, но остается принципиально линейной, что приводит лишь к незначительным улучшениям.</p></li>
</ul>
<p>Это создает явный пробел в гибридных поисковых системах: векторный поиск эффективно справляется с семантической релевантностью, но фильтрация по точным ключевым словам часто становится самым медленным шагом в конвейере.</p>
<p>Milvus поддерживает гибридный векторный и полнотекстовый поиск с фильтрацией метаданных. Для устранения ограничений, связанных с подбором ключевых слов, в Milvus реализован <a href="https://milvus.io/docs/ngram.md"><strong>индекс Ngram</strong></a>, который повышает производительность <code translate="no">LIKE</code> за счет разбиения текста на небольшие подстроки и их индексации для эффективного поиска. Это значительно сокращает объем данных, просматриваемых во время выполнения запроса, обеспечивая <strong>в десятки и сотни раз более высокую скорость</strong> выполнения запросов <code translate="no">LIKE</code> в реальных агентурных рабочих нагрузках.</p>
<p>В этой статье мы рассмотрим, как работает индекс Ngram в Milvus, и оценим его производительность в реальных сценариях.</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Что такое индекс Ngram?<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>В базах данных фильтрация текста обычно выражается с помощью <strong>SQL</strong>, стандартного языка запросов, используемого для получения и управления данными. Одним из наиболее распространенных текстовых операторов в нем является <code translate="no">LIKE</code>, который поддерживает сопоставление строк на основе шаблонов.</p>
<p>Выражения LIKE можно разделить на четыре типа в зависимости от того, как используются подстановочные знаки:</p>
<ul>
<li><p><strong>Инфиксное соответствие</strong> (<code translate="no">name LIKE '%rod%'</code>): Совпадает с записями, в которых подстрочный стержень встречается в любом месте текста.</p></li>
<li><p><strong>Префиксное совпадение</strong> (<code translate="no">name LIKE 'rod%'</code>): Ищет записи, текст которых начинается с rod.</p></li>
<li><p><strong>Суффиксное совпадение</strong> (<code translate="no">name LIKE '%rod'</code>): Искать записи, текст которых заканчивается на rod.</p></li>
<li><p><strong>Wildcard match</strong> (<code translate="no">name LIKE '%rod%aab%bc_de'</code>): Комбинирует несколько условий подстроки (<code translate="no">%</code>) с односимвольными символами подстановки (<code translate="no">_</code>) в одном шаблоне.</p></li>
</ul>
<p>Хотя эти шаблоны отличаются по внешнему виду и выразительности, <strong>индекс Ngram</strong> в Milvus ускоряет их все, используя один и тот же базовый подход.</p>
<p>Перед построением индекса Milvus разбивает каждое текстовое значение на короткие, перекрывающиеся подстроки фиксированной длины, называемые <em>n-граммами</em>. Например, при n = 3 слово <strong>"Milvus"</strong> разлагается на следующие три грамма: <strong>"Mil",</strong> <strong>"ilv",</strong> <strong>"lvu"</strong> и <strong>"vus".</strong> Каждая n-грамма хранится в инвертированном индексе, который сопоставляет подстроку с набором идентификаторов документов, в которых она встречается. Во время запроса условия <code translate="no">LIKE</code> преобразуются в комбинации поиска n-грамм, что позволяет Milvus быстро отфильтровать большинство несовпадающих записей и оценить шаблон по гораздо меньшему набору кандидатов. Именно это превращает дорогостоящее сканирование строк в эффективные запросы на основе индекса.</p>
<p>Два параметра управляют тем, как строится индекс Ngram: <code translate="no">min_gram</code> и <code translate="no">max_gram</code>. Вместе они определяют диапазон длин подстрок, которые Milvus генерирует и индексирует.</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>: Наименьшая длина подстроки для индексирования. На практике это также задает минимальную длину подстроки запроса, при которой может быть использован индекс Ngram</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>: Самая длинная длина подстроки для индексирования. Во время запроса он дополнительно определяет максимальный размер окна, используемого при разбиении длинных строк запроса на n-граммы.</p></li>
</ul>
<p>Индексируя все смежные подстроки, длина которых находится в диапазоне от <code translate="no">min_gram</code> до <code translate="no">max_gram</code>, Milvus создает последовательную и эффективную основу для ускорения всех поддерживаемых типов шаблонов <code translate="no">LIKE</code>.</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Как работает индекс Ngram?<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus реализует индекс Ngram в двухфазном процессе:</p>
<ul>
<li><p><strong>Построение индекса:</strong> Генерировать n-граммы для каждого документа и строить инвертированный индекс во время приема данных.</p></li>
<li><p><strong>Ускорение запросов:</strong> Используйте индекс для сужения поиска до небольшого набора кандидатов, а затем проверяйте точные совпадения <code translate="no">LIKE</code> по этим кандидатам.</p></li>
</ul>
<p>На конкретном примере этот процесс легче понять.</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">Этап 1: Создание индекса</h3><p><strong>Разложите текст на n-граммы:</strong></p>
<p>Предположим, что мы индексируем текст <strong>"Apple"</strong> со следующими настройками:</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>При этих настройках Milvus генерирует все смежные подстроки длиной 2 и 3:</p>
<ul>
<li><p>2-граммы: <code translate="no">Ap</code>, <code translate="no">pp</code>, <code translate="no">pl</code>, <code translate="no">le</code></p></li>
<li><p>3-граммы: <code translate="no">App</code>, <code translate="no">ppl</code>, <code translate="no">ple</code></p></li>
</ul>
<p><strong>Построение инвертированного индекса:</strong></p>
<p>Теперь рассмотрим небольшой набор данных из пяти записей:</p>
<ul>
<li><p><strong>Документ 0</strong>: <code translate="no">Apple</code></p></li>
<li><p><strong>Документ 1</strong>: <code translate="no">Pineapple</code></p></li>
<li><p><strong>Документ 2</strong>: <code translate="no">Maple</code></p></li>
<li><p><strong>Документ 3</strong>: <code translate="no">Apply</code></p></li>
<li><p><strong>Документ 4</strong>: <code translate="no">Snapple</code></p></li>
</ul>
<p>Во время обработки Milvus генерирует n-граммы для каждой записи и вставляет их в инвертированный индекс. В этом индексе:</p>
<ul>
<li><p><strong>Ключи</strong> - это n-граммы (подстроки).</p></li>
<li><p><strong>Значения</strong> - списки идентификаторов документов, в которых встречается n-грамма.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Теперь индекс полностью сформирован.</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">Этап 2: Ускорение запросов</h3><p>Когда выполняется фильтр <code translate="no">LIKE</code>, Milvus использует индекс нграмм для ускорения обработки запросов, выполняя следующие действия:</p>
<p><strong>1. Извлечение термина запроса:</strong> Из выражения <code translate="no">LIKE</code> извлекаются смежные подстроки без подстановочных знаков (например, <code translate="no">'%apple%'</code> становится <code translate="no">apple</code>).</p>
<p><strong>2. Декомпозиция термина запроса:</strong> Термин запроса декомпозируется на n-граммы с учетом его длины (<code translate="no">L</code>) и конфигурации <code translate="no">min_gram</code> и <code translate="no">max_gram</code>.</p>
<p><strong>3. Поиск каждой граммы и пересечение:</strong> Milvus ищет n-граммы запроса в инвертированном индексе и пересекает их списки идентификаторов документов, чтобы получить небольшой набор кандидатов.</p>
<p><strong>4. Проверка и возврат результатов:</strong> Оригинальное условие <code translate="no">LIKE</code> применяется только к этому набору кандидатов для определения окончательного результата.</p>
<p>На практике способ разбиения запроса на n-граммы зависит от формы самого шаблона. Чтобы понять, как это работает, мы рассмотрим два распространенных случая: инфиксные совпадения и совпадения с подстановочными знаками. Префиксные и суффиксные совпадения ведут себя так же, как и инфиксные, поэтому мы не будем рассматривать их отдельно.</p>
<p><strong>Инфиксное соответствие</strong></p>
<p>При инфиксном совпадении выполнение зависит от длины литеральной подстроки (<code translate="no">L</code>) относительно <code translate="no">min_gram</code> и <code translate="no">max_gram</code>.</p>
<p><strong>1. <code translate="no">min_gram ≤ L ≤ max_gram</code></strong> (например, <code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>Буквенная подстрока <code translate="no">ppl</code> полностью попадает в заданный диапазон n-грамм. Milvus напрямую ищет n-грамму <code translate="no">&quot;ppl&quot;</code> в инвертированном индексе, получая идентификаторы документов-кандидатов <code translate="no">[0, 1, 3, 4]</code>.</p>
<p>Поскольку литерал сам по себе является индексированной n-граммой, все кандидаты уже удовлетворяют условию инфикса. Заключительный шаг проверки не удаляет ни одной записи, и в результате остается <code translate="no">[0, 1, 3, 4]</code>.</p>
<p><strong>2. <code translate="no">L &gt; max_gram</code></strong> (например, <code translate="no">strField LIKE '%pple%'</code>)</p>
<p>Буквенная подстрока <code translate="no">pple</code> длиннее, чем <code translate="no">max_gram</code>, поэтому она декомпозируется на перекрывающиеся n-граммы с помощью окна размером <code translate="no">max_gram</code>. С <code translate="no">max_gram = 3</code> получаются n-граммы <code translate="no">&quot;ppl&quot;</code> и <code translate="no">&quot;ple&quot;</code>.</p>
<p>Milvus просматривает каждую n-грамму в инвертированном индексе:</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Пересечение этих списков дает набор кандидатов <code translate="no">[0, 1, 4]</code>. Затем к этим кандидатам применяется оригинальный фильтр <code translate="no">LIKE '%pple%'</code>. Все три удовлетворяют условию, поэтому конечным результатом остается <code translate="no">[0, 1, 4]</code>.</p>
<p><strong>3. <code translate="no">L &lt; min_gram</code></strong> (например, <code translate="no">strField LIKE '%pp%'</code>)</p>
<p>Буквальная подстрока короче, чем <code translate="no">min_gram</code>, и поэтому не может быть разложена на индексированные n-граммы. В этом случае индекс Ngram не может быть использован, и Milvus возвращается к стандартному пути выполнения, оценивая условие <code translate="no">LIKE</code> через полное сканирование с сопоставлением образцов.</p>
<p><strong>Совпадение с подстановочным знаком</strong> (например, <code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>Этот шаблон содержит несколько подстановочных знаков, поэтому Milvus сначала разбивает его на смежные литералы: <code translate="no">&quot;Ap&quot;</code> и <code translate="no">&quot;pple&quot;</code>.</p>
<p>Затем Milvus обрабатывает каждый литерал независимо:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> имеет длину 2 и попадает в диапазон n-грамм.</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> длиннее, чем <code translate="no">max_gram</code>, и разлагается на <code translate="no">&quot;ppl&quot;</code> и <code translate="no">&quot;ple&quot;</code>.</p></li>
</ul>
<p>Таким образом, запрос сводится к следующим n-граммам:</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> → <code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> → <code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> → <code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>Пересечение этих списков дает единственного кандидата: <code translate="no">[0]</code>.</p>
<p>Наконец, оригинальный фильтр <code translate="no">LIKE '%Ap%pple%'</code> применяется к документу 0 (<code translate="no">&quot;Apple&quot;</code>). Поскольку он не удовлетворяет полному шаблону, конечный набор результатов оказывается пустым.</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Ограничения и компромиссы индекса Ngram<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Несмотря на то что индекс Ngram может значительно повысить производительность запросов <code translate="no">LIKE</code>, он имеет ряд недостатков, которые следует учитывать при внедрении в реальном мире.</p>
<ul>
<li><strong>Увеличенный размер индекса</strong></li>
</ul>
<p>Основной ценой индекса Ngram является увеличение накладных расходов на хранение данных. Поскольку в индексе хранятся все смежные подстроки, длина которых находится в диапазоне от <code translate="no">min_gram</code> до <code translate="no">max_gram</code>, количество генерируемых n-грамм быстро растет по мере расширения этого диапазона. Каждая дополнительная длина n-граммы эффективно добавляет еще один полный набор перекрывающихся подстрок для каждого текстового значения, увеличивая как количество ключей индекса, так и списки их размещения. На практике расширение диапазона всего на один символ может примерно удвоить размер индекса по сравнению со стандартным инвертированным индексом.</p>
<ul>
<li><strong>Эффективность не для всех рабочих нагрузок</strong></li>
</ul>
<p>Индекс Ngram ускоряет не все рабочие нагрузки. Если шаблоны запросов очень нерегулярны, содержат очень короткие литералы или на этапе фильтрации не удается свести набор данных к небольшому набору кандидатов, преимущество в производительности может быть ограничено. В таких случаях выполнение запроса может приближаться к стоимости полного сканирования, даже несмотря на наличие индекса.</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">Оценка производительности индекса Ngram на LIKE-запросах<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>Цель этого бенчмарка - оценить, насколько эффективно индекс Ngram ускоряет выполнение запросов <code translate="no">LIKE</code> на практике.</p>
<h3 id="Test-Methodology" class="common-anchor-header">Методология тестирования</h3><p>Чтобы оценить его производительность в контексте, мы сравниваем его с двумя базовыми режимами выполнения:</p>
<ul>
<li><p><strong>Master</strong>: Грубое выполнение без индекса.</p></li>
<li><p><strong>Master-inverted</strong>: Выполнение с использованием обычного инвертированного индекса.</p></li>
</ul>
<p>Мы разработали два тестовых сценария, чтобы охватить различные характеристики данных:</p>
<ul>
<li><p><strong>Набор текстовых данных Wiki</strong>: 100 000 строк, каждое текстовое поле усечено до 1 КБ.</p></li>
<li><p><strong>Набор данных с одним словом</strong>: 1 000 000 строк, где каждая строка содержит одно слово.</p></li>
</ul>
<p>В обоих сценариях последовательно применяются следующие настройки:</p>
<ul>
<li><p>В запросах используется <strong>инфиксный шаблон соответствия</strong> (<code translate="no">%xxx%</code>).</p></li>
<li><p>Индекс Ngram настроен на <code translate="no">min_gram = 2</code> и <code translate="no">max_gram = 4</code></p></li>
<li><p>Чтобы изолировать стоимость выполнения запроса и избежать накладных расходов на материализацию результатов, все запросы возвращают <code translate="no">count(*)</code> вместо полных наборов результатов.</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">Результаты</h3><p><strong>Тест для вики, каждая строка - вики-текст с длиной содержимого, усеченной на 1000, 100K строк</strong></p>
<table>
<thead>
<tr><th></th><th>Буквальный</th><th>Время (мс)</th><th>Ускорение</th><th>Счетчик</th></tr>
</thead>
<tbody>
<tr><td>Мастер</td><td>стадион</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>Мастер-инверсия</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Нграмма</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>средняя школа</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>Мастер-инверсия</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Нграмма</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>совместное обучение, средняя школа-спонсор</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>Мастер-инверсия</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>Тест для отдельных слов, 1M строк</strong></p>
<table>
<thead>
<tr><th></th><th>Букварь</th><th>Время (мс)</th><th>Ускорение</th><th>Счет</th></tr>
</thead>
<tbody>
<tr><td>Мастер</td><td>na</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>Мастер-инвертированный</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Ngram</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>nat</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>Мастер-инверсия</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Нграмма</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>нати</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>Мастер-инвертированный</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Ngram</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>natio</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>Мастер-инвертированный</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Мастер</td><td>нация</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>Инвертированный хозяин</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Ngram</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>Примечание:</strong> Эти результаты основаны на бенчмарках, проведенных в мае. С тех пор в ветке Master были проведены дополнительные оптимизации производительности, поэтому ожидается, что в текущих версиях разрыв в производительности, наблюдаемый здесь, будет меньше.</p>
<p>Результаты бенчмарков выявили четкую закономерность: индекс Ngram значительно ускоряет выполнение запросов LIKE во всех случаях, причем скорость выполнения запросов сильно зависит от структуры и длины исходных текстовых данных.</p>
<ul>
<li><p>Для <strong>длинных текстовых полей</strong>, таких как документы в стиле Вики, усеченные до 1 000 байт, прирост производительности особенно заметен. По сравнению с грубым выполнением без индекса, индекс Ngram обеспечивает ускорение примерно <strong>на 100-200×</strong>. Если сравнивать с обычным инвертированным индексом, то улучшение еще более значительное и достигает <strong>1 200-1 900×</strong>. Это объясняется тем, что LIKE-запросы по длинному тексту особенно дороги для традиционных подходов к индексированию, в то время как поиск по n-граммам позволяет быстро сузить пространство поиска до очень небольшого набора кандидатов.</p></li>
<li><p>На наборах данных, состоящих из <strong>записей, состоящих из одного слова</strong>, выигрыш меньше, но все равно существенный. В этом сценарии индекс n-грамм работает примерно <strong>на 80-100×</strong> быстрее, чем перебор, и <strong>на 45-55×</strong> быстрее, чем обычный инвертированный индекс. Хотя более короткий текст по своей природе дешевле для сканирования, подход, основанный на n-граммах, позволяет избежать ненужных сравнений и последовательно снижает стоимость запроса.</p></li>
</ul>
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
    </button></h2><p>Индекс Ngram ускоряет выполнение запросов <code translate="no">LIKE</code>, разбивая текст на n-граммы фиксированной длины и индексируя их с помощью инвертированной структуры. Такая конструкция превращает дорогостоящее сопоставление подстрок в эффективный поиск n-грамм с последующей минимальной проверкой. В результате удается избежать полнотекстового сканирования и сохранить точную семантику <code translate="no">LIKE</code>.</p>
<p>На практике этот подход эффективен в широком диапазоне рабочих нагрузок, особенно сильные результаты были получены при нечетком сопоставлении длинных текстовых полей. Поэтому индекс Ngram хорошо подходит для сценариев реального времени, таких как поиск кода, работа агентов службы поддержки, поиск юридических и медицинских документов, корпоративные базы знаний и академический поиск, где точное соответствие ключевым словам остается важным.</p>
<p>В то же время Ngram Index выигрывает от тщательной настройки. Выбор подходящих значений <code translate="no">min_gram</code> и <code translate="no">max_gram</code> имеет решающее значение для баланса между размером индекса и производительностью запросов. Если индекс Ngram настроен с учетом реальных шаблонов запросов, он представляет собой практичное, масштабируемое решение для высокопроизводительных запросов <code translate="no">LIKE</code> в производственных системах.</p>
<p>Для получения дополнительной информации об индексе Ngram ознакомьтесь с документацией ниже:</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index | Milvus Documentation</a></li>
</ul>
<p>У вас есть вопросы или вы хотите получить подробную информацию о любой функции последней версии Milvus? Присоединяйтесь к нашему<a href="https://discord.com/invite/8uyFbECzPX"> каналу Discord</a> или создавайте проблемы на<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Вы также можете забронировать 20-минутную индивидуальную сессию, чтобы получить понимание, руководство и ответы на свои вопросы через<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Подробнее о возможностях Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Представляем Milvus 2.6: доступный векторный поиск в миллиардных масштабах</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Представляем функцию встраивания: Как Milvus 2.6 оптимизирует векторизацию и семантический поиск</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Измельчение JSON в Milvus: 88,9-кратное ускорение фильтрации JSON с гибкостью</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Разблокирование истинного поиска на уровне сущностей: Новые возможности Array-of-Structs и MAX_SIM в Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Объединение геопространственной фильтрации и векторного поиска с геометрическими полями и RTREE в Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Представление AISAQ в Milvus: векторный поиск миллиардного масштаба стал на 3 200× дешевле по памяти</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Оптимизация NVIDIA CAGRA в Milvus: гибридный подход GPU-CPU к ускоренному индексированию и более дешевым запросам</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH в Milvus: секретное оружие для борьбы с дубликатами в обучающих данных LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Векторное сжатие в экстремальных условиях: как Milvus обслуживает в 3 раза больше запросов с помощью RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Бенчмарки лгут - векторные БД заслуживают реальной проверки </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Мы заменили Kafka/Pulsar на Woodpecker для Milvus </a></p></li>
</ul>
