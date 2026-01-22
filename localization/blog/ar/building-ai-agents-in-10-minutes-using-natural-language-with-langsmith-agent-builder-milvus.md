---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  بناء وكلاء ذكاء اصطناعي في 10 دقائق باستخدام اللغة الطبيعية مع منشئ وكلاء
  لانجسميث + ميلفوس
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  تعلّم كيفية بناء وكلاء الذكاء الاصطناعي الممكّنين للذاكرة في دقائق باستخدام
  LangSmith Agent Builder و Milvus - بدون كود برمجي ولغة طبيعية وجاهز للإنتاج.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>مع تسارع وتيرة تطوير الذكاء الاصطناعي، تكتشف المزيد من الفرق أن بناء مساعد ذكاء اصطناعي لا يتطلب بالضرورة خلفية في هندسة البرمجيات. فغالباً ما يعرف الأشخاص الذين يحتاجون إلى المساعدين أكثر من غيرهم - فرق المنتجات والعمليات والدعم والباحثين - ما يجب أن يفعله الوكيل بالضبط، ولكن ليس كيفية تنفيذه في التعليمات البرمجية. حاولت الأدوات التقليدية "بدون تعليمات برمجية" سد هذه الفجوة من خلال لوحات السحب والإفلات، لكنها تنهار في اللحظة التي تحتاج فيها إلى سلوك الوكيل الحقيقي: التفكير متعدد الخطوات، أو استخدام الأداة، أو الذاكرة المستمرة.</p>
<p>يتخذ <a href="https://www.langchain.com/langsmith/agent-builder"><strong>منشئ وكيل LangSmith Agent Builder</strong></a> الذي تم إصداره حديثًا نهجًا مختلفًا. فبدلاً من تصميم سير العمل، يمكنك وصف أهداف الوكيل والأدوات المتاحة بلغة بسيطة، ويتولى وقت التشغيل عملية اتخاذ القرار. لا مخططات انسيابية ولا برمجة نصية - فقط نية واضحة.</p>
<p>لكن النية وحدها لا تنتج مساعدًا ذكيًا. بل <strong>الذاكرة</strong> تفعل ذلك. هذا هو المكان الذي توفر فيه <a href="https://milvus.io/"><strong>Milvus،</strong></a> قاعدة البيانات المتجهة مفتوحة المصدر المعتمدة على نطاق واسع، الأساس. من خلال تخزين المستندات وسجل المحادثة كتضمينات، يسمح Milvus لوكيلك باستدعاء السياق واسترجاع المعلومات ذات الصلة والاستجابة بدقة على نطاق واسع.</p>
<p>يستعرض هذا الدليل كيفية بناء مساعد ذكاء اصطناعي جاهز للإنتاج وممكّن للذاكرة باستخدام <strong>LangSmith Agent Builder + Mil</strong>vus، كل ذلك دون كتابة سطر واحد من التعليمات البرمجية.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">ما هو LangSmith Agent Builder وكيف يعمل؟<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>تمامًا كما يكشف اسمها، فإن LangSmith <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">Agent Builder</a> هي أداة بدون كود برمجي من LangChain تتيح لك بناء ونشر وإدارة وكلاء الذكاء الاصطناعي باستخدام لغة بسيطة. بدلاً من كتابة المنطق أو تصميم التدفقات المرئية، يمكنك شرح ما يجب أن يفعله الوكيل، والأدوات التي يمكنه استخدامها، وكيف يجب أن يتصرف. ثم يتعامل النظام مع الأجزاء الصعبة - توليد المطالبات، واختيار الأدوات، وتوصيل المكونات معًا، وتمكين الذاكرة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>على عكس أدوات عدم الترميز أو أدوات سير العمل التقليدية، لا يحتوي Agent Builder على لوحة سحب وإفلات ولا مكتبة عقدة. تتفاعل معه بنفس الطريقة التي تتفاعل بها مع ChatGPT. صِف ما تريد بناءه، وأجب عن بعض الأسئلة التوضيحية، وسيقوم المنشئ بإنتاج وكيل يعمل بشكل كامل بناءً على نيتك.</p>
<p>خلف الكواليس، يتم إنشاء هذا الوكيل من أربع وحدات بناء أساسية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>الموجه:</strong> الموجه هو عقل الوكيل، حيث يحدد أهدافه وقيوده ومنطق اتخاذ القرار. يستخدم منشئ وكلاء لانجسميث Agent Builder الموجه لبناء هذا تلقائيًا: أنت تصف ما تريده، ويطرح أسئلة توضيحية، ويتم تجميع إجاباتك في موجه نظام مفصل وجاهز للإنتاج. بدلاً من كتابة المنطق يدوياً، يمكنك ببساطة التعبير عن النية.</li>
<li><strong>الأدوات:</strong> تتيح الأدوات للوكيل اتخاذ الإجراءات - إرسال رسائل البريد الإلكتروني، أو النشر على Slack، أو إنشاء أحداث التقويم، أو البحث في البيانات، أو استدعاء واجهات برمجة التطبيقات. يدمج Agent Builder هذه الأدوات من خلال بروتوكول سياق النموذج (MCP)، والذي يوفر طريقة آمنة وقابلة للتوسيع لعرض القدرات. يمكن للمستخدمين الاعتماد على عمليات التكامل المدمجة أو إضافة خوادم MCP مخصصة، بما في ذلك <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">خوادم</a>Milvus <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">MCP</a>للبحث عن المتجهات والذاكرة طويلة المدى.</li>
<li><strong>المشغلات:</strong> تحدد المشغلات وقت تشغيل الوكيل. بالإضافة إلى التنفيذ اليدوي، يمكنك إرفاق الوكلاء بالجداول الزمنية أو الأحداث الخارجية بحيث يستجيبون تلقائيًا للرسائل أو رسائل البريد الإلكتروني أو نشاط خطاف الويب. عندما يتم تشغيل أحد المشغّلات، يبدأ Agent Builder سلسلة رسائل تنفيذ جديدة ويقوم بتشغيل منطق الوكيل، مما يتيح سلوكًا مستمرًا قائمًا على الأحداث.</li>
<li><strong>الوكلاء الفرعيون:</strong> يقوم الوكلاء الفرعيون بتقسيم المهام المعقدة إلى وحدات أصغر متخصصة. يمكن للوكيل الأساسي تفويض العمل إلى وكلاء فرعيين - لكل منهم مجموعة أدوات ومطالبات خاصة به - بحيث يتم التعامل مع مهام مثل استرجاع البيانات أو التلخيص أو التنسيق بواسطة مساعدين مخصصين. وهذا يجنبك تحميل موجه واحد مثقل ويخلق بنية وكيل أكثر معيارية وقابلية للتطوير.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">كيف يتذكر الوكيل تفضيلاتك؟<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>ما يجعل Agent Builder فريداً من نوعه هو كيفية تعامله مع <em>الذاكرة</em>. فبدلاً من حشو التفضيلات في سجل الدردشة، يمكن للوكيل تحديث قواعد السلوك الخاصة به أثناء التشغيل. إذا قلت: "من الآن فصاعدًا، أنهِ كل رسالة من رسائل Slack بقصيدة شعرية"، لا يتعامل الوكيل مع ذلك كطلب لمرة واحدة - بل يخزنه كتفضيل دائم ينطبق في عمليات التشغيل المستقبلية.</p>
<p>تحت غطاء المحرك، يحتفظ الوكيل بملف ذاكرة داخلي - وهو في الأساس موجه نظامه المتطور. في كل مرة يبدأ فيها، يقرأ هذا الملف ليقرر كيفية التصرف. عندما تعطي تصحيحات أو قيود، يقوم الوكيل بتعديل الملف بإضافة قواعد منظمة مثل "اختتم الإحاطة دائمًا بقصيدة قصيرة راقية". هذا النهج أكثر استقراراً بكثير من الاعتماد على تاريخ المحادثة لأن الوكيل يعيد كتابة تعليمات التشغيل الخاصة به بشكل نشط بدلاً من دفن تفضيلاتك داخل نص.</p>
<p>يأتي هذا التصميم من برنامج FilesystemMiddleware الخاص بـ DeepAgents ولكن يتم تجريده بالكامل في Agent Builder. أنت لا تلمس الملفات مباشرةً: أنت تعبّر عن التحديثات بلغة طبيعية، ويتعامل النظام مع التعديلات خلف الكواليس. إذا كنت بحاجة إلى مزيد من التحكم، يمكنك توصيل خادم MCP مخصص أو الانتقال إلى طبقة DeepAgents لتخصيص متقدم للذاكرة.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">عرض توضيحي عملي: بناء مساعد ميلفوس في 10 دقائق باستخدام منشئ الوكيل<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>الآن وبعد أن قمنا بتغطية فلسفة التصميم وراء Agent Builder، دعونا ننتقل إلى عملية الإنشاء الكاملة مع مثال عملي. هدفنا هو إنشاء مساعد ذكي يمكنه الإجابة عن الأسئلة التقنية المتعلقة ب Milvus، والبحث في الوثائق الرسمية، وتذكر تفضيلات المستخدم بمرور الوقت.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">الخطوة 1. تسجيل الدخول إلى موقع LangChain الإلكتروني</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">الخطوة 2. قم بإعداد مفتاح واجهة برمجة تطبيقات أنثروبيك</h3><p><strong>ملاحظة:</strong> أنثروبيك مدعوم افتراضيًا. يمكنك أيضًا استخدام نموذج مخصص، طالما أن نوعه مدرج في القائمة المدعومة رسميًا من قبل LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. أضف مفتاح واجهة برمجة التطبيقات</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. أدخل مفتاح واجهة برمجة التطبيقات واحفظه</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">الخطوة 3. إنشاء وكيل جديد</h3><p><strong>ملاحظة:</strong> انقر على <strong>معرفة المزيد</strong> لعرض وثائق الاستخدام.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>تكوين نموذج مخصص (اختياري)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) أدخل المعلمات واحفظ</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">الخطوة 4. وصف متطلباتك لإنشاء الوكيل</h3><p><strong>ملاحظة:</strong> قم بإنشاء الوكيل باستخدام وصف بلغة طبيعية.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>يطرح النظام أسئلة متابعة لتنقيح المتطلبات</strong></li>
</ol>
<p>السؤال 1: حدد أنواع فهرس ميلفوس التي تريد أن يتذكرها الوكيل</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>السؤال 2: اختر كيف يجب أن يتعامل الوكيل مع الأسئلة التقنية  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>السؤال 3: حدد ما إذا كان يجب أن يركز الوكيل على الإرشادات الخاصة بإصدار Milvus معين  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">الخطوة 5: الخطوة 5. مراجعة وتأكيد الوكيل الذي تم إنشاؤه</h3><p><strong>ملاحظة:</strong> يقوم النظام تلقائياً بإنشاء تكوين الوكيل تلقائياً.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>قبل إنشاء الوكيل، يمكنك مراجعة بيانات التعريف والأدوات والمطالبات الخاصة به. بمجرد أن يبدو كل شيء صحيحاً، انقر فوق <strong>إنشاء</strong> للمتابعة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">الخطوة 6. استكشف الواجهة ومناطق الميزات</h3><p>بعد إنشاء الوكيل، سترى ثلاث مناطق وظيفية في الزاوية السفلية اليسرى من الواجهة:</p>
<p><strong>(1) المشغلات</strong></p>
<p>تحدد المشغلات متى يجب أن يعمل الوكيل، إما استجابةً لأحداث خارجية أو وفقًا لجدول زمني:</p>
<ul>
<li><strong>سلاك:</strong> تنشيط الوكيل عند وصول رسالة في قناة محددة</li>
<li><strong>Gmail:</strong> تشغيل الوكيل عند استلام رسالة بريد إلكتروني جديدة</li>
<li><strong>Cron:</strong> تشغيل الوكيل على فاصل زمني مجدول</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) صندوق الأدوات</strong></p>
<p>هذه هي مجموعة الأدوات التي يمكن للوكيل استدعاؤها. في المثال الموضح، يتم إنشاء الأدوات الثلاث تلقائيًا أثناء الإنشاء، ويمكنك إضافة المزيد بالنقر على <strong>إضافة أداة</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>إذا كان وكيلك يحتاج إلى إمكانيات البحث المتجه - مثل البحث الدلالي عبر كميات كبيرة من الوثائق الفنية - يمكنك نشر خادم MCP الخاص بـ Milvus</strong> وإضافته هنا باستخدام زر <strong>MCP</strong>. تأكد من تشغيل خادم MCP <strong>على نقطة نهاية شبكة يمكن الوصول إليها؛</strong> وإلا فلن يتمكن Agent Builder من استدعائه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) الوكلاء الفرعيون</strong></p>
<p>قم بإنشاء وحدات فرعية مستقلة مخصصة لمهام فرعية محددة، مما يتيح تصميم نظام معياري.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">الخطوة 7. اختبر الوكيل</h3><p>انقر فوق <strong>اختبار</strong> في الزاوية العلوية اليمنى للدخول إلى وضع الاختبار. فيما يلي عينة من نتائج الاختبار.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">منشئ الوكيل مقابل DeepAgents: أيهما يجب أن تختار؟<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>تقدم LangChain العديد من أطر عمل الوكلاء، ويعتمد الاختيار الصحيح على مقدار التحكم الذي تحتاجه. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> هي أداة بناء الوكلاء. تُستخدم لبناء وكلاء ذكاء اصطناعي مستقل وطويل الأمد يتعامل مع مهام معقدة ومتعددة الخطوات. وهي مبنية على LangGraph، وهي تدعم التخطيط المتقدم، وإدارة السياق المستند إلى الملفات، وتنسيق الوكلاء الفرعيين، مما يجعلها مثالية للمشاريع طويلة المدى أو مشاريع الإنتاج.</p>
<p>إذن كيف يمكن مقارنة ذلك بـ <strong>Agent Bu</strong>ilder، ومتى يجب عليك استخدام كل منهما؟</p>
<p>يركز<strong>Agent Builder</strong> على البساطة والسرعة. فهو يلخص معظم تفاصيل التنفيذ، مما يتيح لك وصف وكيلك بلغة طبيعية، وتهيئة الأدوات، وتشغيله على الفور. يتم التعامل مع الذاكرة، واستخدام الأدوات، وسير العمل البشري في الحلقة نيابةً عنك. هذا يجعل Agent Builder مثاليًا للنماذج الأولية السريعة والأدوات الداخلية والتحقق من صحة المراحل المبكرة حيث تكون سهولة الاستخدام أكثر أهمية من التحكم الدقيق.</p>
<p>على النقيض من ذلك، تم تصميم<strong>DeepAgents</strong> للسيناريوهات التي تحتاج فيها إلى التحكم الكامل في الذاكرة والتنفيذ والبنية التحتية. يمكنك تخصيص البرمجيات الوسيطة، ودمج أي أداة بايثون، وتعديل الواجهة الخلفية للتخزين (بما في ذلك الذاكرة المستمرة في <a href="https://milvus.io/blog">Milvus</a>)، وإدارة الرسم البياني لحالة الوكيل بشكل صريح. وتتمثل المفاضلة في الجهد الهندسي - فأنت تكتب التعليمات البرمجية وتدير التبعيات وتتعامل مع أوضاع الفشل بنفسك - لكنك تحصل على مكدس وكيل قابل للتخصيص بالكامل.</p>
<p>والأهم من ذلك أن <strong>Agent Builder و DeepAgents ليسا نظامين بيئيين منفصلين - فهما يشكلان سلسلة واحدة متصلة</strong>. تم بناء Agent Builder على رأس DeepAgents. هذا يعني أنه يمكنك البدء بنموذج أولي سريع في Agent Builder، ثم الانتقال إلى DeepAgents عندما تحتاج إلى مزيد من المرونة، دون إعادة كتابة كل شيء من الصفر. والعكس صحيح أيضًا: يمكن تجميع الأنماط المبنية في DeepAgents كقوالب Agent Builder بحيث يمكن للمستخدمين غير التقنيين إعادة استخدامها.</p>
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
    </button></h2><p>بفضل تطوّر الذكاء الاصطناعي، لم يعد بناء وكلاء الذكاء الاصطناعي يتطلب تدفقات عمل معقدة أو هندسة ثقيلة. باستخدام أداة إنشاء الوكلاء من LangSmith Agent Builder، يمكنك إنشاء مساعدين ذوي حالة وطويلة الأمد باستخدام اللغة الطبيعية وحدها. أنت تركز على وصف ما يجب أن يفعله الوكيل، بينما يتولى النظام التخطيط، وتنفيذ الأداة، وتحديثات الذاكرة المستمرة.</p>
<p>وبالاقتران مع <a href="https://milvus.io/blog">Milvus،</a> يكتسب هؤلاء الوكلاء ذاكرة موثوقة ومستمرة للبحث الدلالي وتتبع التفضيلات والسياق طويل الأجل عبر الجلسات. سواء كنت تتحقق من صحة فكرة ما أو تنشر نظامًا قابلاً للتطوير، يوفر كل من LangSmith Agent Builder و Milvus أساسًا بسيطًا ومرنًا للوكلاء الذين لا يستجيبون فقط - بل يتذكرون ويتحسنون بمرور الوقت.</p>
<p>هل لديك أسئلة أو تريد جولة أعمق؟ انضم إلى <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">قناة Slack</a> الخاصة بنا أو احجز جلسة <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">ساعات عمل Milvus المكتبية</a> لمدة 20 دقيقة للحصول على إرشادات مخصصة.</p>
