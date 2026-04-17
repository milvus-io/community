---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: Я построил глубокое исследование с открытым исходным кодом - и вы тоже можете!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Узнайте, как создать агента в стиле Deep Research, используя такие инструменты
  с открытым исходным кодом, как Milvus, DeepSeek R1 и LangChain.
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ну, на самом деле, это минимально необходимый агент, который может рассуждать, планировать, использовать инструменты и т.д. для проведения исследований с помощью Википедии. Тем не менее, неплохо для нескольких часов работы...</p>
<p>Если вы не живете под скалой, в пещере или в отдаленном горном монастыре, вы наверняка слышали о том, что 2 февраля 2025 года OpenAI выпустит <em>Deep Research</em>. Этот новый продукт обещает совершить революцию в том, как мы отвечаем на вопросы, требующие синтеза больших объемов разнообразной информации.</p>
<p>Вы вводите свой запрос, выбираете опцию Deep Research, и платформа автономно ищет информацию в Интернете, анализирует найденные данные и синтезирует множество источников в целостный, полностью цитируемый отчет. По сравнению с обычным чатботом, на создание результатов уходит на несколько порядков больше времени, но результат получается более подробным, более информированным и более тонким.</p>
<h2 id="How-does-it-work" class="common-anchor-header">Как это работает?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Но как работает эта технология и почему Deep Research заметно лучше предыдущих попыток (например, <em>Deep Research</em> от Google - предупреждение о входящем споре по товарному знаку)? О последнем мы расскажем в следующем посте. Что касается первого, то в основе Deep Research, несомненно, лежит много "секретного соуса". Несколько деталей мы можем почерпнуть из сообщения OpenAI, которое я привожу вкратце.</p>
<p><strong>Deep Research использует последние достижения в области фундаментальных моделей, специализированных для задач рассуждения:</strong></p>
<ul>
<li><p>"...отлаженная на грядущей модели рассуждений OpenAI o3..."</p></li>
<li><p>"...использует рассуждения для поиска, интерпретации и анализа огромных объемов текста...".</p></li>
</ul>
<p><strong>Deep Research использует сложный агентный рабочий процесс с планированием, размышлением и памятью:</strong></p>
<ul>
<li><p>"...научился планировать и выполнять многошаговую траекторию..."</p></li>
<li><p>"...отступать назад и реагировать на информацию в реальном времени..."</p></li>
<li><p>"...поворачивать по мере необходимости в ответ на получаемую информацию...".</p></li>
</ul>
<p><strong>Deep Research обучается на собственных данных, используя несколько типов тонкой настройки, что, вероятно, является ключевым компонентом его производительности:</strong></p>
<ul>
<li><p>"...обучен с использованием сквозного обучения с подкреплением на сложных задачах просмотра веб-страниц и рассуждений в различных областях..."</p></li>
<li><p>"...оптимизирован для просмотра веб-страниц и анализа данных...".</p></li>
</ul>
<p>Точный дизайн агентного рабочего процесса держится в секрете, однако мы можем построить что-то сами, основываясь на хорошо известных идеях о том, как структурировать агентов.</p>
<p><strong>Прежде чем мы начнем, сделаем одно замечание</strong>: Легко поддаться лихорадке генеративного ИИ, особенно когда выходит новый продукт, который кажется шагом вперед. Однако у Deep Research, как признают в OpenAI, есть ограничения, свойственные технологии генеративного ИИ. Мы должны помнить, что нужно критически относиться к полученным результатам, поскольку они могут содержать ложные факты ("галлюцинации"), неправильное форматирование и цитирование, а также значительно отличаться по качеству в зависимости от случайного семени.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Могу ли я создать свой собственный?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Конечно, можно! Давайте создадим собственное "Глубокое исследование", работающее локально и с использованием инструментов с открытым исходным кодом. Мы будем вооружены лишь базовыми знаниями о генеративном ИИ, здравым смыслом, парой свободных часов, графическим процессором и открытыми исходными кодами <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> и <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>Конечно, мы не можем надеяться повторить производительность OpenAI, но наш прототип в минимальной степени продемонстрирует некоторые ключевые идеи, которые, вероятно, лежат в основе их технологии, сочетая достижения в моделях рассуждений с достижениями в агентных рабочих процессах. Важно отметить, что, в отличие от OpenAI, мы будем использовать только инструменты с открытым исходным кодом и сможем развернуть нашу систему локально - открытый исходный код, безусловно, обеспечивает нам большую гибкость!</p>
<p>Мы сделаем несколько упрощающих предположений, чтобы уменьшить масштаб нашего проекта:</p>
<ul>
<li><p>Мы будем использовать режим рассуждений с открытым исходным кодом, дистиллированный и <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">квантованный</a> для 4 бит, который можно запустить локально.</p></li>
<li><p>Мы не будем самостоятельно выполнять дополнительную тонкую настройку нашей модели рассуждений.</p></li>
<li><p>Единственный инструмент, которым располагает наш агент, - это возможность загрузить и прочитать страницу Википедии и выполнить отдельные RAG-запросы (у нас не будет доступа ко всему Интернету).</p></li>
<li><p>Наш агент будет обрабатывать только текстовые данные, но не изображения, PDF-файлы и т. д.</p></li>
<li><p>Наш агент не будет возвращаться назад или рассматривать повороты.</p></li>
<li><p>Наш агент будет (пока еще нет) управлять потоком выполнения на основе своих результатов.</p></li>
<li><p>Википедия содержит всю правду, всю правду и ничего, кроме правды.</p></li>
</ul>
<p>Мы будем использовать <a href="https://milvus.io/docs">Milvus</a> для нашей векторной базы данных, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> в качестве нашей модели рассуждений и <a href="https://python.langchain.com/docs/introduction/">LangChain</a> для реализации RAG. Давайте начнем!</p>
<custom-h1>Минимальный агент для онлайн-исследований</custom-h1><p>Мы будем использовать нашу ментальную модель того, как люди проводят исследования, для разработки рабочего процесса агента:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Определение/уточнение вопроса</h3><p>Исследование начинается с определения вопроса. Мы принимаем вопрос за запрос пользователя, однако используем нашу модель рассуждений, чтобы убедиться, что вопрос выражен конкретно, четко и целенаправленно. То есть первым делом мы переписываем вопрос и извлекаем все подзапросы и подвопросы. Мы эффективно используем специализацию наших базовых моделей для рассуждений и простой метод для структурированного вывода JSON.</p>
<p>Вот пример трассировки рассуждений, когда DeepSeek уточняет вопрос "Как изменился актерский состав с течением времени?":</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Поиск</h3><p>Далее мы проводим "обзор литературы" по статьям Википедии. Пока что мы читаем одну статью и оставляем навигацию по ссылкам на будущую итерацию. В процессе создания прототипа мы обнаружили, что поиск ссылок может стать очень дорогим, если каждая ссылка требует обращения к модели рассуждений. Мы разбираем статью и храним ее данные в нашей векторной базе данных Milvus, подобно тому как мы делаем заметки.</p>
<p>Вот фрагмент кода, показывающий, как мы храним страницу Википедии в Milvus с помощью интеграции LangChain:</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">Анализ</h3><p>Агент возвращается к своим вопросам и отвечает на них, основываясь на релевантной информации в документе. Мы оставим многоступенчатый процесс анализа/рефлексии для будущей работы, а также критические размышления о достоверности и предвзятости наших источников.</p>
<p>Вот фрагмент кода, иллюстрирующий построение RAG с помощью LangChain и отдельные ответы на наши подвопросы.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">Синтез</h3><p>После того как агент провел исследование, он создает структурированный конспект, или, скорее, скелет, своих выводов, чтобы обобщить их в отчете. Затем он заполняет каждый раздел, вписывая в него название раздела и соответствующее содержание. Мы оставляем более сложный рабочий процесс с размышлениями, переупорядочиванием и переписыванием для будущей итерации. Эта часть агента требует планирования, использования инструментов и памяти.</p>
<p>Полный код см. в <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">сопроводительном блокноте</a>, а пример вывода - в <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">сохраненном файле отчета</a>.</p>
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
    </button></h2><p>Наш запрос для тестирования - <em>"Как изменился сериал "Симпсоны" со временем?"</em>, а источник данных - статья Википедии о "Симпсонах". Вот один из разделов <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">сгенерированного отчета</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Резюме: что мы создали и что дальше<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Всего за несколько часов мы разработали базовый агентный рабочий процесс, который может рассуждать, планировать и извлекать информацию из Википедии для создания структурированного исследовательского отчета. Хотя этот прототип далек от Deep Research от OpenAI, он демонстрирует возможности таких инструментов с открытым исходным кодом, как Milvus, DeepSeek и LangChain, в создании автономных исследовательских агентов.</p>
<p>Конечно, есть много возможностей для совершенствования. Будущие итерации могут:</p>
<ul>
<li><p>Выйти за рамки Википедии и осуществлять динамический поиск по нескольким источникам.</p></li>
<li><p>Внедрить обратный путь и рефлексию для уточнения ответов</p></li>
<li><p>Оптимизировать процесс выполнения на основе собственных рассуждений агента.</p></li>
</ul>
<p>Открытый исходный код дает нам гибкость и контроль, которых нет у закрытого исходного кода. Создание собственных исследовательских агентов открывает захватывающие возможности, будь то академические исследования, синтез контента или помощь на основе ИИ. Следите за следующими публикациями, в которых мы рассмотрим добавление веб-поиска в реальном времени, многоступенчатых рассуждений и условного потока выполнения!</p>
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
<li><p>Блокнот: <em>"</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Базовый уровень для глубокого исследования с открытым исходным кодом</em></a><em>"</em></p></li>
<li><p>Отчет: <em>"</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>Эволюция "Симпсонов" как шоу с течением времени, охватывающая изменения в содержании, юморе, развитии персонажей, анимации и роли в обществе</em></a><em>".</em></p></li>
<li><p><a href="https://milvus.io/docs">Документация по векторной базе данных Milvus</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Страница модели DeepSeek R1 с дистиллированной и квантованной информацией</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">FAQ по глубоким исследованиям | Центр помощи OpenAI</a></p></li>
</ul>
