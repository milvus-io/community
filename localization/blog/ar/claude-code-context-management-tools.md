---
id: claude-code-context-management-tools.md
title: |
  أفضل 7 أدوات مفتوحة المصدر لإدارة سياق كود «كلود»
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  تفقد جلسات «لونغ كلود كود» الإشارة بسرعة. تعرف على 7 أدوات لتقليل ضوضاء المحطة
  الطرفية، واسترجاع الكود، ومخرجات الأدوات، واستخدام الذاكرة، واستخدام الرموز.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>يمكنك تزويد «كلود كود» بنافذة سياق تبلغ 1M توكن، ومع ذلك ستحصل على إجابات أسوأ بمرور الوقت. المشكلة لا تكمن في حجم السياق فحسب، بل في جودته أيضًا.</p>
<p>تتدهور جلسات Claude Code عندما تتنافس سجلات المحطة الطرفية، ومخرجات الأدوات الأولية، وعمليات قراءة الملفات المتكررة، والاستجابات المطولة، وسجل المشروع المنسي، جميعها على جذب الانتباه. في سير عمل الوكلاء طويلة الأمد، يتحول هذا التشويش إلى حلقة مفرغة: يفقد النموذج الخيط، فتضيف المزيد من الأدوار لإصلاح الإجابة، وتضيف تلك الأدوار الإضافية المزيد من التشويش.</p>
<p>هذا هو <strong>ما يُعرف بـ «تشتت السياق</strong>»: النموذج لديه مساحة كافية لاستيعاب المعلومات، لكن المعلومات المهمة تُدفن تحت سياق ضعيف الإشارة. النوافذ الأكبر حجمًا قد تجعل من السهل تجاهل هذا الأمر لأن المطورين يتوقفون عن التفكير بعناية فيما يدخل في الموجه.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>رسم تخطيطي لتخزين المطالبات مؤقتًا يوضح كيف أن البادئات المعاد استخدامها لا تزال تضيف سياقًا يُحسب تكلفته عبر الأدوار</span>
  
 </span></p>
<p>يمكن لتخزين المطالبات مؤقتًا أن يقلل من تكلفة البادئات المتكررة، لكنه لا يحول نافذة السياق إلى درج للخردة. فأنت لا تزال تدفع ثمن الرموز الجديدة، ولا تزال بحاجة إلى النموذج لاستنتاج المعلومات الصحيحة.</p>
<p>تستعرض هذه المقالة سبع أدوات مفتوحة المصدر تعالج فقدان التركيز على السياق من مستويات مختلفة: إخراج المحطة الطرفية، وإخراج الأدوات، والتنقل في قاعدة الكود، وقراءة الملفات، وإسهاب النموذج، واسترجاع الكود الدلالي، والذاكرة عبر الجلسات. كما تشرح المقالة كيف ترتبط هذه الأفكار بتصميم <a href="https://zilliz.com/learn/what-is-vector-database">قواعد البيانات المتجهة</a> ، <a href="https://zilliz.com/learn/vector-similarity-search">والبحث عن التشابه المتجه</a>، وأنظمة الاسترجاع مثل Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">ما الذي يسبب فقدان التركيز على السياق في Claude Code؟<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>عادةً ما ينشأ فقدان التركيز السياقي في Claude Code عن خمسة أنماط من الفشل: كثرة النص الخام للتعليمات، ومخرجات الأدوات المشوشة، واستكشاف قاعدة الكود المتكرر، واستجابات النموذج الطويلة، وفجوات الذاكرة عبر الجلسات أو الوكلاء.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>الأسباب الخمسة لفقدان سياق Claude Code: التعليمات الزائدة، ومخرجات الأدوات غير المنظمة، والاسترجاع المتكرر لقاعدة الكود، والاستجابات الطويلة، وفجوات الذاكرة</span>
  
 </span></p>
<table>
<thead>
<tr><th>نمط فشل السياق</th><th>كيف يبدو ذلك في Claude Code</th><th>فئة الأدوات التي تساعد</th></tr>
</thead>
<tbody>
<tr><td>سجلات المحطة الطرفية مشوشة</td><td><code translate="no">git</code>، و <code translate="no">pytest</code> ، و <code translate="no">gh</code> ، وواجهات CLI السحابية تُفرز نصوصًا أكثر مما يحتاج إليه النموذج.</td><td>ضغط مخرجات واجهة سطر الأوامر</td></tr>
<tr><td>مخرجات الأدوات تغمر النافذة</td><td>تدخل سجلات الاختبار، ونسخ DOM، ومخرجات MCP إلى الدردشة ككتل خام ضخمة.</td><td>عزل مخرجات الأدوات</td></tr>
<tr><td>تكرار التنقل في قاعدة الكود</td><td>يُدرج Claude الدلائل، ويُجري عمليات البحث باستخدام grep، ويقرأ الملفات، ويكرر نفس الاستكشاف في كل جلسة.</td><td>الرسم البياني للكود أو الاسترجاع الدلالي</td></tr>
<tr><td>قراءة الملفات واسعة النطاق للغاية</td><td>يقرأ النموذج ملفًا كاملاً في حين أنه لا يحتاج سوى إلى رمز واحد أو ملخص.</td><td>قراءة الكود التدريجية</td></tr>
<tr><td>كلود يتحدث كثيرًا</td><td>الإجابة نفسها تضيف سياقًا غير ضروري للمراحل اللاحقة.</td><td>ضغط الاستجابة</td></tr>
<tr><td>الذاكرة لا تدوم</td><td>تقوم بإعادة شرح قرارات المشروع في كل مرة تبدأ فيها جلسة جديدة.</td><td>الذاكرة التي تعتمد على Markdown أولاً</td></tr>
</tbody>
</table>
<p>يجب أن تقوم مجموعة أدوات إدارة السياق الجيدة بثلاثة أمور: استبعاد المعلومات غير المهمة، واسترجاع المعرفة الصحيحة عن المشروع عند الطلب، والحفاظ على القرارات الدائمة عبر الجلسات.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">ما هي أداة سياق Claude Code التي يجب أن تستخدمها أولاً؟<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>ابدأ بالطبقة التي تسبب أكبر قدر من التشويش في سير عملك. إذا كان إخراج المحطة الطرفية هو المشكلة، فابدأ بـ RTK. إذا كان Claude يستمر في التجول عبر مستودع كبير، فابدأ بـ claude-context أو code-review-graph. إذا كانت مشكلتك الحقيقية هي إعادة شرح نفس القرارات كل يوم، فابدأ بـ memsearch.</p>
<table>
<thead>
<tr><th>الأداة</th><th>المشكلة الرئيسية التي تحلها</th><th>الخيار الأنسب</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>إخراج محطة طرفية مليء بالضوضاء ناتج عن الأوامر الشائعة للمطورين.</td><td>المطورون الذين يقومون بتشغيل العديد من أوامر واجهة سطر الأوامر داخل Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">وضع السياق</a></td><td>مخرجات ضخمة من الأدوات الخام تدخل في المحادثة الرئيسية.</td><td>المستخدمون الكثيفون لـ Playwright أو GitHub أو السجلات أو أدوات MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>استكشاف قاعدة الكود بشكل عشوائي في مستودعات كبيرة.</td><td>عمليات المراجعة، وتحليل التبعيات، والأسئلة المتعلقة بنطاق التأثير.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>قراءة الملفات بالكامل في حين أن ملخص الرموز يكفي.</td><td>الملفات الكبيرة، وعمليات البحث المتكررة عن الرموز، والقراءة التزايدية للكود.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>عادات كلود في تقديم ردود مطولة.</td><td>المستخدمون الذين يرغبون في مخرجات موجزة وسياق مستقبلي أصغر.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>إعادة استكشاف قاعدة الكود في كل جلسة.</td><td>البحث الدلالي عن الكود عبر MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>فقدان ذاكرة المشروع عبر الجلسات والوكلاء وتبديل النماذج.</td><td>مشاريع طويلة الأمد ذات قرارات ودروس مستدامة.</td></tr>
</tbody>
</table>
<p>الأدوات الخمس الأولى تقلل ما يدخل أو يبقى في السياق. أما الأداتان الأخيرتان فتسهلان استرجاع السياق المفيد.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">يقوم RTK بضغط مخرجات الأوامر الأولية قبل أن يراها Claude<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK هو وكيل CLI لتقليل استخدام الرموز من الأوامر الشائعة للمطورين. يذكر وصفه على GitHub أنه يقلل من استهلاك رموز LLM بنسبة 60-90٪ في الأوامر الشائعة للمطورين، ويتم توزيعه كملف ثنائي واحد بلغة Rust.</p>
<p>في الاستخدام اليومي لـ Claude Code، غالبًا ما تقوم أوامر مثل <code translate="no">git status</code> و <code translate="no">pytest</code> وقوائم الدلائل بتفريغ معلومات البيئة الكاملة ووصف الحالة في نافذة السياق. وعادةً ما يحتاج النموذج إلى إجابة أصغر فقط: ما هي الملفات التي تم تغييرها، أو أي اختبار فشل، أو أين توقف طلب السحب (PR)، أو ما هي الملفات الرئيسية الموجودة في الدليل.</p>
<p>يقع RTK بين شل وClaude. ويمكنه إعادة كتابة الأوامر من خلال ربطات Claude Code وإرجاع مخرجات مضغوطة.</p>
<p>المخرجات الأولية لـ <code translate="no">git status</code>:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>ما يهم فعليًّا:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>نفس الأمر مع <code translate="no">pytest</code>. المخرجات الأولية مليئة بالحالات الناجحة وضوضاء البيئة:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>بعد الضغط، تصبح الإشارة فورية:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>يُعد RTK أسهل نقطة انطلاق عندما يكون تضخم السياق ناتجًا عن أوامر shell بدلاً من استرجاع الكود.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">يعزل وضع السياق (Context Mode) مخرجات الأدوات الضخمة خارج نطاق الدردشة الرئيسية<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>تم تصميم «Context Mode» للتعامل مع الكتل الأولية التي تُرجعها الأدوات: سجلات الاختبار، ولقطات DOM للمتصفح، وحمولات GitHub، ومخرجات أداة MCP، والصفحات التي تم استخراجها. يسلط وصفه على GitHub الضوء على تحسين نافذة السياق لوكلاء البرمجة المدعومين بالذكاء الاصطناعي، ويشير إلى انخفاض بنسبة 98% في مخرجات الأدوات.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>بطاقة مستودع GitHub لـ «Context Mode» تُظهر مخرجات الأدوات المعزولة وتحسين وضع السياق</span>
  
 </span></p>
<p>ويتمثل نهجه في عزل مخرجات الأدوات الكبيرة في بيئة آمنة محلية وفهرس، ثم تمرير الملخصات ومقابض الاسترجاع فقط إلى محادثة Claude.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>تدفق «Context Mode» الذي يوضح انتقال مخرجات الأدوات الكبيرة عبر التنفيذ في بيئة الحماية، وفهارس SQLite أو FTS، والملخصات، ونتائج الاسترجاع</span>
  
 </span></p>
<p>يُعد هذا التدفق مفيدًا لأن وكيل البرمجة غالبًا ما يحتاج إلى العقدة الفاشلة أو المحدد المعطل أو تتبع المكدس ذي الصلة، وليس DOM بالكامل أو كل سطر اختبار ناجح. يحافظ «Context Mode» على إتاحة المخرجات الكاملة محليًّا مع منعها من السيطرة على المحادثة الرئيسية.</p>
<p>وهذا مشابه للطريقة التي تفصل بها أنظمة <a href="https://zilliz.com/blog/hybrid-search-with-milvus">البحث الهجينة</a> في بيئة الإنتاج بين التخزين والاسترجاع. فأنت تحتفظ بالبيانات الأولية في مكان دائم، ثم تسترجع فقط الجزء المهم منها.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">يقوم code-review-graph بتعيين بنية الكود قبل أن يتنقل Claude فيها<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>يعالج code-review-graph مشكلة مختلفة: لا يحتاج Claude دائمًا إلى مزيد من النص؛ بل يحتاج إلى خريطة أفضل.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>صورة شعار code-review-graph المستخدمة في المقالة الأصلية</span>
  
 </span></p>
<p>في مستودع كبير، يمكن أن يؤدي سؤال بسيط إلى استكشاف مكلف:</p>
<blockquote>
<p>بعد تغيير منطق تسجيل الدخول هذا، ما هي الملفات والاختبارات المتأثرة؟</p>
</blockquote>
<p>بدون مخطط للكود، فإن الخطوة المعتادة لـ Claude هي:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>يقوم code-review-graph مسبقًا بإنشاء خريطة هيكلية لقاعدة الكود. ويستخدم Tree-sitter لتحليل الدوال، والفئات، وعمليات الاستيراد، وعلاقات الاستدعاء، والوراثة، وتبعيات الاختبارات، ثم يكتب الرسم البياني في SQLite.</p>
<p>وهذا يجعله مفيدًا لمراجعة الكود وتحليل نطاق التأثير. بدلاً من مطالبة كلود بإعادة اكتشاف مخطط التبعية من خلال القراءات المتكررة، فإنك تسمح له بالاستعلام عن البنية أولاً.</p>
<p>هذا قريب من <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">البحث الدلالي</a>، لكنه ليس مطابقًا له. فالرسم البياني الهيكلي يجيب على سؤال «ما الذي يعتمد على ماذا؟»، بينما يجيب الاسترجاع الدلالي على سؤال «ما هو الكود المرتبط من الناحية المفاهيمية بهذا السؤال؟». وفي سير عمل مساعد الكود الفعلي، غالبًا ما تحتاج إلى كليهما.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">يقدم «Token Savior» ملخصات الرموز إلى «Claude» قبل إرسال الملفات الكاملة<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>الفكرة الأساسية لـ Token Savior بسيطة: لا ترسل الملف الكامل بشكل افتراضي. أرسل فهرسًا أو ملخصًا للرموز أولاً، ثم قم بالتوسيع فقط عندما تحتاج المهمة إلى مزيد من التفاصيل.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>بطاقة مستودع GitHub لـ Token Savior تُظهر وصف خادم MCP وإحصائيات المشروع</span>
  
 </span></p>
<p>إذا سألت عن مكان معالجة webhook للدفع، فغالبًا ما لا يحتاج النموذج إلى كل سطر في كل ملف ذي صلة. بل يحتاج أولًا إلى معرفة ما إذا كان الملف أو الرمز ذو صلة.</p>
<p>يقدم «Token Savior» الكود على شكل طبقات:</p>
<table>
<thead>
<tr><th>الطبقة</th><th>ما يتلقاه Claude</th><th>عند التوسيع</th></tr>
</thead>
<tbody>
<tr><td>ملخص</td><td>الفهرس وأسماء الرموز والأوصاف الموجزة.</td><td>الاستجابة الأولى الافتراضية.</td></tr>
<tr><td>مقتطف</td><td>جزء أصغر من الكود حول الرمز ذي الصلة.</td><td>عندما يكون الملخص ذا صلة على الأرجح.</td></tr>
<tr><td>الملف الكامل</td><td>محتوى الملف الكامل.</td><td>فقط عندما يتطلب ذلك التحرير أو التفكير المتعمق.</td></tr>
</tbody>
</table>
<p>وهذا يعكس الطريقة التي يقرأ بها المطورون الكود فعليًا. فأنت تقوم بمسح الكود سريعًا، وتؤكد مدى صلته بالموضوع، ثم تفتح الملف الكامل فقط عند الضرورة. كما أنه يشبه نمط الاسترجاع التدريجي المستخدم في <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">تطبيقات RAG</a>: الاسترجاع على نطاق واسع بما يكفي للتوجيه، ثم تضييق السياق قبل الإنشاء.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">يقلل Caveman من تضخم استجابات Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>تركز معظم أدوات السياق على ما يدخل إلى النموذج. بينما يستهدف Caveman ما ينتجه Claude.</p>
<p>Caveman هو مهارة/مكون إضافي لـ Claude Code يعمل على إزالة الحشو، والكلمات المجاملة، والجمل التغليفية، والإفراط في الشرح، والهياكل المتكررة. الهدف ليس إزالة المعرفة؛ بل جعل الإجابة أكثر كثافة.</p>
<p>بدون «Caveman»:</p>
<blockquote>
<p>السبب وراء إعادة عرض مكون React الخاص بك هو على الأرجح...</p>
</blockquote>
<p>مع Caveman:</p>
<blockquote>
<p>مرجع كائن جديد عند كل عملية عرض. خاصية الكائن المضمنة = مرجع جديد = إعادة العرض. قم بتغليفها في useMemo.</p>
</blockquote>
<p>هذا مهم لأن إجابات Claude نفسها تصبح سياقًا مستقبليًا. إذا تضمنت كل إجابة شرحًا طويلًا، فسيبدأ الدور التالي بنص أطول مما هو مطلوب. يمكن للإجابات الأقصر أن تحسّن الدور التالي بقدر ما تحسّن الدور الحالي.</p>
<p>بالنسبة للفرق التي تفكر في <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">هندسة السياق لوكلاء الذكاء الاصطناعي</a>، يُعد Caveman تذكيرًا بأن سياسة الإخراج هي جزء من سياسة السياق.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">يضيف claude-context البحث الدلالي عن الكود من خلال MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>يحل claude-context مشكلة استكشاف قاعدة الكود المتكررة باستخدام الاسترجاع الدلالي. فهو يقوم بفهرسة مستودع، وتخزين أجزاء الكود في قاعدة بيانات متجهة، ويتيح البحث من خلال <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">بروتوكول سياق النموذج (Model Context Protocol)</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>مستودع Claude Context المعروض على GitHub الشائع في المقالة الأصلية</span>
  
 </span></p>
<p>في قاعدة كود كبيرة، تطرح باستمرار أسئلة على Claude مثل:</p>
<blockquote>
<p>ساعدني في معرفة أي أجزاء من الكود قد تكون مرتبطة بهذا الخطأ.</p>
</blockquote>
<p>بدون طبقة استرجاع، غالبًا ما يكون النهج الافتراضي لـ Claude هو:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>ينقل claude-context هذه العمليات إلى طبقة استرجاع. فهو يقسم المستودع إلى أجزاء، ويولد التضمينات، ويخزنها في <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">فهرس كود مدعوم بـ Milvus</a>، ويسترجع أجزاء الكود ذات الصلة قبل أن يبدأ النموذج في قراءة الملفات بشكل عشوائي.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>تدفق claude-context الذي يوضح تقسيم قاعدة الكود، والتضمينات، وقاعدة البيانات المتجهة، والبحث الهجين، واسترجاع الكود ذي الصلة، وحقن سياق Claude</span>
  
 </span></p>
<p>وهنا تبدأ أدوات البرمجة التي تعتمد على الذكاء الاصطناعي في التشبه بأنظمة البحث. فأنت بحاجة إلى التقسيم إلى أجزاء، والتضمينات، والبيانات الوصفية، والمطابقة المعجمية، والترتيب، وحداثة المعلومات. وهذه هي نفس اللبنات الأساسية التي تقوم عليها <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">عمليات استرجاع RAG في بيئة الإنتاج</a>، <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">وتوجيه الاسترجاع الهجين،</a> <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">واختيار نموذج التضمين</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">يحتفظ memsearch بالذاكرة المفيدة عبر الجلسات والوكلاء<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>تتناول memsearch الجانب المعاكس من المشكلة: ليس ما يجب نسيانه، بل كيفية تذكر ما يهم.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>صورة شعار memsearch من المقالة الأصلية</span>
  
 </span></p>
<p>تخيل أنك تقول لـ Claude يوم الاثنين:</p>
<blockquote>
<p>لا يمكن لـ webhook الخاص بنا إعادة المحاولة عند الفشل — يجب أن تذهب الأحداث الفاشلة إلى قائمة الرسائل الميتة.</p>
</blockquote>
<p>يوم الأربعاء، تفتح جلسة جديدة وتسأل:</p>
<blockquote>
<p>ما الذي يمكننا تحسينه أيضًا في طبقة الويب هوك؟</p>
</blockquote>
<p>بدون ذاكرة دائمة، يتعامل كلود مع قرار يوم الاثنين كما لو أنه لم يحدث أبدًا. فأنت تشرح الأمر مرة أخرى.</p>
<p>يخزن memsearch الذاكرة كملفات Markdown محلية يمكن قراءتها بواسطة البشر، ويستخدم Milvus كفهرس استرجاع قابل لإعادة البناء. يحافظ هذا التصميم على إمكانية تعديل الذاكرة بواسطة البشر مع إبقائها قابلة للبحث من قبل الوكلاء.</p>
<p>عند الاسترجاع، يستخدم memsearch الاسترجاع التدريجي: البحث أولاً، والتوسيع إذا لزم الأمر، ثم التعمق في النص الأصلي فقط عند الضرورة.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>تدفق الاسترجاع التدريجي لـ memsearch الذي يوضح البحث، والتوسيع، والنص، والعودة الملخصة إلى المحادثة الرئيسية</span>
  
 </span></p>
<p>يُعد نمط «Markdown أولاً» هذا مفيدًا للفرق التي تعمل عبر الجلسات والنماذج والوكلاء. كما أنه يتكامل بشكل طبيعي مع <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">ذاكرة وكلاء الذكاء الاصطناعي طويلة المدى،</a> <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">والذاكرة المشتركة بين الوكلاء المتعددين،</a> والمشكلة الأوسع نطاقًا المتمثلة في منع <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">تدهور السياق في أنظمة الوكلاء</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">كيف تعمل هذه الأدوات معًا؟<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>الأدوات السبع متكاملة، وليست قابلة للتبادل. استخدمها كطبقات.</p>
<table>
<thead>
<tr><th>الطبقة</th><th>استخدم هذه الأدوات</th><th>لماذا</th></tr>
</thead>
<tbody>
<tr><td>إزالة التشويش في الأوامر</td><td>RTK</td><td>ضغط مخرجات المحطة الطرفية ذات الحجم الكبير قبل وصولها إلى Claude.</td></tr>
<tr><td>وضع الحماية لمخرجات الأداة الأولية</td><td>وضع السياق</td><td>احتفظ بالسجلات الكبيرة و DOMs وحمولات الأدوات خارج المحادثة الرئيسية.</td></tr>
<tr><td>رسم خريطة هيكل الكود</td><td>code-review-graph</td><td>الإجابة على الأسئلة المتعلقة بالتبعية ونطاق التأثير دون الحاجة إلى قراءة الملفات بشكل عشوائي.</td></tr>
<tr><td>قراءة الكود بشكل تدريجي</td><td>Token Savior</td><td>ابدأ بملخصات الرموز، ثم قم بالتوسيع فقط عند الحاجة.</td></tr>
<tr><td>ضغط إجابات كلود</td><td>Caveman</td><td>امنع أن تصبح مخرجات النموذج نفسه عبئًا على السياق المستقبلي.</td></tr>
<tr><td>استرجع الكود ذي الصلة</td><td>claude-context</td><td>استخدم البحث الدلالي والمختلط عن الكود بدلاً من حلقات grep المتكررة.</td></tr>
<tr><td>إعادة استخدام القرارات الدائمة</td><td>memsearch</td><td>استرجاع سجل المشروع عبر الجلسات والوكلاء وتبديل النماذج.</td></tr>
</tbody>
</table>
<p>ترتيب التنفيذ العملي هو:</p>
<ol>
<li><strong>تخلص من الضوضاء الواضحة أولاً.</strong> أضف RTK أو وضع السياق (Context Mode) إذا كانت مخرجات shell وحمولات الأدوات تهيمن على سياقك.</li>
<li><strong>أصلح التنقل في المستودع.</strong> أضف code-review-graph للهيكل أو claude-context لاسترجاع الكود الدلالي.</li>
<li><strong>تحكم في ما يتبقى.</strong> استخدم Token Savior و Caveman للحفاظ على قراءات الملفات واستجابات النموذج موجزة.</li>
<li><strong>حافظ على المعرفة الدائمة.</strong> استخدم memsearch عندما تصبح التفسيرات المتكررة عنق الزجاجة.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">ابقَ على اتصال<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>انضم إلى <a href="https://discord.com/invite/8uyFbECzPX">مجتمع Milvus Discord</a> لطرح الأسئلة ومقارنة أنماط إدارة السياق مع مطورين آخرين.</li>
<li><a href="https://milvus.io/office-hours">احجز جلسة مجانية من "ساعات العمل" في Milvus</a> إذا كنت تريد المساعدة في تصميم طبقة استرجاع لأحمال عمل الكود أو الذاكرة أو RAG.</li>
<li>إذا كنت تفضل تخطي إعداد البنية التحتية، فإن <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus المُدار) يقدم مستوى مجانيًا للبدء.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">الأسئلة المتكررة<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>كيف يمكنني تقليل استخدام رموز Claude Code دون فقدان السياق المفيد؟</strong></p>
<p>ابدأ بضغط المدخلات الأكثر تشويشًا: مخرجات المحطة الطرفية، وحمولات الأدوات الأولية، وقراءات الكود المتكررة. ثم أضف أدوات استرجاع مثل claude-context أو code-review-graph حتى يتمكن Claude من سحب الكود ذي الصلة بدلاً من استكشاف المستودع من الصفر.</p>
<p><strong>هل يجب عليّ استخدام claude-context أو code-review-graph لمستودع كبير؟</strong></p>
<p>استخدم claude-context عندما تحتاج إلى البحث الدلالي عن الكود، خاصةً عندما لا تعرف اسم الملف أو الرمز بالضبط. استخدم code-review-graph عندما تحتاج إلى إجابات هيكلية مثل علاقات الاستدعاء، وعمليات الاستيراد، وتبعيات الاختبار، ونطاق المراجعة.</p>
<p><strong>هل يختلف استرجاع الذاكرة عن استرجاع الكود في Claude Code؟</strong></p>
<p>نعم. يبحث استرجاع الكود عن ملفات المشروع أو الرموز ذات الصلة. أما استرجاع الذاكرة فيسترجع القرارات الدائمة وتفضيلات المستخدم وسجل تصحيح الأخطاء والدروس المستفادة عبر الجلسات. يركز memsearch على الذاكرة؛ بينما يركز claude-context على استرجاع الكود.</p>
<p><strong>هل تحل هذه الأدوات محل التخزين المؤقت للمطالبات أو نافذة السياق الأكبر؟</strong></p>
<p>لا. يساعد التخزين المؤقت للموجهات ونوافذ السياق الكبيرة في السعة والتكلفة، لكنها لا تحدد المعلومات التي تستحق الاهتمام. تعمل أدوات إدارة السياق على تحسين جودة وكثافة ما يدخل النموذج في المقام الأول. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
