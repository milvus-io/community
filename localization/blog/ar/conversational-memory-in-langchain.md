---
id: conversational-memory-in-langchain.md
title: ذاكرة المحادثة في سلسلة اللغات
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
<p>LangChain هو إطار عمل قوي لبناء تطبيقات LLM. ومع ذلك، مع هذه القوة يأتي قدر كبير من التعقيد. يوفر LangChain العديد من الطرق لمطالبة LLM وميزات أساسية مثل ذاكرة المحادثة. توفر ذاكرة المحادثة سياقًا لـ LLM لتذكر محادثتك.</p>
<p>في هذا المنشور، نلقي نظرة على كيفية استخدام ذاكرة المحادثة مع LangChain وMilvus. للمتابعة، تحتاج إلى <code translate="no">pip</code> تثبيت أربع مكتبات ومفتاح OpenAI API. يمكن تثبيت المكتبات الأربع التي تحتاجها عن طريق تشغيل <code translate="no">pip install langchain milvus pymilvus python-dotenv</code>. أو تنفيذ الكتلة الأولى في <a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">دفتر ملاحظات CoLab</a> لهذه المقالة.</p>
<p>سنتعرف في هذا المنشور على:</p>
<ul>
<li>ذاكرة المحادثة مع LangChain</li>
<li>إعداد سياق المحادثة</li>
<li>تحفيز ذاكرة المحادثة باستخدام LangChain</li>
<li>ملخص ذاكرة المحادثة باستخدام لانغ تشين</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">ذاكرة المحادثة مع لانغ تشين<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>في الحالة الافتراضية، تتفاعل مع ذاكرة المحادثة مع LLM من خلال مطالبات فردية. إضافة ذاكرة للسياق، أو "ذاكرة المحادثة" تعني أنك لم تعد مضطرًا لإرسال كل شيء من خلال مطالبة واحدة. توفر LangChain القدرة على تخزين المحادثة التي أجريتها بالفعل مع LLM لاسترداد تلك المعلومات لاحقًا.</p>
<p>لإعداد ذاكرة محادثة مستمرة مع مخزن متجه، نحتاج إلى ست وحدات من LangChain. أولاً، يجب أن نحصل على <code translate="no">OpenAIEmbeddings</code> و <code translate="no">OpenAI</code> LLM. نحتاج أيضًا إلى <code translate="no">VectorStoreRetrieverMemory</code> ونسخة LangChain من <code translate="no">Milvus</code> لاستخدام الواجهة الخلفية لمخزن المتجهات. ثم نحتاج إلى <code translate="no">ConversationChain</code> و <code translate="no">PromptTemplate</code> لحفظ محادثتنا والاستعلام عنها.</p>
<p>مكتبات <code translate="no">os</code> و <code translate="no">dotenv</code> و <code translate="no">openai</code> هي في الأساس لأغراض تشغيلية. نستخدمها لتحميل واستخدام مفتاح OpenAI API. تتمثل خطوة الإعداد الأخيرة في تشغيل مثيل <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> محلي. نقوم بذلك من خلال استخدام <code translate="no">default_server</code> من حزمة Milvus Python.</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">إعداد سياق المحادثة<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن قمنا بإعداد جميع المتطلبات الأساسية لدينا، يمكننا المتابعة لإنشاء ذاكرة المحادثة الخاصة بنا. خطوتنا الأولى هي إنشاء اتصال بخادم Milvus باستخدام LangChain. بعد ذلك، نستخدم قاموسًا فارغًا لإنشاء مجموعة لانغ تشين ميلفوس الخاصة بنا. بالإضافة إلى ذلك، نقوم بتمرير التضمينات التي أنشأناها أعلاه وتفاصيل الاتصال لخادم ميلفوس لايت.</p>
<p>لاستخدام قاعدة البيانات المتجهة لذاكرة المحادثة، نحتاج إلى إنشائها كمسترجع. نقوم باسترداد النتيجة الأولى فقط في هذه الحالة، مع تعيين <code translate="no">k=1</code>. الخطوة الأخيرة لإعداد ذاكرة المحادثة هي استخدام الكائن <code translate="no">VectorStoreRetrieverMemory</code> كذاكرة محادثة لدينا من خلال المسترد واتصال قاعدة بيانات المتجهات الذي أنشأناه للتو.</p>
<p>لاستخدام ذاكرة المحادثة لدينا، يجب أن تحتوي على بعض السياق فيها. لذا دعونا نعطي الذاكرة بعض السياق. في هذا المثال، سنعطي خمسة أجزاء من المعلومات. دعنا نخزن وجباتي الخفيفة المفضلة (الشوكولاتة)، والرياضة (السباحة)، والبيرة (جينيس)، والحلوى (كعكة الجبن)، والموسيقي (تايلور سويفت). يتم حفظ كل إدخال في الذاكرة من خلال وظيفة <code translate="no">save_context</code>.</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">تحفيز ذاكرة المحادثة باستخدام LangChain<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>حان الوقت لإلقاء نظرة على كيفية استخدام ذاكرة المحادثة. لنبدأ بالاتصال بـ OpenAI LLM من خلال LangChain. نستخدم درجة حرارة 0 للإشارة إلى أننا لا نريد أن تكون ذاكرة LLM الخاصة بنا مبدعة.</p>
<p>بعد ذلك، ننشئ قالبًا. نخبر LLM أنه منخرط في محادثة ودية مع إنسان ونقوم بإدراج متغيرين. يوفر المتغير <code translate="no">history</code> السياق من ذاكرة المحادثة. يوفر المتغير <code translate="no">input</code> المدخلات الحالية. نستخدم الكائن <code translate="no">PromptTemplate</code> لإدراج هذه المتغيرات.</p>
<p>نستخدم الكائن <code translate="no">ConversationChain</code> لدمج كائن لدمج المطالبة وLLM والذاكرة. نحن الآن جاهزون للتحقق من ذاكرة محادثتنا من خلال إعطائها بعض المطالبات. نبدأ بإخبار LLM أن اسمنا هو غاري، المنافس الرئيسي في سلسلة البوكيمون (كل شيء آخر في ذاكرة المحادثة هو حقيقة عني).</p>
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
<p>توضح الصورة أدناه كيف يمكن أن تبدو الاستجابة المتوقعة من LLM. في هذا المثال، استجاب في هذا المثال بقوله أن اسمه هو "AI".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لنختبر الآن الذاكرة حتى الآن. نستخدم الكائن <code translate="no">ConversationChain</code> الذي أنشأناه سابقًا ونستعلم عن الموسيقي المفضل لدي.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تُظهر الصورة أدناه استجابة متوقعة من سلسلة المحادثة. نظرًا لأننا استخدمنا خيار الإسهاب، فإنه يظهر لنا أيضًا المحادثة ذات الصلة. يمكننا أن نرى أنه يُظهر أن الفنان المفضل لدي هو تايلور سويفت، كما هو متوقع.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد ذلك، دعنا نتحقق من الحلوى المفضلة لدي - كعكة الجبن.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>عندما نستفسر عن الحلوى المفضلة لدي، يمكننا أن نرى أن سلسلة المحادثة تختار مرة أخرى المعلومات الصحيحة من ميلفوس. يجد أن الحلوى المفضلة لدي هي كعكة الجبن، كما أخبرته سابقًا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الآن بعد أن تأكدنا من أنه يمكننا الاستعلام عن المعلومات التي قدمناها سابقًا، دعنا نتحقق من شيء آخر - المعلومات التي قدمناها في بداية محادثتنا. بدأنا محادثتنا بإخبار الذكاء الاصطناعي أن اسمنا هو غاري.</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>ينتج عن فحصنا الأخير أن سلسلة المحادثة خزنت الجزء الخاص باسمنا في ذاكرة المحادثة في مخزننا المتجه. يعود أننا قلنا أن اسمنا هو غاري.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">ملخص ذاكرة المحادثة في سلسلة اللغات<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>تعلّمنا في هذا الشرح كيفية استخدام ذاكرة المحادثة في لانغتشين. تقدم لانغ تشين إمكانية الوصول إلى مخزن المتجهات الخلفية مثل ميلفوس لذاكرة المحادثة الدائمة. يمكننا استخدام ذاكرة المحادثة عن طريق حقن التاريخ في مطالباتنا وحفظ السياق التاريخي في الكائن <code translate="no">ConversationChain</code>.</p>
<p>في هذا المثال التعليمي، أعطينا سلسلة المحادثة خمس حقائق عني وتظاهرنا بأننا المنافس الرئيسي في بوكيمون، غاري. بعد ذلك، ضغطنا على سلسلة المحادثة بأسئلة حول المعرفة المسبقة التي قمنا بتخزينها - الموسيقي والحلوى المفضلة لدي. وقد أجاب على هذين السؤالين بشكل صحيح وأظهر الإدخالات ذات الصلة. وأخيراً، سألناها عن اسمنا كما ورد في بداية المحادثة، فأجابت بشكل صحيح بأن اسمنا هو "غاري".</p>
