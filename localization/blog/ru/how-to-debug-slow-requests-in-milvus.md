---
id: how-to-debug-slow-requests-in-milvus.md
title: Как отладить медленные поисковые запросы в Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  В этом посте мы расскажем о том, как сортировать медленные запросы в Milvus, и
  поделимся практическими шагами, которые вы можете предпринять, чтобы сделать
  задержку предсказуемой, стабильной и стабильно низкой.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>В основе Milvus лежит производительность. При нормальных условиях поисковый запрос в Milvus выполняется за миллисекунды. Но что происходит, когда ваш кластер замедляется - когда задержка поиска достигает целых секунд?</p>
<p>Медленные поисковые запросы случаются нечасто, но они могут проявиться при масштабировании или сложных рабочих нагрузках. И когда это происходит, они имеют значение: они нарушают работу пользователей, искажают производительность приложений и часто выявляют скрытые неэффективные возможности вашей системы.</p>
<p>В этом посте мы расскажем о том, как определить медленные запросы в Milvus, и поделимся практическими шагами, которые вы можете предпринять, чтобы сделать задержку предсказуемой, стабильной и постоянно низкой.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Определение медленных запросов<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Диагностика медленного запроса начинается с двух вопросов: <strong>как часто это происходит и куда уходит время?</strong> Milvus дает вам ответы на оба вопроса с помощью метрик и журналов.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Метрики Milvus</h3><p>Milvus экспортирует подробные метрики, которые можно отслеживать в инструментальных панелях Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Основные панели включают:</p>
<ul>
<li><p><strong>Качество сервиса → Медленный запрос</strong>: Отмечает любой запрос, превышающий значение proxy.slowQuerySpanInSeconds (по умолчанию: 5 с). Эти запросы также отмечаются в Prometheus.</p></li>
<li><p><strong>Качество обслуживания → Задержка поиска</strong>: Показывает общее распределение задержек. Если все выглядит нормально, но конечные пользователи все равно видят задержки, проблема, скорее всего, находится за пределами Milvus - на сетевом или прикладном уровне.</p></li>
<li><p><strong>Узел запроса → Задержка поиска по фазам</strong>: Разделяет задержки на этапы очереди, запроса и уменьшения. Для более глубокого анализа такие панели, как <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em> и <em>Wait tSafe Latency</em>, показывают, какой этап доминирует.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Журналы Milvus</h3><p>Milvus также регистрирует все запросы длительностью более одной секунды, помечая их такими маркерами, как [Search slow]. Эти журналы показывают <em>, какие</em> запросы являются медленными, дополняя информацию из метрик. В качестве эмпирического правила:</p>
<ul>
<li><p><strong>&lt; 30 мс</strong> → нормальная задержка поиска в большинстве сценариев</p></li>
<li><p><strong>&gt; 100 мс</strong> → стоит проверить</p></li>
<li><p><strong>&gt; 1 с</strong> → определенно медленно и требует внимания</p></li>
</ul>
<p>Пример журнала:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>Вкратце, <strong>метрики говорят вам, куда уходит время; журналы говорят вам, какие запросы попали в цель.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Анализ первопричины<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Большая рабочая нагрузка</h3><p>Частой причиной медленных запросов является чрезмерная рабочая нагрузка. Когда запрос имеет очень большое <strong>NQ</strong> (количество запросов на запрос), он может выполняться в течение длительного времени и монополизировать ресурсы узла запросов. Остальные запросы скапливаются за ним, что приводит к увеличению задержки в очереди. Даже если каждый запрос имеет небольшой NQ, очень высокая общая пропускная способность (QPS) все равно может вызвать тот же эффект, поскольку Milvus может объединять параллельные поисковые запросы внутри узла.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Сигналы, на которые следует обратить внимание:</strong></p>
<ul>
<li><p>Все запросы показывают неожиданно высокую задержку.</p></li>
<li><p>Метрики узла запросов сообщают о высокой <strong>задержке в очереди</strong>.</p></li>
<li><p>Журналы показывают запрос с большим NQ и большой общей продолжительностью, но относительно малой продолжительностью PerNQ - это указывает на то, что один чрезмерно большой запрос доминирует над ресурсами.</p></li>
</ul>
<p><strong>Как это исправить:</strong></p>
<ul>
<li><p><strong>Пакетные запросы</strong>: Держите NQ скромным, чтобы не перегружать один запрос.</p></li>
<li><p><strong>Масштабируйте узлы запросов</strong>: Если высокий параллелизм является регулярной частью вашей рабочей нагрузки, добавьте узлы запросов, чтобы распределить нагрузку и поддерживать низкую задержку.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Неэффективная фильтрация</h3><p>Еще одним распространенным узким местом являются неэффективные фильтры. Если выражения фильтров плохо составлены или поля не имеют скалярных индексов, Milvus может вернуться к <strong>полному сканированию</strong> вместо того, чтобы просканировать небольшое, целевое подмножество. Фильтры JSON и строгие настройки согласованности могут еще больше увеличить накладные расходы.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Сигналы, за которыми нужно следить:</strong></p>
<ul>
<li><p>Высокая <strong>задержка скалярного фильтра</strong> в метрике Query Node.</p></li>
<li><p>Заметные скачки задержки только при применении фильтров.</p></li>
<li><p>Длительное <strong>ожидание tSafe Latency</strong>, если включена строгая согласованность.</p></li>
</ul>
<p><strong>Как исправить:</strong></p>
<ul>
<li><strong>Упростить выражения фильтров</strong>: Уменьшите сложность плана запроса, оптимизировав фильтры. Например, замените длинные цепочки OR на выражение IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus также представляет механизм шаблонизации выражений фильтров, призванный повысить эффективность за счет сокращения времени разбора сложных выражений. Более подробную информацию см. в <a href="https://milvus.io/docs/filtering-templating.md">этом документе</a>.</p></li>
<li><p><strong>Добавьте правильные индексы</strong>: Избегайте полного сканирования, создавая скалярные индексы для полей, используемых в фильтрах.</p></li>
<li><p><strong>Эффективно обрабатывайте JSON</strong>: В Milvus 2.6 появились индексы path и flat для полей JSON, что позволяет эффективно работать с данными JSON. В <a href="https://milvus.io/docs/roadmap.md">дорожной карте</a> также запланировано измельчение JSON для дальнейшего повышения производительности. Дополнительную информацию см. в <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">документе о полях JSON</a>.</p></li>
<li><p><strong>Настройте уровень согласованности</strong>: Если строгие гарантии не требуются, используйте чтение с <em>ограниченным</em> или <em>конечным</em> уровнем согласованности, что позволит сократить время ожидания <em>tSafe</em>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Неправильный выбор индекса вектора</h3><p><a href="https://milvus.io/docs/index-explained.md">Векторные индексы</a> не являются универсальными. Выбор неправильного индекса может существенно повлиять на задержку. Индексы в памяти обеспечивают самую высокую производительность, но потребляют больше памяти, в то время как индексы на диске экономят память за счет снижения скорости. Двоичные векторы также требуют специальных стратегий индексирования.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Сигналы, на которые следует обратить внимание:</strong></p>
<ul>
<li><p>Высокая задержка поиска векторов в метриках Query Node.</p></li>
<li><p>Насыщение дискового ввода-вывода при использовании DiskANN или MMAP.</p></li>
<li><p>Замедление запросов сразу после перезапуска из-за холодного старта кэша.</p></li>
</ul>
<p><strong>Как исправить:</strong></p>
<ul>
<li><p><strong>Соответствие индекса рабочей нагрузке (плавающие векторы):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - лучше всего подходит для случаев использования in-memory с большим количеством обращений и низкой задержкой.</p></li>
<li><p><strong>Семейство IVF</strong> - гибкий компромисс между отзывом и скоростью.</p></li>
<li><p><strong>DiskANN</strong> - поддерживает миллиардные массивы данных, но требует большой пропускной способности диска.</p></li>
</ul></li>
<li><p><strong>Для двоичных векторов:</strong> Используйте <a href="https://milvus.io/docs/minhash-lsh.md">индекс MINHASH_LSH</a> (появился в Milvus 2.6) с метрикой MHJACCARD для эффективной аппроксимации сходства по Жаккарду.</p></li>
<li><p><strong>Включите</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Картографируйте индексные файлы в память вместо того, чтобы держать их полностью резидентными, чтобы найти баланс между задержкой и использованием памяти.</p></li>
<li><p><strong>Настроить параметры индекса/поиска</strong>: Настройте параметры, чтобы сбалансировать запоминание и задержку для вашей рабочей нагрузки.</p></li>
<li><p><strong>Смягчение холодного старта</strong>: Прогревайте часто используемые сегменты после перезапуска, чтобы избежать первоначальной медлительности запросов.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Время выполнения и условия среды</h3><p>Не все медленные запросы вызваны самим запросом. Узлы запросов часто используют ресурсы совместно с фоновыми заданиями, такими как уплотнение, миграция данных или создание индексов. Частые обновления могут генерировать множество небольших неиндексированных сегментов, вынуждая поиск сканировать необработанные данные. В некоторых случаях неэффективность конкретной версии также может приводить к задержкам до тех пор, пока она не будет исправлена.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Сигналы, на которые следует обратить внимание:</strong></p>
<ul>
<li><p>Скачки загрузки процессора во время фоновых заданий (уплотнение, миграция, создание индексов).</p></li>
<li><p>Насыщение дискового ввода-вывода, влияющее на производительность запросов.</p></li>
<li><p>Очень медленный прогрев кэша после перезапуска.</p></li>
<li><p>Большое количество маленьких неиндексированных сегментов (из-за частых обновлений).</p></li>
<li><p>Регрессии задержки, связанные с определенными версиями Milvus.</p></li>
</ul>
<p><strong>Как исправить:</strong></p>
<ul>
<li><p><strong>Переназначьте фоновые задачи</strong> (например, уплотнение) на непиковые часы.</p></li>
<li><p><strong>Освободите неиспользуемые коллекции</strong>, чтобы освободить память.</p></li>
<li><p><strong>Учитывайте время прогрева</strong> после перезагрузки; при необходимости предварительно прогрейте кэш.</p></li>
<li><p><strong>Выполняйте пакетные вставки</strong>, чтобы сократить создание крошечных сегментов и позволить компакту не отставать.</p></li>
<li><p><strong>Поддерживайте актуальность</strong>: переходите на новые версии Milvus для исправления ошибок и оптимизации.</p></li>
<li><p><strong>Выделяйте ресурсы</strong>: выделяйте дополнительные ресурсы процессора/памяти для рабочих нагрузок, чувствительных к задержкам.</p></li>
</ul>
<p>Соотнеся каждый сигнал с правильным действием, можно быстро и предсказуемо разрешить большинство медленных запросов.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Лучшие практики для предотвращения медленных запросов<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Лучшая сессия отладки - та, которую вам никогда не придется запускать. По нашему опыту, несколько простых привычек помогают предотвратить медленные запросы в Milvus:</p>
<ul>
<li><p><strong>Планируйте распределение ресурсов</strong>, чтобы избежать нагрузки на процессор и диск.</p></li>
<li><p><strong>Устанавливайте проактивные предупреждения</strong> как о сбоях, так и о скачках задержки.</p></li>
<li><p><strong>Сохраняйте</strong> короткие, простые и эффективные<strong>выражения фильтров</strong>.</p></li>
<li><p><strong>Выполняйте пакетные вставки</strong> и поддерживайте NQ/QPS на устойчивом уровне.</p></li>
<li><p><strong>Индексируйте все поля</strong>, используемые в фильтрах.</p></li>
</ul>
<p>Медленные запросы в Milvus - редкость, а когда они появляются, то обычно имеют четкие, диагностируемые причины. Благодаря метрикам, журналам и структурированному подходу вы сможете быстро выявить и устранить проблемы. Это та самая схема, которую наша служба поддержки использует каждый день, а теперь она доступна и вам.</p>
<p>Мы надеемся, что это руководство не только поможет вам в поиске и устранении неисправностей, но и придаст уверенности в том, что ваши рабочие нагрузки Milvus будут работать гладко и эффективно.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Хотите погрузиться глубже?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Присоединяйтесь к <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a>, чтобы задавать вопросы, делиться опытом и учиться у сообщества.</p></li>
<li><p>Запишитесь на наши <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>офисные часы Milvus Office Hours</strong></a>, чтобы напрямую пообщаться с командой и получить практическую помощь в работе с вашими рабочими нагрузками.</p></li>
</ul>
