---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >-
  هل برنامج MCP قديم بالفعل؟ السبب الحقيقي وراء شحن المهارات الأنثروبولوجية -
  وكيفية إقرانها مع ميلفوس
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: >-
  تعرّف على كيفية عمل Skills لتقليل استهلاك الرموز الرمزية، وكيفية عمل Skills و
  MCP مع Milvus لتعزيز سير عمل الذكاء الاصطناعي.
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>على مدى الأسابيع القليلة الماضية، اندلع جدال ساخن بشكل مدهش عبر X وHacker News: <em>هل نحتاج بالفعل إلى خوادم MCP بعد الآن؟</em> يدّعي بعض المطورين أن MCP مفرط في هندسة MCP، ومتعطش للرموز، وغير متوافق بشكل أساسي مع كيفية استخدام الوكلاء للأدوات. بينما يدافع آخرون عن MCP كطريقة موثوقة لعرض قدرات العالم الحقيقي لنماذج اللغة. اعتمادًا على الموضوع الذي تقرأه، فإن MCP هو إما مستقبل استخدام الأدوات أو ميت عند الوصول.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>الإحباط مفهوم. تمنحك MCP وصولاً قويًا إلى الأنظمة الخارجية، لكنها أيضًا تجبر النموذج على تحميل مخططات طويلة وأوصاف مطولة وقوائم أدوات مترامية الأطراف. وهذا يضيف تكلفة حقيقية. إذا قمت بتنزيل نص اجتماع ثم أدخلته لاحقًا إلى أداة أخرى، فقد يعيد النموذج معالجة نفس النص عدة مرات، مما يؤدي إلى تضخيم استخدام الرمز المميز دون فائدة واضحة. بالنسبة للفرق التي تعمل على نطاق واسع، هذا ليس إزعاجاً - إنها فاتورة.</p>
<p>لكن إعلان أن MCP عفا عليه الزمن سابق لأوانه. قدم أنثروبيك - نفس الفريق الذي اخترع MCP - شيئًا جديدًا بهدوء: <a href="https://claude.com/blog/skills"><strong>المهارات</strong></a>. المهارات هي تعريفات Markdown/YAML خفيفة الوزن تصف <em>كيف</em> <em>ومتى</em> يجب استخدام الأداة. بدلاً من إلقاء المخططات الكاملة في نافذة السياق، يقرأ النموذج أولاً البيانات الوصفية المدمجة ويستخدمها للتخطيط. في الممارسة العملية، تقلل المهارات بشكل كبير من النفقات العامة للرموز وتمنح المطورين مزيدًا من التحكم في تنسيق الأدوات.</p>
<p>إذن، هل هذا يعني أن المهارات ستحل محل MCP؟ ليس تمامًا. تعمل المهارات على تبسيط التخطيط، لكن MCP لا تزال توفر الإمكانيات الفعلية: قراءة الملفات، واستدعاء واجهات برمجة التطبيقات، والتفاعل مع أنظمة التخزين، أو التوصيل بالبنية التحتية الخارجية مثل <a href="https://milvus.io/"><strong>Milvus،</strong></a> وهي قاعدة بيانات متجهة مفتوحة المصدر تدعم الاسترجاع الدلالي السريع على نطاق واسع، مما يجعلها خلفية مهمة عندما تحتاج مهاراتك إلى وصول حقيقي للبيانات.</p>
<p>يفصل هذا المنشور ما تقوم به المهارات بشكل جيد، حيث لا يزال MCP مهمًا، وكيف يتناسب كلاهما مع بنية الوكيل المتطورة في أنثروبيك. ثم سنستعرض كيفية بناء مهاراتك الخاصة التي تتكامل بشكل نظيف مع ميلفوس.</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">ما هي مهارات الوكيل الأنثروبيك وكيف تعمل؟<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>تتمثل إحدى نقاط الألم الطويلة الأمد لوكلاء الذكاء الاصطناعي التقليديين في أن التعليمات تتلاشى مع نمو المحادثة.</p>
<p>حتى مع أكثر تعليمات النظام المصممة بعناية، يمكن أن ينجرف سلوك النموذج تدريجيًا على مدار المحادثة. بعد عدة أدوار، يبدأ كلود بنسيان التعليمات الأصلية أو يفقد التركيز عليها.</p>
<p>تكمن المشكلة في بنية موجه النظام. فهو عبارة عن حقنة ثابتة لمرة واحدة تتنافس على مساحة في نافذة سياق النموذج، إلى جانب تاريخ المحادثة والمستندات وأي مدخلات أخرى. ومع امتلاء نافذة السياق، يصبح انتباه النموذج إلى موجه النظام مخففًا بشكل متزايد، مما يؤدي إلى فقدان الاتساق مع مرور الوقت.</p>
<p>تم تصميم المهارات لمعالجة هذه المشكلة. المهارات هي مجلدات تحتوي على تعليمات ونصوص وموارد. وبدلاً من الاعتماد على موجه نظام ثابت، تقوم المهارات بتقسيم الخبرة إلى حزم تعليمات معيارية وقابلة لإعادة الاستخدام ومستمرة يمكن لكلود اكتشافها وتحميلها ديناميكيًا عند الحاجة إليها في مهمة ما.</p>
<p>عندما يبدأ Claude مهمة، يقوم أولاً بإجراء مسح خفيف الوزن لجميع المهارات المتاحة من خلال قراءة البيانات الوصفية YAML الخاصة بها فقط (بضع عشرات من الرموز المميزة). توفر هذه البيانات الوصفية معلومات كافية لكلود لتحديد ما إذا كانت المهارة ذات صلة بالمهمة الحالية. إذا كان الأمر كذلك، يتوسع كلود في مجموعة كاملة من التعليمات (عادةً أقل من 5 آلاف رمز)، ولا يتم تحميل موارد أو نصوص إضافية إلا إذا لزم الأمر.</p>
<p>يسمح هذا الإفصاح التدريجي لكلود بتهيئة المهارة بـ 30-50 رمزًا فقط، مما يحسّن الكفاءة بشكل كبير ويقلل من عبء السياق غير الضروري.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">كيف تقارن المهارات بالموجهات، والمشاريع، وبرنامج إدارة النماذج، والوكلاء الفرعيين<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>قد يبدو مشهد أدوات النماذج اليوم مزدحمًا. حتى داخل النظام البيئي للوكلاء في كلود وحده، هناك العديد من المكونات المتميزة: المهارات، والمطالبات، والمشاريع، والمشاريع، والوكلاء الفرعيين، و MCP.</p>
<p>الآن بعد أن فهمنا ما هي المهارات وكيفية عملها من خلال حزم التعليمات المعيارية والتحميل الديناميكي، نحتاج إلى معرفة كيفية ارتباط المهارات بأجزاء أخرى من نظام كلود البيئي، خاصةً MCP. فيما يلي ملخص:</p>
<h3 id="1-Skills" class="common-anchor-header">1. المهارات</h3><p>المهارات هي مجلدات تحتوي على تعليمات ونصوص وموارد. يكتشفها Claude ويحمّلها ديناميكيًا باستخدام الكشف التدريجي: البيانات الوصفية أولًا، ثم التعليمات الكاملة، وأخيرًا أي ملفات مطلوبة.</p>
<p><strong>الأفضل لـ</strong></p>
<ul>
<li><p>سير العمل التنظيمي (إرشادات العلامة التجارية وإجراءات الامتثال)</p></li>
<li><p>الخبرة في المجال (صيغ Excel، تحليل البيانات)</p></li>
<li><p>التفضيلات الشخصية (أنظمة تدوين الملاحظات، أنماط الترميز)</p></li>
<li><p>المهام المهنية التي تحتاج إلى إعادة استخدامها عبر المحادثات (مراجعات أمن التعليمات البرمجية المستندة إلى OWASP)</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2. الموجهات</h3><p>الموجهات هي التعليمات باللغة الطبيعية التي تعطيها لكلود في المحادثة. وهي مؤقتة وموجودة فقط في المحادثة الحالية.</p>
<p><strong>أفضل من أجل:</strong></p>
<ul>
<li><p>طلبات لمرة واحدة (تلخيص مقال، تنسيق قائمة)</p></li>
<li><p>تحسين المحادثة (تعديل النبرة، إضافة تفاصيل)</p></li>
<li><p>السياق الفوري (تحليل بيانات محددة، تفسير المحتوى)</p></li>
<li><p>تعليمات مخصصة</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3. المشاريع</h3><p>المشاريع عبارة عن مساحات عمل قائمة بذاتها مع تاريخ محادثة وقواعد معارف خاصة بها. يقدم كل مشروع نافذة سياق بسعة 200 ألف. عندما تقترب معارف مشروعك من حدود السياق، ينتقل Claude بسلاسة إلى وضع RAG، مما يسمح بتوسيع السعة الفعّالة حتى 10 أضعاف.</p>
<p><strong>الأفضل لـ</strong></p>
<ul>
<li><p>السياق المستمر (على سبيل المثال، جميع المحادثات المتعلقة بإطلاق منتج ما)</p></li>
<li><p>تنظيم مساحة العمل (سياقات منفصلة لمبادرات مختلفة)</p></li>
<li><p>تعاون الفريق (على خطط الفريق والمشاريع)</p></li>
<li><p>تعليمات مخصصة (نغمة أو منظور خاص بالمشروع)</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4. الوكلاء الفرعيون</h3><p>الوكلاء الفرعيون هم مساعدو ذكاء اصطناعي متخصصون لهم نوافذ السياق الخاصة بهم، ومطالبات النظام المخصصة، وأذونات أدوات محددة. يمكنهم العمل بشكل مستقل وإرجاع النتائج إلى الوكيل الرئيسي.</p>
<p><strong>الأفضل من أجل:</strong></p>
<ul>
<li><p>التخصص في المهام (مراجعة التعليمات البرمجية، وإنشاء الاختبارات، والتدقيق الأمني)</p></li>
<li><p>إدارة السياق (الحفاظ على تركيز المحادثة الرئيسية)</p></li>
<li><p>المعالجة المتوازية (عوامل فرعية متعددة تعمل على جوانب مختلفة في وقت واحد)</p></li>
<li><p>تقييد الأدوات (على سبيل المثال، الوصول للقراءة فقط)</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5. بروتوكول سياق النموذج (MCP)</h3><p>بروتوكول سياق النموذج (MCP) هو معيار مفتوح يربط نماذج الذكاء الاصطناعي بالأدوات الخارجية ومصادر البيانات.</p>
<p><strong>أفضل من أجل:</strong></p>
<ul>
<li><p>الوصول إلى البيانات الخارجية (Google Drive، Slack، GitHub، قواعد البيانات)</p></li>
<li><p>استخدام أدوات الأعمال (أنظمة إدارة علاقات العملاء، ومنصات إدارة المشاريع)</p></li>
<li><p>الاتصال ببيئات التطوير (الملفات المحلية، IDEs، التحكم في الإصدار)</p></li>
<li><p>التكامل مع الأنظمة المخصصة (أدوات الملكية ومصادر البيانات)</p></li>
</ul>
<p>استناداً إلى ما سبق، يمكننا أن نرى أن المهارات و MCP يعالجان تحديات مختلفة ويعملان معاً لتكملة بعضهما البعض.</p>
<table>
<thead>
<tr><th><strong>البُعد</strong></th><th><strong>MCP</strong></th><th><strong>المهارات</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>القيمة الأساسية</strong></td><td>الاتصال بالأنظمة الخارجية (قواعد البيانات وواجهات برمجة التطبيقات ومنصات SaaS)</td><td>تحديد مواصفات السلوك (كيفية معالجة البيانات وتقديمها)</td></tr>
<tr><td><strong>الإجابة على الأسئلة</strong></td><td>"ما الذي يمكن لكلود الوصول إليه؟</td><td>"ماذا يجب أن يفعل كلود؟</td></tr>
<tr><td><strong>التنفيذ</strong></td><td>بروتوكول العميل والخادم + مخطط JSON</td><td>ملف تخفيض السعر + بيانات YAML الوصفية</td></tr>
<tr><td><strong>استهلاك السياق</strong></td><td>عشرات الآلاف من الرموز (تراكمات متعددة للخوادم)</td><td>30-50 رمزًا لكل عملية</td></tr>
<tr><td><strong>حالات الاستخدام</strong></td><td>الاستعلام عن قواعد البيانات الكبيرة، واستدعاء واجهات برمجة تطبيقات GitHub</td><td>تحديد استراتيجيات البحث، وتطبيق قواعد التصفية، وتنسيق الإخراج</td></tr>
</tbody>
</table>
<p>لنأخذ البحث عن التعليمات البرمجية كمثال.</p>
<ul>
<li><p><strong>MCP (على سبيل المثال، كلود-سياق):</strong> يوفر القدرة على الوصول إلى قاعدة بيانات متجه ميلفوس.</p></li>
<li><p><strong>المهارات:</strong> يحدد سير العمل، مثل تحديد أولويات التعليمات البرمجية الأحدث تعديلاً، وفرز النتائج حسب الصلة بالموضوع، وتقديم البيانات في جدول Markdown.</p></li>
</ul>
<p>توفر MCP الإمكانيات، بينما تحدد المهارات العملية. يشكلان معًا زوجًا مكملاً لبعضهما البعض.</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">كيفية بناء مهارات مخصصة باستخدام كلود-سياق كلود وميلفوس<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Context</a> هو مكون إضافي MCP يضيف وظيفة البحث الدلالي عن التعليمات البرمجية إلى كلود كود، مما يحول قاعدة التعليمات البرمجية بأكملها إلى سياق كلود.</p>
<h3 id="Prerequisite" class="common-anchor-header">المتطلبات الأساسية</h3><p>متطلبات النظام:</p>
<ul>
<li><p><strong>Node.js</strong>: الإصدار &gt;= 20.0.0 و &lt;24.0.0.0</p></li>
<li><p><strong>مفتاح OpenAI API</strong> (لتضمين النماذج)</p></li>
<li><p><strong>مفتاح</strong><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API</strong> Key (لخدمة Milvus المُدارة)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">الخطوة 1: تكوين خدمة MCP (كلود-سياق)</h3><p>قم بتشغيل الأمر التالي في المحطة الطرفية:</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>تحقق من التكوين:</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>اكتمل إعداد MCP. يمكن لكلود الآن الوصول إلى قاعدة بيانات ناقلات ميلفوس.</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">الخطوة 2: إنشاء المهارة</h3><p>قم بإنشاء دليل المهارات:</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>قم بإنشاء ملف SKILL.md:</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">الخطوة 3: أعد تشغيل Claude لتطبيق المهارات</h3><p>قم بتشغيل الأمر التالي لإعادة تشغيل Claude:</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>ملاحظة:</strong> بعد اكتمال التهيئة، يمكنك استخدام المهارات على الفور للاستعلام عن قاعدة كود ميلفوس.</p>
<p>فيما يلي مثال على كيفية عمل ذلك.</p>
<p>استعلام كيف يعمل استعلام ميلفوس QueryCoord؟</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>تعمل المهارات في جوهرها كآلية لتغليف ونقل المعرفة المتخصصة. وباستخدام المهارات، يمكن للذكاء الاصطناعي أن يرث خبرة الفريق ويتبع أفضل الممارسات في المجال - سواء كانت قائمة مرجعية لمراجعات التعليمات البرمجية أو معايير التوثيق. عندما يتم توضيح هذه المعرفة الضمنية من خلال ملفات Markdown، يمكن أن تشهد جودة المخرجات التي يولدها الذكاء الاصطناعي تحسناً كبيراً.</p>
<p>وبالنظر إلى المستقبل، يمكن أن تصبح القدرة على الاستفادة من المهارات بفعالية عاملاً رئيسياً في كيفية استخدام الفرق والأفراد للذكاء الاصطناعي لصالحهم.</p>
<p>بينما تستكشف إمكانات الذكاء الاصطناعي في مؤسستك، فإن Milvus يمثل أداة مهمة لإدارة البيانات المتجهة واسعة النطاق والبحث فيها. من خلال إقران قاعدة بيانات المتجهات القوية في Milvus بأدوات الذكاء الاصطناعي مثل Skills، يمكنك تحسين ليس فقط سير عملك ولكن أيضًا عمق وسرعة الرؤى المستندة إلى البيانات.</p>
<p>هل لديك أسئلة أو تريد التعمق في أي ميزة؟ انضم إلى<a href="https://discord.com/invite/8uyFbECzPX"> قناة Discord</a> الخاصة بنا للدردشة مع مهندسينا ومهندسي الذكاء الاصطناعي الآخرين في المجتمع. يمكنك أيضًا حجز جلسة فردية مدتها 20 دقيقة للحصول على رؤى وإرشادات وإجابات عن أسئلتك من خلال<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> ساعات عمل Milvus المكتبية</a>.</p>
