---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: >-
  Представляем DeepSearcher: Локальное глубокое исследование с открытым исходным
  кодом
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  В отличие от OpenAI's Deep Research, этот пример работал локально, используя
  только модели и инструменты с открытым исходным кодом, такие как Milvus и
  LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="deep researcher.gif" class="doc-image" id="deep-researcher.gif" />
   </span> <span class="img-wrapper"> <span>deep researcher.gif</span> </span></p>
<p>В предыдущей заметке <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>"Я построил глубокое исследование с открытым исходным кодом - и вы тоже можете!"</em></a> мы объяснили некоторые принципы, лежащие в основе исследовательских агентов, и создали простой прототип, который генерирует подробные отчеты по заданной теме или вопросу. Статья и соответствующий блокнот продемонстрировали фундаментальные концепции <em>использования инструментов</em>, <em>декомпозиции запросов</em>, <em>рассуждений</em> и <em>размышлений</em>. Пример из нашей предыдущей заметки, в отличие от Deep Research от OpenAI, работал локально, используя только модели и инструменты с открытым исходным кодом, такие как <a href="https://milvus.io/docs">Milvus</a> и LangChain. (Я рекомендую вам прочитать <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">статью выше</a>, прежде чем продолжить).</p>
<p>В последующие недели произошел взрыв интереса к пониманию и воспроизведению глубоких исследований OpenAI. Например, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> и <a href="https://huggingface.co/blog/open-deep-research">Hugging Face's Open DeepResearch</a>. Эти инструменты различаются по архитектуре и методологии, хотя имеют общую цель: итеративно исследовать тему или вопрос, просматривая веб-страницы или внутренние документы, и выдать подробный, обоснованный и хорошо структурированный отчет. Важно, что базовый агент автоматизирует рассуждения о том, какие действия следует предпринять на каждом промежуточном этапе.</p>
<p>В этом посте мы развиваем нашу предыдущую статью и представляем проект <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> от Zilliz с открытым исходным кодом. Наш агент демонстрирует дополнительные концепции: <em>маршрутизацию запросов, поток условного выполнения</em> и <em>веб-ползание как инструмент</em>. Он представлен в виде библиотеки Python и инструмента командной строки, а не блокнота Jupyter, и является более полнофункциональным, чем наш предыдущий пост. Например, он может вводить несколько исходных документов и задавать модель встраивания и используемую векторную базу данных через конфигурационный файл. Несмотря на то, что DeepSearcher все еще относительно прост, он является отличным примером агентного RAG и еще одним шагом на пути к созданию современных приложений ИИ.</p>
<p>Кроме того, мы изучаем потребность в более быстрых и эффективных сервисах вывода. Модели рассуждений используют "масштабирование выводов", то есть дополнительные вычисления, для улучшения своих результатов, и это в сочетании с тем фактом, что один отчет может потребовать сотни или тысячи вызовов LLM, приводит к тому, что пропускная способность выводов становится основным узким местом. Мы используем <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">модель рассуждений DeepSeek-R1 на специально разработанном SambaNova оборудовании</a>, которое в два раза быстрее по скорости вывода токенов в секунду, чем ближайший конкурент (см. рисунок ниже).</p>
<p>SambaNova Cloud также предоставляет услуги по созданию выводов для других моделей с открытым исходным кодом, включая Llama 3.x, Qwen2.5 и QwQ. Сервис обработки выводов работает на собственном чипе SambaNova под названием реконфигурируемый блок обработки данных (RDU), который специально разработан для эффективной обработки выводов в моделях генеративного ИИ, снижая стоимость и увеличивая скорость обработки выводов. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Более подробную информацию можно найти на их сайте.</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output speed- deepseek r1.png" class="doc-image" id="output-speed--deepseek-r1.png" />
   </span> <span class="img-wrapper"> <span>Скорость вывода - deepseek r1.png</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">Архитектура DeepSearcher<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Архитектура <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> повторяет наш предыдущий пост, разбивая проблему на четыре этапа - <em>определение/уточнение вопроса</em>, <em>исследование</em>, <em>анализ</em>, <em>синтез</em> - хотя на этот раз с некоторым дублированием. Мы пройдемся по каждому шагу, подчеркивая улучшения <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="deepsearcher architecture.png" class="doc-image" id="deepsearcher-architecture.png" />
   </span> <span class="img-wrapper"> <span>архитектура deepsearcher.png</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Определение и уточнение вопроса</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>В дизайне DeepSearcher границы между исследованием и уточнением вопроса размыты. Первоначальный запрос пользователя декомпозируется на подзапросы, как и в предыдущем посте. См. выше исходные подзапросы, созданные на основе запроса "Как менялся сериал "Симпсоны" с течением времени?". Однако на следующем этапе исследования вопрос будет уточняться по мере необходимости.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Исследование и анализ</h3><p>После разбивки запроса на подзапросы начинается исследовательская часть работы агента. В ней, грубо говоря, четыре этапа: <em>маршрутизация</em>, <em>поиск</em>, <em>размышление и условное повторение</em>.</p>
<h4 id="Routing" class="common-anchor-header">Маршрутизация</h4><p>Наша база данных содержит множество таблиц или коллекций из разных источников. Было бы эффективнее, если бы мы могли ограничить семантический поиск только теми источниками, которые имеют отношение к рассматриваемому запросу. Маршрутизатор запроса подсказывает LLM, из каких коллекций следует извлекать информацию.</p>
<p>Вот метод формирования запроса-маршрутизатора:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>Мы заставляем LLM возвращать структурированный вывод в виде JSON, чтобы легко преобразовать его в решение о том, что делать дальше.</p>
<h4 id="Search" class="common-anchor-header">Поиск</h4><p>После выбора различных коллекций баз данных с помощью предыдущего шага, шаг поиска выполняет поиск по сходству с помощью <a href="https://milvus.io/docs">Milvus</a>. Как и в предыдущем посте, исходные данные были определены заранее, разбиты на куски, встроены и сохранены в векторной базе данных. Для DeepSearcher источники данных, как локальные, так и онлайн, должны быть указаны вручную. Мы оставляем онлайн-поиск для будущих работ.</p>
<h4 id="Reflection" class="common-anchor-header">Отражение</h4><p>В отличие от предыдущего поста, DeepSearcher демонстрирует настоящую форму агентской рефлексии, вводя предыдущие результаты в качестве контекста в подсказку, которая "размышляет" о том, содержат ли заданные вопросы и соответствующие извлеченные фрагменты какие-либо информационные пробелы. Это можно рассматривать как шаг анализа.</p>
<p>Вот метод создания подсказки:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>И снова мы заставляем LLM возвращать структурированный результат, на этот раз в виде интерпретируемых на Python данных.</p>
<p>Вот пример новых подзапросов, "обнаруженных" в результате размышлений после ответа на первоначальные подзапросы, приведенные выше:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Условное повторение</h4><p>В отличие от нашего предыдущего поста, DeepSearcher иллюстрирует условный поток выполнения. После размышлений о том, являются ли вопросы и ответы на них полными, если есть дополнительные вопросы, которые необходимо задать, агент повторяет описанные выше шаги. Важно отметить, что поток выполнения (цикл while) является функцией вывода LLM, а не жестко закодирован. В данном случае есть только двоичный выбор: <em>повторить исследование</em> или <em>сгенерировать отчет</em>. В более сложных агентах их может быть несколько, например: <em>перейти по гиперссылке</em>, <em>извлечь фрагменты, сохранить в памяти, обдумать</em> и т. д. Таким образом, вопрос продолжает уточняться по усмотрению агента до тех пор, пока он не решит выйти из цикла и создать отчет. В нашем примере с Симпсонами DeepSearcher выполняет еще два раунда заполнения пробелов с помощью дополнительных подзапросов.</p>
<h3 id="Synthesize" class="common-anchor-header">Синтез</h3><p>Наконец, полностью разложенный вопрос и извлеченные фрагменты синтезируются в отчет с единственной подсказкой. Вот код для создания подсказки:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>Преимущество этого подхода по сравнению с нашим прототипом, который анализировал каждый вопрос отдельно и просто объединял результаты, заключается в том, что отчет получается таким, что все разделы соответствуют друг другу, т. е. не содержат повторяющейся или противоречивой информации. Более сложная система может сочетать в себе оба варианта, используя поток условного выполнения для структурирования отчета, подведения итогов, переписывания, отражения и разворота и т. д., что мы оставляем на будущее.</p>
<h2 id="Results" class="common-anchor-header">Результаты<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Вот пример отчета, сгенерированного по запросу "Как менялись Симпсоны со временем?" с помощью DeepSeek-R1, передающего страницу Википедии о Симпсонах в качестве исходного материала:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Полный отчет</a> вы найдете <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">здесь</a>, а для сравнения <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">- отчет, созданный DeepSearcher с GPT-4o mini</a>.</p>
<h2 id="Discussion" class="common-anchor-header">Обсуждение<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Мы представили <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, агента для проведения исследований и написания отчетов. Наша система построена на идее, изложенной в предыдущей статье, с добавлением таких функций, как условный поток выполнения, маршрутизация запросов и улучшенный интерфейс. Мы перешли от локального вывода с небольшой 4-битной квантованной моделью рассуждений к онлайн-сервису вывода для массивной модели DeepSeek-R1, что качественно улучшило наш выходной отчет. DeepSearcher работает с большинством сервисов, таких как OpenAI, Gemini, DeepSeek и Grok 3 (скоро появится!).</p>
<p>Модели рассуждений, особенно используемые в исследовательских агентах, требуют большого количества выводов, и нам повезло, что мы смогли использовать самую быструю модель DeepSeek-R1 от SambaNova, работающую на их специализированном оборудовании. Для нашего демонстрационного запроса мы сделали шестьдесят пять обращений к сервису вывода DeepSeek-R1 от SambaNova, ввели около 25 тыс. лексем, вывели 22 тыс. лексем и потратили $0,30. Мы были впечатлены скоростью вывода, учитывая, что модель содержит 671 миллиард параметров и имеет размер 3/4 терабайта. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Узнайте больше подробностей здесь!</a></p>
<p>Мы продолжим развивать эту работу в следующих постах, рассматривая дополнительные агентные концепции и пространство дизайна исследовательских агентов. А пока мы приглашаем всех попробовать <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, <a href="https://github.com/zilliztech/deep-searcher">отметить нас на GitHub</a> и поделиться своими отзывами!</p>
<h2 id="Resources" class="common-anchor-header">Ресурсы<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher Зиллиза</strong></a></p></li>
<li><p>Справочное чтение: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>"Я построил глубокое исследование с открытым исходным кодом - и вы тоже можете!"</em></strong></a></p></li>
<li><p><em>"</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova запускает самый быстрый DeepSeek-R1 671B с высочайшей эффективностью</strong></a><em>"</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">Отчет DeepSeek-R1 о "Симпсонах</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">Мини-отчет GPT-4o о "Симпсонах</a></p></li>
<li><p><a href="https://milvus.io/docs">База данных векторов Milvus с открытым исходным кодом</a></p></li>
</ul>
