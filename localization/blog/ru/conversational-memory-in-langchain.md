---
id: conversational-memory-in-langchain.md
title: Разговорная память в LangChain
author: Yujian Tang
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/conversational-memory-in-langchain.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain - это надежный фреймворк для создания LLM-приложений. Однако вместе с этой мощью приходит и некоторая сложность. LangChain предоставляет множество способов подсказки LLM и такие важные функции, как разговорная память. Память разговоров предлагает контекст, в котором LLM запоминает ваш разговор.</p>
<p>В этом посте мы рассмотрим, как использовать разговорную память с LangChain и Milvus. Чтобы следовать этому, вам нужно <code translate="no">pip</code> установить четыре библиотеки и ключ OpenAI API. Четыре необходимые библиотеки можно установить, запустив <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. Или выполнив первый блок в <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">блокноте CoLab</a> для этой статьи.</p>
<p>В этом посте мы узнаем о:</p>
<ul>
<li>Разговорная память с LangChain</li>
<li>Настройка контекста разговора</li>
<li>Создание подсказок в разговорной памяти с помощью LangChain</li>
<li>Краткое описание разговорной памяти LangChain</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">Разговорная память с LangChain<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>В состоянии по умолчанию вы взаимодействуете с LLM с помощью одиночных подсказок. Добавление памяти для контекста, или "разговорной памяти", означает, что вам больше не нужно передавать все через одну подсказку. LangChain предлагает возможность хранить разговор, который вы уже вели с LLM, чтобы получить эту информацию позже.</p>
<p>Чтобы настроить постоянную разговорную память с векторным хранилищем, нам понадобятся шесть модулей от LangChain. Во-первых, мы должны получить <code translate="no">OpenAIEmbeddings</code> и <code translate="no">OpenAI</code> LLM. Для использования бэкенда векторного хранилища нам также нужны <code translate="no">VectorStoreRetrieverMemory</code> и LangChain-версия <code translate="no">Milvus</code>. Затем нам нужны <code translate="no">ConversationChain</code> и <code translate="no">PromptTemplate</code>, чтобы сохранить наш разговор и запросить его.</p>
<p>Библиотеки <code translate="no">os</code>, <code translate="no">dotenv</code> и <code translate="no">openai</code> предназначены в основном для операционных целей. Мы используем их для загрузки и использования ключа API OpenAI. Последний шаг настройки - запуск локального экземпляра <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Для этого мы используем <code translate="no">default_server</code> из пакета Milvus Python.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">embeddings</span>.<span class="hljs-property">openai</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAIEmbeddings</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">llms</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">memory</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">VectorStoreRetrieverMemory</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">chains</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">ConversationChain</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">prompts</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">PromptTemplate</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">vectorstores</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Milvus</span>
embeddings = <span class="hljs-title class_">OpenAIEmbeddings</span>()


<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">import</span> openai
<span class="hljs-title function_">load_dotenv</span>()
openai.<span class="hljs-property">api_key</span> = os.<span class="hljs-title function_">getenv</span>(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)


<span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
default_server.<span class="hljs-title function_">start</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">Настройка контекста разговора<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда все предварительные условия созданы, мы можем приступить к созданию памяти разговора. Первым шагом будет создание соединения с сервером Milvus с помощью LangChain. Далее мы используем пустой словарь для создания коллекции LangChain Milvus. Кроме того, мы передаем созданные нами выше вкрапления и данные для подключения к серверу Milvus Lite.</p>
<p>Чтобы использовать векторную базу данных для разговорной памяти, нам нужно инстанцировать ее как ретривер. В данном случае мы получаем только 1 лучший результат, установив <code translate="no">k=1</code>. Последний шаг настройки разговорной памяти - использование объекта <code translate="no">VectorStoreRetrieverMemory</code> в качестве разговорной памяти через соединение ретривера и векторной базы данных, которое мы только что установили.</p>
<p>Чтобы использовать нашу разговорную память, в ней должен быть некоторый контекст. Поэтому давайте зададим памяти контекст. Для этого примера мы дадим пять частей информации. Давайте запомним мою любимую закуску (шоколад), вид спорта (плавание), пиво (Guinness), десерт (чизкейк) и музыканта (Тейлор Свифт). Каждая запись сохраняется в памяти с помощью функции <code translate="no">save_context</code>.</p>
<pre><code translate="no">vectordb = Milvus.from_documents(
   {},
   embeddings,
   connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;127.0.0.1&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: default_server.listen_port})
retriever = Milvus.as_retriever(vectordb, search_kwargs=<span class="hljs-built_in">dict</span>(k=<span class="hljs-number">1</span>))
memory = VectorStoreRetrieverMemory(retriever=retriever)
about_me = [
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite snack is chocolate&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Nice&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite sport is swimming&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Cool&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite beer is Guinness&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Great&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite dessert is cheesecake&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Good to know&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite musician is Taylor Swift&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Same&quot;</span>}
]
<span class="hljs-keyword">for</span> example <span class="hljs-keyword">in</span> about_me:
   memory.save_context({<span class="hljs-string">&quot;input&quot;</span>: example[<span class="hljs-string">&quot;input&quot;</span>]}, {<span class="hljs-string">&quot;output&quot;</span>: example[<span class="hljs-string">&quot;output&quot;</span>]})
<button class="copy-code-btn"></button></code></pre>
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">Создание подсказок для разговорной памяти с помощью LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>Пришло время посмотреть, как мы можем использовать нашу разговорную память. Начнем с подключения к OpenAI LLM через LangChain. Мы используем температуру 0, чтобы указать, что мы не хотим, чтобы наша LLM была творческой.</p>
<p>Далее мы создадим шаблон. Мы сообщаем LLM, что он участвует в дружеской беседе с человеком, и вставляем две переменные. Переменная <code translate="no">history</code> предоставляет контекст из памяти разговора. Переменная <code translate="no">input</code> предоставляет текущий ввод. Мы используем объект <code translate="no">PromptTemplate</code> для вставки этих переменных.</p>
<p>Мы используем объект <code translate="no">ConversationChain</code> для объединения подсказки, LLM и памяти. Теперь мы готовы проверить память нашего разговора, дав ему несколько подсказок. Начнем с того, что сообщим LLM, что нас зовут Гэри, главный соперник в серии Pokemon (все остальное в памяти разговора - это факты обо мне).</p>
<pre><code translate="no">llm = OpenAI(temperature=<span class="hljs-number">0</span>) <span class="hljs-comment"># Can be any valid LLM</span>
_DEFAULT_TEMPLATE = <span class="hljs-string">&quot;&quot;&quot;The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.


Relevant pieces of previous conversation:
{history}


(You do not need to use these pieces of information if not relevant)


Current conversation:
Human: {input}
AI:&quot;&quot;&quot;</span>
PROMPT = PromptTemplate(
   input_variables=[<span class="hljs-string">&quot;history&quot;</span>, <span class="hljs-string">&quot;input&quot;</span>], template=_DEFAULT_TEMPLATE
)
conversation_with_summary = ConversationChain(
   llm=llm,
   prompt=PROMPT,
   memory=memory,
   verbose=<span class="hljs-literal">True</span>
)
conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Hi, my name is Gary, what&#x27;s up?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>На изображении ниже показано, как может выглядеть ожидаемая реакция LLM. В данном примере он ответил, что его зовут "ИИ".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Теперь давайте проверим, как работает память. Используем объект <code translate="no">ConversationChain</code>, который мы создали ранее, и сделаем запрос на моего любимого музыканта.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>На изображении ниже показан ожидаемый ответ от Conversation Chain. Поскольку мы использовали опцию verbose, он также показывает нам соответствующую беседу. Мы видим, что, как и ожидалось, в ответ приходит сообщение о том, что моим любимым исполнителем является Тейлор Свифт.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Далее давайте проверим мой любимый десерт - чизкейк.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Когда мы запрашиваем мой любимый десерт, мы видим, что цепочка разговоров снова выбирает правильную информацию из Milvus. Она обнаруживает, что мой любимый десерт - чизкейк, как я и говорил ранее.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Теперь, когда мы убедились, что можем запрашивать информацию, которую мы сообщили ранее, давайте проверим еще одну вещь - информацию, которую мы предоставили в начале нашего разговора. Мы начали разговор, сообщив ИИ, что нас зовут Гэри.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Наша последняя проверка показывает, что цепочка разговора сохранила информацию о нашем имени в нашей векторной памяти разговора. Она возвращает, что мы сказали, что нас зовут Гэри.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">Краткое описание разговорной памяти LangChain<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>В этом уроке мы узнали, как использовать разговорную память в LangChain. LangChain предлагает доступ к бэкендам векторных хранилищ, таких как Milvus, для постоянной разговорной памяти. Мы можем использовать разговорную память, внедряя историю в наши подсказки и сохраняя исторический контекст в объекте <code translate="no">ConversationChain</code>.</p>
<p>В этом учебном примере мы сообщили разговорной цепочке пять фактов обо мне и притворились главным соперником в Pokemon, Гэри. Затем мы задали разговорной цепочке вопросы о сохраненных априорных знаниях - о моем любимом музыканте и десерте. Она правильно ответила на оба вопроса и вывела на экран соответствующие записи. Наконец, мы спросили его о нашем имени, указанном в начале разговора, и он правильно ответил, что мы сказали, что нас зовут "Гэри".</p>
