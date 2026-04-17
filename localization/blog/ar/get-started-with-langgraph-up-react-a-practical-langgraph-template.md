---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'الشروع في استخدام قالب لانجغراف-أعلى-التفاعل: قالب لانجغراف عملي لانجغراف'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  تقديم قالب langgraph-up-react، وهو قالب جاهز للاستخدام LangGraph + ReAct
  لوكلاء ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>أصبح وكلاء الذكاء الاصطناعي نمطًا أساسيًا في الذكاء الاصطناعي التطبيقي. حيث تتخطى المزيد من المشاريع المطالبات الفردية ونماذج الأسلاك إلى حلقات صنع القرار. هذا أمر مثير، ولكنه يعني أيضًا إدارة الحالة وتنسيق الأدوات والتعامل مع الفروع وإضافة عمليات تسليم بشرية - وهي أمور ليست واضحة على الفور.</p>
<p>يعد<a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> خيارًا قويًا لهذه الطبقة. إنه إطار ذكاء اصطناعي يوفر الحلقات، والمشروطيات، والمثابرة، وعناصر التحكم البشرية في الحلقة، والبث - وهي بنية كافية لتحويل الفكرة إلى تطبيق حقيقي متعدد العوامل. ومع ذلك، فإن LangGraph لديه منحنى تعليمي حاد. تتحرك وثائقه بسرعة، وتستغرق التجريدات وقتًا للتعود عليها، وقد يكون الانتقال من عرض توضيحي بسيط إلى شيء يبدو كمنتج محبطًا.</p>
<p>لقد بدأت مؤخرًا باستخدام <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react - وهو</strong></a>قالب جاهز للاستخدام LangGraph + ReAct لوكلاء ReAct. إنه يقلل من الإعداد، ويأتي مع إعدادات افتراضية عاقلة، ويتيح لك التركيز على السلوك بدلاً من القوالب النمطية. في هذا المنشور، سأستعرض في هذا المقال كيفية البدء باستخدام LangGraph باستخدام هذا القالب.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">فهم وكلاء ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>قبل الغوص في القالب نفسه، يجدر بنا النظر إلى نوع الوكيل الذي سنقوم ببنائه. أحد الأنماط الأكثر شيوعًا اليوم هو إطار عمل <strong>ReAct (ReAct) (Reason + Act)</strong> ، والذي تم تقديمه لأول مرة في ورقة جوجل لعام 2022 <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: تآزر الاستدلال والتصرف في النماذج اللغوية.</em></a><em>"</em></p>
<p>الفكرة واضحة ومباشرة: بدلاً من التعامل مع التفكير والتصرف بشكل منفصل، يجمع ReAct بينهما في حلقة تغذية راجعة تشبه إلى حد كبير حل المشكلات البشرية. حيث يقوم الوكيل <strong>بالتفكير</strong> في المشكلة، <strong>ويتصرف</strong> من خلال استدعاء أداة أو واجهة برمجة التطبيقات، ثم <strong>يراقب</strong> النتيجة قبل أن يقرر ما يجب فعله بعد ذلك. هذه الدورة البسيطة - التفكير ← التصرف ← الملاحظة - تتيح للوكلاء التكيف ديناميكيًا بدلًا من اتباع نص ثابت.</p>
<p>إليك كيف تتوافق الأجزاء مع بعضها البعض:</p>
<ul>
<li><p><strong>السبب</strong>: يقسم النموذج المشاكل إلى خطوات، ويخطط للاستراتيجيات، ويمكنه حتى تصحيح الأخطاء في منتصف الطريق.</p></li>
<li><p><strong>التصرف</strong>: استنادًا إلى منطقه، يستدعي الوكيل الأدوات - سواء كان ذلك محرك بحث أو آلة حاسبة أو واجهة برمجة تطبيقات مخصصة.</p></li>
<li><p><strong>الملاحظة</strong>: ينظر الوكيل إلى مخرجات الأداة، ويقوم بتصفية النتائج، ثم يعيد تغذية ذلك في الجولة التالية من التفكير.</p></li>
</ul>
<p>أصبحت هذه الحلقة بسرعة العمود الفقري لوكلاء الذكاء الاصطناعي الحديث. سترى آثارًا لها في إضافات ChatGPT، وخطوط أنابيب RAG، والمساعدين الأذكياء، وحتى الروبوتات. في حالتنا، إنها الأساس الذي يبني عليه قالب <code translate="no">langgraph-up-react</code>.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">فهم لانجغراف<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن بعد أن ألقينا نظرة على نمط ReAct، السؤال التالي هو: كيف يمكنك تنفيذ شيء من هذا القبيل عملياً؟ خارج الصندوق، معظم النماذج اللغوية لا تتعامل مع التفكير متعدد الخطوات بشكل جيد. كل استدعاء يكون عديم الحالة: يولد النموذج إجابة وينسى كل شيء بمجرد الانتهاء منه. وهذا يجعل من الصعب نقل النتائج الوسيطة إلى الأمام أو تعديل الخطوات اللاحقة بناءً على الخطوات السابقة.</p>
<p>يغلق<a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> هذه الفجوة. فبدلاً من التعامل مع كل مطالبة على أنها لمرة واحدة، يمنحك طريقة لتقسيم المهام المعقدة إلى خطوات، وتذكر ما حدث في كل نقطة، وتحديد ما يجب القيام به بعد ذلك بناءً على الحالة الحالية. بعبارة أخرى، يحول عملية التفكير لدى الوكيل إلى شيء منظم وقابل للتكرار، بدلًا من سلسلة من المطالبات المخصصة.</p>
<p>يمكنك التفكير في الأمر على أنه <strong>مخطط انسيابي لتفكير الذكاء الاصطناعي</strong>:</p>
<ul>
<li><p><strong>تحليل</strong> استعلام المستخدم</p></li>
<li><p><strong>تحديد</strong> الأداة المناسبة للمهمة</p></li>
<li><p><strong>تنفيذ</strong> المهمة عن طريق استدعاء الأداة</p></li>
<li><p><strong>معالجة</strong> النتائج</p></li>
<li><p><strong>تحقق</strong> مما إذا كانت المهمة قد اكتملت؛ وإذا لم تكتمل، فقم بالتكرار ومتابعة التفكير</p></li>
<li><p><strong>إخراج</strong> الإجابة النهائية</p></li>
</ul>
<p>على طول الطريق، يتعامل LangGraph مع <strong>تخزين الذاكرة</strong> حتى لا تضيع نتائج الخطوات السابقة، ويتكامل مع <strong>مكتبة أدوات خارجية</strong> (واجهات برمجة التطبيقات، وقواعد البيانات، والبحث، والآلات الحاسبة، وأنظمة الملفات، إلخ).</p>
<p>لهذا السبب يُطلق عليه اسم <em>LangGraph</em>: <strong>لانج (لغة) + رسم بياني - وهو</strong>إطار عمل لتنظيم كيفية تفكير النماذج اللغوية وتفاعلها مع مرور الوقت.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">فهم رد فعل لانجغراف-أعلى-لغة<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>إن LangGraph قوي، لكنه يأتي مع نفقات زائدة. فإعداد إدارة الحالة، وتصميم العقد والحواف، والتعامل مع الأخطاء، وتوصيل الأسلاك في النماذج والأدوات، كلها أمور تستغرق وقتًا. قد يكون تصحيح التدفقات متعددة الخطوات مؤلمًا أيضًا - عندما ينكسر شيء ما، قد تكون المشكلة في أي عقدة أو انتقال. مع نمو المشاريع، حتى التغييرات الصغيرة يمكن أن تنتشر عبر قاعدة الكود وتبطئ كل شيء.</p>
<p>هنا يحدث القالب الناضج فرقًا كبيرًا. فبدلًا من البدء من الصفر، يمنحك القالب بنية مثبتة وأدوات مبنية مسبقًا ونصوص برمجية تعمل فقط. يمكنك تخطي القوالب النمطية والتركيز مباشرةً على منطق الوكيل.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> هو أحد هذه القوالب. إنه مصمم لمساعدتك على تشغيل وكيل LangGraph ReAct بسرعة، مع:</p>
<ul>
<li><p>🔧 <strong>نظام الأدوات المدمج</strong>: محولات وأدوات مساعدة جاهزة للاستخدام خارج الصندوق</p></li>
<li><p>⚡ <strong>بداية سريعة</strong>: تكوين بسيط ووكيل يعمل في دقائق</p></li>
<li><p>🧪 <strong>اختبار مضمن</strong>: اختبارات الوحدة واختبارات التكامل للثقة أثناء التوسيع</p></li>
<li><p>📦 <strong>إعداد جاهز للإنتاج</strong>: أنماط بنية ونصوص برمجية توفر الوقت عند النشر</p></li>
</ul>
<p>باختصار، إنه يعتني بالقوالب النمطية حتى تتمكن من التركيز على بناء الوكلاء الذين يحلون بالفعل مشاكل عملك.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">الشروع في استخدام قالب langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>بدء تشغيل القالب أمر بسيط ومباشر. إليك عملية الإعداد خطوة بخطوة:</p>
<ol>
<li>تثبيت تبعيات البيئة</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>استنساخ المشروع</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>تثبيت التبعيات</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>تهيئة البيئة</li>
</ol>
<p>انسخ مثال التهيئة وأضف مفاتيحك:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>قم بتحرير .env وقم بتعيين موفر نموذج واحد على الأقل بالإضافة إلى مفتاح Tavily API الخاص بك:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>ابدأ المشروع</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>سيكون خادم التطوير الخاص بك الآن جاهزًا للاختبار.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">ما الذي يمكنك بناءه باستخدام langgraph-up-react؟<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>إذًا ما الذي يمكنك فعله فعليًا بمجرد تشغيل القالب؟ إليك مثالين ملموسين يوضحان كيف يمكن تطبيقه في مشاريع حقيقية.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">قاعدة المعارف المؤسسية للأسئلة والأجوبة (Agentic RAG)</h3><p>إحدى حالات الاستخدام الشائعة هي مساعد الأسئلة والأجوبة الداخلي لمعارف الشركة. فكر في كتيبات المنتجات، والمستندات التقنية، والأسئلة الشائعة - معلومات مفيدة ولكنها مبعثرة. باستخدام <code translate="no">langgraph-up-react</code> ، يمكنك إنشاء وكيل يقوم بفهرسة هذه المستندات في قاعدة بيانات <a href="https://milvus.io/"><strong>Milvus</strong></a> vector، واسترداد المقاطع الأكثر صلة، وإنشاء إجابات دقيقة تستند إلى السياق.</p>
<p>للنشر، يوفر Milvus خيارات مرنة: <strong>Lite</strong> للنماذج الأولية السريعة، و <strong>Standalone</strong> لأحمال عمل الإنتاج متوسطة الحجم، و <strong>Distributed</strong> للأنظمة على نطاق المؤسسة. ستحتاج أيضًا إلى ضبط معلمات الفهرس (على سبيل المثال، HNSW) لتحقيق التوازن بين السرعة والدقة، وإعداد مراقبة زمن الوصول والاستدعاء لضمان بقاء النظام موثوقًا تحت الحمل.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">التعاون متعدد الوكلاء</h3><p>حالة استخدام قوية أخرى هي التعاون متعدد الوكلاء. فبدلاً من محاولة وكيل واحد القيام بكل شيء، يمكنك تحديد عدة وكلاء متخصصين يعملون معاً. في سير عمل تطوير البرمجيات، على سبيل المثال، يقوم وكيل مدير المنتج بتحليل المتطلبات، ويقوم وكيل المهندس المعماري بصياغة التصميم، ويقوم وكيل المطور بكتابة التعليمات البرمجية، ويقوم وكيل الاختبار بالتحقق من صحة النتائج.</p>
<p>يسلط هذا التنسيق الضوء على نقاط قوة LangGraph - إدارة الحالة والتفرع والتنسيق بين الوكلاء. سنغطي هذا الإعداد بمزيد من التفصيل في مقالة لاحقة، لكن النقطة الأساسية هي أن <code translate="no">langgraph-up-react</code> يجعل من العملي تجربة هذه الأنماط دون قضاء أسابيع في السقالات.</p>
<h2 id="Conclusion" class="common-anchor-header">الخاتمة<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>إن بناء وكلاء موثوقين لا يتعلق فقط بالمطالبات الذكية - بل يتعلق بهيكلة التفكير، وإدارة الحالة، وربط كل شيء في نظام يمكنك صيانته بالفعل. يمنحك LangGraph إطار العمل للقيام بذلك، ويقلل <code translate="no">langgraph-up-react</code> من العوائق من خلال التعامل مع القوالب النمطية حتى تتمكن من التركيز على سلوك الوكيل.</p>
<p>باستخدام هذا القالب، يمكنك إنشاء مشاريع مثل أنظمة الأسئلة والأجوبة للقاعدة المعرفية أو تدفقات العمل متعددة الوكلاء دون أن تضيع في الإعداد. إنها نقطة بداية توفر الوقت وتتجنب المزالق الشائعة وتجعل تجربة LangGraph أكثر سلاسة.</p>
<p>في المنشور التالي، سأتعمق أكثر في برنامج تعليمي عملي - سأشرح خطوة بخطوة كيفية توسيع القالب وبناء وكيل عامل لحالة استخدام حقيقية باستخدام LangGraph و <code translate="no">langgraph-up-react</code> وقاعدة بيانات Milvus vector. ترقبوا ذلك.</p>
