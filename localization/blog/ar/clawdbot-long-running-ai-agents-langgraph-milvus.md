---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  لماذا انتشر Clawdbot على نطاق واسع - وكيفية بناء عملاء جاهزين للإنتاج طويل
  الأمد مع لانجغراف وميلفوس
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  أثبت Clawdbot أن الناس يريدون ذكاءً اصطناعيًا يعمل. تعرّف على كيفية بناء وكلاء
  جاهزين للإنتاج طويل الأمد باستخدام بنية العميلين وMilvus وLangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">انتشر Clawdbot (الآن OpenClaw) على نطاق واسع<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>استحوذ<a href="https://openclaw.ai/">Clawdbot،</a> الذي أعيدت تسميته الآن إلى OpenClaw، على الإنترنت الأسبوع الماضي. فقد حقق مساعد الذكاء الاصطناعي المفتوح المصدر الذي أنشأه بيتر شتاينبرغر <a href="https://github.com/openclaw/openclaw">أكثر من 110,000 نجمة على GitHub</a> في غضون أيام قليلة. وقد نشر المستخدمون مقاطع فيديو له وهو يتفقدهم بشكل مستقل في رحلات الطيران وإدارة رسائل البريد الإلكتروني والتحكم في الأجهزة المنزلية الذكية. وأشاد به أندريه كارباثي، المهندس المؤسس في OpenAI. وقام ديفيد ساكس، مؤسس ومستثمر في مجال التكنولوجيا، بالتغريد عنها. أطلق عليه الناس اسم "جارفيس، ولكن حقيقي".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ثم جاءت التحذيرات الأمنية.</p>
<p>وجد الباحثون مئات من لوحات الإدارة المكشوفة. يعمل الروبوت مع وصول الجذر بشكل افتراضي. لا يوجد وضع حماية. يمكن أن تسمح ثغرات الحقن الموجه للمهاجمين باختطاف الوكيل. كابوس أمني.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">انتشر Clawdbot لسبب ما<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>انتشر Clawdbot لسبب ما.</strong> يعمل محلياً أو على خادمك الخاص. يتصل بتطبيقات المراسلة التي يستخدمها الناس بالفعل - واتس آب، سلاك، تيليجرام، آي مسج. يتذكر السياق بمرور الوقت بدلاً من نسيان كل شيء بعد كل رد. يدير التقويمات، ويلخص رسائل البريد الإلكتروني، ويقوم بأتمتة المهام عبر التطبيقات.</p>
<p>ويشعر المستخدمون بأن الذكاء الاصطناعي الشخصي لا يحتاج إلى مساعدة شخصية، فهو ليس مجرد أداة مطالبة واستجابة. ويروق نموذجها المفتوح المصدر والمستضاف ذاتياً للمطورين الذين يرغبون في التحكم والتخصيص. كما أن سهولة التكامل مع تدفقات العمل الحالية تجعل من السهل مشاركتها والتوصية بها.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">تحديان لبناء وكلاء طويل الأمد<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تثبت شعبية Clawdbot أن شعبية Clawdbot تثبت أن الناس يريدون ذكاءً اصطناعيًا</strong><strong> يعمل، وليس فقط يجيب.</strong> ولكن أي وكيل يعمل على فترات طويلة ويكمل مهام حقيقية - سواء كان Clawdbot أو أي شيء تقوم ببنائه بنفسك - يجب أن يحل تحديين تقنيين: <strong>الذاكرة</strong> <strong>والتحقق</strong>.</p>
<p>تظهر<strong>مشكلة الذاكرة</strong> بطرق متعددة:</p>
<ul>
<li><p>يستنفد الوكلاء نافذة السياق الخاصة بهم في منتصف المهمة ويتركون وراءهم عملاً نصف منتهٍ</p></li>
<li><p>يفقدون رؤية قائمة المهام الكاملة ويعلنون "تم" في وقت مبكر جدًا</p></li>
<li><p>لا يستطيعون تسليم السياق بين الجلسات، لذا تبدأ كل جلسة جديدة من الصفر</p></li>
</ul>
<p>كل هذه المشاكل تنبع من نفس الجذر: الوكلاء ليس لديهم ذاكرة ثابتة. نوافذ السياق محدودة، والاسترجاع بين الجلسات محدود، ولا يتم تتبع التقدم بطريقة يمكن للوكلاء الوصول إليها.</p>
<p><strong>مشكلة التحقق</strong> مختلفة. فحتى عندما تعمل الذاكرة، لا يزال الوكلاء يضعون علامة على المهام على أنها مكتملة بعد اختبار سريع للوحدة - دون التحقق مما إذا كانت الميزة تعمل بالفعل من البداية إلى النهاية.</p>
<p>يعالج Clawdbot كلا الأمرين. فهو يخزن الذاكرة محليًا عبر الجلسات ويستخدم "مهارات" معيارية لأتمتة المتصفحات والملفات والخدمات الخارجية. النهج يعمل. ولكنه ليس جاهزاً للإنتاج. للاستخدام المؤسسي، تحتاج إلى بنية وقابلية تدقيق وأمان لا يوفرها Clawdbot خارج الصندوق.</p>
<p>تغطي هذه المقالة نفس المشاكل مع الحلول الجاهزة للإنتاج.</p>
<p>بالنسبة للذاكرة، نستخدم <strong>بنية مكونة من عميلين</strong> استنادًا إلى <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">أبحاث أنثروبيك</a>: عامل تهيئة يقسم المشاريع إلى ميزات يمكن التحقق منها، وعامل ترميز يعمل من خلالها واحدًا تلو الآخر مع عمليات تسليم نظيفة. وللاستدعاء الدلالي عبر الجلسات، نستخدم <a href="https://milvus.io/">Milvus،</a> وهي قاعدة بيانات متجهة تتيح للوكلاء البحث حسب المعنى وليس الكلمات الرئيسية.</p>
<p>للتحقق، نستخدم <strong>أتمتة المتصفح</strong>. بدلاً من الوثوق باختبارات الوحدة، يختبر الوكيل الميزات بالطريقة التي يختبر بها المستخدم الحقيقي.</p>
<p>سنستعرض المفاهيم، ثم نعرض تطبيقًا عمليًا باستخدام <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> و Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">كيف تمنع البنية ثنائية الوكيلين استنفاد السياق<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>يحتوي كل برنامج LLM على نافذة للسياق: حد لمقدار النص الذي يمكنه معالجته في وقت واحد. عندما يعمل الوكيل على مهمة معقدة، تمتلئ هذه النافذة بالرمز ورسائل الخطأ وسجل المحادثة والوثائق. وبمجرد امتلاء النافذة، يتوقف الوكيل أو يبدأ في نسيان السياق السابق. بالنسبة للمهام طويلة الأمد، هذا أمر لا مفر منه.</p>
<p>فكّر في وكيلٍ أُعطيَ مطالبة بسيطة: "إنشاء نسخة من claude.ai." يتطلب المشروع المصادقة، وواجهات الدردشة، وسجل المحادثات، وتدفق الردود، وعشرات الميزات الأخرى. سيحاول وكيل واحد معالجة كل شيء دفعة واحدة. في منتصف تنفيذ واجهة الدردشة، تمتلئ نافذة السياق. تنتهي الجلسة بشيفرة نصف مكتوبة، ولا يوجد توثيق لما تمت تجربته، ولا إشارة إلى ما يعمل وما لا يعمل. ترث الجلسة التالية فوضى. حتى مع ضغط السياق، يجب على الوكيل الجديد تخمين ما كانت تفعله الجلسة السابقة، وتصحيح التعليمات البرمجية التي لم يكتبها، ومعرفة أين يستأنف. تضيع ساعات قبل إحراز أي تقدم جديد.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">حل الوكيل ذو الشقين</h3><p>يتمثل حل أنثروبيك الموصوف في منشورهم الهندسي <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"التسخير الفعال للوكلاء الذين يعملون لفترة طويلة"</a> في استخدام وضعين مختلفين للمطالبات: <strong>مطالبة تهيئة</strong> للجلسة الأولى <strong>ومطالبة ترميز</strong> للجلسات اللاحقة.</p>
<p>من الناحية الفنية، كلا الوضعين يستخدمان نفس الوكيل الأساسي وموجه النظام والأدوات والتسخير. الفرق الوحيد هو موجه المستخدم الأولي. ولكن نظرًا لأنهما يخدمان أدوارًا مختلفة، فإن التفكير فيهما كعاملين منفصلين هو نموذج ذهني مفيد. نسمي هذه البنية ذات الوكيلين.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>يقوم المُهيئ بإعداد البيئة للتقدم التدريجي.</strong> يأخذ طلبًا غامضًا ويقوم بثلاثة أشياء:</p>
<ul>
<li><p><strong>يقسم المشروع إلى ميزات محددة يمكن التحقق منها.</strong> ليس متطلبات غامضة مثل "إنشاء واجهة دردشة"، بل خطوات ملموسة قابلة للاختبار: "ينقر المستخدم على زر دردشة جديدة ← تظهر محادثة جديدة في الشريط الجانبي ← تظهر منطقة الدردشة حالة ترحيب." يحتوي مثال claude.ai المستنسخ من أنثروبيك على أكثر من 200 من هذه الميزات.</p></li>
<li><p><strong>ينشئ ملف تتبع التقدم.</strong> يسجل هذا الملف حالة اكتمال كل ميزة، بحيث يمكن لأي جلسة أن ترى ما تم إنجازه وما تبقى.</p></li>
<li><p><strong>يكتب البرامج النصية للإعداد ويجعل التزام git الأولي.</strong> تتيح البرامج النصية مثل <code translate="no">init.sh</code> للجلسات المستقبلية تشغيل بيئة التطوير بسرعة. يؤسس التزام git خط أساس نظيف.</p></li>
</ul>
<p>لا يقوم المُهيئ بالتخطيط فقط. إنه ينشئ بنية تحتية تتيح للجلسات المستقبلية بدء العمل على الفور.</p>
<p>يتعامل<strong>عامل الترميز</strong> مع كل جلسة لاحقة. يقوم بـ</p>
<ul>
<li><p>يقرأ ملف التقدم وسجلات git لفهم الحالة الحالية</p></li>
<li><p>يقوم بإجراء اختبار أساسي من طرف إلى طرف للتأكد من أن التطبيق لا يزال يعمل</p></li>
<li><p>يختار ميزة واحدة للعمل عليها</p></li>
<li><p>ينفذ الميزة ويختبرها بدقة ويرسلها إلى git مع رسالة وصفية ويحدّث ملف التقدم</p></li>
</ul>
<p>عندما تنتهي الجلسة، تكون قاعدة البرمجة في حالة قابلة للدمج: لا توجد أخطاء كبيرة، كود منظم، وثائق واضحة. لا يوجد عمل غير مكتمل ولا غموض حول ما تم إنجازه. تلتقط الجلسة التالية بالضبط من حيث توقفت هذه الجلسة.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">استخدم JSON لتتبع الميزات، وليس Markdown</h3><p><strong>أحد تفاصيل التنفيذ الجديرة بالملاحظة: يجب أن تكون قائمة الميزات JSON وليس Markdown.</strong></p>
<p>عند تحرير JSON، تميل نماذج الذكاء الاصطناعي إلى تعديل حقول محددة بشكل جراحي. عند تحرير Markdown، فإنها غالبًا ما تعيد كتابة أقسام كاملة. مع وجود قائمة تضم أكثر من 200 ميزة، يمكن أن تؤدي عمليات تحرير Markdown إلى إفساد تتبع تقدمك عن طريق الخطأ.</p>
<p>يبدو إدخال JSON هكذا:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>لكل ميزة خطوات تحقق واضحة. يتتبع الحقل <code translate="no">passes</code> الإكمال. يوصى أيضًا بتعليمات شديدة اللهجة مثل "من غير المقبول إزالة الاختبارات أو تعديلها لأن ذلك قد يؤدي إلى فقدان وظائف أو أخطاء" لمنع الوكيل من التلاعب بالنظام عن طريق حذف الميزات الصعبة.</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">كيف يمنح ميلفوس الوكلاء ذاكرة دلالية عبر الجلسات<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تحل بنية الوكيلين مشكلة استنفاد السياق، لكنها لا تحل مشكلة النسيان.</strong> فحتى مع عمليات التسليم النظيفة بين الجلسات، يفقد الوكيل مسار ما تعلمه. لا يمكن أن يتذكر أن "رموز تحديث JWT" تتعلق ب "مصادقة المستخدم" ما لم تظهر هذه الكلمات بالضبط في ملف التقدم. مع نمو المشروع، يصبح البحث في مئات التزامات git بطيئًا. تفوت مطابقة الكلمات الرئيسية الروابط التي قد تكون واضحة للإنسان.</p>
<p><strong>هنا يأتي دور قواعد البيانات المتجهة.</strong> فبدلاً من تخزين النص والبحث عن الكلمات المفتاحية، تقوم قاعدة بيانات المتجهات بتحويل النص إلى تمثيلات رقمية للمعنى. عندما تبحث عن "مصادقة المستخدم"، تجد إدخالات حول "رموز تحديث JWT" و"معالجة جلسة تسجيل الدخول". ليس لأن الكلمات متطابقة، ولكن لأن المفاهيم متقاربة من الناحية الدلالية. يمكن للوكيل أن يسأل "هل رأيت شيئًا كهذا من قبل؟" ويحصل على إجابة مفيدة.</p>
<p><strong>في الممارسة العملية، يعمل هذا من خلال تضمين سجلات التقدم والتزامات git في قاعدة البيانات كمتجهات.</strong> عندما تبدأ جلسة الترميز، يستفسر الوكيل عن قاعدة البيانات بمهمته الحالية. تقوم قاعدة البيانات بإرجاع السجل ذي الصلة بالمللي ثانية: ما تمت تجربته من قبل، وما الذي نجح وما الذي فشل. لا يبدأ الوكيل من الصفر. بل يبدأ بالسياق.</p>
<p><a href="https://milvus.io/"><strong>ميلفوس</strong></a> <strong>مناسب تمامًا لحالة الاستخدام هذه.</strong> فهو مفتوح المصدر ومصمّم للبحث عن المتجهات على نطاق الإنتاج، ويتعامل مع مليارات المتجهات دون عناء. بالنسبة للمشاريع الأصغر أو التطوير المحلي، يمكن تضمين <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> مباشرةً في تطبيق مثل SQLite. لا حاجة لإعداد المجموعة. عندما ينمو المشروع، يمكنك الانتقال إلى Milvus الموزعة دون تغيير الكود الخاص بك. لتوليد التضمينات، يمكنك استخدام نماذج خارجية مثل <a href="https://www.sbert.net/">SentenceTransformer</a> للتحكم الدقيق، أو الرجوع إلى <a href="https://milvus.io/docs/embeddings.md">وظائف التضمين المدمجة</a> هذه لإعدادات أبسط. يدعم Milvus أيضًا <a href="https://milvus.io/docs/hybridsearch.md">البحث الهجين،</a> حيث يجمع بين التشابه المتجه والتصفية التقليدية، بحيث يمكنك الاستعلام عن "البحث عن مشكلات مصادقة مماثلة من الأسبوع الماضي" في مكالمة واحدة.</p>
<p><strong>هذا يحل أيضًا مشكلة النقل.</strong> تستمر قاعدة بيانات المتجهات خارج أي جلسة واحدة، لذلك تتراكم المعرفة بمرور الوقت. تتمتع الجلسة 50 بإمكانية الوصول إلى كل ما تم تعلمه في الجلسات من 1 إلى 49. يطور المشروع الذاكرة المؤسسية.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">التحقق من الاكتمال بالاختبار الآلي<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>حتى مع البنية المكونة من عميلين والذاكرة طويلة الأمد، لا يزال بإمكان الوكلاء إعلان النصر مبكرًا جدًا. هذه هي مشكلة التحقق.</strong></p>
<p>إليك وضع فشل شائع: تنتهي جلسة البرمجة من ميزة ما، وتقوم بتشغيل اختبار وحدة سريع، وترى أنها نجحت، وتنقلب <code translate="no">&quot;passes&quot;: false</code> إلى <code translate="no">&quot;passes&quot;: true</code>. لكن اجتياز اختبار الوحدة لا يعني أن الميزة تعمل بالفعل. قد تُرجع واجهة برمجة التطبيقات بيانات صحيحة بينما لا تعرض واجهة المستخدم أي شيء بسبب خطأ في CSS. يقول ملف التقدم "مكتمل" بينما لا يرى المستخدمون شيئًا.</p>
<p><strong>الحل هو جعل الوكيل يختبر مثل المستخدم الحقيقي.</strong> لكل ميزة في قائمة الميزات خطوات تحقق ملموسة: "ينقر المستخدم على زر دردشة جديدة ← تظهر محادثة جديدة في الشريط الجانبي ← تظهر منطقة الدردشة حالة الترحيب." يجب على الوكيل التحقق من هذه الخطوات حرفيًا. بدلاً من إجراء اختبارات على مستوى التعليمات البرمجية فقط، فإنه يستخدم أدوات أتمتة المتصفح مثل Puppeteer لمحاكاة الاستخدام الفعلي. فهو يفتح الصفحة، وينقر على الأزرار، ويملأ النماذج، ويتحقق من ظهور العناصر الصحيحة على الشاشة. فقط عندما يمر التدفق الكامل، يقوم الوكيل بوضع علامة على اكتمال الميزة.</p>
<p><strong>هذا يكتشف المشاكل التي تفوتها اختبارات الوحدة</strong>. قد تحتوي ميزة الدردشة على منطق خلفي مثالي واستجابات صحيحة لواجهة برمجة التطبيقات. ولكن إذا لم تعرض الواجهة الأمامية الرد، فلن يرى المستخدمون شيئًا. يمكن لأتمتة المتصفح تصوير النتيجة والتحقق من أن ما يظهر على الشاشة يطابق ما يجب أن يظهر. لا يصبح الحقل <code translate="no">passes</code> <code translate="no">true</code> إلا عندما تعمل الميزة بشكل حقيقي من البداية إلى النهاية.</p>
<p><strong>ومع ذلك، هناك قيود.</strong> لا يمكن أتمتة بعض الميزات الأصلية للمتصفح بواسطة أدوات مثل Puppeteer. منتقي الملفات ومربعات حوار تأكيد النظام هي أمثلة شائعة. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">لاحظت أنثروبيك</a> أن الميزات التي تعتمد على نماذج التنبيهات الأصلية في المتصفح تميل إلى أن تكون أكثر خطأ لأن الوكيل لا يستطيع رؤيتها من خلال Puppeteer. الحل العملي هو التصميم حول هذه القيود. استخدم مكونات واجهة المستخدم المخصصة بدلاً من مربعات الحوار الأصلية حيثما أمكن، حتى يتمكن الوكيل من اختبار كل خطوة تحقق في قائمة الميزات.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">تجميعها معًا: لانجغراف لحالة الجلسة، وميلفوس للذاكرة طويلة الأجل<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>تجتمع المفاهيم أعلاه معًا في نظام عمل باستخدام أداتين: LangGraph لحالة الجلسة و Milvus للذاكرة طويلة المدى.</strong> يدير LangGraph ما يحدث داخل جلسة عمل واحدة: ما هي الميزة التي يتم العمل عليها، وما الذي اكتمل، وما هو التالي. يخزن Milvus السجل القابل للبحث عبر الجلسات: ما تم إنجازه من قبل، وما هي المشاكل التي تمت مواجهتها، وما هي الحلول التي نجحت. وهما معاً يعطيان العملاء ذاكرة قصيرة الأجل وذاكرة طويلة الأجل.</p>
<p><strong>ملاحظة حول هذا التنفيذ:</strong> الكود أدناه هو عرض توضيحي مبسط. إنه يعرض الأنماط الأساسية في برنامج نصي واحد، لكنه لا يكرر فصل الجلسات الموضح سابقًا بشكل كامل. في إعدادات الإنتاج، ستكون كل جلسة ترميز عبارة عن استدعاء منفصل، ربما على أجهزة مختلفة أو في أوقات مختلفة. <code translate="no">MemorySaver</code> و <code translate="no">thread_id</code> في LangGraph يتيح ذلك من خلال استمرار الحالة بين عمليات الاستدعاء. لرؤية سلوك الاستئناف بوضوح، يمكنك تشغيل البرنامج النصي مرة واحدة، ثم إيقافه، ثم تشغيله مرة أخرى بنفس <code translate="no">thread_id</code>. سيبدأ التشغيل الثاني من حيث توقف الأول.</p>
<p>بايثون</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">خاتمة</h3><p>يفشل وكلاء الذكاء الاصطناعي في المهام طويلة الأمد لأنهم يفتقرون إلى الذاكرة الدائمة والتحقق المناسب. انتشر Clawdbot على نطاق واسع من خلال حل هذه المشاكل، لكن نهجه ليس جاهزاً للإنتاج.</p>
<p>غطت هذه المقالة ثلاثة حلول هي</p>
<ul>
<li><p><strong>بنية ذات عميلين:</strong> يقوم عامل التهيئة بتقسيم المشاريع إلى ميزات قابلة للتحقق؛ ويعمل وكيل الترميز من خلالهما واحدًا تلو الآخر مع عمليات تسليم نظيفة. هذا يمنع استنفاد السياق ويجعل التقدم قابلاً للتتبع.</p></li>
<li><p><strong>قاعدة بيانات متجهة للذاكرة الدلالية:</strong> يقوم <a href="https://milvus.io/">ميلفوس</a> بتخزين سجلات التقدم والتزامات git على شكل تضمينات، بحيث يمكن للوكلاء البحث حسب المعنى وليس الكلمات الرئيسية. تتذكر الجلسة 50 ما تعلمته الجلسة 1.</p></li>
<li><p><strong>أتمتة المتصفح للتحقق الحقيقي:</strong> تتحقق اختبارات الوحدة من تشغيل الشيفرة البرمجية. يتحقق Puppeteer مما إذا كانت الميزات تعمل بالفعل من خلال اختبار ما يراه المستخدمون على الشاشة.</p></li>
</ul>
<p>لا تقتصر هذه الأنماط على تطوير البرمجيات. يمكن الاستفادة من البحث العلمي والنمذجة المالية ومراجعة المستندات القانونية - أي مهمة تمتد على عدة جلسات وتتطلب عمليات تسليم موثوقة.</p>
<p>المبادئ الأساسية:</p>
<ul>
<li><p>استخدم أداة تهيئة لتقسيم العمل إلى أجزاء يمكن التحقق منها</p></li>
<li><p>تتبع التقدم بتنسيق منظم وقابل للقراءة آليًا</p></li>
<li><p>تخزين الخبرة في قاعدة بيانات متجهة للاسترجاع الدلالي</p></li>
<li><p>التحقق من الإكمال باختبارات واقعية، وليس فقط اختبارات الوحدة</p></li>
<li><p>تصميم حدود واضحة للجلسات بحيث يمكن إيقاف العمل واستئنافه بأمان</p></li>
</ul>
<p>الأدوات موجودة. تم إثبات الأنماط. ما تبقى هو تطبيقها.</p>
<p><strong>هل أنت مستعد للبدء؟</strong></p>
<ul>
<li><p>استكشف <a href="https://milvus.io/">Milvus</a> و <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> لإضافة ذاكرة دلالية إلى وكلائك</p></li>
<li><p>اطلع على LangGraph لإدارة حالة الجلسة</p></li>
<li><p>اقرأ <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">بحث أنثروبيك الكامل</a> حول تسخير الوكلاء طويل الأمد</p></li>
</ul>
<p><strong>هل لديك أسئلة أو تريد مشاركة ما تقوم ببنائه؟</strong></p>
<ul>
<li><p>انضم إلى <a href="https://milvus.io/slack">مجتمع ميلفوس سلاك</a> للتواصل مع مطورين آخرين</p></li>
<li><p>احضر <a href="https://milvus.io/office-hours">ساعات عمل ميلفوس المكتبية</a> للأسئلة والأجوبة المباشرة مع الفريق</p></li>
</ul>
