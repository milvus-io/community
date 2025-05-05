---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >-
  برنامج تعليمي عملي: إنشاء مساعد مستندات مدعوم من RAG في 10 دقائق باستخدام Dify
  و Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  تعرّف على كيفية إنشاء مساعد مستندات مدعوم بالذكاء الاصطناعي باستخدام التوليد
  المعزز للاسترجاع (RAG) مع Dify وMilvus في هذا البرنامج التعليمي العملي السريع
  للمطورين.
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ماذا لو كان بإمكانك تحويل مكتبة التوثيق بأكملها - آلاف الصفحات من المواصفات الفنية ومواقع الويكي الداخلية ووثائق التعليمات البرمجية - إلى مساعد ذكاء اصطناعي ذكي يجيب على أسئلة محددة على الفور؟</p>
<p>والأفضل من ذلك، ماذا لو كان بإمكانك بناء ذلك في وقت أقل مما يستغرقه إصلاح تعارض الدمج؟</p>
<p>هذا هو وعد <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">الجيل المعزز للاسترجاع</a> (RAG) عند تنفيذه بالطريقة الصحيحة.</p>
<p>على الرغم من أن ChatGPT وغيرها من أدوات التوليد المعزز للاسترجاع مثيرة للإعجاب، إلا أنها سرعان ما تصل إلى حدودها عندما تُسأل عن وثائق شركتك أو قاعدة الرموز أو قاعدة المعرفة الخاصة بشركتك. تعمل RAG على سد هذه الفجوة من خلال دمج بياناتك الخاصة في المحادثة، مما يوفر لك قدرات الذكاء الاصطناعي ذات الصلة المباشرة بعملك.</p>
<p>ما المشكلة؟ يبدو تنفيذ RAG التقليدي على هذا النحو:</p>
<ul>
<li><p>كتابة خطوط أنابيب توليد تضمين مخصصة</p></li>
<li><p>تكوين قاعدة بيانات متجهة ونشرها</p></li>
<li><p>تصميم قوالب مطالبة معقدة</p></li>
<li><p>إنشاء منطق الاسترجاع وعتبات التشابه</p></li>
<li><p>إنشاء واجهة قابلة للاستخدام</p></li>
</ul>
<p>ولكن ماذا لو كان بإمكانك التخطي مباشرةً إلى النتائج؟</p>
<p>في هذا البرنامج التعليمي، سنقوم ببناء تطبيق RAG بسيط باستخدام أداتين تركزان على المطورين:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: منصة مفتوحة المصدر تتعامل مع تنسيق RAG بأقل قدر من التهيئة</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">ميلفوس</a>: قاعدة بيانات متجهية مفتوحة المصدر ومفتوحة المصدر سريعة جداً مصممة خصيصاً للبحث عن التشابه وعمليات البحث بالذكاء الاصطناعي</p></li>
</ul>
<p>بحلول نهاية هذا الدليل الذي يستغرق 10 دقائق، سيكون لديك مساعد ذكاء اصطناعي فعال يمكنه الإجابة عن أسئلة مفصلة حول أي مجموعة مستندات تطرحها عليه - دون الحاجة إلى شهادة في التعلم الآلي.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">ما ستقوم ببنائه<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>في بضع دقائق فقط من العمل النشط، سوف تنشئ</p>
<ul>
<li><p>خط معالجة المستندات الذي يحول أي ملف PDF إلى معرفة قابلة للاستعلام عنها</p></li>
<li><p>نظام بحث متجه يعثر على المعلومات الصحيحة بالضبط</p></li>
<li><p>واجهة محادثة آلية تجيب على الأسئلة التقنية بدقة متناهية</p></li>
<li><p>حل قابل للنشر يمكنك دمجه مع أدواتك الحالية</p></li>
</ul>
<p>الجزء الأفضل؟ يتم تكوين معظمها من خلال واجهة مستخدم بسيطة (UI) بدلاً من التعليمات البرمجية المخصصة.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">ما ستحتاج إليه<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>معرفة أساسية ب Docker (مستوى <code translate="no">docker-compose up -d</code> فقط)</p></li>
<li><p>مفتاح OpenAI API</p></li>
<li><p>مستند PDF لتجربته (سنستخدم ورقة بحثية)</p></li>
</ul>
<p>هل أنت مستعد لبناء شيء مفيد بالفعل في وقت قياسي؟ لنبدأ!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">بناء تطبيق RAG الخاص بك باستخدام Milvus وDify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>في هذا القسم، سنقوم ببناء تطبيق RAG بسيط باستخدام Dify، حيث يمكننا طرح أسئلة حول المعلومات الواردة في ورقة بحثية. بالنسبة للورقة البحثية، يمكنك استخدام أي ورقة بحثية تريدها؛ ولكن في هذه الحالة، سنستخدم الورقة البحثية الشهيرة التي عرّفتنا على بنية المحول &quot;<a href="https://arxiv.org/abs/1706.03762">الانتباه هو كل ما تحتاجه</a>&quot;.</p>
<p>سنستخدم "ميلفوس" كمخزن متجه لدينا، حيث سنقوم بتخزين جميع السياقات الضرورية. بالنسبة لنموذج التضمين و LLM، سنستخدم نماذج من OpenAI. لذلك، نحتاج إلى إعداد مفتاح OpenAI API أولاً. يمكنك معرفة المزيد حول إعداده<a href="https://platform.openai.com/docs/quickstart"> هنا</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">الخطوة 1: بدء تشغيل حاويات ديفي وميلفوس</h3><p>في هذا المثال، سنقوم باستضافة Dify ذاتيًا باستخدام Docker Compose. لذلك، قبل أن نبدأ، تأكد من تثبيت Docker على جهازك المحلي. إذا لم تقم بذلك، فقم بتثبيت Docker بالرجوع إلى<a href="https://docs.docker.com/desktop/"> صفحة التثبيت الخاصة به</a>.</p>
<p>بمجرد تثبيت Docker، نحتاج إلى استنساخ كود مصدر Dify في جهازنا المحلي باستخدام الأمر التالي:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>بعد ذلك، انتقل إلى الدليل <code translate="no">docker</code> داخل الكود المصدري الذي قمت باستنساخه للتو. هناك، تحتاج إلى نسخ الملف <code translate="no">.env</code> باستخدام الأمر التالي:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>باختصار، يحتوي ملف <code translate="no">.env</code> على التكوينات اللازمة لإعداد تطبيق Dify وتشغيله، مثل اختيار قواعد بيانات المتجهات، وبيانات الاعتماد اللازمة للوصول إلى قاعدة بيانات المتجهات، وعنوان تطبيق Dify الخاص بك، وما إلى ذلك.</p>
<p>بما أننا سنستخدم ملف Milvus كقاعدة بيانات المتجهات الخاصة بنا، فنحن بحاجة إلى تغيير قيمة المتغير <code translate="no">VECTOR_STORE</code> داخل ملف <code translate="no">.env</code> إلى <code translate="no">milvus</code>. نحتاج أيضًا إلى تغيير المتغير <code translate="no">MILVUS_URI</code> إلى <code translate="no">http://host.docker.internal:19530</code> لضمان عدم وجود مشكلة في الاتصال بين حاويات Docker لاحقًا بعد النشر.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>نحن الآن جاهزون لبدء تشغيل حاويات Docker. للقيام بذلك، كل ما علينا فعله هو تشغيل الأمر <code translate="no">docker compose up -d</code>. بعد انتهائه، سترى مخرجات مماثلة في جهازك الطرفي كما هو موضح أدناه:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكننا التحقق من حالة جميع الحاويات ومعرفة ما إذا كانت تعمل بشكل صحي باستخدام الأمر <code translate="no">docker compose ps</code>. إذا كانت جميعها سليمة، سترى مخرجات كما هو موضح أدناه:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>وأخيرًا، إذا توجهنا إلى<a href="http://localhost/install"> </a>http://localhost/install، سترى صفحة Dify المقصودة حيث يمكننا التسجيل والبدء في بناء تطبيق RAG الخاص بنا في أي وقت من الأوقات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد التسجيل، يمكنك بعد ذلك تسجيل الدخول إلى Dify باستخدام بيانات الاعتماد الخاصة بك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">الخطوة 2: إعداد مفتاح OpenAI API Key</h3><p>أول شيء نحتاج إلى القيام به بعد التسجيل في Dify هو إعداد مفاتيح واجهة برمجة التطبيقات التي سنستخدمها لاستدعاء نموذج التضمين بالإضافة إلى LLM. نظرًا لأننا سنستخدم نماذج من OpenAI، نحتاج إلى إدراج مفتاح OpenAI API الخاص بنا في ملفنا الشخصي. للقيام بذلك، انتقل إلى "الإعدادات" عن طريق تمرير المؤشر فوق ملفك الشخصي في أعلى يمين واجهة المستخدم، كما ترى في لقطة الشاشة أدناه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بعد ذلك، انتقل إلى "موفر النموذج"، ومرر المؤشر على OpenAI، ثم انقر على "إعداد". سترى بعد ذلك شاشة منبثقة حيث سيُطلب منك إدخال مفتاح OpenAI API الخاص بك. بمجرد الانتهاء، سنكون جاهزين لاستخدام النماذج من OpenAI كنموذج التضمين و LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">الخطوة 3: إدراج المستندات في قاعدة المعرفة</h3><p>الآن دعنا نخزن القاعدة المعرفية لتطبيق RAG الخاص بنا. تتكون القاعدة المعرفية من مجموعة من المستندات أو النصوص الداخلية التي يمكن استخدامها كسياقات ذات صلة لمساعدة LLM على توليد استجابات أكثر دقة.</p>
<p>في حالة الاستخدام الخاصة بنا، فإن قاعدتنا المعرفية هي في الأساس ورقة "الانتباه هو كل ما تحتاجه". ومع ذلك، لا يمكننا تخزين الورقة كما هي لأسباب متعددة. أولاً، الورقة طويلة جدًا، وإعطاء سياق طويل جدًا لـ LLM لن يساعد لأن السياق واسع جدًا. ثانيًا، لا يمكننا إجراء عمليات بحث عن التشابه لجلب السياق الأكثر صلة إذا كانت المدخلات عبارة عن نص خام.</p>
<p>لذلك، هناك خطوتان على الأقل نحتاج إلى القيام بهما قبل تخزين ورقتنا في قاعدة المعرفة. أولاً، نحتاج أولاً إلى تقسيم الورقة إلى أجزاء نصية، ثم تحويل كل جزء إلى تضمين عبر نموذج تضمين. أخيرًا، يمكننا تخزين هذه التضمينات في ميلفوس كقاعدة بيانات متجهة.</p>
<p>يجعل Dify من السهل علينا تقسيم النصوص في الورقة البحثية إلى أجزاء وتحويلها إلى تضمينات. كل ما علينا فعله هو تحميل ملف PDF الخاص بالورقة، وتعيين طول القطعة، واختيار نموذج التضمين عبر شريط تمرير. للقيام بكل هذه الخطوات، انتقل إلى &quot;المعرفة&quot; ثم انقر على &quot;إنشاء معرفة&quot;. بعد ذلك، سيُطلب منك تحميل ملف PDF من حاسوبك المحلي. لذلك، من الأفضل أن تقوم بتحميل الورقة البحثية من ArXiv وحفظها على حاسوبك أولاً.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بمجرد تحميل الملف، يمكننا ضبط طول القطعة، وطريقة الفهرسة، ونموذج التضمين الذي نريد استخدامه، وإعدادات الاسترجاع.</p>
<p>في منطقة "إعدادات القطع"، يمكنك اختيار أي رقم كحد أقصى لطول القطعة (في حالة استخدامنا، سنضبطه على 100). بعد ذلك، بالنسبة لـ "طريقة الفهرسة"، نحتاج إلى اختيار خيار "جودة عالية" لأنه سيمكننا من إجراء عمليات بحث عن التشابه للعثور على السياقات ذات الصلة. بالنسبة لخيار "نموذج التضمين"، يمكنك اختيار أي نموذج تضمين من OpenAI الذي تريده، ولكن في هذا المثال، سنستخدم نموذج تضمين النص-تضمين 3-صغير. أخيرًا، بالنسبة لـ "إعداد الاسترجاع"، نحتاج إلى اختيار "بحث المتجهات" لأننا نريد إجراء عمليات بحث عن التشابه للعثور على السياقات الأكثر صلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الآن إذا نقرت على "حفظ ومعالجة" وسار كل شيء على ما يرام، سترى علامة خضراء تظهر كما هو موضح في لقطة الشاشة التالية:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">الخطوة 4: إنشاء تطبيق RAG</h3><p>حتى هذه النقطة، نكون قد نجحنا في إنشاء قاعدة معرفية وتخزينها داخل قاعدة بيانات ميلفوس. نحن الآن جاهزون لإنشاء تطبيق RAG.</p>
<p>إنشاء تطبيق RAG باستخدام Dify بسيط للغاية. نحتاج إلى الانتقال إلى "الاستوديو" بدلاً من "المعرفة" كما في السابق، ثم النقر على "إنشاء من فراغ". بعد ذلك، اختر "Chatbot" كنوع التطبيق، ثم اختر "Chatbot" كنوع التطبيق، وأعطِ اسمًا للتطبيق داخل الحقل المتوفر. بمجرد الانتهاء، انقر على "إنشاء". سترى الآن الصفحة التالية:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تحت حقل "التعليمات"، يمكننا كتابة مطالبة النظام مثل "أجب عن استفسار المستخدم بإيجاز". بعد ذلك، بصفتنا "السياق"، نحتاج إلى النقر على رمز "إضافة"، ثم إضافة القاعدة المعرفية التي أنشأناها للتو. بهذه الطريقة، سيقوم تطبيق RAG الخاص بنا بجلب السياقات الممكنة من هذه القاعدة المعرفية للإجابة على استعلام المستخدم.</p>
<p>الآن بعد أن أضفنا القاعدة المعرفية إلى تطبيق RAG الخاص بنا، فإن آخر شيء نحتاج إلى القيام به هو اختيار LLM من OpenAI. للقيام بذلك، يمكنك النقر على قائمة النماذج المتاحة في الزاوية العلوية اليمنى، كما ترى في لقطة الشاشة أدناه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>والآن نحن جاهزون لنشر تطبيق RAG الخاص بنا! في الزاوية العلوية اليمنى، انقر فوق "نشر"، وهناك يمكنك العثور على العديد من الطرق لنشر تطبيق RAG الخاص بنا: يمكننا ببساطة تشغيله في متصفح، أو تضمينه على موقعنا الإلكتروني، أو الوصول إلى التطبيق عبر واجهة برمجة التطبيقات. في هذا المثال، سنكتفي في هذا المثال بتشغيل تطبيقنا في متصفح، لذا يمكننا النقر على &quot;تشغيل التطبيق&quot;.</p>
<p>وهذا كل شيء! يمكنك الآن طلب أي شيء متعلق بورقة "الانتباه هو كل ما تحتاجه" أو أي مستندات مدرجة في قاعدة معارفنا.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>لقد قمت الآن ببناء تطبيق RAG يعمل باستخدام Dify و Milvus، مع الحد الأدنى من التعليمات البرمجية والتكوين. هذا النهج يجعل بنية RAG المعقدة في متناول المطورين دون الحاجة إلى خبرة عميقة في قواعد البيانات المتجهة أو تكامل LLM. الوجبات الرئيسية. الوجبات الرئيسية:</p>
<ol>
<li><strong>نفقات إعداد منخفضة</strong>: يؤدي استخدام Docker Compose إلى تبسيط عملية النشر</li>
<li><strong>تنسيق بدون كود/كود منخفض</strong>: يتعامل Dify مع معظم خط أنابيب RAG</li>
<li><strong>قاعدة بيانات متجهة جاهزة للإنتاج</strong>: يوفر Milvus تخزين واسترجاع فعال للتضمين</li>
<li><strong>بنية قابلة للتوسيع</strong>: سهولة إضافة المستندات أو تعديل المعلمات لنشر الإنتاج، ضع في اعتبارك:</li>
</ol>
<ul>
<li>إعداد المصادقة للتطبيق الخاص بك</li>
<li>تهيئة التحجيم المناسب لملفوس (خاصة لمجموعات المستندات الأكبر حجماً)</li>
<li>تنفيذ المراقبة لمثيلات Dify و Milvus الخاصة بك</li>
<li>الضبط الدقيق لمعلمات الاسترجاع للحصول على الأداء الأمثل يتيح الجمع بين Dify و Milvus التطوير السريع لتطبيقات RAG التي يمكنها الاستفادة بشكل فعال من المعرفة الداخلية لمؤسستك مع نماذج اللغات الكبيرة الحديثة (LLMs). بناء سعيد!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">موارد إضافية<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">وثائق Dify</a></li>
<li><a href="https://milvus.io/docs">وثائق ملفوس</a></li>
<li><a href="https://zilliz.com/learn/vector-database">أساسيات قاعدة بيانات المتجهات</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">أنماط تنفيذ RAG</a></li>
</ul>
