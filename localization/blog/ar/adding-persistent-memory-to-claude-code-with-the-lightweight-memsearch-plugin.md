---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: إضافة ذاكرة ثابتة إلى كود كلود مع المكوّن الإضافي خفيف الوزن memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  امنح كلود كود ذاكرة طويلة المدى مع ميمسارش ccplugin. تخزين ماركداون خفيف الوزن
  وشفاف، واسترجاع دلالي تلقائي، ونفقات رمزية صفرية.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>لقد أنشأنا مؤخرًا مكتبة <a href="https://github.com/zilliztech/memsearch">ذاكرة</a> طويلة الأمد مستقلة ومفتوحة المصدر، وهي مكتبة ذاكرة طويلة الأمد مستقلة وقابلة للتوصيل والتشغيل تمنح أي وكيل ذاكرة ثابتة وشفافة وقابلة للتحرير البشري. تستخدم نفس بنية الذاكرة الأساسية مثل OpenClaw - فقط بدون بقية مكدس OpenClaw. هذا يعني أنه يمكنك إسقاطها في أي إطار عمل وكيل (Claude وGPT وLlama والوكلاء المخصصين ومحركات سير العمل) وإضافة ذاكرة دائمة وقابلة للاستعلام على الفور. <em>(إذا كنت تريد التعمق في كيفية عمل memsearch، فقد كتبنا</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>منشورًا منفصلًا هنا</em></a><em>).</em></p>
<p>في معظم عمليات سير عمل الوكلاء، تعمل memsearch على النحو المنشود تمامًا. لكن <strong>الترميز العميل</strong> قصة مختلفة. فجلسات الترميز تستغرق وقتًا طويلاً، وتبديلات السياق ثابتة، والمعلومات التي تستحق الحفظ تتراكم على مدار أيام أو أسابيع. يكشف هذا الحجم الهائل والتقلب الهائل عن نقاط الضعف في أنظمة ذاكرة الوكيل النموذجية - بما في ذلك البحث عن الذاكرة. في سيناريوهات الترميز، تختلف أنماط الاسترجاع بما يكفي بحيث لا يمكننا ببساطة إعادة استخدام الأداة الحالية كما هي.</p>
<p>لمعالجة هذا الأمر، قمنا ببناء <strong>مكون إضافي للذاكرة الدائمة مصمم خصيصًا لـ Claude Code</strong>. وهي موجودة فوق واجهة برمجة memsearch CLI، ونطلق عليها اسم <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(مفتوح المصدر، رخصة MIT)</em></li>
</ul>
<p>من خلال البرنامج <strong>المساعد memsearch ccplugin</strong> خفيف الوزن الذي يدير الذاكرة خلف الكواليس، يكتسب Claude Code القدرة على تذكر كل محادثة وكل قرار وكل تفضيل نمط وكل سلسلة رسائل متعددة الأيام - مفهرسة تلقائيًا وقابلة للبحث بشكل كامل ومستمرة عبر الجلسات.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>للتوضيح خلال هذا المنشور يشير مصطلح "ccplugin" إلى الطبقة العليا، أو المكون الإضافي Claude Code نفسه. تشير كلمة "memsearch" إلى الطبقة السفلى، أو أداة CLI المستقلة الموجودة تحتها.</em></p>
<p>إذًا لماذا تحتاج البرمجة إلى مكون إضافي خاص بها، ولماذا بنينا شيئًا خفيفًا جدًا؟ يعود الأمر إلى مشكلتين من المؤكد أنك واجهتهما: افتقار Claude Code إلى الذاكرة المستمرة، وغلظة وتعقيد الحلول الحالية مثل claude-mem.</p>
<p>فلماذا إذن لماذا بناء مكون إضافي مخصص أصلاً؟ لأن وكلاء الترميز يصطدمون بنقطتي ألم من المؤكد أنك واجهتهما بنفسك:</p>
<ul>
<li><p>كلود كود ليس لديه ذاكرة ثابتة.</p></li>
<li><p>العديد من حلول المجتمع الحالية - مثل <em>claude-mem -</em>قوية ولكنها ثقيلة أو ثقيلة أو معقدة للغاية بالنسبة لأعمال الترميز اليومية.</p></li>
</ul>
<p>تهدف الإضافة ccplugin إلى حل كلتا المشكلتين بطبقة بسيطة وشفافة وسهلة الاستخدام للمطورين فوق ميمسارش.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">مشكلة ذاكرة كود كلود كود: ينسى كل شيء عند انتهاء الجلسة<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>لنبدأ بسيناريو واجهه مستخدمو كلود كود بالتأكيد.</p>
<p>تفتح كلود كود في الصباح. تكتب: "أكمل إعادة بناء مصادقة الأمس". يرد كلود: "لست متأكدًا مما كنت تعمل عليه بالأمس." لذا تقضي الدقائق العشر التالية في نسخ ولصق سجلات الأمس. إنها ليست مشكلة كبيرة، لكنها سرعان ما تصبح مزعجة لأنها تظهر بشكل متكرر.</p>
<p>على الرغم من أن كلود كود لديه آليات الذاكرة الخاصة به، إلا أنها بعيدة كل البعد عن أن تكون مرضية. يمكن للملف <code translate="no">CLAUDE.md</code> تخزين توجيهات المشروع والتفضيلات، لكنه يعمل بشكل أفضل للقواعد الثابتة والأوامر القصيرة، وليس لتجميع المعرفة طويلة الأجل.</p>
<p>يوفر كلود كود <code translate="no">resume</code> و <code translate="no">fork</code> الأوامر، لكنها بعيدة كل البعد عن كونها سهلة الاستخدام. بالنسبة لأوامر التشعب، تحتاج إلى تذكر معرّفات الجلسات، وكتابة الأوامر يدويًا، وإدارة شجرة من تواريخ المحادثات المتفرعة. عند تشغيل <code translate="no">/resume</code> ، ستحصل على حائط من عناوين الجلسات. إذا كنت لا تتذكر سوى تفاصيل قليلة حول ما قمت به وكان ذلك قبل أكثر من بضعة أيام، فحظًا موفقًا في العثور على الجلسة الصحيحة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بالنسبة لتراكم المعرفة طويل الأجل عبر المشاريع، فإن هذا النهج برمته مستحيل.</p>
<p>لتحقيق هذه الفكرة، يستخدم claude-mem نظام ذاكرة من ثلاثة مستويات. يبحث المستوى الأول في الملخصات عالية المستوى. يبحث المستوى الثاني في جدول زمني لمزيد من التفاصيل. يسحب المستوى الثالث الملاحظات الكاملة للمحادثة الأولية. علاوة على ذلك، هناك تصنيفات الخصوصية، وتتبع التكلفة، وواجهة تصور الويب.</p>
<p>إليك كيف تعمل تحت الغطاء:</p>
<ul>
<li><p><strong>طبقة وقت التشغيل.</strong> تعمل خدمة Node.js Worker على المنفذ 37777. تعيش البيانات الوصفية للجلسة في قاعدة بيانات SQLite خفيفة الوزن. قاعدة بيانات متجهة تتعامل مع الاسترجاع الدلالي الدقيق لمحتوى الذاكرة.</p></li>
<li><p><strong>طبقة التفاعل.</strong> تتيح لك واجهة مستخدم الويب المستندة إلى React عرض الذكريات الملتقطة في الوقت الفعلي: الملخصات والجداول الزمنية والسجلات الأولية.</p></li>
<li><p><strong>طبقة الواجهة.</strong> يعرض خادم MCP (بروتوكول سياق النموذج) واجهات أداة موحدة. يمكن لكلود استدعاء <code translate="no">search</code> (الاستعلام عن الملخصات عالية المستوى) و <code translate="no">timeline</code> (عرض الجداول الزمنية المفصلة) و <code translate="no">get_observations</code> (استرداد سجلات التفاعل الخام) لاسترداد الذكريات واستخدامها مباشرةً.</p></li>
</ul>
<p>لكي نكون منصفين، هذا منتج قوي يحل مشكلة ذاكرة كلود كود. ولكنه معقّد ومُعقّد من نواحٍ مختلفة من يوم لآخر.</p>
<table>
<thead>
<tr><th>الطبقة</th><th>التقنية</th></tr>
</thead>
<tbody>
<tr><td>اللغة</td><td>TypeScript (ES2022، وحدات ESNext)</td></tr>
<tr><td>وقت التشغيل</td><td>Node.js 18+</td></tr>
<tr><td>قاعدة البيانات</td><td>SQLite 3 مع برنامج تشغيل bun:sqlite</td></tr>
<tr><td>مخزن المتجهات</td><td>ChromaDB (اختياري، للبحث الدلالي)</td></tr>
<tr><td>خادم HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>الوقت الحقيقي</td><td>الأحداث المرسلة من الخادم (SSE)</td></tr>
<tr><td>إطار عمل واجهة المستخدم</td><td>React + TypeScript</td></tr>
<tr><td>SDK للذكاء الاصطناعي</td><td>@Aanthropic-ai/claude-agent-sdk</td></tr>
<tr><td>أداة البناء</td><td>esbuild (حزم TypeScript)</td></tr>
<tr><td>مدير العمليات</td><td>الكعكة</td></tr>
<tr><td>اختبار</td><td>أداة تشغيل الاختبار المدمجة في Node.js</td></tr>
</tbody>
</table>
<p><strong>بالنسبة للمبتدئين، الإعداد ثقيل.</strong> تشغيل claude-mem يعني تثبيت Node.js و Bun ووقت تشغيل MCP، ثم إعداد خدمة عامل، وخادم Express، و React UI، و SQLite، ومخزن متجه فوق ذلك. هناك الكثير من الأجزاء المتحركة التي يجب نشرها وصيانتها وتصحيحها عند حدوث عطل ما.</p>
<p><strong>كل هذه المكونات تحرق أيضًا رموزًا لم تطلب إنفاقها.</strong> يتم تحميل تعريفات أداة MCP بشكل دائم في نافذة سياق Claude، وكل استدعاء أداة يستهلك الرموز المميزة في الطلب والاستجابة. خلال الجلسات الطويلة، تتراكم هذه النفقات الزائدة بسرعة ويمكن أن تخرج تكاليف الرموز عن السيطرة.</p>
<p><strong>لا يمكن الاعتماد على استدعاء الذاكرة لأنه يعتمد كليًا على اختيار كلود للبحث.</strong> يجب على كلود أن تقرر من تلقاء نفسها استدعاء أدوات مثل <code translate="no">search</code> لتشغيل الاسترجاع. إذا لم يدرك أنه يحتاج إلى ذاكرة، فلن يظهر المحتوى ذو الصلة أبدًا. ويتطلب كل مستوى من مستويات الذاكرة الثلاثة استدعاء الأداة الخاصة به بشكل صريح، لذلك لا يوجد أي تراجع إذا لم يفكر كلود في البحث.</p>
<p><strong>أخيرًا، تخزين البيانات غير شفاف، مما يجعل تصحيح الأخطاء والترحيل غير سار.</strong> يتم تقسيم الذكريات عبر SQLite للبيانات الوصفية للجلسة و Chroma لبيانات المتجه الثنائي، مع عدم وجود تنسيق مفتوح يربطهما معًا. الترحيل يعني كتابة البرامج النصية للتصدير. رؤية ما يتذكره الذكاء الاصطناعي بالفعل يعني المرور عبر واجهة مستخدم الويب أو واجهة استعلام مخصصة. لا توجد طريقة للنظر إلى البيانات الخام فقط.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">لماذا يعد البرنامج الإضافي memsearch لـ كلود كود أفضل؟<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>لقد أردنا طبقة ذاكرة خفيفة الوزن حقًا - لا خدمات إضافية، ولا بنية متشابكة، ولا نفقات تشغيلية زائدة. هذا ما حفزنا على بناء ميمسارش <strong>ccplugin</strong>. كان هذا في جوهره تجربة: <em>هل يمكن لنظام ذاكرة يركز على الترميز أن يكون أبسط بشكل جذري؟</em></p>
<p>نعم، وقد أثبتنا ذلك.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>إن ccplugin ccplugin بأكمله عبارة عن أربعة خطافات صدفة بالإضافة إلى عملية مراقبة في الخلفية. لا يوجد Node.js، ولا خادم MCP، ولا واجهة مستخدم ويب. إنها مجرد نصوص برمجية تستدعي واجهة مستخدم memsearch CLI، مما يقلل من شريط الإعداد والصيانة بشكل كبير.</p>
<p>يمكن أن يكون ccplugin بهذه النحافة بسبب حدود المسؤولية الصارمة. فهو لا يتعامل مع تخزين الذاكرة أو استرجاع المتجهات أو تضمين النص. كل ذلك مفوض إلى واجهة مستخدم memsearch CLI الموجودة تحته. يحتوي ccplugin على وظيفة واحدة: ربط أحداث دورة حياة Claude Code (بدء الجلسة، إرسال المطالبة، إيقاف الاستجابة، نهاية الجلسة) بوظائف memsearch CLI المقابلة.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>هذا التصميم المنفصل يجعل النظام مرنًا بما يتجاوز كلود كود. تعمل واجهة برمجة تطبيقات memsearch CLI بشكل مستقل مع IDEs الأخرى أو أطر عمل الوكلاء الآخرين أو حتى الاستدعاء اليدوي البسيط. فهو غير مقفل على حالة استخدام واحدة.</p>
<p>عمليًا، يوفر هذا التصميم ثلاث مزايا رئيسية.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. جميع الذكريات تعيش في ملفات Markdown العادية</h3><p>تعيش كل ذاكرة ينشئها ccplugin في <code translate="no">.memsearch/memory/</code> كملف Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>إنه ملف واحد لكل يوم. يحتوي كل ملف على ملخصات جلسات ذلك اليوم بنص عادي يمكن قراءته بشكل كامل. إليك لقطة شاشة لملفات الذاكرة اليومية من مشروع memsearch نفسه:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>يمكنك رؤية التنسيق على الفور: الطابع الزمني، ومعرف الجلسة، ومعرف الدوران، وملخص الجلسة. لا شيء مخفي.</p>
<p>هل تريد معرفة ما يتذكره الذكاء الاصطناعي؟ افتح ملف Markdown. هل تريد تحرير الذاكرة؟ استخدم محرر النصوص الخاص بك. هل تريد ترحيل بياناتك؟ انسخ المجلد <code translate="no">.memsearch/memory/</code>.</p>
<p>فهرس متجه <a href="https://milvus.io/">ميلفوس</a> هو ذاكرة تخزين مؤقت لتسريع البحث الدلالي. يُعاد بناؤه من Markdown في أي وقت. لا توجد قواعد بيانات مبهمة ولا صناديق سوداء ثنائية. جميع البيانات قابلة للتتبع وإعادة البناء بالكامل.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. حقن السياق التلقائي لا يكلف أي رموز إضافية</h3><p>التخزين الشفاف هو أساس هذا النظام. يأتي المردود الحقيقي من كيفية استخدام هذه الذكريات، وفي ccplugin، يتم استدعاء الذاكرة تلقائيًا بالكامل.</p>
<p>في كل مرة يتم فيها إرسال موجهة، يقوم خطاف <code translate="no">UserPromptSubmit</code> بإطلاق بحث دلالي ويحقن أفضل 3 ذكريات ذات صلة في السياق. لا يقرر كلود ما إذا كان سيتم البحث أم لا. بل يحصل فقط على السياق.</p>
<p>أثناء هذه العملية، لا يرى Claude أبدًا تعريفات أداة MCP، لذلك لا يوجد شيء إضافي يشغل نافذة السياق. يعمل الخطاف في طبقة CLI ويحقن نتائج بحث نصية عادية. لا توجد نفقات IPC زائدة ولا تكاليف رمز استدعاء الأداة. اختفى تمامًا انتفاخ نافذة السياق الذي يأتي مع تعريفات أدوات MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>بالنسبة للحالات التي لا تكفي فيها أعلى 3 مستويات تلقائيًا، قمنا أيضًا ببناء ثلاثة مستويات من الاسترجاع التدريجي. جميع المستويات الثلاثة هي أوامر CLI، وليست أدوات MCP.</p>
<ul>
<li><p><strong>L1 (تلقائي):</strong> تقوم كل مطالبة بإرجاع أفضل 3 نتائج بحث دلالية مع معاينة <code translate="no">chunk_hash</code> و 200 حرف. يغطي هذا معظم الاستخدام اليومي.</p></li>
<li><p><strong>L2 (عند الطلب):</strong> عند الحاجة إلى السياق الكامل، يقوم <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> بإرجاع قسم Markdown الكامل بالإضافة إلى البيانات الوصفية.</p></li>
<li><p><strong>L3 (عميق):</strong> عندما تكون هناك حاجة إلى المحادثة الأصلية، يسحب <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> سجل JSONL الخام من Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. يتم إنشاء ملخصات الجلسات في الخلفية بتكلفة تقترب من الصفر</h3><p>يغطي الاسترجاع كيفية استخدام الذكريات. ولكن يجب كتابة الذكريات أولاً. كيف يتم إنشاء كل ملفات Markdown هذه؟</p>
<p>ينشئها ccplugin من خلال خط أنابيب في الخلفية يعمل بشكل غير متزامن ولا يكلف شيئًا تقريبًا. في كل مرة تقوم فيها بإيقاف استجابة كلود ، يتم تشغيل خطاف <code translate="no">Stop</code>: يقوم بتحليل نص المحادثة ، ويستدعي كلود هايكو (<code translate="no">claude -p --model haiku</code>) لإنشاء ملخص ، ويلحقه بملف Markdown لليوم الحالي. إن مكالمات واجهة برمجة تطبيقات Haiku رخيصة للغاية، تكاد لا تذكر لكل استدعاء.</p>
<p>من هناك، تكتشف عملية المراقبة تغيير الملف وتقوم تلقائيًا بفهرسة المحتوى الجديد في ملف Milvus بحيث يكون متاحًا للاسترجاع على الفور. يعمل التدفق بأكمله في الخلفية دون مقاطعة عملك، وتبقى التكاليف تحت السيطرة.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">بدء تشغيل ملحق memsearch السريع مع كلود كود<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">أولاً، قم بالتثبيت من سوق ملحقات Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">ثانيًا، أعد تشغيل Claude Code.</h3><p>تقوم الإضافة بتهيئة تكوينها تلقائيًا.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">ثالثًا، بعد المحادثة، تحقق من ملف ذاكرة اليوم:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">رابعًا، استمتع.</h3><p>في المرة التالية التي يبدأ فيها Claude Code، يسترجع النظام تلقائيًا الذكريات ذات الصلة ويحقنها. لا حاجة لخطوات إضافية.</p>
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
    </button></h2><p>دعونا نعود إلى السؤال الأصلي: كيف تمنح الذكاء الاصطناعي ذاكرة مستمرة؟ كلود ميم وذاكرة ميم سيبلوغين memsearch ccplugin يتخذان نهجين مختلفين، ولكل منهما نقاط قوة مختلفة. لخصنا دليلًا سريعًا للاختيار بينهما:</p>
<table>
<thead>
<tr><th>الفئة</th><th>memsearch</th><th>كلود ميم</th></tr>
</thead>
<tbody>
<tr><td>البنية</td><td>4 خطافات صدفة + 1 عملية مراقبة</td><td>عامل Node.js + عامل Node.js + Express + React UI</td></tr>
<tr><td>طريقة التكامل</td><td>خطافات أصلية + CLI</td><td>خادم MCP (stdio)</td></tr>
<tr><td>الاستدعاء</td><td>تلقائي (حقن الخطاف)</td><td>مدفوع بالوكيل (يتطلب استدعاء الأداة)</td></tr>
<tr><td>استهلاك السياق</td><td>صفر (حقن نص النتيجة فقط)</td><td>تستمر تعريفات أداة MCP</td></tr>
<tr><td>ملخص الجلسة</td><td>مكالمة واحدة غير متزامنة من Haiku CLI</td><td>مكالمات واجهة برمجة التطبيقات المتعددة + ضغط الملاحظة</td></tr>
<tr><td>تنسيق التخزين</td><td>ملفات تخفيض السعر العادي</td><td>SQLite + تضمينات كروما</td></tr>
<tr><td>ترحيل البيانات</td><td>ملفات تخفيض السعر العادي</td><td>ملفات SQLite + تضمينات Chroma</td></tr>
<tr><td>طريقة الترحيل</td><td>نسخ ملفات .md</td><td>التصدير من قاعدة البيانات</td></tr>
<tr><td>وقت التشغيل</td><td>بايثون + كلود CLI</td><td>Node.js + Bun + وقت تشغيل MCP</td></tr>
</tbody>
</table>
<p>يوفر claude-mem ميزات أكثر ثراءً، وواجهة مستخدم مصقولة، وتحكمًا أكثر دقة. بالنسبة للفرق التي تحتاج إلى التعاون أو التصور على الويب أو إدارة الذاكرة التفصيلية، فهو اختيار قوي.</p>
<p>يوفر البرنامج المساعد memsearch ccplugin تصميمًا بسيطًا، ونفقات زائدة في نافذة السياق صفر، وتخزينًا شفافًا تمامًا. بالنسبة للمهندسين الذين يريدون طبقة ذاكرة خفيفة الوزن بدون تعقيدات إضافية، فهو الأنسب للمهندسين الذين يريدون طبقة ذاكرة خفيفة الوزن بدون تعقيدات إضافية. أيهما أفضل يعتمد على ما تحتاج إليه.</p>
<p>هل تريد التعمق أكثر أو الحصول على مساعدة في البناء باستخدام memsearch أو Milvus؟</p>
<ul>
<li><p>انضم إلى <a href="https://milvus.io/slack">مجتمع Milvus Slack</a> t للتواصل مع مطورين آخرين ومشاركة ما تقوم ببنائه.</p></li>
<li><p>احجز <a href="https://milvus.io/office-hours">ساعات عمل Milvus المكتبية للحصول على</a>أسئلة وأجوبة مباشرة ودعم مباشر من الفريق.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">الموارد<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>وثائق برنامج memsearch ccplugin:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>جيثب:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>مشروع memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>مدونة <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">لقد استخرجنا نظام ذاكرة OpenClaw وقمنا بفتح مصادره (memsearch)</a></p></li>
<li><p>مدونة: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">ما هو OpenClaw؟ الدليل الكامل لعامل الذكاء الاصطناعي المفتوح المصدر -</a></p></li>
<li><p>مدونة: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">البرنامج التعليمي لـ OpenClaw الاتصال بـ Slack لمساعد الذكاء الاصطناعي المحلي</a></p></li>
</ul>
