---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Понимание уровня согласованности в базе данных Milvus Vector - часть II
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: >-
  Анатомия механизма, лежащего в основе настраиваемых уровней согласованности в
  векторной базе данных Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_image</span> </span></p>
<blockquote>
<p>Эта статья написана <a href="https://github.com/longjiquan">Джикуаном Лонгом</a> и переработана <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p>В <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">предыдущем блоге</a> о согласованности мы объяснили, что подразумевается под согласованностью в распределенной векторной базе данных, рассказали о четырех уровнях согласованности - сильном, ограниченном, сессионном и конечном, поддерживаемых в векторной базе данных Milvus, и объяснили, какой сценарий применения лучше всего подходит для каждого уровня согласованности.</p>
<p>В этом посте мы продолжим рассматривать механизм, который позволяет пользователям векторной базы данных Milvus гибко выбирать идеальный уровень согласованности для различных сценариев применения. Мы также предоставим базовое руководство по настройке уровня согласованности в векторной базе данных Milvus.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">Базовый механизм временных меток</a></li>
<li><a href="#Guarantee-timestamp">Гарантированная временная метка</a></li>
<li><a href="#Consistency-levels">Уровни согласованности</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Как настроить уровень согласованности в Milvus?</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">Базовый механизм временных тиков<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus использует механизм временных тиков для обеспечения различных уровней согласованности при выполнении векторного поиска или запроса. Time Tick - это водяной знак Milvus, который действует как часы в Milvus и указывает, в какой момент времени находится система Milvus. Всякий раз, когда в векторную базу данных Milvus отправляется запрос на языке манипулирования данными (DML), он присваивает запросу временную метку. Как показано на рисунке ниже, при вставке новых данных, например, в очередь сообщений, Milvus не только проставляет временную метку на этих вставленных данных, но и вставляет временные метки через регулярный интервал.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>временная метка</span> </span></p>
<p>В качестве примера возьмем <code translate="no">syncTs1</code> на рисунке выше. Когда последующие потребители, например узлы запросов, видят <code translate="no">syncTs1</code>, компоненты-потребители понимают, что все данные, вставленные ранее <code translate="no">syncTs1</code>, были потреблены. Другими словами, запросы на вставку данных, чьи значения временной метки меньше, чем <code translate="no">syncTs1</code>, больше не будут появляться в очереди сообщений.</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">Гарантированная временная метка<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>Как уже говорилось в предыдущем разделе, компоненты-потребители, такие как узлы запросов, постоянно получают сообщения о запросах на вставку данных и временных метках из очереди сообщений. Каждый раз, когда потребляется временная метка, узел запроса отмечает эту потребленную временную метку как обслуживаемую - <code translate="no">ServiceTime</code>, и все данные, вставленные до <code translate="no">ServiceTime</code>, видны узлу запроса.</p>
<p>В дополнение к <code translate="no">ServiceTime</code> в Milvus также принят тип временной метки - гарантийная временная метка (<code translate="no">GuaranteeTS</code>), чтобы удовлетворить потребности различных пользователей в различных уровнях согласованности и доступности. Это означает, что пользователи векторной базы данных Milvus могут указать <code translate="no">GuaranteeTs</code>, чтобы сообщить узлам запроса, что все данные до <code translate="no">GuaranteeTs</code> должны быть видны и задействованы при выполнении поиска или запроса.</p>
<p>Обычно существует два сценария, когда узел запроса выполняет поисковый запрос в векторной базе данных Milvus.</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">Сценарий 1: Выполнение поискового запроса немедленно</h3><p>Как показано на рисунке ниже, если <code translate="no">GuaranteeTs</code> меньше, чем <code translate="no">ServiceTime</code>, узлы запроса могут выполнить поисковый запрос немедленно.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>выполнить_немедленно</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">Сценарий 2: Подождать, пока "ServiceTime &gt; GuaranteeTs".</h3><p>Если <code translate="no">GuaranteeTs</code> больше, чем <code translate="no">ServiceTime</code>, узлы запросов должны продолжать потреблять временные тики из очереди сообщений. Поисковые запросы не могут быть выполнены до тех пор, пока <code translate="no">ServiceTime</code> не станет больше <code translate="no">GuaranteeTs</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">Уровни согласованности<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>Таким образом, значение <code translate="no">GuaranteeTs</code> настраивается в поисковом запросе для достижения заданного вами уровня согласованности. Значение <code translate="no">GuaranteeTs</code> с большим значением обеспечивает <a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">сильную согласованность</a> ценой высокой задержки поиска. А <code translate="no">GuaranteeTs</code> с малым значением уменьшает задержку поиска, но ухудшает видимость данных.</p>
<p><code translate="no">GuaranteeTs</code> в Milvus - это гибридный формат временных меток. И пользователь не имеет представления о <a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSO</a> внутри Milvus. Поэтому определение значения<code translate="no">GuaranteeTs</code> является слишком сложной задачей для пользователей. Чтобы избавить пользователей от проблем и обеспечить оптимальный пользовательский опыт, Milvus требует от пользователей только выбора конкретного уровня согласованности, а векторная база данных Milvus будет автоматически обрабатывать значение <code translate="no">GuaranteeTs</code> для пользователей. Иными словами, пользователю Milvus нужно выбрать только один из четырех уровней согласованности: <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code>, и <code translate="no">Eventually</code>. Каждому уровню согласованности соответствует определенное значение <code translate="no">GuaranteeTs</code>.</p>
<p>На рисунке ниже показано значение <code translate="no">GuaranteeTs</code> для каждого из четырех уровней согласованности в векторной базе данных Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>гарантия_ц</span> </span></p>
<p>Векторная база данных Milvus поддерживает четыре уровня согласованности:</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code>: <code translate="no">GuaranteeTs</code> устанавливается в то же значение, что и последняя системная метка времени, и узлы запроса ждут, пока время обслуживания не перейдет к последней системной метке времени, чтобы обработать запрос на поиск или запрос.</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>: <code translate="no">GuaranteeTs</code> устанавливается в значение, незначительно меньшее, чем последняя системная метка времени, чтобы пропустить проверку согласованности. Узлы запросов выполняют поиск непосредственно в существующем представлении данных.</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>: <code translate="no">GuaranteeTs</code> устанавливается в значение, относительно меньшее, чем последняя системная метка времени, и узлы запроса выполняют поиск в допустимо менее обновленном представлении данных.</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>: Клиент использует в качестве <code translate="no">GuaranteeTs</code> временную метку последней операции записи, чтобы каждый клиент мог, по крайней мере, самостоятельно получить вставленные данные.</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Как настроить уровень согласованности в Milvus?<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus поддерживает настройку уровня согласованности при <a href="https://milvus.io/docs/v2.1.x/create_collection.md">создании коллекции</a> или выполнении <a href="https://milvus.io/docs/v2.1.x/search.md">поиска</a> или <a href="https://milvus.io/docs/v2.1.x/query.md">запроса</a>.</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">Проведение поиска векторного сходства</h3><p>Чтобы выполнить поиск векторного сходства с нужным вам уровнем согласованности, просто задайте для параметра <code translate="no">consistency_level</code> значение <code translate="no">Strong</code>, <code translate="no">Bounded</code>, <code translate="no">Session</code> или <code translate="no">Eventually</code>. Если вы не зададите значение для параметра <code translate="no">consistency_level</code>, уровень согласованности по умолчанию будет <code translate="no">Bounded</code>. В примере выполняется поиск векторного сходства с уровнем согласованности <code translate="no">Strong</code>.</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">Выполнение векторного запроса</h3><p>Аналогично проведению поиска векторного сходства, при проведении векторного запроса можно указать значение параметра <code translate="no">consistency_level</code>. В примере выполняется векторный запрос с консистенцией <code translate="no">Strong</code>.</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Подробнее читайте в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Понимание уровня согласованности в векторной базе данных Milvus (часть II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
