---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 وMilvus: كيفية بناء وكلاء جاهزين للإنتاج بذاكرة حقيقية طويلة
  المدى
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  اكتشف كيف تبسّط سلسلة اللغات 1.0 بنية الوكيل وكيف تضيف Milvus ذاكرة طويلة
  المدى لتطبيقات الذكاء الاصطناعي القابلة للتطوير والجاهزة للإنتاج.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain هو إطار عمل شائع مفتوح المصدر لتطوير تطبيقات مدعومة بنماذج لغوية كبيرة (LLMs). وهو يوفر مجموعة أدوات معيارية لبناء عوامل الاستدلال واستخدام الأدوات، وربط النماذج بالبيانات الخارجية، وإدارة تدفقات التفاعل.</p>
<p>وبإصدار الإصدار <strong>1.0</strong> من <strong>LangChain 1.0،</strong> يخطو إطار العمل خطوة نحو بنية أكثر ملاءمة للإنتاج. يستبدل الإصدار الجديد التصميم السابق المستند إلى السلسلة بحلقة ReAct الموحدة (الاستدلال ← استدعاء الأداة ← المراقبة ← اتخاذ القرار) ويقدم البرمجيات الوسيطة لإدارة التنفيذ والتحكم والسلامة.</p>
<p>ومع ذلك، فإن الاستدلال وحده لا يكفي. يحتاج الوكلاء أيضًا إلى القدرة على تخزين المعلومات واستدعائها وإعادة استخدامها. هذا هو المكان الذي يمكن أن تلعب فيه <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة مفتوحة المصدر، دورًا أساسيًا. توفر Milvus طبقة ذاكرة قابلة للتطوير وعالية الأداء تمكّن الوكلاء من تخزين المعلومات والبحث عنها واسترجاعها بكفاءة عبر التشابه الدلالي.</p>
<p>في هذا المنشور، سنستكشف في هذا المنشور كيف يقوم LangChain 1.0 بتحديث بنية الوكيل، وكيف يساعد دمج Milvus الوكلاء على تجاوز مرحلة التفكير المنطقي - مما يتيح ذاكرة ذكية ومستمرة لحالات الاستخدام في العالم الحقيقي.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">لماذا يقصر التصميم القائم على السلسلة<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>في أيامها الأولى (الإصدار 0.x)، تمحورت بنية LangChain حول السلاسل. كانت كل سلسلة تُعرّف تسلسلًا ثابتًا وتأتي مع قوالب معدة مسبقًا تجعل تنسيق LLM بسيطًا وسريعًا. كان هذا التصميم رائعًا لبناء النماذج الأولية بسرعة. ولكن مع تطور نظام LLM البيئي وتزايد تعقيد حالات الاستخدام في العالم الحقيقي، بدأت تظهر التصدعات في هذه البنية.</p>
<p><strong>1. عدم المرونة</strong></p>
<p>وفرت الإصدارات المبكرة من LangChain خطوط أنابيب معيارية مثل SimpleSequentialChain أو LLMChain، حيث يتبع كل منها تدفقًا خطيًا ثابتًا - إنشاء الموجة ← استدعاء النموذج ← معالجة الإخراج. عمل هذا التصميم بشكل جيد للمهام البسيطة والمتوقعة وجعل من السهل وضع نموذج أولي سريع.</p>
<p>ومع ذلك، مع نمو التطبيقات بشكل أكثر ديناميكية، بدأت هذه القوالب الجامدة تبدو مقيدة. عندما لم يعد منطق العمل يتلاءم بدقة مع تسلسل محدد مسبقًا، أصبح لديك خياران غير مرضيين: إما إجبار منطقك على التوافق مع إطار العمل أو تجاوزه تمامًا عن طريق استدعاء واجهة برمجة تطبيقات LLM مباشرةً.</p>
<p><strong>2. عدم وجود تحكم على مستوى الإنتاج</strong></p>
<p>ما كان يعمل بشكل جيد في العروض التوضيحية غالبًا ما يتعطل في الإنتاج. لم تتضمن السلاسل الضمانات اللازمة للتطبيقات واسعة النطاق أو المستمرة أو الحساسة. تضمنت المشكلات الشائعة ما يلي:</p>
<ul>
<li><p><strong>تجاوز السياق:</strong> يمكن أن تتجاوز المحادثات الطويلة حدود الرمز المميز، مما يتسبب في حدوث أعطال أو اقتطاع صامت.</p></li>
<li><p><strong>تسريب البيانات الحساسة:</strong> قد يتم إرسال معلومات التعريف الشخصية (مثل رسائل البريد الإلكتروني أو المعرفات) عن غير قصد إلى نماذج الجهات الخارجية.</p></li>
<li><p><strong>عمليات غير خاضعة للإشراف:</strong> قد يقوم الوكلاء بحذف البيانات أو إرسال بريد إلكتروني دون موافقة بشرية.</p></li>
</ul>
<p><strong>3. عدم التوافق عبر النماذج</strong></p>
<p>يطبّق كل مزوّد خدمة LLM - OpenAI و Anthropic والعديد من النماذج الصينية - بروتوكولاته الخاصة للاستدلال واستدعاء الأدوات. في كل مرة تقوم فيها بتبديل الموفرين، كان عليك إعادة كتابة طبقة التكامل: قوالب المطالبة والمهايئات ومحللي الاستجابة. أدى هذا العمل المتكرر إلى إبطاء التطوير وجعل التجربة مؤلمة.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">سلسلة اللغات 1.0: وكيل ReAct الكل في الكل<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>عندما قام فريق LangChain بتحليل المئات من تطبيقات الوكلاء على مستوى الإنتاج، برزت فكرة واحدة: جميع الوكلاء الناجحين تقريبًا يتقاربون بشكل طبيعي مع <strong>نمط ReAct ("التفكير + التمثيل")</strong>.</p>
<p>وسواء كان ذلك في نظام متعدد الوكلاء أو وكيل واحد يقوم بالتفكير العميق، تظهر نفس حلقة التحكم: التناوب بين خطوات التفكير الموجزة مع استدعاءات الأدوات المستهدفة، ثم تغذية الملاحظات الناتجة في القرارات اللاحقة حتى يتمكن الوكيل من تقديم إجابة نهائية.</p>
<p>وللبناء على هذه البنية المثبتة، تضع LangChain 1.0 حلقة ReAct في صميم بنيتها، مما يجعلها البنية الافتراضية لبناء وكلاء موثوقين وقابلين للتفسير وجاهزين للإنتاج.</p>
<p>ولدعم كل شيء بدءًا من الوكلاء البسيطين إلى عمليات التنسيق المعقدة، يتبنى LangChain 1.0 تصميمًا متعدد الطبقات يجمع بين سهولة الاستخدام والتحكم الدقيق:</p>
<ul>
<li><p><strong>السيناريوهات القياسية:</strong> ابدأ بالدالة create_agent() - وهي حلقة ReAct نظيفة وموحدة تتعامل مع الاستدعاءات المنطقية واستدعاءات الأدوات خارج الصندوق.</p></li>
<li><p><strong>سيناريوهات موسعة:</strong> أضف البرمجيات الوسيطة للحصول على تحكم دقيق. تسمح لك البرمجيات الوسيطة بفحص أو تعديل ما يحدث داخل الوكيل - على سبيل المثال، إضافة اكتشاف معلومات تحديد الهوية الشخصية أو نقاط التحقق من الموافقة البشرية أو إعادة المحاولة التلقائية أو خطافات المراقبة.</p></li>
<li><p><strong>سيناريوهات معقدة:</strong> بالنسبة لتدفقات العمل ذات الحالة أو التنسيق متعدد العوامل، استخدم LangGraph، وهو محرك تنفيذ قائم على الرسم البياني يوفر تحكمًا دقيقًا في التدفق المنطقي والتبعيات وحالات التنفيذ.</p></li>
</ul>
<p>والآن دعونا نفصل المكونات الرئيسية الثلاثة التي تجعل تطوير الوكيل أبسط وأكثر أمانًا واتساقًا عبر النماذج.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. إنشاء_الوكيل(): طريقة أبسط لبناء الوكلاء</h3><p>أحد الإنجازات الرئيسية في LangChain 1.0 هو كيفية تقليل تعقيد بناء الوكلاء إلى دالة واحدة - create_agent(). لم تعد بحاجة إلى التعامل يدويًا مع إدارة الحالة أو معالجة الأخطاء أو تدفق المخرجات. هذه الميزات على مستوى الإنتاج تُدار الآن تلقائيًا بواسطة وقت تشغيل LangGraph الموجود تحتها.</p>
<p>بثلاث معلمات فقط، يمكنك تشغيل وكيل يعمل بكامل طاقته:</p>
<ul>
<li><p><strong>النموذج</strong> - إما مُعرِّف نموذج (سلسلة) أو كائن نموذج مُثبَّت.</p></li>
<li><p><strong>الأدوات</strong> - قائمة بالوظائف التي تمنح الوكيل قدراته.</p></li>
<li><p><strong>system_prompt</strong> - التعليمات التي تحدد دور الوكيل ونبرته وسلوكه.</p></li>
</ul>
<p>تحت الغطاء، تعمل عملية إنشاء_وكيل() على حلقة الوكيل القياسية - استدعاء نموذج، والسماح له باختيار الأدوات للتنفيذ، والانتهاء بمجرد عدم الحاجة إلى المزيد من الأدوات:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>كما أنه يرث أيضًا قدرات LangGraph المدمجة لاستمرارية الحالة واستعادة الانقطاع والتدفق. المهام التي كانت تستغرق مئات الأسطر من التعليمات البرمجية للتنسيق يتم التعامل معها الآن من خلال واجهة برمجة تطبيقات واحدة توضيحية.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. البرمجيات الوسيطة: طبقة قابلة للتركيب للتحكم الجاهز للإنتاج</h3><p>البرمجيات الوسيطة هي الجسر الرئيسي الذي ينقل LangChain من النموذج الأولي إلى الإنتاج. وهي تعرض خطافات في نقاط استراتيجية في حلقة تنفيذ الوكيل، مما يسمح لك بإضافة منطق مخصص دون إعادة كتابة عملية ReAct الأساسية.</p>
<p>تتبع الحلقة الرئيسية للوكيل عملية قرار من ثلاث خطوات - النموذج ← الأداة ← الإنهاء:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يوفر LangChain 1.0 بعض <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">البرامج الوسيطة المعدة مسبقًا</a> للأنماط الشائعة. فيما يلي أربعة أمثلة.</p>
<ul>
<li><strong>كشف PII: أي تطبيق يتعامل مع بيانات المستخدم الحساسة</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>التلخيص: تلخيص سجل المحادثة تلقائيًا عند الاقتراب من حدود الرمز المميز.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>إعادة محاولة الأداة: إعادة محاولة مكالمات الأداة الفاشلة تلقائياً مع إمكانية تكوينها بشكل أسي قابل للتكوين.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>البرمجيات الوسيطة المخصصة</strong></li>
</ul>
<p>بالإضافة إلى خيارات البرمجيات الوسيطة الرسمية مسبقة الإنشاء، يمكنك أيضًا إنشاء برمجيات وسيطة مخصصة باستخدام طريقة قائمة على الديكور أو طريقة قائمة على الفئة.</p>
<p>على سبيل المثال، يوضح المقتطف أدناه كيفية تسجيل استدعاءات النموذج قبل التنفيذ:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. الإخراج المهيكل: طريقة موحدة للتعامل مع البيانات</h3><p>في تطوير الوكيل التقليدي، لطالما كان من الصعب إدارة المخرجات المهيكلة. كل مزود نموذج يتعامل معه بشكل مختلف - على سبيل المثال، يقدم OpenAI واجهة برمجة تطبيقات أصلية للإخراج المنظم، بينما يدعم الآخرون الاستجابات المنظمة بشكل غير مباشر من خلال استدعاءات الأدوات. هذا يعني في كثير من الأحيان كتابة محولات مخصصة لكل مزود، مما يضيف عملًا إضافيًا ويجعل الصيانة أكثر صعوبة مما ينبغي.</p>
<p>في LangChain 1.0، يتم التعامل مع الإخراج المهيكل مباشرةً من خلال معلمة_تنسيق_الاستجابة في create_agent().  تحتاج فقط إلى تحديد مخطط بياناتك مرة واحدة. تقوم LangChain تلقائيًا باختيار أفضل استراتيجية تنفيذ تلقائيًا بناءً على النموذج الذي تستخدمه - لا حاجة إلى إعداد إضافي أو رمز خاص بالبائع.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>تدعم LangChain استراتيجيتين للإخراج المنظم:</p>
<p><strong>1. استراتيجية الموفر:</strong> يدعم بعض مزودي النماذج الإخراج المنظم أصلاً من خلال واجهات برمجة التطبيقات الخاصة بهم (مثل OpenAI و Grok). عندما يتوفر مثل هذا الدعم، تستخدم LangChain تطبيق المخطط المدمج الخاص بالمزود مباشرةً. يوفر هذا النهج أعلى مستوى من الموثوقية والاتساق، لأن النموذج نفسه يضمن تنسيق الإخراج.</p>
<p><strong>2. استراتيجية استدعاء الأداة:</strong> بالنسبة للنماذج التي لا تدعم الإخراج المهيكل الأصلي، تستخدم LangChain استراتيجية استدعاء الأداة لتحقيق نفس النتيجة.</p>
<p>لا داعي للقلق بشأن الاستراتيجية المستخدمة - حيث يكتشف إطار العمل قدرات النموذج ويتكيف تلقائيًا. يتيح لك هذا التجريد التبديل بين موفري النماذج المختلفة بحرية دون تغيير منطق عملك.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">كيف يعزز ميلفوس ذاكرة الوكيل<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>بالنسبة للوكلاء على مستوى الإنتاج، لا يكون عنق الزجاجة الحقيقي في الأداء في كثير من الأحيان هو محرك التفكير - بل نظام الذاكرة. في LangChain 1.0، تعمل قواعد البيانات المتجهة في نظام LangChain 1.0 بمثابة ذاكرة خارجية للوكيل، مما يوفر استدعاءً طويل المدى من خلال الاسترجاع الدلالي.</p>
<p>تُعد<a href="https://milvus.io/">Milvus</a> واحدة من أكثر قواعد البيانات المتجهة مفتوحة المصدر المتاحة اليوم نضجًا، وهي مصممة خصيصًا للبحث المتجه على نطاق واسع في تطبيقات الذكاء الاصطناعي. وهي تتكامل بشكل أصلي مع LangChain، لذا لن تضطر إلى التعامل يدويًا مع عملية تحويل المتجهات أو إدارة الفهرس أو البحث عن التشابه. تقوم حزمة langchain_milvus بتغليف Milvus كواجهة VectorStore قياسية، مما يسمح لك بتوصيلها بالوكلاء الخاصين بك ببضعة أسطر من التعليمات البرمجية.</p>
<p>من خلال القيام بذلك، يعالج Milvus ثلاثة تحديات رئيسية في بناء أنظمة ذاكرة وكلاء قابلة للتطوير وموثوقة:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. الاسترجاع السريع من قواعد المعرفة الضخمة</strong></h4><p>عندما يحتاج الوكيل إلى معالجة الآلاف من المستندات أو المحادثات السابقة أو كتيبات المنتجات، فإن البحث البسيط عن الكلمات الرئيسية لا يكفي. يستخدم Milvus البحث عن التشابه المتجه للعثور على المعلومات ذات الصلة الدلالية في أجزاء من الثانية - حتى لو كان الاستعلام يستخدم صياغة مختلفة. وهذا يسمح لوكيلك باستدعاء المعرفة بناءً على المعنى، وليس فقط التطابق النصي الدقيق.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. الذاكرة المستمرة طويلة المدى</strong></h4><p>يمكن لبرنامج LangChain's SummarizationMiddleware الخاص بـ LangChain تلخيص تاريخ المحادثة عندما يطول كثيرًا، ولكن ماذا يحدث لجميع التفاصيل التي يتم تلخيصها؟ يحتفظ بها ميلفوس. يمكن تلخيص كل محادثة ومكالمة أداة وخطوة تفكير وتخزينها للرجوع إليها على المدى الطويل. عند الحاجة، يمكن للوكيل استرجاع الذكريات ذات الصلة بسرعة من خلال البحث الدلالي، مما يتيح الاستمرارية الحقيقية عبر الجلسات.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. الإدارة الموحدة للمحتوى متعدد الوسائط</strong></h4><p>يتعامل الوكلاء الحديثون مع أكثر من مجرد نصوص - فهم يتفاعلون مع الصور والصوت والفيديو. يدعم Milvus التخزين متعدد النواقل والمخطط الديناميكي، مما يسمح لك بإدارة التضمينات من طرائق متعددة في نظام واحد. يوفر هذا أساسًا موحدًا للذاكرة للوكلاء متعددي الوسائط، مما يتيح استرجاعًا متسقًا عبر أنواع مختلفة من البيانات.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain مقابل LangGraph: كيفية اختيار النظام الذي يناسب وكلاءك<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>تُعد الترقية إلى الإصدار 1.0 من LangChain خطوة أساسية نحو بناء وكلاء على مستوى الإنتاج - ولكن هذا لا يعني أنه الخيار الوحيد أو الأفضل دائمًا لكل حالة استخدام. يحدد اختيار إطار العمل المناسب مدى سرعة دمج هذه الإمكانيات في نظام عامل وقابل للصيانة.</p>
<p>في الواقع، يمكن النظر إلى LangChain 1.0 وLangGraph 1.0 كجزء من نفس المكدس متعدد الطبقات، مصممين للعمل معًا بدلًا من استبدال أحدهما الآخر: يساعدك LangChain على بناء وكلاء قياسيين بسرعة، بينما يمنحك LangGraph تحكمًا دقيقًا في سير العمل المعقد. بعبارة أخرى، يساعدك LangChain على التحرك بسرعة، بينما يساعدك LangGraph على التعمق.</p>
<p>فيما يلي مقارنة سريعة لكيفية اختلافهما في التموضع التقني:</p>
<table>
<thead>
<tr><th><strong>البعد</strong></th><th><strong>سلسلة اللغات 1.0</strong></th><th><strong>سلسلة اللغات 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>مستوى التجريد</strong></td><td>تجريد عالي المستوى، مصمم لسيناريوهات الوكيل القياسية</td><td>إطار عمل تزامن منخفض المستوى، مصمم لسير العمل المعقد</td></tr>
<tr><td><strong>القدرة الأساسية</strong></td><td>حلقة ReAct القياسية (السبب ← استدعاء الأداة ← المراقبة ← الاستجابة)</td><td>آلات الحالة المخصصة ومنطق التفرع المعقد (مخطط الحالة + التوجيه الشرطي)</td></tr>
<tr><td><strong>آلية التمديد</strong></td><td>البرمجيات الوسيطة للقدرات على مستوى الإنتاج</td><td>الإدارة اليدوية للعقد، والحواف، وانتقالات الحالة</td></tr>
<tr><td><strong>التنفيذ الأساسي</strong></td><td>الإدارة اليدوية للعقد والحواف وانتقالات الحالة</td><td>وقت تشغيل أصلي مع مثابرة واسترداد مدمجة</td></tr>
<tr><td><strong>حالات الاستخدام النموذجية</strong></td><td>80% من سيناريوهات الوكيل القياسية</td><td>التعاون متعدد الوكلاء وتنسيق سير العمل طويل الأمد</td></tr>
<tr><td><strong>منحنى التعلم</strong></td><td>بناء وكيل في حوالي 10 أسطر من التعليمات البرمجية</td><td>يتطلب فهم المخططات البيانية للحالة وتنسيق العقدة</td></tr>
</tbody>
</table>
<p>إذا كنت جديدًا في بناء الوكلاء أو ترغب في إنشاء مشروع وتشغيله بسرعة، ابدأ باستخدام LangChain. أما إذا كنت تعرف بالفعل أن حالة استخدامك تتطلب تزامنًا معقدًا أو تعاونًا متعدد الوكلاء أو سير عمل طويل الأمد، فانتقل مباشرةً إلى LangGraph.</p>
<p>يمكن أن يتعايش كلا الإطارين في نفس المشروع - يمكنك البدء باستخدام LangChain بشكل بسيط ثم استخدام LangGraph عندما يحتاج نظامك إلى مزيد من التحكم والمرونة. المفتاح هو اختيار الأداة المناسبة لكل جزء من سير عملك.</p>
<h2 id="Conclusion" class="common-anchor-header">الخلاصة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل ثلاث سنوات، بدأت LangChain قبل ثلاث سنوات كغلاف خفيف الوزن لاستدعاء LLMs. أما اليوم، فقد تطورت لتصبح إطار عمل متكامل على مستوى الإنتاج.</p>
<p>في الأساس، توفر طبقات البرمجيات الوسيطة السلامة والامتثال وإمكانية المراقبة. ويضيف LangGraph التنفيذ المستمر، وتدفق التحكم، وإدارة الحالة. وفي طبقة الذاكرة، يسدّ <a href="https://milvus.io/">ميلفوس</a> فجوة حرجة - توفير ذاكرة طويلة الأجل قابلة للتطوير وموثوقة تسمح للوكلاء باسترجاع السياق والاستدلال على التاريخ والتحسين بمرور الوقت.</p>
<p>وتشكل كل من LangChain وLangGraph وMilvus معًا سلسلة أدوات عملية لعصر الوكلاء الحديث - تربط بين النماذج الأولية السريعة والنشر على نطاق المؤسسة، دون التضحية بالموثوقية أو الأداء.</p>
<p>🚀 هل أنت مستعد لمنح وكيلك ذاكرة موثوقة طويلة الأمد؟ استكشف <a href="https://milvus.io">Milvus</a> وشاهد كيف يعمل على تشغيل ذاكرة ذكية طويلة المدى لوكلاء LangChain في الإنتاج.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">قناة Discord</a> الخاصة بنا أو قم بتسجيل المشكلات على <a href="https://github.com/milvus-io/milvus">GitHub</a>. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات لأسئلتك من خلال <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a>.</p>
