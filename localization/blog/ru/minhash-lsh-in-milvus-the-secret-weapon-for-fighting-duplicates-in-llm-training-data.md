---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH в Milvus: секретное оружие для борьбы с дубликатами в обучающих
  данных LLM
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH в Milvus 2.6 предлагает эффективное решение для дедупликации
  массивных обучающих наборов данных LLM, обеспечивая двукратную скорость
  обработки и трех-пятикратную экономию средств по сравнению с традиционными
  методами.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Большие языковые модели (БЯМ) изменили ландшафт искусственного интеллекта благодаря своей способности писать код, создавать контент и решать сложные задачи. Однако для обучения этих мощных моделей требуются огромные объемы высококачественных данных.</p>
<p>Проблема заключается в том, что необработанные данные для обучения часто содержат значительную избыточность. Это все равно что учить ребенка, повторяя одни и те же уроки снова и снова, пропуская при этом другие важные темы. Крупная компания, занимающаяся разработкой искусственного интеллекта, обратилась к нам именно с этой проблемой - они создавали новую амбициозную языковую модель, но столкнулись с проблемой дедупликации десятков миллиардов документов. Традиционные методы сопоставления не могли справиться с таким объемом, а специализированные инструменты дедупликации требовали огромных вычислительных ресурсов, что делало их экономически нецелесообразными.</p>
<p>Для решения этой проблемы мы разработали решение: индексирование MinHash LSH (Locality Sensitive Hashing), которое будет доступно в Milvus 2.6. В этой статье мы рассмотрим, как MinHash LSH эффективно решает проблему дедупликации данных для обучения LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Дедупликация данных: Почему это важно для обучения LLM<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Качественные и разнообразные данные необходимы для обучения мощных LLM. Когда в обучающих данных появляется дублированный контент, это создает несколько серьезных проблем:</p>
<ul>
<li><p><strong>Нерациональное использование ресурсов:</strong> Избыточные данные увеличивают время обучения, затраты и потребление энергии.</p></li>
<li><p><strong>Снижение производительности:</strong> Модели могут чрезмерно подстраиваться под повторяющийся контент, что ограничивает их способность обобщать новую информацию.</p></li>
<li><p><strong>Эффект запоминания:</strong> Дублирование контента повышает вероятность того, что модели запомнят и воспроизведут конкретный текст дословно. Это также может привести к утечке конфиденциальной информации или нарушению авторских прав.</p></li>
<li><p><strong>Ошибочные оценки:</strong> Дубликаты между обучающими и тестовыми наборами могут случайно завысить показатели эффективности.</p></li>
</ul>
<p>Существует три основных подхода к поиску и удалению дубликатов:</p>
<ul>
<li><p><strong>Точное совпадение:</strong> выявление идентичных дубликатов с помощью хэширования.</p></li>
<li><p><strong>Приблизительное совпадение:</strong> поиск близких дубликатов с помощью таких алгоритмов, как MinHash LSH и сходство по Жаккарду.</p></li>
<li><p><strong>Семантическое сопоставление:</strong> выявление контента с похожим смыслом с помощью векторных вкраплений.</p></li>
</ul>
<p>Когда объем предварительно подготовленных корпораций достигает терабайта или даже петабайта, традиционные методы точного сопоставления, такие как парные сравнения, становятся невыполнимыми с вычислительной точки зрения. Семантическая дедупликация добавляет значительные накладные расходы за счет использования моделей встраивания для генерации векторов. Нам нужны более инновационные приближенные методы, такие как <strong>MinHash LSH, которые</strong>позволят сбалансировать отзыв и точность, сохраняя при этом приемлемые затраты, что сделает крупномасштабную дедупликацию практичной.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: эффективное обнаружение близких дубликатов в массивных массивах данных<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Чтобы найти близкие дубликаты в океане обучающих данных, нам нужен эффективный и точный алгоритм приближенного сопоставления. MinHash LSH (Locality Sensitive Hashing) - отличный инструмент для достижения этой цели. Давайте разберем это сложное на первый взгляд понятие пошагово.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Шаг 1: Представление документов с помощью MinHash</h3><p>Во-первых, нам нужен способ измерения сходства документов. Стандартный подход использует сходство по Жаккарду:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span>.</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Эта формула измеряет степень дублирования документа A и документа B - в частности, отношение общего количества элементов к общему количеству уникальных элементов. Более высокое значение означает, что документы более похожи.</p>
<p>Однако прямой расчет этого показателя для миллиардов пар документов требует значительных ресурсов и может занять годы. MinHash создает компактные "отпечатки пальцев" (подписи), которые сохраняют отношения сходства и делают сравнение гораздо быстрее.</p>
<ol>
<li><strong>Шингование:</strong> Разбиваем каждый документ на перекрывающиеся последовательности слов или символов (k-синглы). Например, предложение "Я люблю векторный поиск" с k=3 (по словам) дает: {"Я люблю вектор", "люблю векторный поиск"}.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> примените несколько хэш-функций к каждому набору шинглов и запишите минимальное значение хэша из каждой функции. В результате получается вектор подписи для каждого документа.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>При вычислении сходства вероятность того, что хэш-значения совпадают в одних и тех же позициях в подписях MinHash двух документов (что соответствует расстоянию Жаккарда между этими подписями), обеспечивает близкое приближение к сходству Жаккарда их исходных наборов черепицы. Это позволяет нам эффективно оценивать сходство документов без прямого сравнения больших оригинальных текстов; вместо этого мы можем анализировать их компактные подписи MinHash.</p>
<p>Принцип MinHash предполагает использование слова с наименьшим хэш-значением для представления всего документа, повышая точность за счет включения дополнительных хэш-функций. Незначительные изменения слов могут быть пропущены, так как они обычно не влияют на минимальное хэш-значение. Более существенные изменения, напротив, приводят к изменению хэш-значения и легче обнаруживаются. Этот метод можно рассматривать как минимальное объединение хэш-значений различных слов. Помимо MinHash, для генерации подписей документов существуют альтернативные варианты, например SimHash, но они здесь не рассматриваются.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Шаг 2: выявление похожих документов с помощью LSH</h3><p>Даже при использовании компактных подписей MinHash сравнение каждой пары в миллионах или миллиардах документов требует больших вычислительных затрат. Именно здесь на помощь приходит <strong>хэширование, чувствительное к локальности (LSH)</strong>.</p>
<p>Ключевая идея LSH заключается в использовании хэш-функций, которые <strong>намеренно вызывают коллизии - похожие</strong>элементы с большей вероятностью будут хэшироваться в один и тот же бакет, а разные - нет. Это противоположно традиционному хэшированию, цель которого - избежать коллизий.</p>
<p>Для MinHash популярной стратегией LSH является <strong>техника бандинга</strong>:</p>
<ol>
<li><p><strong>Биндинг</strong>: Разделите каждую сигнатуру MinHash (вектор длины <em>N</em>) на <em>b</em> полос, каждая из которых состоит <em>из r</em> строк<em>(N = b × r</em>).</p></li>
<li><p><strong>Хеширование полос:</strong> Хешируем каждую полосу (подвектор из <em>r</em> значений) в ведро с помощью стандартной хеш-функции.</p></li>
<li><p><strong>Пары-кандидаты:</strong> Если два документа имеют общий бакет в <strong>любой</strong> полосе, они помечаются как потенциальные совпадения.</p></li>
</ol>
<p>Регулируя количество полос (b) и количество строк в каждой полосе ®, вы можете контролировать компромисс между отзывом, точностью и эффективностью поиска.</p>
<p>Основная идея заключается в том, что у очень похожих документов в подписях MinHash будет много совпадающих хэш-значений. Когда эти подписи разбиваются на группы, даже одной группы со всеми совпадающими значениями достаточно, чтобы поместить два документа в одно ведро. Чем более похожи документы, тем выше вероятность того, что это произойдет хотя бы в одной полосе, что позволяет LSH эффективно находить пары-кандидаты без исчерпывающего сравнения всех подписей.</p>
<p>Короче говоря, <strong>MinHash + LSH</strong> обеспечивают масштабируемую приблизительную дедупликацию: MinHash сжимает документы в компактные подписи, а LSH эффективно сужает пространство поиска, группируя вероятные совпадения. Это похоже на поиск близнецов в толпе: сначала сделайте быстрый снимок характеристик каждого (MinHash), сгруппируйте похожих (LSH), а затем внимательно осмотрите небольшие группы на предмет реальных дубликатов.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Интеграция MinHash LSH в Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Интеграция MinHash LSH в Milvus 2.6 была вызвана реальной необходимостью. Как упоминалось ранее, пользователь Milvus - одна из ведущих компаний, занимающихся разработкой LLM, - обратился к нам с проблемой: эффективная дедупликация огромных объемов текстовых данных для предварительного обучения LLM.</p>
<p>Традиционные конвейеры дедупликации обычно опираются на внешние инструменты, отделенные от систем хранения и поиска, что требует дорогостоящей передачи данных между компонентами. Такой фрагментированный рабочий процесс увеличивает операционные накладные расходы и не позволяет полностью использовать распределенные вычислительные ресурсы.</p>
<p>Учитывая сильные стороны Milvus в работе с высокопроизводительными векторными данными, возникла естественная идея: <strong><em>Что, если MinHash LSH встроить в Milvus нативно, сделав приблизительную дедупликацию первоклассной функцией базы данных?</em></strong></p>
<p>Такой подход позволяет организовать полный рабочий процесс от дедупликации до семантического поиска в Milvus, упрощая MLOps и используя его масштабируемость и унифицированный API. Вместе с нашим партнером мы оптимизировали MinHash LSH для облачной нативной архитектуры Milvus, в результате чего получилось быстрое и масштабируемое решение для крупномасштабной дедупликации.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Основные возможности Milvus 2.6 включают:</h3><ul>
<li><p><strong>Нативное индексирование MinHash LSH:</strong> Реализует стандартную технику группирования для LSH и поддерживает дополнительное ранжирование по Жаккарду для улучшения запоминания. Реализация в памяти и на основе mmap обеспечивает гибкость при различных рабочих нагрузках.</p></li>
<li><p><strong>Бесшовная интеграция API:</strong> Пользователи могут определять векторные поля MinHash, строить индексы <code translate="no">MINHASH_LSH</code>, вставлять данные подписи и выполнять поиск по приблизительному сходству, используя стандартный SDK и декларативные API Milvus.</p></li>
<li><p><strong>Распределенность и масштабируемость:</strong> Построенная на основе облачной нативной архитектуры Milvus, функция поддерживает горизонтальное масштабирование для больших наборов данных и высокопроизводительной обработки.</p></li>
</ul>
<p>Эта интеграция дала впечатляющие результаты. Запустив MinHash LSH на полностью управляемом Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>), мы помогли этому пользователю эффективно дедуплицировать <strong>10 миллиардов документов</strong>. По сравнению с предыдущим подходом, основанным на MapReduce, новое решение <strong>увеличило скорость обработки более чем в два раза</strong> и обеспечило <strong>3-5-кратную экономию средств</strong> благодаря оптимизированному индексированию и выполнению запросов в Milvus.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Практическая работа: дедупликация наборов данных LLM с помощью Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте засучим рукава и воспользуемся MinHash LSH в Milvus 2.6 для выполнения приблизительной дедупликации в масштабе.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Предварительные условия: Генерация подписей MinHash</h3><p>Milvus управляет индексацией и поиском <strong>предварительно сгенерированных</strong> сигнатур MinHash. Вам нужно будет сгенерировать их во время предварительной обработки, используя такие инструменты, как <code translate="no">datasketch</code> в Python или собственную реализацию. Типичные шаги таковы:</p>
<ol>
<li><p>Чтение необработанных документов</p></li>
<li><p>Шинговать (токенизировать или разбивать на части) каждый документ</p></li>
<li><p>Применение нескольких хэш-функций для генерации подписи MinHash (например, массива uint64 размером 128).</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Шаг 1: Создание схемы в Milvus</h3><p>Нам нужно создать коллекцию Milvus для хранения подписей MinHash и соответствующих им идентификаторов документов.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Шаг 2: Создание индекса и коллекции MINHASH_LSH</strong></h3><p>Это основной шаг. Нам нужно указать JACCARD в качестве типа метрики и настроить параметры, связанные с LSH.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Примечание по настройке параметров: Эффективность MinHash LSH сильно зависит от выбора параметров. Например, количество хэш-функций, используемых при генерации подписи MinHash (т. е. <code translate="no">MINHASH_DIM</code>), влияет на точность и размер подписи. На этапе LSH количество полос (<code translate="no">num_bands</code>) и строк в каждой полосе определяют диапазон чувствительности порога сходства и баланс между запоминанием и точностью. Пользователям необходимо экспериментировать и проводить тонкую настройку в зависимости от характеристик набора данных и требований к дедупликации. Часто это итеративный процесс.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Шаг 3: Вставка подписей MinHash</strong></h3><p>Допустим, у вас есть пакет документов и соответствующие им подписи MinHash.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Шаг 5: Поиск близких дубликатов</h3><p>Используйте подпись MinHash документа для поиска похожих документов в коллекции.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Шаг 6: Постобработка и кластеризация</h3><p>Полученные результаты - это <strong>кандидаты в близкие дубликаты</strong>. Чтобы сформировать полные группы дедупликации, к парам кандидатов можно применить методы кластеризации, например <strong>Union-Find</strong>. Каждая полученная группа представляет собой набор дубликатов; сохраните один репрезентативный документ и заархивируйте или удалите остальные.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Заключение</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH в Milvus 2.6 - это скачок вперед в области обработки данных ИИ. То, что начиналось как решение для дедупликации данных LLM, теперь открывает двери для более широких областей применения - очистка веб-контента, управление каталогами, обнаружение плагиата и многое другое.</p>
<p>Если у вас есть похожий случай использования, пожалуйста, свяжитесь с нами в <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>, чтобы записаться на <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">встречу Office Hour</a>.</p>
