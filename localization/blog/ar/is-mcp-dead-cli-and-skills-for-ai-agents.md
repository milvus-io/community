---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: هل مات MCP؟ ما الذي تعلمناه من البناء باستخدام MCP و CLI ومهارات الوكيل
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  يأكل MCP السياق، ويتعطل في الإنتاج، ولا يمكنه إعادة استخدام LLM وكيلك. لقد
  بنينا مع الثلاثة - إليك متى يناسب كل منها.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>عندما قال دينيس ياراتس رئيس قسم التكنولوجيا في بيربليسيتي في مؤتمر ASK 2026 أن الشركة كانت تقلل من أولوية MCP داخليًا، أدى ذلك إلى إطلاق الدورة المعتادة. فقد انتقد الرئيس التنفيذي لشركة YC غاري تان - MCP تلتهم الكثير من نافذة السياق، والمصادقة معطلة، وقام ببناء بديل لـ CLI في 30 دقيقة. نشر موقع Hacker News أخبارًا مناهضة بشدة لـ MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>قبل عام مضى، كان هذا المستوى من التشكيك العلني غير معتاد. تم وضع بروتوكول السياق النموذجي (MCP) باعتباره المعيار النهائي لتكامل أداة <a href="https://zilliz.com/glossary/ai-agents">وكيل الذكاء الاصطناعي</a>. وكان عدد الخوادم يتضاعف أسبوعيًا. وقد اتبع النمط منذ ذلك الحين قوسًا مألوفًا: ضجة سريعة، واعتماد واسع النطاق، ثم خيبة أمل في الإنتاج.</p>
<p>تستجيب الصناعة بسرعة. فقد قامت شركة Lark/Feishu التابعة لشركة Bytedance بفتح المصدر الرسمي لواجهة برمجة التطبيقات (CLI) الخاصة بها - أكثر من 200 أمر عبر 11 مجال عمل مع 19 مهارة وكيل مدمجة. شحنت جوجل gws لـ Google Workspace. سرعان ما أصبح نمط CLI + Skills هو النمط الافتراضي لأدوات وكلاء المؤسسات، وليس بديلاً متخصصًا.</p>
<p>في Zilliz، أصدرنا <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI،</a> الذي يتيح لك تشغيل وإدارة <a href="https://milvus.io/intro">Milvus</a> <a href="https://zilliz.com/cloud">وZilliz Cloud</a> (Milvus المدارة بالكامل) مباشرةً من جهازك الطرفي دون مغادرة بيئة الترميز الخاصة بك. علاوة على ذلك، قمنا ببناء <a href="https://milvus.io/docs/milvus_for_agents.md">مهارات Milvus Skills</a> و <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>بحيث يمكن لوكلاء الترميز بالذكاء الاصطناعي مثل Claude Code و Codex إدارة <a href="https://zilliz.com/learn/what-is-vector-database">قاعدة بياناتك المتجهة</a> من خلال اللغة الطبيعية.</p>
<p>كما قمنا أيضًا ببناء خادم MCP لـ Milvus و Zilliz Cloud قبل عام واحد. علمتنا تلك التجربة أين تتعطل MCP بالضبط - وأين لا تزال مناسبة. دفعتنا ثلاثة قيود معمارية نحو CLI و Skills: تضخم نافذة السياق، وتصميم الأداة السلبي، وعدم القدرة على إعادة استخدام LLM الخاص بالوكيل.</p>
<p>في هذا المنشور، سنستعرض في هذا المنشور كل مشكلة، ونعرض ما نبنيه بدلاً من ذلك، ونضع إطارًا عمليًا للاختيار بين MCP و CLI ومهارات الوكيل.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">يستهلك MCP 72% من نافذة السياق عند بدء التشغيل<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>يمكن أن يستهلك إعداد MCP القياسي حوالي 72% من نافذة السياق المتاحة لديك قبل أن يتخذ الوكيل إجراءً واحدًا. قم بتوصيل ثلاثة خوادم - GitHub، Playwright، وتكامل IDE - على نموذج 200 ألف رمز مميز، وتشغل تعريفات الأدوات وحدها ما يقرب من 143 ألف رمز مميز. لم يفعل الوكيل أي شيء بعد. إنه ممتلئ بالفعل بثلاثة أرباعه.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>التكلفة ليست مجرد رموز. فكلما زاد المحتوى غير ذي الصلة المعبأ في السياق، كلما كان تركيز النموذج أضعف على ما يهم بالفعل. وجود مائة أداة تخطيطية في السياق يعني أن الوكيل يخوض فيها جميعًا في كل قرار. وقد وثق الباحثون ما يسمونه <em>تعفن السياق</em> - أي تدهور جودة التفكير بسبب الحمل الزائد للسياق. في الاختبارات المقاسة، انخفضت دقة اختيار الأداة من 43% إلى أقل من 14% مع زيادة عدد الأدوات. ومن المفارقات أن زيادة الأدوات تعني استخدامًا أسوأ للأدوات.</p>
<p>السبب الجذري هو الهندسة المعمارية. حيث يقوم MCP بتحميل جميع أوصاف الأدوات بالكامل عند بدء الجلسة، بغض النظر عما إذا كانت المحادثة الحالية ستستخدمها أم لا. هذا خيار تصميم على مستوى البروتوكول، وليس خطأ - لكن التكلفة تتزايد مع كل أداة تضيفها.</p>
<p>تتبع مهارات الوكيل نهجًا مختلفًا: <strong>الإفصاح التدريجي</strong>. في بداية الجلسة، يقرأ الوكيل البيانات الوصفية لكل مهارة فقط - الاسم، والوصف المكون من سطر واحد، وحالة التشغيل. إجمالي بضع عشرات من الرموز. لا يتم تحميل محتوى المهارة الكامل إلا عندما يحدد الوكيل أنها ذات صلة. فكر في الأمر بهذه الطريقة: يصطف MCP كل أداة عند الباب ويجعلك تختار؛ تمنحك المهارات فهرسًا أولاً، ومحتوى كامل عند الطلب.</p>
<p>تقدم أدوات CLI ميزة مماثلة. يقوم الوكيل بتشغيل git --help أو docker --help لاكتشاف القدرات عند الطلب، دون تحميل مسبق لكل تعريف معلمة. تكلفة السياق هي الدفع حسب الاستخدام، وليس مقدماً.</p>
<p>على نطاق صغير، يكون الفرق ضئيلًا. أما على نطاق الإنتاج، فهو الفرق بين الوكيل الذي يعمل والوكيل الذي يغرق في تعريفات الأدوات الخاصة به.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">بنية MCP السلبية تحدّ من سير عمل الوكيل<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP هو بروتوكول استدعاء الأدوات: كيفية اكتشاف الأدوات واستدعائها وتلقي النتائج. تصميم نظيف لحالات استخدام بسيطة. لكن هذه النظافة هي أيضًا قيد.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">مساحة أداة مسطحة بدون تسلسل هرمي</h3><p>أداة MCP عبارة عن توقيع دالة مسطح. لا توجد أوامر فرعية، لا يوجد وعي بدورة حياة الجلسة، لا يوجد إحساس بمكان الوكيل في سير عمل متعدد الخطوات. إنها تنتظر أن يتم استدعاؤها. هذا كل ما يفعله.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>تعمل CLI بشكل مختلف، فعمليات التزام git، ودفع git، وسجل git هي مسارات تنفيذ مختلفة تمامًا تتشارك واجهة واحدة. يقوم الوكيل بتشغيل --المساعدة، ويستكشف السطح المتاح بشكل تدريجي، ويوسع فقط ما يحتاج إليه - دون تحميل جميع وثائق المعلمات في السياق.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">ترميز المهارات ترميز منطق سير العمل - لا يستطيع MCP ذلك</h3><p>مهارة الوكيل عبارة عن ملف Markdown يحتوي على إجراء تشغيل قياسي: ما يجب القيام به أولاً، وما يجب القيام به بعد ذلك، وكيفية التعامل مع حالات الفشل، ومتى يتم إظهار شيء ما للمستخدم. لا يتلقى الوكيل أداة فقط بل سير عمل كامل. تشكل المهارات بفعالية كيفية تصرف الوكيل أثناء المحادثة - ما الذي يحفزه، وما الذي يعده مسبقًا، وكيف يتعافى من الأخطاء. يمكن لأدوات MCP الانتظار فقط.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">لا يمكن لأدوات MCP الوصول إلى LLM الخاص بالوكيل</h3><p>هذا هو القيد الذي أوقفنا بالفعل.</p>
<p>عندما قمنا ببناء <a href="https://github.com/zilliztech/claude-context">claude-context</a> - وهو مكون إضافي لبرنامج MCP يضيف <a href="https://zilliz.com/glossary/semantic-search">البحث الدلالي</a> إلى Claude Code وغيره من وكلاء ترميز الذكاء الاصطناعي الآخرين، مما يمنحهم سياقًا عميقًا من قاعدة برمجة كاملة - أردنا استرداد مقتطفات المحادثة التاريخية ذات الصلة من Milvus وإظهارها كسياق. نجح استرجاع <a href="https://zilliz.com/learn/vector-similarity-search">البحث المتجه</a>. كانت المشكلة هي ما يجب فعله بالنتائج.</p>
<p>استرجع أفضل 10 نتائج، وربما تكون 3 نتائج مفيدة. والـ7 الأخرى ضوضاء. سلّم جميع الـ 10 إلى الوكيل الخارجي، وستتداخل الضوضاء مع الإجابة. في الاختبار، رأينا أن الاستجابات تتشتت بسبب السجلات التاريخية غير ذات الصلة. كنا بحاجة إلى التصفية قبل تمرير النتائج.</p>
<p>جربنا عدة طرق. إضافة خطوة إعادة الترتيب داخل خادم MCP باستخدام نموذج صغير: لم يكن دقيقًا بما فيه الكفاية، وكانت عتبة الملاءمة بحاجة إلى ضبط لكل حالة استخدام. استخدام نموذج كبير لإعادة الترتيب: سليم من الناحية الفنية، لكن خادم MCP يعمل كعملية منفصلة دون إمكانية الوصول إلى LLM الخاص بالوكيل الخارجي. كان علينا تكوين عميل LLM منفصل، وإدارة مفتاح API منفصل، والتعامل مع مسار استدعاء منفصل.</p>
<p>ما أردناه كان بسيطًا: السماح ل LLM الخاص بالوكيل الخارجي بالمشاركة مباشرةً في قرار التصفية. استرجاع أفضل 10، والسماح للوكيل نفسه بالحكم على ما يستحق الاحتفاظ به، وإرجاع النتائج ذات الصلة فقط. لا يوجد نموذج ثانٍ. لا مفاتيح API إضافية.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>لا يمكن لـ MCP القيام بذلك. حدود العملية بين الخادم والوكيل هي أيضًا حدود ذكاء. لا يمكن للخادم استخدام LLM الخاص بالوكيل؛ لا يمكن للوكيل التحكم في ما يحدث داخل الخادم. لا بأس بالنسبة لأدوات CRUD البسيطة. في اللحظة التي تحتاج فيها الأداة إلى إصدار حكم، يصبح هذا العزل قيدًا حقيقيًا.</p>
<p>تحل مهارة الوكيل هذا الأمر مباشرةً. يمكن لمهارة الاسترجاع أن تستدعي مهارة الاسترجاع البحث المتجه عن أفضل 10، وتجعل أداة الوكيل الخاصة بها تقيِّم مدى الملاءمة، وتُعيد فقط ما ينجح. لا يوجد نموذج إضافي. يقوم الوكيل بالتصفية بنفسه.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">ما بنيناه بدلاً من ذلك مع CLI والمهارات<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>نحن نرى أن CLI + Skills هو اتجاه التفاعل بين الوكيل والأداة - ليس فقط لاسترجاع الذاكرة، ولكن عبر المكدس. هذه القناعة تقود كل ما نقوم ببنائه.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: طبقة ذاكرة قائمة على المهارات لوكلاء الذكاء الاصطناعي</h3><p>لقد قمنا ببناء <a href="https://github.com/zilliztech/memsearch">memsearch،</a> وهي طبقة ذاكرة مفتوحة المصدر لـ Claude Code ووكلاء الذكاء الاصطناعي الآخرين. تعمل المهارة داخل وكيل فرعي بثلاث مراحل: يتعامل Milvus مع البحث الأولي عن المتجهات لاكتشاف واسع النطاق، ويتولى Milvus البحث الأولي عن المتجهات لاكتشاف واسع النطاق، ويقوم LLM الخاص بالوكيل بتقييم الصلة وتوسيع السياق للحصول على نتائج واعدة، ويصل التنقيب النهائي إلى المحادثات الأصلية فقط عند الحاجة. يتم التخلص من الضوضاء في كل مرحلة - لا تصل نفايات الاسترجاع الوسيطة إلى نافذة السياق الأساسي.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الفكرة الرئيسية: ذكاء الوكيل هو جزء من تنفيذ الأداة. تقوم أداة LLM الموجودة بالفعل في الحلقة بعملية التصفية - لا يوجد نموذج ثانٍ، ولا مفتاح واجهة برمجة تطبيقات إضافي، ولا ضبط عتبة هش. هذه حالة استخدام محددة - استرجاع سياق المحادثة لوكلاء الترميز - لكن البنية قابلة للتعميم على أي سيناريو تحتاج فيه الأداة إلى الحكم وليس التنفيذ فقط.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI، والمهارات، والمكوّن الإضافي لعمليات قاعدة البيانات المتجهة</h3><p>Milvus هي قاعدة البيانات المتجهة مفتوحة المصدر الأكثر اعتمادًا في العالم مع <a href="https://github.com/milvus-io/milvus">أكثر من 43 ألف نجمة على GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> هي خدمة مُدارة بالكامل من Milvus مع ميزات مؤسسية متقدمة وهي أسرع بكثير من Milvus.</p>
<p>نفس البنية متعددة الطبقات المذكورة أعلاه تقود أدوات المطورين لدينا:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> هي طبقة البنية التحتية. إدارة المجموعة، <a href="https://milvus.io/docs/manage-collections.md">وعمليات التجميع، وعمليات التجميع،</a> والبحث عن المتجهات، و <a href="https://milvus.io/docs/rbac.md">RBAC،</a> والنسخ الاحتياطية، والفوترة - كل ما يمكنك القيام به في وحدة تحكم Zilliz Cloud، متاح من المحطة الطرفية. يستخدم البشر والوكلاء نفس الأوامر. تعمل Zilliz CLI أيضًا كأساس لمهارات Milvus Skills ومهارات Zilliz.</li>
<li>Milvus<a href="https://milvus.io/docs/milvus_for_agents.md">Skill</a> هي الطبقة المعرفية لـ Milvus مفتوحة المصدر. وهي تعلّم وكلاء الترميز بالذكاء الاصطناعي (Claude Code، Cursor، Codex، GitHub Copilot) لتشغيل أي نشر لـ Milvus - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> أو مستقل أو موزع - من خلال كود <a href="https://milvus.io/docs/install-pymilvus.md">Pymilvus</a> Python: الاتصالات، <a href="https://milvus.io/docs/schema-hands-on.md">تصميم المخطط،</a> CRUD، <a href="https://zilliz.com/learn/hybrid-search-with-milvus">البحث الهجين،</a> <a href="https://milvus.io/docs/full-text-search.md">البحث في النص الكامل،</a> <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">خطوط أنابيب RAG</a>.</li>
<li>يقوم Zilliz<a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Skill</a> بالشيء نفسه بالنسبة لـ Zilliz Cloud، حيث يقوم بتعليم الوكلاء إدارة البنية التحتية السحابية من خلال Zilliz CLI.</li>
<li>Zilliz<a href="https://github.com/zilliztech/zilliz-plugin">Plugin</a> هو طبقة تجربة المطور لـ Claude Code - يلف CLI + Skill في تجربة موجهة مع أوامر مائلة مثل /zilliz:quickstart و /zilliz:status.</li>
</ul>
<p>تتعامل CLI مع التنفيذ، بينما تقوم المهارات بترميز المعرفة ومنطق سير العمل، ويقدم المكون الإضافي تجربة المستخدم. لا يوجد خادم MCP في الحلقة.</p>
<p>لمزيد من التفاصيل، راجع هذه الموارد:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">تقديم واجهة Zilliz CLI ومهارات الوكيل ل Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">زيليز كلاود هبطت للتو في كلود كود</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">موجهات الذكاء الاصطناعي - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">مرجع Zilliz CLI - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">مهارة زيليز - Zilliz Cloud Developer Hub - Zilliz Cloud Developer Hub</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">ميليفوس لوكلاء الذكاء الاصطناعي - وثائق ميليفوس</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">هل يموت MCP بالفعل؟<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>يتجه الكثير من المطورين والشركات بما في ذلك نحن هنا في Zilliz إلى واجهة برمجة التطبيقات والمهارات. ولكن هل MCP يحتضر حقًا؟</p>
<p>الإجابة المختصرة: لا - لكن نطاقه يضيق إلى حيث يناسبه بالفعل.</p>
<p>تم التبرع بـ MCP لمؤسسة لينكس. يبلغ عدد الخوادم النشطة أكثر من 10,000 خادم. يبلغ عدد التنزيلات الشهرية لـ SDK 97 مليون تنزيل. نظام بيئي بهذا الحجم لا يختفي بسبب تعليق في مؤتمر.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>موضوع على موقع هاكر نيوز - <em>"متى يكون MCP منطقيًا مقابل CLI؟</em> - استقطب إجابات فضلت في الغالب CLI: "أدوات CLI تشبه الأدوات الدقيقة"، "كما أن CLI تبدو أكثر سرعة من MCPs". بعض المطورين لديهم وجهة نظر أكثر توازناً: المهارات هي الوصفة التفصيلية التي تساعدك على حل المشكلة بشكل أفضل؛ أما MCP فهي الأداة التي تساعدك على حل المشكلة. كلاهما له مكانته.</p>
<p>هذا عادل - لكنه يثير سؤالاً عمليًا. إذا كانت الوصفة نفسها يمكن أن توجه الوكيل بشأن الأدوات التي يجب استخدامها وكيفية استخدامها، فهل لا يزال بروتوكول توزيع الأدوات المنفصل ضروريًا؟</p>
<p>يعتمد ذلك على حالة الاستخدام.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>إن<strong>MCP عبر stdio</strong> - وهو الإصدار الذي يقوم معظم المطورين بتشغيله محليًا - هو المكان الذي تتراكم فيه المشاكل: اتصال غير مستقر بين العمليات، وعزل فوضوي للبيئة، ونفقات رمزية عالية. في هذا السياق، توجد بدائل أفضل لكل حالة استخدام تقريبًا.</p>
<p>يعد<strong>MCP عبر HTTP</strong> قصة مختلفة. تحتاج منصات الأدوات الداخلية للمؤسسات إلى إدارة مركزية للأذونات، و OAuth موحد، وقياس عن بُعد وتسجيل موحد. تكافح أدوات CLI المجزأة حقًا لتوفيرها. بنية MCP المركزية لها قيمة حقيقية في هذا السياق.</p>
<p>ما أسقطه Perplexity في الواقع هو في المقام الأول حالة استخدام stdio. لقد حدد دينيس ياراتس "داخليًا" ولم يدعو إلى اعتماد هذا الخيار على مستوى الصناعة. لقد ضاع هذا الفارق الدقيق في الإرسال - انتشرت عبارة "Perplexity يتخلى عن MCP" بشكل أسرع بكثير من عبارة "Perplexity يقلل من أولوية MCP على stdio لتكامل الأدوات الداخلية."</p>
<p>ظهرت MCP لأنها حلت مشكلة حقيقية: فقبلها، كان كل تطبيق ذكاء اصطناعي يكتب منطق استدعاء الأدوات الخاص به، دون وجود معيار مشترك. قدمت MCP واجهة موحدة في الوقت المناسب، وتم بناء النظام البيئي بسرعة. ثم أظهرت تجربة الإنتاج بعد ذلك القيود. هذا هو القوس الطبيعي لأدوات البنية التحتية - وليس حكمًا بالإعدام.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">متى تستخدم MCP، أو CLI، أو المهارات<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th></th><th>MCP عبر stdio (محلي)</th><th>MCP عبر HTTP (مؤسسي)</th></tr>
</thead>
<tbody>
<tr><td><strong>المصادقة</strong></td><td>لا يوجد</td><td>المصادقة، مركزية</td></tr>
<tr><td><strong>استقرار الاتصال</strong></td><td>مشكلات عزل العملية</td><td>استقرار HTTPS</td></tr>
<tr><td><strong>تسجيل الدخول</strong></td><td>لا توجد آلية قياسية</td><td>القياس عن بُعد المركزي</td></tr>
<tr><td><strong>التحكم في الوصول</strong></td><td>لا يوجد</td><td>الأذونات المستندة إلى الأدوار</td></tr>
<tr><td><strong>ما نراه</strong></td><td>الاستبدال ب CLI + المهارات</td><td>الاحتفاظ بالأدوات المؤسسية</td></tr>
</tbody>
</table>
<p>بالنسبة للفرق التي تختار مجموعة أدوات <a href="https://zilliz.com/glossary/ai-agents">الذكاء الاصطناعي العميل</a> الخاصة بها، إليك كيفية ملاءمة الطبقات:</p>
<table>
<thead>
<tr><th>الطبقة</th><th>ما هي وظيفتها</th><th>الأفضل ل</th><th>أمثلة</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>المهام التشغيلية وإدارة المعلومات</td><td>الأوامر التي يشغلها كل من الوكلاء والبشر</td><td>git, docker, zilliz-cli, git, docker, zilliz-cli</td></tr>
<tr><td><strong>المهارات</strong></td><td>منطق سير عمل الوكيل، المعرفة المشفرة</td><td>المهام التي تحتاج إلى حكم LLM، إجراءات التشغيل الموحدة متعددة الخطوات</td><td>ميلفوس-مهارة، زيليز-مهارة، ميمسارش</td></tr>
<tr><td><strong>واجهات برمجة تطبيقات REST</strong></td><td>عمليات التكامل الخارجية</td><td>الاتصال بخدمات الطرف الثالث</td><td>واجهة برمجة تطبيقات GitHub، واجهة برمجة تطبيقات Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>منصات أدوات المؤسسة</td><td>المصادقة المركزية وتسجيل التدقيق</td><td>بوابات الأدوات الداخلية</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">ابدأ العمل<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>كل ما ناقشناه في هذه المقالة متاح اليوم:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - طبقة الذاكرة القائمة على المهارات لوكلاء الذكاء الاصطناعي. أسقطها في كلود كود أو أي وكيل يدعم المهارات.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - إدارة Milvus و Zilliz Cloud من جهازك الطرفي. قم بتثبيته واستكشف الأوامر الفرعية التي يمكن لوكلائك استخدامها.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> و Zilliz <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Skill</strong></a> - امنح وكيل ترميز الذكاء الاصطناعي الخاص بك معرفة Milvus و Zilliz Cloud الأصلية.</li>
</ul>
<p>هل لديك أسئلة حول البحث المتجه أو بنية الوكيل أو البناء باستخدام CLI والمهارات؟ انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع ميلفوس ديسكورد</a> أو <a href="https://milvus.io/office-hours">احجز جلسة ساعات العمل المجانية</a> للتحدث عن حالة استخدامك.</p>
<p>هل أنت جاهز للبناء؟ <a href="https://cloud.zilliz.com/signup">اشترك في Zilliz Cloud</a> - الحسابات الجديدة التي لديها بريد إلكتروني للعمل تحصل على 100 دولار من الأرصدة المجانية. هل لديك حساب بالفعل؟ <a href="https://cloud.zilliz.com/login">سجّل الدخول هنا</a>.</p>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتداولة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">ما الخطأ في MCP لوكلاء الذكاء الاصطناعي؟</h3><p>لدى MCP ثلاثة قيود معمارية رئيسية في الإنتاج. أولاً، يقوم بتحميل جميع مخططات الأدوات في نافذة السياق عند بدء الجلسة - يمكن أن يستهلك توصيل ثلاثة خوادم MCP فقط على نموذج 200 ألف رمز رمزي أكثر من 70% من السياق المتاح قبل أن يقوم الوكيل بأي شيء. ثانيًا، تكون أدوات MCP سلبية: فهي تنتظر أن يتم استدعاؤها ولا يمكنها ترميز تدفقات العمل متعددة الخطوات أو منطق معالجة الأخطاء أو إجراءات التشغيل القياسية. ثالثًا، تعمل خوادم MCP كعمليات منفصلة دون إمكانية الوصول إلى LLM الخاص بالوكيل، لذا فإن أي أداة تحتاج إلى حكم (مثل تصفية نتائج البحث عن الصلة) تتطلب تكوين نموذج منفصل بمفتاح API الخاص بها. تكون هذه المشاكل أكثر حدة مع MCP عبر stdio؛ بينما يخفف MCP عبر HTTP من بعض هذه المشاكل.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">ما الفرق بين MCP ومهارات الوكيل؟</h3><p>MCP هو بروتوكول استدعاء الأدوات الذي يحدد كيفية اكتشاف الوكيل للأدوات الخارجية واستدعائه لها. مهارة الوكيل عبارة عن ملف Markdown يحتوي على إجراءات تشغيل قياسية كاملة - المشغلات والتعليمات خطوة بخطوة ومعالجة الأخطاء وقواعد التصعيد. الفرق المعماري الرئيسي: يتم تشغيل المهارات داخل عملية الوكيل، بحيث يمكنها الاستفادة من LLM الخاص بالوكيل في إصدار الأحكام مثل تصفية الملاءمة أو إعادة ترتيب النتائج. تعمل أدوات MCP في عملية منفصلة ولا يمكنها الوصول إلى ذكاء الوكيل. تستخدم المهارات أيضًا الإفصاح التدريجي - يتم تحميل البيانات الوصفية خفيفة الوزن فقط عند بدء التشغيل، مع تحميل المحتوى الكامل عند الطلب - مما يجعل استخدام نافذة السياق في حده الأدنى مقارنةً بتحميل مخطط MCP مقدمًا.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">متى يجب الاستمرار في استخدام MCP بدلاً من CLI أو Skills؟</h3><p>لا يزال MCP عبر HTTP منطقيًا لمنصات أدوات المؤسسات حيث تحتاج إلى OAuth مركزي، والتحكم في الوصول المستند إلى الأدوار، والقياس عن بُعد الموحد، وتسجيل التدقيق عبر العديد من الأدوات الداخلية. تكافح أدوات CLI المجزأة لتوفير هذه المتطلبات المؤسسية بشكل متسق. بالنسبة لسير عمل التطوير المحلي - حيث يتفاعل الوكلاء مع الأدوات على جهازك - عادةً ما توفر CLI + Skills أداءً أفضل، ونفقات أقل في السياق، ومنطق سير عمل أكثر مرونة من MCP عبر stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">كيف تعمل أدوات CLI ومهارات الوكيل معًا؟</h3><p>توفر CLI طبقة التنفيذ (الأوامر الفعلية)، بينما توفر المهارات طبقة المعرفة (متى يتم تشغيل الأوامر، وبأي ترتيب، وكيفية التعامل مع حالات الفشل). على سبيل المثال، تتعامل واجهة Zilliz CLI مع عمليات البنية التحتية مثل إدارة المجموعات، والتجميع CRUD، والبحث عن المتجهات. يقوم ميلفوس سكيل بتعليم الوكيل أنماط البيميلفوس الصحيحة لتصميم المخطط، والبحث الهجين، وخطوط أنابيب RAG. تقوم CLI بالعمل؛ وتعلم المهارة سير العمل. هذا النمط متعدد الطبقات - CLI للتنفيذ، والمهارات للمعرفة، والمكون الإضافي لتجربة المستخدم - هو الطريقة التي قمنا بها بهيكلة جميع أدوات المطورين لدينا في Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP مقابل المهارات مقابل CLI: متى يجب استخدام كل منهما؟</h3><p>أدوات CLI مثل git، أو docker، أو zilliz-cli هي الأفضل للمهام التشغيلية - فهي تعرض أوامر فرعية هرمية ويتم تحميلها عند الطلب. أما المهارات مثل milvus-skill فهي الأفضل لمنطق سير عمل الوكيل - فهي تحمل إجراءات التشغيل واسترداد الأخطاء ويمكنها الوصول إلى LLM الخاص بالوكيل. لا يزال MCP عبر HTTP يناسب منصات أدوات المؤسسات التي تحتاج إلى OAuth مركزي، وأذونات، وتسجيل التدقيق. يتم استبدال MCP عبر stdio - الإصدار المحلي - بـ CLI + Skills في معظم إعدادات الإنتاج.</p>
