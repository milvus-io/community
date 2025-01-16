---
id: deep-dive-7-query-expression.md
title: Как база данных понимает и выполняет ваш запрос?
author: Milvus
date: 2022-05-05T00:00:00.000Z
desc: >-
  Векторный запрос - это процесс получения векторов с помощью скалярной
  фильтрации.
cover: assets.zilliz.com/Deep_Dive_7_baae830823.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-7-query-expression.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_7_baae830823.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Изображение на обложке</span> </span></p>
<blockquote>
<p>Эта статья переведена <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Анжелой Ни</a>.</p>
</blockquote>
<p><a href="https://milvus.io/docs/v2.0.x/query.md">Векторный запрос</a> в Milvus - это процесс получения векторов с помощью скалярной фильтрации на основе булевых выражений. С помощью скалярной фильтрации пользователи могут ограничить результаты запроса определенными условиями, наложенными на атрибуты данных. Например, если пользователь запрашивает фильмы, выпущенные в 1990-2010 годах и имеющие оценку выше 8,5 балла, ему будут представлены только те фильмы, атрибуты которых (год выпуска и оценка) удовлетворяют условию.</p>
<p>В этой статье мы рассмотрим, как выполняется запрос в Milvus, начиная с ввода выражения запроса и заканчивая генерацией плана запроса и его выполнением.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#Query-expression">Выражение запроса</a></li>
<li><a href="#Plan-AST-generation">Генерация плана AST</a></li>
<li><a href="#Query-execution">Выполнение запроса</a></li>
</ul>
<h2 id="Query-expression" class="common-anchor-header">Выражение запроса<button data-href="#Query-expression" class="anchor-icon" translate="no">
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
    </button></h2><p>Выражение запроса с фильтрацией атрибутов в Milvus использует синтаксис EBNF (Extended Backus-Naur form). Ниже показаны правила выражения в Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Expression_Syntax_966493a5be.png" alt="Expression Syntax" class="doc-image" id="expression-syntax" />
   </span> <span class="img-wrapper"> <span>Синтаксис выражений</span> </span></p>
<p>Логические выражения могут быть созданы с помощью комбинации бинарных логических операторов, унарных логических операторов, логических выражений и одиночных выражений. Поскольку синтаксис EBNF сам по себе рекурсивен, логическое выражение может быть результатом комбинации или частью большего логического выражения. Логическое выражение может содержать множество подлогических выражений. То же правило действует и в Milvus. Если пользователю необходимо отфильтровать атрибуты результатов с помощью множества условий, он может создать свой собственный набор условий фильтрации, комбинируя различные логические операторы и выражения.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Boolean_expression_1_dce12f8483.png" alt="Boolean expression" class="doc-image" id="boolean-expression" />
   </span> <span class="img-wrapper"> <span>Булево выражение</span> </span></p>
<p>На изображении выше показана часть <a href="https://milvus.io/docs/v2.0.x/boolean.md">правил булевых выражений</a> в Milvus. В выражение можно добавлять унарные логические операторы. В настоящее время Milvus поддерживает только унарный логический оператор &quot;not&quot;, который указывает на то, что система должна отбирать векторы, значения скалярного поля которых не удовлетворяют результатам вычислений. Бинарные логические операторы включают &quot;и&quot; и &quot;или&quot;. К одиночным выражениям относятся выражения термов и сравнения.</p>
<p>Базовые арифметические вычисления, такие как сложение, вычитание, умножение и деление, также поддерживаются при выполнении запроса в Milvus. Следующее изображение демонстрирует приоритет операций. Операторы перечислены сверху вниз в порядке убывания старшинства.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Precedence_b8cfbdf17b.png" alt="Precedence" class="doc-image" id="precedence" />
   </span> <span class="img-wrapper"> <span>Приоритет</span> </span></p>
<h3 id="How-a-query-expression-on-certain-films-is-processed-in-Milvus" class="common-anchor-header">Как в Milvus обрабатывается выражение запроса на определенные фильмы?</h3><p>Предположим, что в Milvus хранится большое количество данных о фильмах, и пользователь хочет запросить определенные фильмы. Например, каждый фильм, хранящийся в Milvus, имеет следующие пять полей: идентификатор фильма, год выпуска, тип фильма, оценка и постер. В этом примере тип данных идентификатора фильма и года выпуска - int64, а оценки фильма - данные с плавающей точкой. Также постеры фильмов хранятся в формате векторов с плавающей точкой, а тип фильма - в формате строковых данных. Примечательно, что поддержка строкового типа данных - это новая возможность в Milvus 2.1.</p>
<p>Например, если пользователь хочет запросить фильмы с оценками выше 8,5. При этом фильмы должны быть выпущены в период с десятилетия до 2000 года по десятилетие после 2000 года или их тип должен быть либо комедией, либо боевиком, пользователю необходимо ввести следующее предикатное выражение: <code translate="no">score &gt; 8.5 &amp;&amp; (2000 - 10 &lt; release_year &lt; 2000 + 10 || type in [comedy,action])</code>.</p>
<p>Получив выражение запроса, система выполнит его в следующем порядке:</p>
<ol>
<li>Запрос на фильмы с оценкой выше 8,5. Результаты запроса называются &quot;result1&quot;.</li>
<li>Вычислите 2000 - 10, чтобы получить "результат2" (1990).</li>
<li>Вычислите 2000 + 10, чтобы получить "результат3" (2010).</li>
<li>Запросите фильмы со значением <code translate="no">release_year</code> больше, чем &quot;результат2&quot;, и меньше, чем &quot;результат3&quot;. Иными словами, системе нужно запросить фильмы, выпущенные в период с 1990 по 2010 год. Результаты запроса называются &quot;result4&quot;.</li>
<li>Запрос на фильмы, которые являются либо комедиями, либо боевиками. Результаты запроса называются &quot;result5&quot;.</li>
<li>Объедините "result4" и "result5", чтобы получить фильмы, которые либо выпущены в период с 1990 по 2010 год, либо относятся к категории комедий или боевиков. Полученные результаты называются &quot;result6&quot;.</li>
<li>Возьмите общую часть в "result1" и "result6", чтобы получить конечный результат, удовлетворяющий всем условиям.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_16_00972a6e5d.png" alt="Film example" class="doc-image" id="film-example" />
   </span> <span class="img-wrapper"> <span>Пример фильма</span> </span></p>
<h2 id="Plan-AST-generation" class="common-anchor-header">Генерация плана AST<button data-href="#Plan-AST-generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus использует инструмент с открытым исходным кодом <a href="https://www.antlr.org/">ANTLR</a> (ANother Tool for Language Recognition) для генерации AST (абстрактного синтаксического дерева) плана. ANTLR - это мощный генератор парсеров для чтения, обработки, выполнения или перевода структурных текстовых или бинарных файлов. Более конкретно, ANTLR может генерировать синтаксический анализатор для построения и обхода деревьев разбора на основе предварительно заданного синтаксиса или правил. Ниже показан пример, в котором входным выражением является &quot;SP=100;&quot;. LEXER, встроенная в ANTLR функция распознавания языка, генерирует четыре лексемы для входного выражения - &quot;SP&quot;, &quot;=&quot;, &quot;100&quot; и &quot;;&quot;. Затем инструмент выполнит дальнейший разбор этих четырех лексем, чтобы сгенерировать соответствующее дерево разбора.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_b2c3fb0b36.png" alt="parse tree" class="doc-image" id="parse-tree" />
   </span> <span class="img-wrapper"> <span>дерево разбора</span> </span></p>
<p>Механизм walker является важной частью инструмента ANTLR. Он предназначен для просмотра всех деревьев разбора, чтобы проверить, подчиняется ли каждый узел правилам синтаксиса, или для обнаружения определенных чувствительных слов. Некоторые из соответствующих API перечислены на рисунке ниже. Поскольку ANTLR начинает с корневого узла и спускается вниз через все подузлы до самого низа, нет необходимости различать порядок прохождения по дереву разбора.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/parse_tree_walker_9a27942502.png" alt="parse tree walker" class="doc-image" id="parse-tree-walker" />
   </span> <span class="img-wrapper"> <span>программа для просмотра дерева разбора</span> </span></p>
<p>Milvus генерирует PlanAST для запроса аналогично ANTLR. Однако использование ANTLR требует переопределения довольно сложных правил синтаксиса. Поэтому Milvus использует одно из наиболее распространенных правил - правила булевых выражений, и зависит от пакета <a href="https://github.com/antonmedv/expr">Expr</a>, открытого на GitHub для запроса и разбора синтаксиса выражений запроса.</p>
<p>Во время запроса с фильтрацией атрибутов Milvus, получив выражение запроса, сгенерирует примитивное дерево нерешенных планов с помощью ant-parser, метода разбора, предоставляемого Expr. Примитивное дерево плана, которое мы получим, представляет собой простое двоичное дерево. Затем дерево плана подвергается тонкой настройке с помощью Expr и встроенного оптимизатора в Milvus. Оптимизатор в Milvus очень похож на вышеупомянутый механизм walker. Поскольку функциональность оптимизации дерева планов, предоставляемая Expr, довольно сложна, нагрузка на встроенный оптимизатор Milvus в значительной степени облегчается. В конечном итоге анализатор рекурсивно анализирует оптимизированное дерево планов, чтобы сгенерировать план AST в структуре <a href="https://developers.google.com/protocol-buffers">буферов протоколов</a> (protobuf).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plan_AST_workflow_3e50b7a0d4.png" alt="plan AST workflow" class="doc-image" id="plan-ast-workflow" />
   </span> <span class="img-wrapper"> <span>Рабочий процесс создания АСТ плана</span> </span></p>
<h2 id="Query-execution" class="common-anchor-header">Выполнение запроса<button data-href="#Query-execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Выполнение запроса - это в корне выполнение плана AST, сгенерированного на предыдущих шагах.</p>
<p>В Milvus план AST определяется в структуре proto. На рисунке ниже представлено сообщение со структурой protobuf. Существует шесть типов выражений, среди которых двоичное выражение и унарное выражение, далее могут быть двоичное логическое выражение и унарное логическое выражение.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Protobuf1_232132dcf2.png" alt="protobuf1" class="doc-image" id="protobuf1" />
   </span> <span class="img-wrapper"> <span>protobuf1</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/protobuf2_193f92f033.png" alt="protobuf2" class="doc-image" id="protobuf2" />
   </span> <span class="img-wrapper"> <span>protobuf2</span> </span></p>
<p>На рисунке ниже представлено UML-изображение выражения запроса. Оно демонстрирует базовый класс и производный класс каждого выражения. Каждый класс имеет метод, принимающий параметры посетителя. Это типичный паттерн проектирования посетителей. Milvus использует этот паттерн для выполнения плана AST, поскольку его главным преимуществом является то, что пользователям не нужно ничего делать с примитивными выражениями, а можно напрямую обратиться к одному из методов в паттерне, чтобы изменить определенный класс выражения запроса и соответствующие элементы.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/UML_1238bc30e1.png" alt="UML" class="doc-image" id="uml" />
   </span> <span class="img-wrapper"> <span>UML</span> </span></p>
<p>При выполнении плана AST Milvus сначала получает узел плана типа proto-. Затем с помощью внутреннего синтаксического анализатора C++ proto получают узел плана типа segcore. После получения двух типов узлов плана Milvus принимает серию обращений к классам, а затем модифицирует и выполняет во внутренней структуре узлов плана. Наконец, Milvus перебирает все узлы плана выполнения, чтобы получить отфильтрованные результаты. Окончательные результаты выводятся в формате битовой маски. Битовая маска - это массив битовых чисел ("0" и "1"). Данные, удовлетворяющие условиям фильтрации, помечаются в битовой маске как "1", а данные, не удовлетворяющие требованиям, помечаются в битовой маске как "0".</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_workflow_d89f1ee925.png" alt="execute workflow" class="doc-image" id="execute-workflow" />
   </span> <span class="img-wrapper"> <span>выполнить рабочий процесс</span> </span></p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">О серии "Глубокое погружение<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>После <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">официального объявления об общей доступности</a> Milvus 2.0 мы организовали эту серию блогов Milvus Deep Dive, чтобы дать глубокую интерпретацию архитектуры и исходного кода Milvus. В этой серии блогов рассматриваются следующие темы:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Обзор архитектуры Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API и Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Обработка данных</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Управление данными</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Запрос в реальном времени</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Скалярный механизм выполнения</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Система контроля качества</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Векторный механизм выполнения</a></li>
</ul>
